
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

// Class definition
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
                url: "../caso-mantenimiento-casos/datatables.php",
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
                    data: null,
                    orderable: false,
                    className: 'text-end',
                    render: function (data) {
                        var id  = data.id_caso;
                        var cod = (data.cod_caso || "").replace(/'/g, "\\'");
                        return `
                            <div class="d-flex justify-content-end gap-1">
                                <button type="button" class="btn btn-icon btn-sm btn-light-warning" data-bs-toggle="tooltip" title="Editar caso" onclick="editarCaso(${id})">
                                    <i class="ki-duotone ki-pencil fs-4"><span class="path1"></span><span class="path2"></span></i>
                                </button>
                                <button type="button" class="btn btn-icon btn-sm btn-light-danger" data-bs-toggle="tooltip" title="Eliminar caso" onclick="dropCaso(${id}, '${cod}')">
                                    <i class="ki-duotone ki-trash fs-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i>
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
            KTMenu.createInstances();
            if(window.bootstrap && bootstrap.Tooltip){
                document.querySelectorAll('#tbCasos [data-bs-toggle="tooltip"]').forEach(el=>{
                    bootstrap.Tooltip.getOrCreateInstance(el);
                });
            }
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

    // Reset Filter
    // var handleResetForm = () => {
    //     // Select reset button
    //     const resetButton = document.querySelector('[data-kt-docs-table-filter="reset"]');

    //     // Reset datatable
    //     resetButton.addEventListener('click', function () {
    //         // Reset payment type
    //         filterPayment[0].checked = true;

    //         // Reset datatable --- official docs reference: https://datatables.net/reference/api/search()
    //         dt.search('').draw();
    //     });
    // }

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

function editarCaso(ide){
    $.ajax({
        type:"GET",
        url:`${$("#urlRequestCasos").val()}`,
        data:{
            "params":ide,
            "method":"getDataCaso"
        },
        beforeSend:()=>{
            loading();
        },success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            console.log(response);
            if(response.status == 0){
                $("#txtPatrocinadoUpdate").val(response.data[0].desc_patrocinado);
                $('#cmbMateriaUpdate').val(response.data[0].desc_materia).trigger('change');
                removeDivDynamic(response.data[0].desc_materia);
                setDataDynamic(response.data[0].desc_materia,response.data[0]);
                $("#txtIdCasoHidden").val(ide);
                return false;
            }
            response.type = "error";
            swal(response);
        }
    });
    $("#modalCasoUpdate").modal("show");
}

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

// Elimina (lógicamente) un caso
function dropCaso(id, cod){
    Swal.fire({
        html: `¿Está seguro de eliminar el caso <strong>${escaparHtml(cod)}</strong>?`,
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
        if(!result.value) return false;
        $.ajax({
            type:"POST",
            data:{ "params":id, "method":"dropCase" },
            url:"../../../capa_negocio/caso-mantenimiento-casos/logic.php",
            beforeSend:()=>{ swalLoading(); },
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
                swal({ type:"error", message:"Ocurrió un error al eliminar el caso." });
            }
        });
    });
}

// ============================================================
//  HELPERS DE LA GRILLA DE CASOS
// ============================================================

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