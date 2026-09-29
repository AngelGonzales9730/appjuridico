var arbolGlobal = [];   // [{id_modulo, modulo, submodulos:[{id_submodulo, submodulo}]}]
var rolesGlobal = [];
var tablaRoles  = null;

function escaparHtml(texto){
    if(texto === null || texto === undefined) return "";
    return String(texto)
        .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

KTUtil.onDOMContentLoaded(function(){
    cargarArbol();
    cargarRoles();

    $("#txtBuscarRol").off("keyup.r").on("keyup.r", function(){
        if(tablaRoles) tablaRoles.search(this.value).draw();
    });
    $("#btnNuevoRol").off("click.r").on("click.r", abrirNuevoRol);
    $("#btnGuardarRol").off("click.r").on("click.r", guardarRol);
    $("#btnReasignarEliminar").off("click.r").on("click.r", reasignarEliminar);

    // Check global
    $("#chkTodosGlobal").off("change.r").on("change.r", function(){
        var marcar = this.checked;
        $("#contenedorModulos .chk-sub, #contenedorModulos .chk-modulo").prop("checked", marcar);
    });
    // Check por módulo (marca todos sus submódulos)
    $(document).off("change.rmod").on("change.rmod", "#contenedorModulos .chk-modulo", function(){
        var idMod = $(this).data("modulo");
        $(`#contenedorModulos .chk-sub[data-modulo='${idMod}']`).prop("checked", this.checked);
        sincronizarGlobal();
    });
    // Check de submódulo (actualiza el estado de su módulo y el global)
    $(document).off("change.rsub").on("change.rsub", "#contenedorModulos .chk-sub", function(){
        sincronizarModulo($(this).data("modulo"));
        sincronizarGlobal();
    });
});

function sincronizarModulo(idMod){
    var subs = $(`#contenedorModulos .chk-sub[data-modulo='${idMod}']`);
    var marcados = subs.filter(":checked").length;
    $(`#contenedorModulos .chk-modulo[data-modulo='${idMod}']`).prop("checked", subs.length > 0 && marcados === subs.length);
}
function sincronizarGlobal(){
    var todos = $("#contenedorModulos .chk-sub");
    var marcados = todos.filter(":checked").length;
    $("#chkTodosGlobal").prop("checked", todos.length > 0 && marcados === todos.length);
}

function cargarArbol(){
    $.ajax({
        type:"GET",
        url:`${$("#urlRequestRoles").val()}`,
        data:{ method:"arbolModulos" },
        success:(response)=>{
            response = JSON.parse(response);
            var filas = response.data || [];
            var mapa = {};
            arbolGlobal = [];
            filas.forEach(f=>{
                if(!mapa[f.id_modulo]){
                    mapa[f.id_modulo] = { id_modulo:f.id_modulo, modulo:f.modulo, submodulos:[] };
                    arbolGlobal.push(mapa[f.id_modulo]);
                }
                mapa[f.id_modulo].submodulos.push({ id_submodulo:f.id_submodulo, submodulo:f.submodulo });
            });
        }
    });
}

function cargarRoles(){
    $.ajax({
        type:"GET",
        url:`${$("#urlRequestRoles").val()}`,
        data:{ method:"listarRoles" },
        beforeSend:()=>{ loading(); },
        success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            rolesGlobal = response.data || [];
            pintarTablaRoles(rolesGlobal);
        },
        error:()=>{ hideLoading(); }
    });
}

function pintarTablaRoles(data){
    if($.fn.DataTable.isDataTable("#tbRoles")){
        $("#tbRoles").DataTable().clear().destroy();
    }
    tablaRoles = $("#tbRoles").DataTable({
        data: data,
        order: [[1, 'desc']],
        columns: [
            {
                className: 'text-center',
                orderable: false,
                data: null,
                width: '40px',
                render: ()=> `<button type="button" class="btn btn-icon btn-sm btn-light-primary btn-toggle-rol" title="Ver accesos">
                                <span class="toggle-icon fw-bold fs-4 lh-1">+</span>
                              </button>`
            },
            { data: 'id_rol', visible:false },
            { data: 'nombre', orderable:false, render: (d)=> `<span class="fw-bold text-gray-800">${escaparHtml(d)}</span>` },
            {
                data: null,
                orderable:false,
                render: (d)=>{
                    var m = parseInt(d.total_modulos,10) || 0;
                    var s = parseInt(d.total_submodulos,10) || 0;
                    if(s === 0) return `<span class="text-muted">Sin accesos</span>`;
                    return `<span class="badge badge-light-primary me-1">${m} módulo${m!==1?'s':''}</span><span class="badge badge-light-info">${s} submódulo${s!==1?'s':''}</span>`;
                }
            },
            {
                data: 'total_usuarios',
                className:'text-center',
                orderable:false,
                render: (d)=>{
                    var n = parseInt(d,10) || 0;
                    return `<span class="badge badge-light-${n>0?'success':'secondary'}">${n}</span>`;
                }
            },
            {
                data: null,
                orderable:false,
                className:'text-end',
                render: (data)=> `
                    <div class="d-flex justify-content-end gap-1">
                        <button type="button" class="btn btn-icon btn-sm btn-light-warning" data-bs-toggle="tooltip" title="Editar rol" onclick="editarRol(${data.id_rol})">
                            <i class="ki-duotone ki-pencil fs-4"><span class="path1"></span><span class="path2"></span></i>
                        </button>
                        <button type="button" class="btn btn-icon btn-sm btn-light-danger" data-bs-toggle="tooltip" title="Eliminar rol" onclick="pedirEliminarRol(${data.id_rol})">
                            <i class="ki-duotone ki-trash fs-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>
                        </button>
                    </div>`
            }
        ],
        drawCallback: function(){
            if(window.bootstrap && bootstrap.Tooltip){
                document.querySelectorAll('#tbRoles [data-bs-toggle="tooltip"]').forEach(el=> bootstrap.Tooltip.getOrCreateInstance(el));
            }
        }
    });

    // Expandir / contraer el árbol de accesos del rol
    $("#tbRoles tbody").off("click.detalleRol", ".btn-toggle-rol")
        .on("click.detalleRol", ".btn-toggle-rol", function(){
            var tr  = $(this).closest("tr");
            var row = tablaRoles.row(tr);
            var icono = $(this).find(".toggle-icon");
            if(row.child.isShown()){
                row.child.hide(); tr.removeClass("shown"); icono.text("+");
            }else{
                row.child(formatArbolRol(row.data())).show(); tr.addClass("shown"); icono.text("−");
            }
        });
}

