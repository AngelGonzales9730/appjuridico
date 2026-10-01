
var div_caso_uno  = ["divEJudicial","divCFiscal","divIncidente"];
var div_caso_dos  = ["divEJudicial","divMCautelar"];
var div_caso_tres = ["divEJudicial"];
var div_total     = ["divEJudicial","divCFiscal","divIncidente","divMCautelar"];

var div_caso_uno_upd  = ["divEJudicialUpdate","divCFiscalUpdate","divIncidenteUpdate"];
var div_caso_dos_upd  = ["divEJudicialUpdate","divMCautelarUpdate"];
var div_caso_tres_upd = ["divEJudicialUpdate"];
var div_total_upd     = ["divEJudicialUpdate","divCFiscalUpdate","divIncidenteUpdate","divMCautelarUpdate"];

$("document").ready(function(){
    $("#cmbMateria").select2({
            dropdownParent: $('#modalCaso')
    });
    $("#cmbMateriaUpdate").select2({
        dropdownParent: $('#modalCasoUpdate')
    });
    $("#txtBuscarCaso").focus();
});

$("#btnOpenModalCaso").on("click",()=>{
    modal("modalCaso",1);
});

$("#modalCaso").on("shown.bs.modal",()=>{
    $("#txtPatrocinado").focus();
});

$("#cmbMateria").on("change",(e)=>{

    if(e.currentTarget.value == "Penal"){
        removeAtribute(div_caso_dos,0); //ocultar
        removeAtribute(div_caso_tres,0); //ocultar
        removeAtribute(div_caso_uno,1); //Mostrar
    }
    if(e.currentTarget.value == "Civil" || e.currentTarget.value == "Laboral" || e.currentTarget.value == "Familia"
        || e.currentTarget.value == "Constitucional" || e.currentTarget.value == "Contencioso_administrativo"
    ){
        removeAtribute(div_caso_uno,0); //Ocultar
        removeAtribute(div_caso_tres,0); //Ocultar
        removeAtribute(div_caso_dos,1); //Mostrar
    }
    if(e.currentTarget.value == "Administrativo" || e.currentTarget.value == "Casos_libres"
    ){
        removeAtribute(div_caso_uno,0); //Ocultar
        removeAtribute(div_caso_dos,0); //Ocultar
        removeAtribute(div_caso_tres,1); //Mostrar
    }
});

$("#cmbMateriaUpdate").on("change",(e)=>{
    removeDivDynamic(e.currentTarget.value);
});

function setDataDynamic(value,content){
    if(value == "Penal"){
        $("#txtExpJudicialUpdate").val(content.desc_ejudicial);
        $("#txtCarpetaFiscalUpdate").val(content.desc_cfiscal);
        $("#txtIncidenteUpdate").val(content.desc_incidente);
    }
    if(value == "Civil" || value == "Laboral" || value == "Familia"
        || value == "Constitucional" || value == "Contencioso_administrativo"
    ){
        $("#txtExpJudicialUpdate").val(content.desc_ejudicial);
        $("#txtMCautelarUpdate").val(content.desc_mcautelar);
    }
    if(value == "Administrativo" || value == "Casos_libres"
    ){
        $("#txtExpJudicialUpdate").val(content.desc_ejudicial);
    }
}

function removeDivDynamic(value){
    if(value == "Penal"){
        removeAtribute(div_caso_dos_upd,0); //ocultar
        removeAtribute(div_caso_tres_upd,0); //ocultar
        removeAtribute(div_caso_uno_upd,1); //Mostrar
    }
    if(value == "Civil" || value == "Laboral" || value == "Familia"
        || value == "Constitucional" || value == "Contencioso_administrativo"
    ){
        removeAtribute(div_caso_uno_upd,0); //Ocultar
        removeAtribute(div_caso_tres_upd,0); //Ocultar
        removeAtribute(div_caso_dos_upd,1); //Mostrar
    }
    if(value == "Administrativo" || value == "Casos_libres"
    ){
        removeAtribute(div_caso_uno_upd,0); //Ocultar
        removeAtribute(div_caso_dos_upd,0); //Ocultar
        removeAtribute(div_caso_tres_upd,1); //Mostrar
    }
}

function removeAtribute(params,type){
    if(type === 1){
        params.forEach(element => {
            $(`#${element}`).removeAttr("hidden");  
        });
    }else if(type === 0){
        params.forEach(element => {
            $(`#${element}`).prop("hidden",true);  
        });
    }
}

$("#btnSaveCase").on("click",()=>{
    var formulario = $("#frmCasos").serialize();
    $.ajax({
        type:"POST",
        url:"../../../capa_negocio/caso-mantenimiento-casos/logic.php",
        data:{
            "params":formulario,
            "method":"insertCase"
        },
        beforeSend:()=>{
            loading();
        },success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            if(response.status == 1){
                response.type = "success";
                swal(response);
                $('#cmbMateria').val(0).trigger('change');
                removeAtribute(div_total,0);
                $("#frmCasos")[0].reset();
                modal("modalCaso",0);
                reloadDataTable();
                return false;
            }
            response.type = "error";
            swal(response);
        },error:(xhr,status,error)=>{
            console.log(error);
        }
    });
});

