
var div_caso_uno  = ["divEJudicial","divCFiscal","divIncidente"];
var div_caso_dos  = ["divEJudicial","divMCautelar"];
var div_caso_tres = ["divEJudicial"];
var div_total     = ["divEJudicial","divCFiscal","divIncidente","divMCautelar"];

var div_caso_uno_upd  = ["divEJudicialUpdate","divCFiscalUpdate","divIncidenteUpdate"];
var div_caso_dos_upd  = ["divEJudicialUpdate","divMCautelarUpdate"];
var div_caso_tres_upd = ["divEJudicialUpdate"];
var div_total_upd     = ["divEJudicialUpdate","divCFiscalUpdate","divIncidenteUpdate","divMCautelarUpdate"];

var filesArray = [];

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
                        var esp  = parseInt(row.archivos_esperados, 10) || 0;
                        var arch = parseInt(row.tiene_archivos, 10) || 0;

                        if(reg === 0){
                            return `<span class="badge badge-light-secondary">Pendiente</span>`;
                        }
                        // Progreso X/Y con barra animada
                        if(esp > 0){
                            var pct   = Math.min(100, Math.round((carg * 100) / esp));
                            var color = (carg >= esp) ? "success" : (carg > 0 ? "primary" : "warning");
                            return `
                                <div class="d-flex flex-column align-items-center">
                                    <span class="fw-bold fs-7 text-${color} mb-1">${carg}/${esp}</span>
                                    <div class="progress h-6px w-90px">
                                        <div class="progress-bar bg-${color}" role="progressbar" data-width="${pct}" style="width:0%; transition:width .9s ease;"></div>
                                    </div>
                                </div>`;
                        }
                        // Sin "esperados" definidos para la materia: estado simple
                        if(arch > 0) return `<span class="badge badge-light-success">Cargados</span>`;
                        return `<span class="badge badge-light-warning">Sin archivos</span>`;
                    }
                },
                {
                    data: null,
                    orderable: false,
                    className: 'text-end',
                    render: function (data) {
                        var id = data.id_caso;
                        var yaRegistrado = parseInt(data.total_registros, 10) > 0;
                        // Si el caso ya tiene registros de carga, "Cargar archivos" se deshabilita: se gestionan por "Editar"
                        var btnCargar = yaRegistrado
                            ? `<button type="button" class="btn btn-icon btn-sm btn-light-primary" disabled data-bs-toggle="tooltip" title="Este caso ya fue registrado. Use 'Editar archivos' para gestionar sus archivos.">
                                    <i class="ki-duotone ki-file-up fs-4"><span class="path1"></span><span class="path2"></span></i>
                               </button>`
                            : `<button type="button" class="btn btn-icon btn-sm btn-light-primary" data-bs-toggle="tooltip" title="Cargar archivos" onclick="loadFile(${id})">
                                    <i class="ki-duotone ki-file-up fs-4"><span class="path1"></span><span class="path2"></span></i>
                               </button>`;
                        return `
                            <div class="d-flex justify-content-end gap-1">
                                ${btnCargar}
                                <button type="button" class="btn btn-icon btn-sm btn-light-warning" data-bs-toggle="tooltip" title="Editar archivos" onclick="editFiles(${id})">
                                    <i class="ki-duotone ki-pencil fs-4"><span class="path1"></span><span class="path2"></span></i>
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

function loadFile(ide){
    $.ajax({
        type:"GET",
        url:`${$("#urlRequestFiles").val()}`,
        data:{
            "params":ide,
            "method":"getDataCaso"
        },
        beforeSend:()=>{
            loading();
        },success:(response)=>{
            hideLoading();
            response = JSON.parse(response);
            if(response.status == 0){
                // Limpiar dropzones de aperturas anteriores para evitar desalineación de filesArray
                filesArray.forEach(dz => {
                    try { dz.destroy(); } catch(e) {}
                });
                filesArray = [];
                $("#tbBodyArchivos").html("");

                var cantDivFiles = response.data[0].name_files.split(",");
                var divHtml  = "";
                var contador = 1;
                $("#codCaso").val(response.data[0].id_caso);
                cantDivFiles.forEach(element => {
                    divHtml += 
                    `
                        <div class='row m-0 p-0'>
                            <div class='col-md-12'>
                                <h2>${element}</h2>
                            </div>
                            <div class='col-md-12'>
                                <div class='table-responsive'>
                                    <form name="formFiles${contador}" id="formFiles${contador}">
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
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td><input type="text" class="form-control form-control-sm" name="txtPet${contador}" id="txtPet${contador}" autocomplete="off" /></td>
                                                    <td><input type="date" class="form-control form-control-sm" name="txtFecha${contador}" id="txtFecha${contador}" autocomplete="off" /></td>
                                                    <td>
                                                        <div class="form-check form-check-success form-check-solid form-check-sm">
                                                            <input type="checkbox" class="form-check-input" style="cursor:pointer;" name="txtCheck${contador}" id="txtCheck${contador}" />
                                                            <label class="form-check-label" for="txtCheck${contador}" style="cursor:pointer;">
                                                                Resolvió
                                                            </label>
                                                        </div>
                                                    </td>
                                                    <td><input type="date" class="form-control form-control-sm" name="txtFechaD${contador}" id="txtFechaD${contador}" autocomplete="off" /></td>
                                                    <td>
                                                        <textarea class="form-control form-control-sm" name="txtResumen${contador}" id="txtResumen${contador}" rows="4" cols="50"></textarea>
                                                    </td>
                                                    <td>
                                                        <form class="form" action="#" method="post">
                                                            <div class="fv-row">
                                                                <div class="dropzone" id="fileEscrito${contador}">
                                                                    <div class="dz-message needsclick">
                                                                        <i class="ki-duotone ki-file-up fs-2x text-primary"><span class="path1"></span><span class="path2"></span></i>
                                                                        <div class="ms-4">
                                                                            <h6 class="fs-7 fw-bold text-gray-900 mb-1">Cargar o arrastrar archivos</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </td>
                                                    <td>
                                                        <form class="form" action="#" method="post">
                                                            <div class="fv-row">
                                                                <div class="dropzone" id="txtFileFiscalia${contador}">
                                                                    <div class="dz-message needsclick">
                                                                        <i class="ki-duotone ki-file-up fs-2x text-primary"><span class="path1"></span><span class="path2"></span></i>
                                                                        <div class="ms-4">
                                                                            <h6 class="fs-7 fw-bold text-gray-900 mb-1">Cargar o arrastrar archivos</h6>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </form>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </form>
                                </div>
                            </div>
                        </div>
                        <script>
                            var myDropzoneFileEscritorio${contador} = new Dropzone("#fileEscrito${contador}", {
                                url         : "../caso-carga-archivos-casos/validate.php",
                                method      : "post",
                                paramName   : "file", 
                                maxFiles    : 1,
                                maxFilesize : 100, // MB
                                addRemoveLinks: true,
                                acceptedFiles: ".pdf",
                                dictDefaultMessage: "Eliminar archivos cargados",
                                dictRemoveFile: "Eliminar",
                                dictCancelUpload: "Cancelar",
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

                            var myDropzoneFileFiscalia${contador} = new Dropzone("#txtFileFiscalia${contador}", {
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

                            filesArray.push(myDropzoneFileEscritorio${contador})
                            filesArray.push(myDropzoneFileFiscalia${contador})
                        </script>
                        <hr>
                    `;
                    contador++;
                });
                $("#tbBodyArchivos").html(divHtml);
                return false;
            }
            response.type = "error";
            swal(response);
        }
    });
    $("#modalArchivo").modal("show");
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

$("#btnSaveFile").on("click",()=>{
    var formsFiles  = $('form[name^="formFiles"]');
    var contar      = 0;
    var auxiliar    = 0;
    let success     = 0, failed = 0;
    var promesas    = [];

    // Pre-validación: todos los formularios deben tener ambos archivos cargados
    var faltanArchivos = false;
    formsFiles.each(function(index){
        var archivoEscrito  = filesArray[index * 2].getAcceptedFiles()[0];
        var archivoFiscalia = filesArray[index * 2 + 1].getAcceptedFiles()[0];
        if(!archivoEscrito || !archivoFiscalia){
            faltanArchivos = true;
            return false; // detiene el recorrido
        }
    });

    if(faltanArchivos){
        swal({
            type    : "error",
            message : "Debe cargar el archivo de Escritos y el de Fiscalía en cada registro antes de grabar."
        });
        return false;
    }

    formsFiles.each(function(index){
        var formData = new FormData();
        formData.append("numero"            ,(auxiliar+1));
        formData.append("codCaso"           ,$(`#codCaso`).val());
        formData.append("petitorio"         ,$(`#txtPet${index+1}`).val());
        formData.append("fechaUno"          ,$(`#txtFecha${index+1}`).val());
        formData.append("resolvio"          ,$(`#txtCheck${index+1}`).is(":checked"));
        formData.append("fechaDos"          ,$(`#txtFechaD${index+1}`).val());
        formData.append("resumen"           ,$(`#txtResumen${index+1}`).val());
        formData.append("escritos"          ,filesArray[contar].getAcceptedFiles()[0]);
        contar   += 1;
        formData.append("fiscalia"          ,filesArray[contar].getAcceptedFiles()[0]);
        formData.append("metodoFormData"    ,"insertDetailFilesCasos");

        promesas.push(
            upFile(formData)
            .then(response => {
                response = JSON.parse(response);
                if(response.status == 1){
                    success++;
                }else{
                    failed++;
                }
            })
            .catch(error => {
                failed++;
                console.log(error)
            })
        );
        
        auxiliar += 1;
        contar   += 1;
    });

    Promise.all(promesas)
        .then(() => {
            if(success == promesas.length){
                let response = {
                    message:"Se guardaron correctamente los datos.",
                    type:"success"
                }
                $("#modalArchivo").modal("hide");
                swal(response);
                $("#formFiles").html("");
                if($.fn.DataTable.isDataTable("#tbCasos")){ $("#tbCasos").DataTable().ajax.reload(null, false); }
                return false;
            }

            let response = {
                message:"Ocurrió un error al crear los datos.",
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
    return (tipos[idx] || `Registro ${registro.orden || ""}`).trim();
}

// Valida que un archivo seleccionado sea PDF
function esPdf(file){
    return file && (file.type === "application/pdf" || /\.pdf$/i.test(file.name));
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
                try { resolve(JSON.parse(response)); }
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

// ---------- EDICIÓN / GESTIÓN ----------
function editFiles(ide){
    $("#codCasoEdit").val(ide);
    renderEditar(ide);
}

function renderEditar(ide){
    obtenerRegistrosCaso(ide).then(response=>{
        if(response.status != 0){
            swal({ type:"error", message: response.message || "No se pudo cargar la información." });
            return false;
        }
        var registros = response.data || [];
        if(registros.length === 0){
            $("#bodyEditar").html(`<div class="alert alert-info mb-0">Este caso aún no tiene archivos cargados. Use la opción "Cargar archivos".</div>`);
            $("#modalEditar").modal("show");
            return false;
        }

        var html = "";
        registros.forEach(reg=>{
            var tipo = escaparHtml(nombreTipoRegistro(reg));
            var checked = (parseInt(reg.resuelve,10) === 1) ? "checked" : "";
            html += `
                <div class="card card-bordered mb-5" id="cardReg${reg.id}">
                    <div class="card-header min-h-50px d-flex align-items-center">
                        <h3 class="card-title fs-5 m-0">${tipo}</h3>
                    </div>
                    <div class="card-body">
                        <form id="frmEdit${reg.id}">
                            <div class="row g-4 mb-4">
                                <div class="col-md-4">
                                    <label class="form-label required">Petitorio</label>
                                    <input type="text" class="form-control form-control-sm" id="editPet${reg.id}" value="${escaparHtml(reg.petitorio)}" autocomplete="off"/>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Fecha</label>
                                    <input type="date" class="form-control form-control-sm" id="editFecha${reg.id}" value="${escaparHtml(reg.fechaUno)}"/>
                                </div>
                                <div class="col-md-2">
                                    <label class="form-label d-block">Resolvió</label>
                                    <div class="form-check form-check-success form-check-solid mt-2">
                                        <input type="checkbox" class="form-check-input" id="editCheck${reg.id}" ${checked} style="cursor:pointer;"/>
                                    </div>
                                </div>
                                <div class="col-md-3">
                                    <label class="form-label">Fecha (resolvió)</label>
                                    <input type="date" class="form-control form-control-sm" id="editFechaD${reg.id}" value="${escaparHtml(reg.fechaDos)}"/>
                                </div>
                                <div class="col-md-12">
                                    <label class="form-label">Resumen</label>
                                    <textarea class="form-control form-control-sm" id="editResumen${reg.id}" rows="3">${escaparHtml(reg.resumen)}</textarea>
                                </div>
                            </div>
                            <div class="row g-4">
                                ${bloqueArchivoEdit(reg.id, "Escrito", "escrito", reg.escritoFile, tipo + " - Escrito")}
                                ${bloqueArchivoEdit(reg.id, "Fiscalía", "fiscalia", reg.fiscaliaFile, tipo + " - Fiscalía")}
                            </div>
                            <div class="text-end mt-4">
                                <button type="button" class="btn btn-sm btn-warning" onclick="saveUpdateFile(${reg.id}, ${reg.orden})">
                                    <i class="ki-duotone ki-check fs-4"></i> Guardar cambios
                                </button>
                            </div>
                        </form>
                    </div>
                </div>`;
        });
        $("#bodyEditar").html(html);
        $("#modalEditar").modal("show");
    }).catch(()=>{
        swal({ type:"error", message:"Ocurrió un error al cargar los archivos." });
    });
}

// Bloque para ver/reemplazar/eliminar un PDF dentro del formulario de edición
function bloqueArchivoEdit(id, etiqueta, campo, fileName, titulo){
    var actual = fileName
        ? `<div class="d-flex flex-wrap gap-2">
                <button type="button" class="btn btn-sm btn-light-primary" onclick="openPdfViewer('${escaparHtml(fileName)}','${escaparHtml(titulo)}')">
                    <i class="ki-duotone ki-eye fs-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i> Ver actual
                </button>
                <button type="button" class="btn btn-sm btn-light-danger" onclick="deleteArchivoFile(${id},'${campo}','${escaparHtml(etiqueta)}')">
                    <i class="ki-duotone ki-trash fs-4"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span></i> Eliminar archivo
                </button>
           </div>`
        : `<span class="badge badge-light-warning">Sin archivo</span>`;
    return `
        <div class="col-md-6">
            <div class="border rounded p-4 h-100">
                <label class="fw-bold d-block mb-2">${etiqueta}</label>
                <div class="mb-3">${actual}</div>
                <label class="form-label fs-7 text-muted">${fileName ? "Reemplazar archivo" : "Cargar archivo"} (PDF, opcional)</label>
                <input type="file" accept="application/pdf,.pdf" class="form-control form-control-sm" id="editFile_${campo}_${id}"/>
            </div>
        </div>`;
}

// Guarda los cambios de un registro (datos y/o archivos reemplazados)
function saveUpdateFile(id, orden){
    var petitorio = $(`#editPet${id}`).val().trim();
    if(petitorio === ""){
        swal({ type:"error", message:"El petitorio es obligatorio." });
        return false;
    }

    var fileEscrito  = $(`#editFile_escrito_${id}`)[0].files[0];
    var fileFiscalia = $(`#editFile_fiscalia_${id}`)[0].files[0];

    if(fileEscrito && !esPdf(fileEscrito)){
        swal({ type:"error", message:"El archivo de Escrito debe ser un PDF." });
        return false;
    }
    if(fileFiscalia && !esPdf(fileFiscalia)){
        swal({ type:"error", message:"El archivo de Fiscalía debe ser un PDF." });
        return false;
    }

    var formData = new FormData();
    formData.append("id"             , id);
    formData.append("numero"         , orden);
    formData.append("codCaso"        , $("#codCasoEdit").val());
    formData.append("petitorio"      , petitorio);
    formData.append("fechaUno"       , $(`#editFecha${id}`).val());
    formData.append("resolvio"       , $(`#editCheck${id}`).is(":checked"));
    formData.append("fechaDos"       , $(`#editFechaD${id}`).val());
    formData.append("resumen"        , $(`#editResumen${id}`).val());
    formData.append("metodoFormData" , "updateDetailFilesCasos");

    if(fileEscrito)  formData.append("escritos", fileEscrito);
    if(fileFiscalia) formData.append("fiscalia", fileFiscalia);

    upFile(formData)
        .then(response=>{
            response = JSON.parse(response);
            if(response.status == 1){
                swal({ type:"success", message: response.message || "Registro actualizado correctamente." });
                renderEditar($("#codCasoEdit").val());
                if($.fn.DataTable.isDataTable("#tbCasos")){ $("#tbCasos").DataTable().ajax.reload(null, false); }
                return false;
            }
            swal({ type:"error", message: response.message || "No se pudo actualizar el registro." });
        })
        .catch(()=>{
            swal({ type:"error", message:"Ocurrió un error al actualizar el registro." });
        });
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
                    renderEditar($("#codCasoEdit").val());
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