// Construye el árbol jerárquico módulo -> submódulos del rol
function formatArbolRol(d){
    if(!d.arbol){
        return `<div class="p-4 text-muted m-2">Este rol no tiene accesos asignados.</div>`;
    }
    var mapa = {}, orden = [];
    d.arbol.split("||").forEach(p=>{
        var i = p.indexOf("::");
        if(i < 0) return;
        var mod = p.substring(0, i), sub = p.substring(i + 2);
        if(!mapa[mod]){ mapa[mod] = []; orden.push(mod); }
        mapa[mod].push(sub);
    });
    var html = `<div class="p-4 bg-light-primary rounded m-2">`;
    orden.forEach(mod=>{
        var subs = mapa[mod].map(sub=>`
            <div class="d-flex align-items-center text-gray-800 mb-1">
                <i class="ki-duotone ki-arrow-right fs-5 text-info me-2"><span class="path1"></span><span class="path2"></span></i>
                ${escaparHtml(sub)}
            </div>`).join("");
        html += `
            <div class="mb-4">
                <div class="d-flex align-items-center mb-2">
                    <i class="ki-duotone ki-folder fs-2 text-primary me-2"><span class="path1"></span><span class="path2"></span></i>
                    <span class="fw-bold fs-6 text-gray-900">${escaparHtml(mod)}</span>
                </div>
                <div class="ps-4 ms-3 border-start border-2 border-primary">${subs}</div>
            </div>`;
    });
    html += `</div>`;
    return html;
}

// Construye el árbol de checkboxes; 'marcados' = ids de submódulos seleccionados
function pintarArbol(marcados){
    marcados = (marcados || []).map(String);
    var html = "";
    arbolGlobal.forEach(m=>{
        var subsHtml = m.submodulos.map(s=>{
            var checked = marcados.indexOf(String(s.id_submodulo)) >= 0 ? "checked" : "";
            return `
                <div class="col-md-6">
                    <label class="form-check form-check-custom form-check-solid form-check-sm">
                        <input class="form-check-input chk-sub" type="checkbox" name="submodulos[]" value="${s.id_submodulo}" data-modulo="${m.id_modulo}" ${checked}/>
                        <span class="form-check-label fw-semibold ms-2">${escaparHtml(s.submodulo)}</span>
                    </label>
                </div>`;
        }).join("");
        html += `
            <div class="border border-dashed rounded p-3 mb-3">
                <label class="form-check form-check-custom form-check-solid">
                    <input class="form-check-input chk-modulo" type="checkbox" data-modulo="${m.id_modulo}"/>
                    <span class="form-check-label fw-bold text-gray-800 ms-2">${escaparHtml(m.modulo)}</span>
                </label>
                <div class="row g-2 mt-1 ps-8">${subsHtml}</div>
            </div>`;
    });
    $("#contenedorModulos").html(html);
    // Sincronizar estado de los checks "todos" de módulo y global
    arbolGlobal.forEach(m=> sincronizarModulo(m.id_modulo));
    sincronizarGlobal();
}

function abrirNuevoRol(){
    $("#tituloModalRol").text("Nuevo rol");
    $("#frmRol")[0].reset();
    $("#txtIdRol").val("");
    pintarArbol([]);
    $("#modalRol").modal("show");
}

