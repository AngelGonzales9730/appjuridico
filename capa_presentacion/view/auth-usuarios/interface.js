var rolesGlobalU   = [];
var usuariosGlobal = [];
var tablaUsuarios  = null;

function escaparHtml(texto){
    if(texto === null || texto === undefined) return "";
    return String(texto)
        .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

function iniciales(nombre, apellido){
    var i1 = (nombre || "").trim().charAt(0);
    var i2 = (apellido || "").trim().charAt(0);
    var r = (i1 + i2).toUpperCase();
    return r !== "" ? r : "US";
}

function urlFoto(foto){
    return `${$("#urlRequestUploads").val()}fotos/${foto}`;
}

KTUtil.onDOMContentLoaded(function(){
    cargarRolesCombo();
    cargarUsuarios();

    $("#txtBuscarUsuario").off("keyup.u").on("keyup.u", function(){
        if(tablaUsuarios) tablaUsuarios.search(this.value).draw();
    });
    $("#btnNuevoUsuario").off("click.u").on("click.u", abrirNuevoUsuario);
    $("#btnGuardarUsuario").off("click.u").on("click.u", guardarUsuario);
    $("#cmbRol").off("change.u").on("change.u", mostrarAccesosRol);

    // Iniciales en vivo mientras no haya foto cargada
    $("#txtNombre, #txtApellido").off("keyup.u").on("keyup.u", function(){
        if($("#fotoPreview").is(":hidden")){
            $("#fotoIniciales").text(iniciales($("#txtNombre").val(), $("#txtApellido").val()));
        }
    });
    // Preview de la foto
    $("#txtFoto").off("change.u").on("change.u", function(){
        var file = this.files[0];
        if(!file){ return; }
        var reader = new FileReader();
        reader.onload = function(e){
            $("#fotoPreview").attr("src", e.target.result).show();
            $("#fotoIniciales").hide();
        };
        reader.readAsDataURL(file);
    });
});

function cargarRolesCombo(){
    $.ajax({
        type:"GET",
        url:`${$("#urlRequestUsuarios").val()}`,
        data:{ method:"listarRoles" },
        success:(response)=>{
            response = JSON.parse(response);
            rolesGlobalU = response.data || [];
            var options = `<option value="">Seleccione un rol...</option>`;
            rolesGlobalU.forEach(r=>{ options += `<option value="${r.id_rol}">${escaparHtml(r.nombre)}</option>`; });
            $("#cmbRol").html(options);
        }
    });
}

function cargarUsuarios(){
    $.ajax({
        type:"GET",
        url:`${$("#urlRequestUsuarios").val()}`,
        data:{ method:"listarUsuarios" },
        beforeSend:()=>{ loading(); },
        success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            usuariosGlobal = response.data || [];
            pintarTablaUsuarios(usuariosGlobal);
        },
        error:()=>{ hideLoading(); }
    });
}

function avatarUsuario(u){
    if(u.foto){
        return `<div class="symbol symbol-35px symbol-circle me-3">
                    <img src="${urlFoto(u.foto)}" alt="foto" style="object-fit:cover;"/>
                </div>`;
    }
    return `<div class="symbol symbol-35px symbol-circle me-3">
                <span class="symbol-label bg-light-primary text-primary fw-bold">${iniciales(u.nombre, u.apellido)}</span>
            </div>`;
}

function pintarTablaUsuarios(data){
    if($.fn.DataTable.isDataTable("#tbUsuarios")){
        $("#tbUsuarios").DataTable().clear().destroy();
    }
    tablaUsuarios = $("#tbUsuarios").DataTable({
        data: data,
        order: [[0, 'desc']],
        columns: [
            { data: 'id_usuario', visible:false },
            {
                data: null,
                render: (d)=> `
                    <div class="d-flex align-items-center">
                        ${avatarUsuario(d)}
                        <div class="d-flex flex-column">
                            <span class="fw-bold text-gray-800">${escaparHtml((d.nombre||"")+" "+(d.apellido||""))}</span>
                            <span class="fs-8 text-muted">${escaparHtml(d.usuario || "")}</span>
                        </div>
                    </div>`
            },
            { data: 'celular', render: (d)=> d ? escaparHtml(d) : `<span class="text-muted">—</span>` },
            { data: 'nombre_rol', render: (d)=> `<span class="badge badge-light-info">${escaparHtml(d)}</span>` },
            {
                data: null,
                orderable:false,
                className:'text-end',
                render: (d)=> `
                    <div class="d-flex justify-content-end gap-1">
                        <button type="button" class="btn btn-icon btn-sm btn-light-dark" data-bs-toggle="tooltip" title="Ver usuario y contraseña" onclick="verCredenciales(${d.id_usuario})">
                            <i class="ki-duotone ki-key fs-4"><span class="path1"></span><span class="path2"></span></i>
                        </button>
                        <button type="button" class="btn btn-icon btn-sm btn-light-success" data-bs-toggle="tooltip" title="Descargar contrato" onclick="descargarContrato(${d.id_usuario})">
                            <i class="ki-duotone ki-file-down fs-4"><span class="path1"></span><span class="path2"></span></i>
                        </button>
                        <button type="button" class="btn btn-icon btn-sm btn-light-warning" data-bs-toggle="tooltip" title="Editar usuario" onclick="editarUsuario(${d.id_usuario})">
                            <i class="ki-duotone ki-pencil fs-4"><span class="path1"></span><span class="path2"></span></i>
                        </button>
                        <button type="button" class="btn btn-icon btn-sm btn-light-danger" data-bs-toggle="tooltip" title="Eliminar usuario" onclick="eliminarUsuario(${d.id_usuario})">
                            <i class="ki-duotone ki-trash fs-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>
                        </button>
                    </div>`
            }
        ],
        drawCallback: function(){
            if(window.bootstrap && bootstrap.Tooltip){
                document.querySelectorAll('#tbUsuarios [data-bs-toggle="tooltip"]').forEach(el=> bootstrap.Tooltip.getOrCreateInstance(el));
            }
        }
    });
}