//DATATABLES
var KTDatatablesServerSide = function () {
    // Shared variables
    var table;
    var dt;
    var filterPayment;

    // Private functions
    var initDatatable = function () {
        dt = $("#tbCasos").DataTable({
            searchDelay: 500,
            processing: true,
            serverSide: true,
            stateSave: false,
            order: [[0, 'desc']],
            ajax: {
                url: "../caso-carga-archivos-casos/datatables.php",
            },
            columns: [
                { data: 'id_caso', visible: false },
                {
                    data: 'cod_caso',
                    orderable: false,
                    render: function (data) {
                        if(!data || data.length <= 0){
                            return `<span class="badge badge-light-danger">Sin data</span>`;
                        }
                        return `
                            <div class="d-flex align-items-center">
                                <button type="button" class="btn btn-icon btn-active-light-primary btn-toggle-detail p-0 me-2" style="width:20px;height:20px;" title="Ver detalle">
                                    <span class="toggle-icon fw-bold fs-4 lh-1">+</span>
                                </button>
                                <span class="badge badge-light-primary fw-bold">${escaparHtml(data)}</span>
                            </div>`;
                    }
                },
                {
                    data: 'desc_patrocinado',
                    orderable: false,
                    render: function (data) {
                        if(!data || data.length <= 0){
                            return `<span class="badge badge-light-danger">Sin data</span>`;
                        }
                        return `<span class="fw-semibold text-gray-800">${celdaTruncada(data, 40)}</span>`;
                    }
                },
                {
                    data: 'desc_materia',
                    orderable: false,
                    render: function (data) {
                        return badgeMateria(data);
                    }
                },
                {
                    data: 'tiene_archivos',
                    orderable: false,
                    className: 'text-center',
                    render: function (data, type, row) {
                        var reg  = parseInt(row.total_registros, 10) || 0;
                        var carg = parseInt(row.archivos_cargados, 10) || 0;

                        if(reg === 0){
                            return `<span class="badge badge-light-secondary">Pendiente</span>`;
                        }
                        // Cada sección admite filas ilimitadas: se espera un Escrito y una
                        // Fiscalía por fila registrada (filas x 2), no por sección.
                        var esp   = reg * 2;
                        var pct   = Math.min(100, Math.round((carg * 100) / esp));
                        var color = (carg >= esp) ? "success" : (carg > 0 ? "primary" : "warning");
                        return `
                            <div class="d-flex flex-column align-items-center" title="PDFs cargados / PDFs posibles (${reg} ${reg === 1 ? "fila" : "filas"} x 2)">
                                <span class="fw-bold fs-7 text-${color} mb-1">${carg}/${esp}</span>
                                <div class="progress h-6px w-90px">
                                    <div class="progress-bar bg-${color}" role="progressbar" data-width="${pct}" style="width:0%; transition:width .9s ease;"></div>
                                </div>
                                <span class="fs-8 text-muted mt-1">${reg} ${reg === 1 ? "fila" : "filas"}</span>
                            </div>`;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-end',
                    render: function (data) {
                        var id = data.id_caso;
                        // "Gestionar archivos": el modal muestra las filas ya registradas para
                        // editarlas o eliminarlas y permite agregar nuevas.
                        return `
                            <div class="d-flex justify-content-end gap-1">
                                <button type="button" class="btn btn-icon btn-sm btn-light-primary" data-bs-toggle="tooltip" title="Gestionar archivos" onclick="loadFile(${id})">
                                    <i class="ki-duotone ki-file-up fs-4"><span class="path1"></span><span class="path2"></span></i>
                                </button>
                                <button type="button" class="btn btn-icon btn-sm btn-light-info" data-bs-toggle="tooltip" title="Visualizar PDFs" onclick="viewFiles(${id})">
                                    <i class="ki-duotone ki-eye fs-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                </button>
                            </div>`;
                    },
                },
            ],
        });

        table = dt.$;

        // Expandir / contraer el detalle del caso (fila hija)
        $("#tbCasos tbody").off("click.detalle", ".btn-toggle-detail")
            .on("click.detalle", ".btn-toggle-detail", function () {
                var tr  = $(this).closest("tr");
                var row = dt.row(tr);
                var icono = $(this).find(".toggle-icon");
                if(row.child.isShown()){
                    row.child.hide();
                    tr.removeClass("shown");
                    icono.text("+");
                }else{
                    row.child(formatChildCaso(row.data())).show();
                    tr.addClass("shown");
                    icono.text("−");
                }
            });

        dt.on('draw', function () {
            initToggleToolbar();
            toggleToolbars();
            handleDeleteRows();
            KTMenu.createInstances();
            // Inicializar tooltips de los botones de acción
            if(window.bootstrap && bootstrap.Tooltip){
                document.querySelectorAll('#tbCasos [data-bs-toggle="tooltip"]').forEach(el=>{
                    bootstrap.Tooltip.getOrCreateInstance(el);
                });
            }
            // Animar las barras de progreso (de 0% al valor real)
            setTimeout(function(){
                document.querySelectorAll('#tbCasos .progress-bar[data-width]').forEach(function(b){
                    b.style.width = b.getAttribute("data-width") + "%";
                });
            }, 80);
        });
    }

    
    var handleSearchDatatable = function () {
        const filterSearch = document.querySelector('[data-kt-docs-table-filter="search"]');
        filterSearch.addEventListener('keyup', function (e) {
            dt.search(e.target.value).draw();
        });
    }

    // Filter Datatable
    var handleFilterDatatable = () => {
        // Select filter options
        filterPayment = document.querySelectorAll('[data-kt-docs-table-filter="findCase"] [name="findCase"]');
        const filterButton = document.querySelector('[data-kt-docs-table-filter="findCase"]');

        // Filter datatable on submit
        // filterButton.addEventListener('click', function () {
        //     // Get filter values
        //     let paymentValue = '';

        //     paymentValue = "Caso";
        //     // Get payment value
        //     // filterPayment.forEach(r => {
        //     //     if (r.checked) {
        //     //         paymentValue = r.value;
        //     //     }

        //     //     // Reset payment value if "All" is selected
        //     //     if (paymentValue === 'all') {
        //     //         paymentValue = '';
        //     //     }
        //     // });

        //     // Filter datatable --- official docs reference: https://datatables.net/reference/api/search()
        //     dt.search(paymentValue).draw();
        // });
    }

    // Eliminar registro
    var handleDeleteRows = () => {
        const deleteButtons = document.querySelectorAll('[data-kt-docs-table-filter="delete_row"]');
        deleteButtons.forEach(d => {
            d.addEventListener('click', function (e) {
                e.preventDefault();
                const parent = e.target.closest('tr');
                const value = parent.querySelectorAll('td')[1].innerText;
                const ide = parent.querySelectorAll('td')[0].innerText;
                Swal.fire({
                    html: "Estar seguro de eliminar: <strong>" + value + "</strong>?",
                    icon: "question",
                    showCancelButton: true,
                    buttonsStyling: false,
                    confirmButtonText: "Sí, eliminar!",
                    cancelButtonText: "No, cancelar",
                    customClass: {
                        confirmButton: "btn fw-bold btn-danger",
                        cancelButton: "btn fw-bold btn-active-light-primary"
                    }
                }).then(function (result) {
                    if (result.value) {
                        $.ajax({
                            type:"POST",
                            data:{
                                "params":ide,
                                "method":"dropCase"
                            },
                            url:"../../../capa_negocio/caso-mantenimiento-casos/logic.php",
                            beforeSend:()=>{
                                swalLoading();
                            },
                            success:(response)=>{
                                response = JSON.parse(response);
                                if(response.status == 1){
                                    response.type = "success";
                                    swal(response);
                                    reloadDataTable();
                                    return false;
                                }
                                response.type = "error";
                                swal(response);
                            },error:(xhr,status,error)=>{
                                response.message = JSON.stringify(error);
                                response.type = "error";
                                swal(response);
                            }
                        });
                        
                    } 
                });
                
            })
        });
    }


    // Init toggle toolbar
    var initToggleToolbar = function () {
        // Toggle selected action toolbar
        // Select all checkboxes
        const container = document.querySelector('#tbCasos');
        const checkboxes = container.querySelectorAll('[type="checkbox"]');

        // Select elements
        const deleteSelected = document.querySelector('[data-kt-docs-table-select="delete_selected"]');

        // Toggle delete selected toolbar
        checkboxes.forEach(c => {
            // Checkbox on click event
            c.addEventListener('click', function () {
                setTimeout(function () {
                    toggleToolbars();
                }, 50);
            });
        });

        // Deleted selected rows
        // deleteSelected.addEventListener('click', function () {
        //     // SweetAlert2 pop up --- official docs reference: https://sweetalert2.github.io/
        //     Swal.fire({
        //         text: "Are you sure you want to delete selected customers?",
        //         icon: "warning",
        //         showCancelButton: true,
        //         buttonsStyling: false,
        //         showLoaderOnConfirm: true,
        //         confirmButtonText: "Yes, delete!",
        //         cancelButtonText: "No, cancel",
        //         customClass: {
        //             confirmButton: "btn fw-bold btn-danger",
        //             cancelButton: "btn fw-bold btn-active-light-primary"
        //         },
        //     }).then(function (result) {
        //         if (result.value) {
        //             // Simulate delete request -- for demo purpose only
        //             Swal.fire({
        //                 text: "Deleting selected customers",
        //                 icon: "info",
        //                 buttonsStyling: false,
        //                 showConfirmButton: false,
        //                 timer: 2000
        //             }).then(function () {
        //                 Swal.fire({
        //                     text: "You have deleted all selected customers!.",
        //                     icon: "success",
        //                     buttonsStyling: false,
        //                     confirmButtonText: "Ok, got it!",
        //                     customClass: {
        //                         confirmButton: "btn fw-bold btn-primary",
        //                     }
        //                 }).then(function () {
        //                     // delete row data from server and re-draw datatable
        //                     dt.draw();
        //                 });

        //                 // Remove header checked box
        //                 const headerCheckbox = container.querySelectorAll('[type="checkbox"]')[0];
        //                 headerCheckbox.checked = false;
        //             });
        //         } else if (result.dismiss === 'cancel') {
        //             Swal.fire({
        //                 text: "Selected customers was not deleted.",
        //                 icon: "error",
        //                 buttonsStyling: false,
        //                 confirmButtonText: "Ok, got it!",
        //                 customClass: {
        //                     confirmButton: "btn fw-bold btn-primary",
        //                 }
        //             });
        //         }
        //     });
        // });
    }

    // Toggle toolbars
    var toggleToolbars = function () {
        // Define variables
        const container = document.querySelector('#tbCasos');
        const toolbarBase = document.querySelector('[data-kt-docs-table-toolbar="base"]');
        const toolbarSelected = document.querySelector('[data-kt-docs-table-toolbar="selected"]');
        const selectedCount = document.querySelector('[data-kt-docs-table-select="selected_count"]');

        // Select refreshed checkbox DOM elements
        const allCheckboxes = container.querySelectorAll('tbody [type="checkbox"]');

        // Detect checkboxes state & count
        let checkedState = false;
        let count = 0;

        // Count checked boxes
        allCheckboxes.forEach(c => {
            if (c.checked) {
                checkedState = true;
                count++;
            }
        });
        selectedCount.innerHTML = 1;
        toolbarBase.classList.add('d-none');
        toolbarSelected.classList.remove('d-none');
        // Toggle toolbars
        if (checkedState) {
            selectedCount.innerHTML = count;
            toolbarBase.classList.add('d-none');
            toolbarSelected.classList.remove('d-none');
        } else {
            toolbarBase.classList.remove('d-none');
            toolbarSelected.classList.add('d-none');
        }
    }

    // Public methods
    return {
        init: function () {
            initDatatable();
            handleSearchDatatable();
            initToggleToolbar();
            handleFilterDatatable();
            handleDeleteRows();
            // handleResetForm();
        }
    }
}();

// Al iniciar documento
KTUtil.onDOMContentLoaded(function () {
    KTDatatablesServerSide.init();
});

function reloadDataTable(){
    $('#tbCasos').DataTable().destroy();
    KTDatatablesServerSide.init();
}

// ============================================================
//  MODAL DE CARGA: SECCIONES CON FILAS DINÁMICAS
//  Cada sección (Expediente Judicial, Carpeta Fiscal, etc.) admite
//  varias filas. orden_registro = posición de la sección en name_files.
// ============================================================

var filaSeq = 0; // contador para ids únicos de las filas del modal de carga

// Solicita al backend las secciones (name_files) según la materia del caso
function obtenerSeccionesCaso(ide){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"GET",
            url:`${$("#urlRequestFiles").val()}`,
            data:{ "params":ide, "method":"getDataCaso" },
            beforeSend:()=>{ loading(); },
            success:(response)=>{
                hideLoading();
                try { resolve(JSON.parse(response)); }
                catch(e){ reject(e); }
            },
            error:(xhr,status,error)=>{ hideLoading(); reject(error); }
        });
    });
}