function editarRol(id){
    var rol = rolesGlobal.find(r=> String(r.id_rol) === String(id));
    if(!rol) return false;
    $("#tituloModalRol").text("Editar rol");
    $("#txtIdRol").val(id);
    $("#txtNombreRol").val(rol.nombre);
    $.ajax({
        type:"GET",
        url:`${$("#urlRequestRoles").val()}`,
        data:{ params:id, method:"submodulosDeRol" },
        beforeSend:()=>{ loading(); },
        success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            pintarArbol(response.data || []);
            $("#modalRol").modal("show");
        },
        error:()=>{ hideLoading(); }
    });
}

function guardarRol(){
    var nombre = $("#txtNombreRol").val().trim();
    if(nombre === ""){ swal({ type:"error", message:"El nombre del rol es obligatorio." }); return false; }
    if($("#contenedorModulos .chk-sub:checked").length === 0){
        swal({ type:"error", message:"Debe seleccionar al menos un submódulo." });
        return false;
    }
    var form = $("#frmRol").serialize();
    $.ajax({
        type:"POST",
        url:`${$("#urlRequestRoles").val()}`,
        data:{ params:form, method:"guardarRol" },
        beforeSend:()=>{ loading(); },
        success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            if(response.status == 1){
                swal({ type:"success", message: response.message });
                $("#modalRol").modal("hide");
                cargarRoles();
                return false;
            }
            swal({ type:"error", message: response.message || "No se pudo guardar el rol." });
        },
        error:()=>{ hideLoading(); }
    });
}

function pedirEliminarRol(id){
    var rol = rolesGlobal.find(r=> String(r.id_rol) === String(id));
    // Primero verificamos si el rol tiene usuarios asignados
    $.ajax({
        type:"POST",
        url:`${$("#urlRequestRoles").val()}`,
        data:{ params:id, method:"verificarEliminarRol" },
        beforeSend:()=>{ loading(); },
        success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            if(response.status == 2){
                // Tiene usuarios: pedir reasignación de inmediato (sin confirmación previa)
                abrirModalReasignar(id, response);
                return false;
            }
            if(response.status != 0){
                swal({ type:"error", message: response.message || "No se pudo verificar el rol." });
                return false;
            }
            // No tiene usuarios: confirmar y eliminar
            Swal.fire({
                html: `¿Está seguro de eliminar el rol <strong>${escaparHtml(rol ? rol.nombre : "")}</strong>?`,
                icon: "question", showCancelButton: true, buttonsStyling: false,
                confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
                customClass: { confirmButton: "btn fw-bold btn-danger", cancelButton: "btn fw-bold btn-active-light-primary" }
            }).then(result=>{
                if(!result.value) return false;
                $.ajax({
                    type:"POST",
                    url:`${$("#urlRequestRoles").val()}`,
                    data:{ params:id, method:"eliminarRol" },
                    beforeSend:()=>{ swalLoading(); },
                    success:(r2)=>{
                        r2 = JSON.parse(r2);
                        if(r2.status == 1){ swal({ type:"success", message: r2.message }); cargarRoles(); return false; }
                        swal({ type:"error", message: r2.message || "No se pudo eliminar el rol." });
                    },
                    error:()=>{ swal({ type:"error", message:"Ocurrió un error al eliminar el rol." }); }
                });
            });
        },
        error:()=>{ hideLoading(); swal({ type:"error", message:"Ocurrió un error al verificar el rol." }); }
    });
}

function abrirModalReasignar(idRol, info){
    $("#txtRolEliminar").val(idRol);
    var total   = info && info.total ? info.total : 0;
    var nombres = info && info.nombres ? info.nombres : "";
    var badges = nombres
        ? nombres.split(", ").map(n=>`<span class="badge badge-light-danger me-1 mb-1">${escaparHtml(n)}</span>`).join("")
        : "";
    $("#msgReasignar").html(
        `Este rol tiene <strong>${total}</strong> usuario(s) asignado(s):` +
        `<div class="mt-2 mb-2">${badges}</div>` +
        `Selecciona un rol para reasignar a esos usuario(s) antes de eliminarlo.`
    );
    var options = `<option value="">Seleccione un rol...</option>`;
    rolesGlobal.forEach(r=>{
        if(String(r.id_rol) !== String(idRol)){
            options += `<option value="${r.id_rol}">${escaparHtml(r.nombre)}</option>`;
        }
    });
    $("#cmbRolDestino").html(options);
    $("#modalReasignar").modal("show");
}

function reasignarEliminar(){
    var idRol   = $("#txtRolEliminar").val();
    var destino = $("#cmbRolDestino").val();
    if(!destino){ swal({ type:"error", message:"Debe seleccionar un rol destino." }); return false; }
    $.ajax({
        type:"POST",
        url:`${$("#urlRequestRoles").val()}`,
        data:{ params:`idRol=${idRol}&idDestino=${destino}`, method:"reasignarEliminarRol" },
        beforeSend:()=>{ loading(); },
        success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            if(response.status == 1){
                swal({ type:"success", message: response.message });
                $("#modalReasignar").modal("hide");
                cargarRoles();
                return false;
            }
            swal({ type:"error", message: response.message || "No se pudo completar la operación." });
        },
        error:()=>{ hideLoading(); }
    });
}