function mostrarAccesosRol(){
    var idRol = $("#cmbRol").val();
    if(!idRol){
        $("#panelAccesos").html(`<span class="text-muted">Seleccione un rol para ver sus accesos.</span>`);
        return;
    }
    $.ajax({
        type:"GET",
        url:`${$("#urlRequestUsuarios").val()}`,
        data:{ params:idRol, method:"menuRol" },
        success:(response)=>{
            response = JSON.parse(response);
            var filas = response.data || [];
            if(filas.length === 0){
                $("#panelAccesos").html(`<span class="badge badge-light-warning">Este rol no tiene accesos asignados.</span>`);
                return;
            }
            // Agrupar submódulos por módulo
            var mapa = {}, orden = [];
            filas.forEach(f=>{
                if(!mapa[f.id_modulo]){ mapa[f.id_modulo] = { modulo:f.modulo, subs:[] }; orden.push(f.id_modulo); }
                mapa[f.id_modulo].subs.push(f.submodulo);
            });
            var html = "";
            orden.forEach(id=>{
                var m = mapa[id];
                var subs = m.subs.map(s=>
                    `<span class="badge badge-light-info fs-8 me-2 mb-1">
                        <i class="ki-duotone ki-arrow-right fs-8 me-1"><span class="path1"></span><span class="path2"></span></i>${escaparHtml(s)}
                     </span>`
                ).join("");
                html += `
                    <div class="mb-3">
                        <div class="mb-2"><span class="badge badge-primary fs-7 px-3 py-2">${escaparHtml(m.modulo)}</span></div>
                        <div class="ps-4">${subs}</div>
                    </div>`;
            });
            $("#panelAccesos").html(html);
        },
        error:()=>{
            $("#panelAccesos").html(`<span class="text-muted">No se pudieron cargar los accesos.</span>`);
        }
    });
}

function resetFoto(){
    $("#fotoPreview").attr("src","").hide();
    $("#fotoIniciales").show().text(iniciales($("#txtNombre").val(), $("#txtApellido").val()));
    $("#txtFoto").val("");
}

function abrirNuevoUsuario(){
    $("#tituloModalUsuario").text("Nuevo usuario");
    $("#frmUsuario")[0].reset();
    $("#txtIdUsuario").val("");
    $("#cmbRol").val("");
    $("#hintClave").text("");
    resetFoto();
    $("#fotoIniciales").text("US");
    mostrarAccesosRol();
    $("#modalUsuario").modal("show");
}

function editarUsuario(id){
    $.ajax({
        type:"GET",
        url:`${$("#urlRequestUsuarios").val()}`,
        data:{ params:id, method:"obtenerUsuario" },
        beforeSend:()=>{ loading(); },
        success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            if(response.status != 0 || !response.data || !response.data[0]){
                swal({ type:"error", message:"No se pudo cargar el usuario." });
                return false;
            }
            var u = response.data[0];
            $("#tituloModalUsuario").text("Editar usuario");
            $("#txtIdUsuario").val(u.id_usuario);
            $("#txtNombre").val(u.nombre);
            $("#txtApellido").val(u.apellido);
            $("#txtCelular").val(u.celular);
            $("#txtUsuario").val(u.usuario);
            $("#txtClave").val("");
            $("#hintClave").text("Déjala en blanco para no cambiar la contraseña.");
            $("#cmbRol").val(u.id_rol);
            // Foto
            $("#txtFoto").val("");
            if(u.foto){
                $("#fotoPreview").attr("src", urlFoto(u.foto)).show();
                $("#fotoIniciales").hide();
            }else{
                $("#fotoPreview").attr("src","").hide();
                $("#fotoIniciales").show().text(iniciales(u.nombre, u.apellido));
            }
            mostrarAccesosRol();
            $("#modalUsuario").modal("show");
        },
        error:()=>{ hideLoading(); }
    });
}