function loadFile(ide){
    var secciones = null;
    obtenerSeccionesCaso(ide).then(response=>{
        if(response.status != 0 || !response.data || response.data.length === 0){
            return Promise.reject(response.message || "No se encontraron secciones para la materia del caso.");
        }
        secciones = response.data[0];
        return obtenerRegistrosCaso(ide);
    }).then(response=>{
        if(response.status != 0){
            return Promise.reject(response.message || "No se pudo cargar la información.");
        }
        renderCarga(secciones, response.data || []);
        $("#modalArchivo").modal("show");
    }).catch(error=>{
        swal({ type:"error", message: (typeof error === "string" && error) ? error : "Ocurrió un error al cargar el caso." });
    });
}

function renderCarga(secciones, registros){
    // Limpiar dropzones de aperturas anteriores
    $("#tbBodyArchivos .fila-carga").each(function(){ destruirDropzonesFila($(this)); });
    $("#tbBodyArchivos").html("");
    $("#codCaso").val(secciones.id_caso);

    var nombres = secciones.name_files.split(",");
    nombres.forEach((nombre, index)=>{
        var orden = index + 1;
        var $seccion = seccionCarga(orden, nombre.trim(), false);

        // Filas ya registradas de la sección (vienen ordenadas por creación)
        var filas = registros.filter(reg => (parseInt(reg.orden,10) || 1) === orden);
        if(filas.length === 0){
            agregarFila($seccion, null);
        }else{
            filas.forEach(reg => agregarFila($seccion, reg));
        }
    });

    // Filas de secciones que ya no corresponden a la materia actual del caso
    // (p. ej. se cambió de Penal a Civil): se muestran para editarlas o eliminarlas.
    var huerfanas = registros.filter(reg => (parseInt(reg.orden,10) || 1) > nombres.length);
    if(huerfanas.length > 0){
        var $otras = seccionCarga("", "Otras (materia anterior)", true);
        huerfanas.forEach(reg => agregarFila($otras, reg));
    }
}

// Crea una sección del modal de carga y la agrega al final del cuerpo
function seccionCarga(orden, nombre, huerfana){
    var $seccion = $(`
        <div class='row m-0 p-0 seccion-carga ${huerfana ? "seccion-huerfana" : ""}' data-orden='${orden}' data-nombre='${escaparHtml(nombre)}'>
            <div class='col-md-12'>
                <h2>${escaparHtml(nombre)}</h2>
                ${huerfana ? `<p class="text-muted fs-7">Filas registradas en secciones que ya no corresponden a la materia actual del caso. Pueden editarse o eliminarse.</p>` : ""}
            </div>
            <div class='col-md-12'>
                <div class='table-responsive'>
                    <table class='table table-md table-hover table-bordered'>
                        <thead>
                            <tr>
                                <th>
                                    <div class="fv-row mb-10">
                                        <label class="required">PETITORIO</label>
                                    </div>
                                </th>
                                <th>
                                    <div class="fv-row mb-10">
                                        <label class="required">FECHA</label>
                                    </div>
                                </th>
                                <th>FISCALÍA</th>
                                <th>FECHA</th>
                                <th>RESUMEN</th>
                                <th>ESCRITOS</th>
                                <th>FISCALÍA</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody class="tbody-filas"></tbody>
                    </table>
                </div>
                ${huerfana ? "" : `<button type="button" class="btn btn-sm btn-light-primary btn-agregar-fila mb-2">+ Agregar fila</button>`}
            </div>
            <hr>
        </div>`);
    $("#tbBodyArchivos").append($seccion);
    return $seccion;
}

// Agrega una fila (vacía o con un registro existente) al final de la sección
function agregarFila($seccion, reg){
    var $tr = $(filaCargaHtml(reg));
    $seccion.find(".tbody-filas").append($tr);
    initDropzonesFila($tr);
    $tr.data("original", JSON.stringify(valoresFila($tr)));
    return $tr;
}

function filaCargaHtml(reg){
    var k       = ++filaSeq;
    var id      = reg ? reg.id : "";
    var checked = (reg && parseInt(reg.resuelve,10) === 1) ? "checked" : "";
    var accion  = reg
        ? `<button type="button" class="btn btn-icon btn-sm btn-light-danger btn-eliminar-fila" title="Eliminar fila">
                <i class="ki-duotone ki-trash fs-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>
           </button>`
        : `<button type="button" class="btn btn-icon btn-sm btn-light-danger btn-quitar-fila" title="Quitar fila">✕</button>`;
    return `
        <tr class="fila-carga" data-id="${id}" data-orden="${reg ? escaparHtml(reg.orden) : ""}">
            <td><input type="text" class="form-control form-control-sm f-pet" id="txtPet${k}" value="${reg ? escaparHtml(reg.petitorio) : ""}" autocomplete="off" /></td>
            <td><input type="date" class="form-control form-control-sm f-fecha" id="txtFecha${k}" value="${reg ? escaparHtml(reg.fechaUno) : ""}" autocomplete="off" /></td>
            <td>
                <div class="form-check form-check-success form-check-solid form-check-sm">
                    <input type="checkbox" class="form-check-input f-check" style="cursor:pointer;" id="txtCheck${k}" ${checked} />
                    <label class="form-check-label" for="txtCheck${k}" style="cursor:pointer;">
                        Resolvió
                    </label>
                </div>
            </td>
            <td><input type="date" class="form-control form-control-sm f-fechad" id="txtFechaD${k}" value="${reg ? escaparHtml(reg.fechaDos) : ""}" autocomplete="off" /></td>
            <td>
                <textarea class="form-control form-control-sm f-resumen" id="txtResumen${k}" rows="4" cols="50">${reg ? escaparHtml(reg.resumen) : ""}</textarea>
            </td>
            <td>
                ${archivoActualCarga(reg, "escrito", "Escrito")}
                ${dropzoneCargaHtml(`fileEscrito${k}`, reg && reg.escritoFile)}
            </td>
            <td>
                ${archivoActualCarga(reg, "fiscalia", "Fiscalía")}
                ${dropzoneCargaHtml(`txtFileFiscalia${k}`, reg && reg.fiscaliaFile)}
            </td>
            <td class="text-center align-middle">${accion}</td>
        </tr>`;
}