function guardarUsuario(){
    var nombre   = $("#txtNombre").val().trim();
    var apellido = $("#txtApellido").val().trim();
    var usuario  = $("#txtUsuario").val().trim();
    var clave    = $("#txtClave").val();
    var idRol    = $("#cmbRol").val();
    var esNuevo  = ($("#txtIdUsuario").val() || "") === "";

    if(nombre === ""){ swal({ type:"error", message:"El nombre es obligatorio." }); return false; }
    if(apellido === ""){ swal({ type:"error", message:"El apellido es obligatorio." }); return false; }
    if(usuario === ""){ swal({ type:"error", message:"El usuario es obligatorio." }); return false; }
    if(!idRol){ swal({ type:"error", message:"Debe seleccionar un rol." }); return false; }
    if(esNuevo && clave === ""){ swal({ type:"error", message:"La contraseña es obligatoria." }); return false; }

    var formData = new FormData();
    formData.append("metodoFormData", "guardarUsuario");
    formData.append("txtIdUsuario", $("#txtIdUsuario").val());
    formData.append("txtNombre", nombre);
    formData.append("txtApellido", apellido);
    formData.append("txtCelular", $("#txtCelular").val().trim());
    formData.append("txtUsuario", usuario);
    formData.append("txtClave", clave);
    formData.append("cmbRol", idRol);
    var foto = $("#txtFoto")[0].files[0];
    if(foto){ formData.append("foto", foto); }

    $.ajax({
        type:"POST",
        url:`${$("#urlRequestUsuarios").val()}`,
        data: formData,
        processData: false,
        contentType: false,
        beforeSend:()=>{ loading(); },
        success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            if(response.status == 1){
                swal({ type:"success", message: response.message });
                $("#modalUsuario").modal("hide");
                cargarUsuarios();
                if(esNuevo && response.id_usuario){
                    descargarContrato(response.id_usuario);
                }
                return false;
            }
            swal({ type:"error", message: response.message || "No se pudo guardar el usuario." });
        },
        error:()=>{ hideLoading(); }
    });
}

function eliminarUsuario(id){
    var u = usuariosGlobal.find(x=> String(x.id_usuario) === String(id));
    var nombre = u ? (u.nombre+" "+u.apellido) : "";
    Swal.fire({
        html: `¿Está seguro de eliminar al usuario <strong>${escaparHtml(nombre)}</strong>?`,
        icon: "question", showCancelButton: true, buttonsStyling: false,
        confirmButtonText: "Sí, eliminar", cancelButtonText: "Cancelar",
        customClass: { confirmButton: "btn fw-bold btn-danger", cancelButton: "btn fw-bold btn-active-light-primary" }
    }).then(result=>{
        if(!result.value) return false;
        $.ajax({
            type:"POST",
            url:`${$("#urlRequestUsuarios").val()}`,
            data:{ params:id, method:"eliminarUsuario" },
            beforeSend:()=>{ swalLoading(); },
            success:(response)=>{
                response = JSON.parse(response);
                if(response.status == 1){ swal({ type:"success", message: response.message }); cargarUsuarios(); return false; }
                swal({ type:"error", message: response.message || "No se pudo eliminar el usuario." });
            },
            error:()=>{ swal({ type:"error", message:"Ocurrió un error al eliminar el usuario." }); }
        });
    });
}

// Muestra al administrador el usuario y la contraseña vigente de la cuenta
function verCredenciales(id){
    var u = usuariosGlobal.find(x=> String(x.id_usuario) === String(id));
    if(!u) return false;
    var estado = parseInt(u.cambio_pendiente, 10) === 1
        ? '<span class="badge badge-light-warning">Temporal (el usuario aún no la cambia)</span>'
        : '<span class="badge badge-light-success">Personalizada por el usuario</span>';
    Swal.fire({
        title: "Credenciales de acceso",
        html: `<div style="text-align:left; line-height:2;">
                    <div><strong>Usuario:</strong> <code>${escaparHtml(u.usuario || "—")}</code></div>
                    <div><strong>Contraseña:</strong> <code>${escaparHtml(u.clave_visible || "—")}</code></div>
                    <div class="mt-2">${estado}</div>
               </div>`,
        icon: "info",
        buttonsStyling: false,
        confirmButtonText: "Cerrar",
        customClass: { confirmButton: "btn fw-bold btn-primary" }
    });
}

function descargarContrato(id){
    var url = `${$("#urlRequestContrato").val()}?id=${id}`;
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = url;
    document.body.appendChild(iframe);
    setTimeout(()=>{ if(iframe.parentNode) document.body.removeChild(iframe); }, 60000);
}