function dropzoneCargaHtml(idDz, tieneArchivo){
    return `
        <div class="fv-row">
            <div class="dropzone" id="${idDz}">
                <div class="dz-message needsclick">
                    <i class="ki-duotone ki-file-up fs-2x text-primary"><span class="path1"></span><span class="path2"></span></i>
                    <div class="ms-4">
                        <h6 class="fs-7 fw-bold text-gray-900 mb-1">${tieneArchivo ? "Reemplazar archivo" : "Cargar o arrastrar archivos"}</h6>
                        <span class="fs-8 text-muted">PDF opcional, puede cargarlo después</span>
                    </div>
                </div>
            </div>
        </div>`;
}

// PDF ya cargado de una fila guardada: ver / eliminar
function archivoActualCarga(reg, campo, etiqueta){
    var fileName = reg ? (campo === "escrito" ? reg.escritoFile : reg.fiscaliaFile) : null;
    if(!fileName) return "";
    var titulo = `${nombreTipoRegistro(reg)} - ${etiqueta}`;
    return `
        <div class="d-flex flex-wrap gap-2 mb-2 archivo-actual" data-campo="${campo}">
            <button type="button" class="btn btn-sm btn-light-primary" onclick="openPdfViewer('${escaparHtml(fileName)}','${escaparHtml(titulo)}')">
                <i class="ki-duotone ki-eye fs-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i> Ver actual
            </button>
            <button type="button" class="btn btn-sm btn-light-danger" onclick="deleteArchivoFile(${reg.id},'${campo}','${escaparHtml(etiqueta)}')">
                <i class="ki-duotone ki-trash fs-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i> Eliminar archivo
            </button>
        </div>`;
}

function crearDropzoneCarga(elemento){
    return new Dropzone(elemento, {
        url         : "../caso-carga-archivos-casos/validate.php",
        method      : "post",
        paramName   : "file",
        maxFiles    : 1,
        maxFilesize : 100, // MB
        addRemoveLinks      : true,
        acceptedFiles       : ".pdf",
        dictDefaultMessage  : "Eliminar archivos cargados",
        dictRemoveFile      : "Eliminar",
        dictCancelUpload    : "Cancelar",
        init: function() {
            this.on("error", function(file, errorMessage) {
                this.removeFile(file);
                var response = {
                    type : "error",
                    message : "Error"
                };
                swal(response);
            });
            this.on("maxfilesexceeded", function(file) {
                this.removeFile(file);
                var response = {
                    type : "error",
                    message : "El limite de archivos a cargar es de uno"
                };
                swal(response);
            });
            this.on("complete", function(file){
                if(file.status == "error") return false;

                if(file.xhr.responseText == "") return false;

                var response = JSON.parse(file.xhr.responseText);
                if(response.status == -1){
                    this.removeFile(file);
                    var response = {
                        type    : "error",
                        message : response.message
                    };
                    swal(response);
                    return false;
                }
            });
        },
        accept: function(file, done) {
            done();
        }
    });
}

function initDropzonesFila($tr){
    var zonas = $tr.find(".dropzone");
    $tr.data("dzEscrito",  crearDropzoneCarga(zonas[0]));
    $tr.data("dzFiscalia", crearDropzoneCarga(zonas[1]));
}

function destruirDropzonesFila($tr){
    ["dzEscrito","dzFiscalia"].forEach(clave=>{
        var dz = $tr.data(clave);
        if(dz){ try { dz.destroy(); } catch(e) {} }
    });
}

// Valores editables de una fila (para validar, enviar y detectar cambios)
function valoresFila($tr){
    return {
        petitorio : $tr.find(".f-pet").val().trim(),
        fechaUno  : $tr.find(".f-fecha").val(),
        resolvio  : $tr.find(".f-check").is(":checked"),
        fechaDos  : $tr.find(".f-fechad").val(),
        resumen   : $tr.find(".f-resumen").val()
    };
}

function filaVacia(v){
    return v.petitorio === "" && v.fechaUno === "" && !v.resolvio && v.fechaDos === "" && v.resumen.trim() === "";
}

// Quita una fila; si la sección queda sin filas, deja una vacía
// (la sección "Otras (materia anterior)" se retira al quedar vacía)
function quitarFila($tr){
    if($tr.hasClass("fila-sale-anim")) return; // ya se está quitando (doble clic)
    var $seccion = $tr.closest(".seccion-carga");

    // Desvanecido breve antes de retirar la fila (sin espera si se reducen animaciones)
    var reducir = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    $tr.addClass("fila-sale-anim");
    setTimeout(()=>{
        destruirDropzonesFila($tr);
        $tr.remove();
        if($seccion.find(".fila-carga").length === 0){
            if($seccion.hasClass("seccion-huerfana")){
                $seccion.remove();
            }else{
                var $nueva = agregarFila($seccion, null).addClass("fila-nueva-anim");
                setTimeout(()=>{ $nueva.removeClass("fila-nueva-anim"); }, 300);
            }
        }
    }, reducir ? 0 : 220);
}

$(document).off("click.cargaFilas", ".btn-agregar-fila").on("click.cargaFilas", ".btn-agregar-fila", function(){
    var $tr = agregarFila($(this).closest(".seccion-carga"), null);

    // Aparición progresiva (inversa del desvanecido de salida)
    $tr.addClass("fila-nueva-anim");
    setTimeout(()=>{ $tr.removeClass("fila-nueva-anim"); }, 300);

    $tr[0].scrollIntoView({ behavior: "smooth", block: "nearest" });
    $tr.find(".f-pet")[0].focus({ preventScroll: true });
});

// Filas nuevas (sin guardar): se quitan del formulario sin confirmación
$(document).off("click.cargaFilas", ".btn-quitar-fila").on("click.cargaFilas", ".btn-quitar-fila", function(){
    quitarFila($(this).closest(".fila-carga"));
});

// Filas guardadas: eliminación lógica del registro, con confirmación
$(document).off("click.cargaFilas", ".btn-eliminar-fila").on("click.cargaFilas", ".btn-eliminar-fila", function(){
    var $tr      = $(this).closest(".fila-carga");
    var id       = $tr.attr("data-id");
    var $seccion = $tr.closest(".seccion-carga");
    var fila     = $seccion.find(".fila-carga").index($tr) + 1;
    Swal.fire({
        html: `¿Está seguro de eliminar la fila ${fila} de <strong>${escaparHtml($seccion.attr("data-nombre"))}</strong>?`,
        icon: "question",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "btn fw-bold btn-danger",
            cancelButton: "btn fw-bold btn-active-light-primary"
        }
    }).then(result=>{
        if(!result.value) return false;
        $.ajax({
            type:"POST",
            url:`${$("#urlRequestFiles").val()}`,
            data:{ "params":id, "method":"eliminarRegistroFile" },
            beforeSend:()=>{ swalLoading(); },
            success:(response)=>{
                response = JSON.parse(response);
                if(response.status == 1){
                    swal({ type:"success", message: response.message || "Registro eliminado con éxito." });
                    quitarFila($tr);
                    if($.fn.DataTable.isDataTable("#tbCasos")){ $("#tbCasos").DataTable().ajax.reload(null, false); }
                    return false;
                }
                swal({ type:"error", message: response.message || "No se pudo eliminar el registro." });
            },
            error:()=>{
                swal({ type:"error", message:"Ocurrió un error al eliminar el registro." });
            }
        });
    });
});

$("#btnSaveUpdateCase").on("click",()=>{
    saveUpdate();
});

function saveUpdate(){
    var form = $("#frmCasosUpdate").serialize();
    $.ajax({
        type:"POST",
        data:{
            "params":form,
            "method":"updateCaso"
        },
        url:`${$("#urlRequestCasos").val()}`,
        beforeSend:()=>{
            loading();
        },success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            console.log(response);
            if(response.status == 1){
                response.type = "success";
                swal(response);
                removeAtribute(div_total,0);
                $("#frmCasosUpdate")[0].reset();
                modal("modalCasoUpdate",0);
                reloadDataTable();
                return false;
            }
            response.type = "error";
            swal(response);
        }
    });
}

$("#btnSaveFile").on("click",()=>{
    let success     = 0, failed = 0;
    var envios      = [];

    // Recorre cada fila de cada sección:
    //  - fila nueva completamente vacía  -> se ignora
    //  - fila nueva con datos            -> insertar (Petitorio y Fecha obligatorios)
    //  - fila guardada con cambios/PDF    -> actualizar (Petitorio obligatorio)
    // Los archivos de Escritos y Fiscalía son opcionales.
    var campoFaltante = null;
    $("#tbBodyArchivos .is-invalid").removeClass("is-invalid");
    $("#tbBodyArchivos .seccion-carga").each(function(){
        var $seccion = $(this);
        var seccion  = $seccion.attr("data-nombre");
        var orden    = $seccion.attr("data-orden");
        $seccion.find(".fila-carga").each(function(index){
            var $tr             = $(this);
            var id              = $tr.attr("data-id");
            var v               = valoresFila($tr);
            var archivoEscrito  = $tr.data("dzEscrito").getAcceptedFiles()[0];
            var archivoFiscalia = $tr.data("dzFiscalia").getAcceptedFiles()[0];
            var sinArchivos     = !archivoEscrito && !archivoFiscalia;

            if(!id && filaVacia(v) && sinArchivos) return;                              // vacía
            if(id && JSON.stringify(v) === $tr.data("original") && sinArchivos) return;  // sin cambios

            var obligatorios = [ { selector: ".f-pet", valor: v.petitorio, nombre: "Petitorio" } ];
            if(!id) obligatorios.push({ selector: ".f-fecha", valor: v.fechaUno, nombre: "Fecha" });
            for(var campo of obligatorios){
                if(campo.valor === ""){
                    campoFaltante = { $el: $tr.find(campo.selector), mensaje: `El campo ${campo.nombre} es obligatorio en "${seccion}", fila ${index+1}.` };
                    return false; // detiene el recorrido
                }
            }

            var formData = new FormData();
            if(id) formData.append("id"     ,id);
            formData.append("numero"            ,$tr.attr("data-orden") || orden); // una fila guardada conserva su sección
            formData.append("codCaso"           ,$(`#codCaso`).val());
            formData.append("petitorio"         ,v.petitorio);
            formData.append("fechaUno"          ,v.fechaUno);
            formData.append("resolvio"          ,v.resolvio);
            formData.append("fechaDos"          ,v.fechaDos);
            formData.append("resumen"           ,v.resumen);
            if(archivoEscrito)  formData.append("escritos", archivoEscrito);
            if(archivoFiscalia) formData.append("fiscalia", archivoFiscalia);
            formData.append("metodoFormData"    ,id ? "updateDetailFilesCasos" : "insertDetailFilesCasos");
            envios.push({ $tr: $tr, formData: formData });
        });
        if(campoFaltante) return false;
    });

    if(campoFaltante){
        campoFaltante.$el.addClass("is-invalid").trigger("focus");
        swal({ type: "error", message: campoFaltante.mensaje });
        return false;
    }

    if(envios.length === 0){
        swal({ type: "info", message: "No hay filas nuevas ni cambios para grabar." });
        return false;
    }

    var promesas = envios.map(envio =>
        upFile(envio.formData)
        .then(response => {
            response = JSON.parse(response);
            if(response.status == 1){
                success++;
                envio.guardado = true;
            }else{
                failed++;
            }
        })
        .catch(error => {
            failed++;
            console.log(error)
        })
    );

    Promise.all(promesas)
        .then(() => {
            if($.fn.DataTable.isDataTable("#tbCasos")){ $("#tbCasos").DataTable().ajax.reload(null, false); }
            if(success == promesas.length){
                let response = {
                    message:"Se guardaron correctamente los datos.",
                    type:"success"
                }
                $("#modalArchivo").modal("hide");
                swal(response);
                return false;
            }

            // Guardado parcial: se retiran del formulario las filas nuevas ya
            // insertadas (evita duplicarlas al reintentar) y se marcan como
            // originales las actualizadas; quedan solo las que fallaron.
            envios.forEach(envio => {
                if(!envio.guardado) return;
                if(envio.$tr.attr("data-id")){
                    envio.$tr.data("original", JSON.stringify(valoresFila(envio.$tr)));
                    ["dzEscrito","dzFiscalia"].forEach(clave => envio.$tr.data(clave).removeAllFiles(true));
                }else{
                    quitarFila(envio.$tr);
                }
            });
            let response = {
                message:`Ocurrió un error al guardar ${failed} de ${promesas.length} filas. Las filas que quedan pendientes pueden grabarse nuevamente.`,
                type:"error"
            }
            swal(response);
        })
        .catch(() => {
            let response = {
                message:"Ocurrió un error al crear los datos.",
                type:"error"
            }
            swal(response);
        });
})

// Quita el resaltado de error en cuanto el usuario completa el campo
$(document).on("input change", 'input[id^="txtPet"], input[id^="txtFecha"]', function(){
    $(this).removeClass("is-invalid");
});

function upFile(formData){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type        : "POST",
            url         : `${$("#urlRequestFiles").val()}`,
            data        : formData,
            processData : false, // Necesario para enviar objetos FormData
            contentType : false, // Necesario para enviar objetos FormData
            beforeSend:()=>{
                loading();
            },success:(response)=>{
                hideLoading();
                resolve(response);
            },error:function(solicitud,textStatus,errServer){
                hideLoading();
                reject(`Error al subir archivos ${textStatus}. Detalle: ${errServer}`);
            }
        });
    });
}

// ============================================================
//  GESTIÓN Y VISUALIZACIÓN DE ARCHIVOS POR CASO
// ============================================================

// Devuelve la URL pública de un PDF dentro de la carpeta uploads
function urlPdf(fileName){
    return `${$("#urlRequestUploads").val()}${fileName}`;
}

// Escapa texto para insertarlo de forma segura en HTML
function escaparHtml(texto){
    if(texto === null || texto === undefined) return "";
    return String(texto)
        .replace(/&/g,"&amp;")
        .replace(/</g,"&lt;")
        .replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;")
        .replace(/'/g,"&#39;");
}

// Obtiene el nombre del tipo de registro (Expediente Judicial, etc.) según el orden
function nombreTipoRegistro(registro){
    if(!registro.nameFiles) return `Registro ${registro.orden || ""}`;
    var tipos = registro.nameFiles.split(",");
    var idx = (parseInt(registro.orden,10) || 1) - 1;
    var nombre = (tipos[idx] || `Registro ${registro.orden || ""}`).trim();
    // Con varias filas en la misma sección se numeran: "Expediente Judicial #2"
    return (registro.totalSeccion > 1) ? `${nombre} #${registro.nroFila}` : nombre;
}

// Numera las filas de cada sección en orden de creación (nroFila / totalSeccion)
function numerarRegistros(registros){
    var conteo = {};
    registros.forEach(reg=>{
        var orden = parseInt(reg.orden,10) || 1;
        conteo[orden] = (conteo[orden] || 0) + 1;
        reg.nroFila = conteo[orden];
    });
    registros.forEach(reg=>{ reg.totalSeccion = conteo[parseInt(reg.orden,10) || 1]; });
    return registros;
}

// Solicita al backend la lista de registros cargados de un caso
function obtenerRegistrosCaso(ide){
    return new Promise((resolve,reject)=>{
        $.ajax({
            type:"GET",
            url:`${$("#urlRequestFiles").val()}`,
            data:{ "params":ide, "method":"listarRegistrosCaso" },
            beforeSend:()=>{ loading(); },
            success:(response)=>{
                hideLoading();
                try {
                    response = JSON.parse(response);
                    if(Array.isArray(response.data)) numerarRegistros(response.data);
                    resolve(response);
                }
                catch(e){ reject(e); }
            },
            error:(xhr,status,error)=>{ hideLoading(); reject(error); }
        });
    });
}

// ---------- VISOR PDF INCRUSTADO ----------
function openPdfViewer(fileName, titulo){
    if(!fileName){
        swal({ type:"error", message:"Este registro no tiene el archivo disponible." });
        return false;
    }
    var url = urlPdf(fileName);
    $("#tituloVisorPdf").text(titulo || fileName);
    $("#iframeVisorPdf").attr("src", url);
    $("#btnAbrirPestana").attr("href", url);
    $("#modalVisorPdf").modal("show");
}

// Libera el PDF de memoria al cerrar el visor
$("#modalVisorPdf").on("hidden.bs.modal",()=>{
    $("#iframeVisorPdf").attr("src","");
});

// Soporte de modales apilados (visor sobre listado) - ajusta z-index
$(document).on("show.bs.modal", ".modal", function(){
    $(".tooltip").remove(); // limpiar tooltips que pudieran quedar visibles
    var zIndex = 1050 + (10 * $(".modal:visible").length);
    $(this).css("z-index", zIndex);
    setTimeout(()=>{
        $(".modal-backdrop").not(".modal-stack").css("z-index", zIndex - 1).addClass("modal-stack");
    }, 0);
});

// ---------- VISUALIZACIÓN DE PDFs ----------
function viewFiles(ide){
    obtenerRegistrosCaso(ide).then(response=>{
        if(response.status != 0){
            swal({ type:"error", message: response.message || "No se pudo cargar la información." });
            return false;
        }
        var registros = response.data || [];
        if(registros.length === 0){
            $("#bodyVisualizar").html(`<div class="alert alert-info mb-0">Este caso aún no tiene archivos cargados.</div>`);
            $("#modalVisualizar").modal("show");
            return false;
        }

        var html = "";
        registros.forEach(reg=>{
            var tipo = escaparHtml(nombreTipoRegistro(reg));
            html += `
                <div class="card card-bordered mb-5">
                    <div class="card-header min-h-50px d-flex align-items-center">
                        <h3 class="card-title fs-5 m-0">${tipo}</h3>
                    </div>
                    <div class="card-body">
                        <div class="row g-4">
                            ${tarjetaPdf("Escrito", reg.escritoFile, tipo + " - Escrito")}
                            ${tarjetaPdf("Fiscalía", reg.fiscaliaFile, tipo + " - Fiscalía")}
                        </div>
                    </div>
                </div>`;
        });
        $("#bodyVisualizar").html(html);
        $("#modalVisualizar").modal("show");
    }).catch(()=>{
        swal({ type:"error", message:"Ocurrió un error al cargar los archivos." });
    });
}

// Genera la tarjeta de un PDF para el modal de visualización
function tarjetaPdf(etiqueta, fileName, titulo){
    if(!fileName){
        return `
            <div class="col-md-6">
                <div class="d-flex align-items-center border border-dashed rounded p-4 h-100 text-muted">
                    <i class="ki-duotone ki-file fs-2x me-3"><span class="path1"></span><span class="path2"></span></i>
                    <div><span class="fw-bold">${etiqueta}</span><div class="fs-7">Sin archivo</div></div>
                </div>
            </div>`;
    }
    var url = urlPdf(fileName);
    return `
        <div class="col-md-6">
            <div class="d-flex flex-column border rounded p-4 h-100">
                <div class="d-flex align-items-center mb-3">
                    <i class="ki-duotone ki-file fs-2x text-danger me-3"><span class="path1"></span><span class="path2"></span></i>
                    <div class="text-truncate">
                        <span class="fw-bold d-block">${etiqueta}</span>
                        <span class="fs-7 text-muted text-truncate d-block" title="${escaparHtml(fileName)}">${escaparHtml(fileName)}</span>
                    </div>
                </div>
                <div class="d-flex gap-2 mt-auto">
                    <button type="button" class="btn btn-sm btn-light-primary flex-grow-1" onclick="openPdfViewer('${escaparHtml(fileName)}','${escaparHtml(titulo)}')">
                        <i class="ki-duotone ki-eye fs-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i> Ver
                    </button>
                    <a href="${url}" download class="btn btn-sm btn-light" title="Descargar">
                        <i class="ki-duotone ki-cloud-download fs-4"><span class="path1"></span><span class="path2"></span></i>
                    </a>
                </div>
            </div>
        </div>`;
}

// Elimina únicamente un archivo PDF (escrito o fiscalía) del registro,
// conservando el resto de la información del registro.
function deleteArchivoFile(id, tipo, etiqueta){
    Swal.fire({
        html: `¿Está seguro de eliminar el archivo de <strong>${escaparHtml(etiqueta)}</strong>?<br/><span class="fs-7 text-muted">Se conservará el resto de la información del registro.</span>`,
        icon: "question",
        showCancelButton: true,
        buttonsStyling: false,
        confirmButtonText: "Sí, eliminar",
        cancelButtonText: "Cancelar",
        customClass: {
            confirmButton: "btn fw-bold btn-danger",
            cancelButton: "btn fw-bold btn-active-light-primary"
        }
    }).then(result=>{
        if(!result.value) return false;
        $.ajax({
            type:"POST",
            url:`${$("#urlRequestFiles").val()}`,
            data:{ "params":id, "method":"eliminarArchivoFile", "tipo":tipo },
            beforeSend:()=>{ swalLoading(); },
            success:(response)=>{
                response = JSON.parse(response);
                if(response.status == 1){
                    swal({ type:"success", message: response.message || "Archivo eliminado con éxito." });
                    // Solo se actualiza la celda, para no perder filas sin guardar
                    $(`#tbBodyArchivos .fila-carga[data-id="${id}"] .archivo-actual[data-campo="${tipo}"]`).remove();
                    if($.fn.DataTable.isDataTable("#tbCasos")){ $("#tbCasos").DataTable().ajax.reload(null, false); }
                    return false;
                }
                swal({ type:"error", message: response.message || "No se pudo eliminar el archivo." });
            },
            error:(xhr,status,error)=>{
                swal({ type:"error", message:"Ocurrió un error al eliminar el archivo." });
            }
        });
    });
}

// ============================================================
//  HELPERS DE LA GRILLA DE CASOS
// ============================================================

// Genera un badge de color según la materia del caso
function badgeMateria(materia){
    if(!materia || materia.length <= 0){
        return `<span class="badge badge-light-danger">Sin materia</span>`;
    }
    var m = String(materia).toLowerCase();
    var colores = {
        "penal"                      : "danger",
        "civil"                      : "primary",
        "laboral"                    : "warning",
        "familia"                    : "info",
        "constitucional"             : "success",
        "contencioso_administrativo" : "dark",
        "administrativo"             : "primary",
        "casos_libres"               : "secondary"
    };
    var color = colores[m] || "secondary";
    var label = String(materia).replace(/_/g, " ");
    return `<span class="badge badge-light-${color} text-capitalize">${escaparHtml(label)}</span>`;
}

// Trunca un texto largo y agrega un enlace "ver más" para mostrarlo completo
function celdaTruncada(texto, max){
    texto = (texto === null || texto === undefined) ? "" : String(texto).trim();
    if(texto === ""){
        return `<span class="text-muted">—</span>`;
    }
    if(texto.length <= max){
        return escaparHtml(texto);
    }
    return `${escaparHtml(texto.substring(0, max))}… <a href="#" class="link-primary fw-semibold ver-mas" data-full="${escaparHtml(texto)}">ver más</a>`;
}

// Construye la fila hija (detalle expandible) de un caso
function formatChildCaso(d){
    var filas = [
        ["Expediente judicial", d.desc_ejudicial],
        ["Carpeta fiscal",      d.desc_cfiscal],
        ["Incidente",           d.desc_incidente],
        ["Medida cautelar",     d.desc_mcautelar]
    ];
    var body = filas.map(f=>`
        <tr>
            <td class="fw-bold text-gray-700 w-200px align-top">${f[0]}</td>
            <td class="text-gray-800">${celdaTruncada(f[1], 120)}</td>
        </tr>`).join("");
    return `
        <div class="p-4 bg-light-primary rounded m-2">
            <table class="table table-sm table-row-bordered align-middle mb-0">
                <tbody>${body}</tbody>
            </table>
        </div>`;
}

// Muestra el contenido completo de un texto truncado (delegado, registrado una sola vez)
$(document).off("click.vermas", ".ver-mas").on("click.vermas", ".ver-mas", function(e){
    e.preventDefault();
    Swal.fire({
        title: "Detalle",
        html: `<div style="text-align:left; white-space:pre-wrap; word-break:break-word; max-height:60vh; overflow:auto;">${escaparHtml($(this).attr("data-full"))}</div>`,
        buttonsStyling: false,
        confirmButtonText: "Cerrar",
        customClass: { confirmButton: "btn fw-bold btn-primary" }
    });
});

