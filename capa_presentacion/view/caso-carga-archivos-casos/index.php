<div class="row">
    <div class="col-md-12 mt-5">
        <div class="table-responsive">
            <!--begin::Wrapper-->
            <div class="d-flex flex-stack mb-5">
                <!--begin::Search-->
                <div class="d-flex align-items-center position-relative my-1">
                    <i class="ki-duotone ki-magnifier fs-1 position-absolute ms-6"><span class="path1"></span><span class="path2"></span></i>
                    <input type="text" data-kt-docs-table-filter="search" id="txtBuscarCaso" class="form-control form-control-solid w-250px ps-15" placeholder="Buscar caso" autocomplete="off"/>
                </div>
                <!--end::Search-->

                <!--begin::Toolbar-->
                <div class="d-flex justify-content-end"  data-kt-docs-table-toolbar="base" >
                    <button type="button" class="btn btn-light-primary me-3" style="display:none"  data-bs-toggle="tooltip" title="Coming Soon">
                        <i class="ki-duotone ki-filter fs-2"><span class="path1"></span><span class="path2"></span></i>
                        Filter
                    </button>
                </div>
                <!--end::Toolbar-->

                <!--begin::Group actions-->
                <div class="d-flex justify-content-end align-items-center d-none" data-kt-docs-table-toolbar="selected">
                    <div class="fw-bold me-5">
                        <span class="me-2" data-kt-docs-table-select="selected_count"></span> Selected
                    </div>

                    <button type="button" class="btn btn-danger" data-bs-toggle="tooltip" title="Coming Soon">
                        Selection Action
                    </button>
                </div>
                <!--end::Group actions-->
            </div>
            <!--end::Wrapper-->

            <!--begin::Datatable-->
            <table id="tbCasos" class="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                    <th>#</th>
                    <th>Código</th>
                    <th>Patrocinado</th>
                    <th>Materia</th>
                    <th class="text-center">Archivos</th>
                    <th class="text-end min-w-100px">Acciones</th>
                </tr>
                </thead>
                <tbody class="text-gray-600 fw-semibold">
                </tbody>
            </table>
            <!--end::Datatable-->
        </div>
    </div>  
</div>



<!--ANIMACIÓN DE FILA AGREGADA EN EL MODAL DE CARGA-->
<style>
    @keyframes filaSale {
        to { opacity: 0; transform: translateY(-4px); }
    }
    /* Entrada: la misma animación de salida, en reversa */
    #tbBodyArchivos tr.fila-nueva-anim {
        animation: filaSale .22s ease-in reverse both;
    }
    #tbBodyArchivos tr.fila-sale-anim {
        animation: filaSale .22s ease-in forwards;
        pointer-events: none;
    }
    @media (prefers-reduced-motion: reduce) {
        #tbBodyArchivos tr.fila-nueva-anim,
        #tbBodyArchivos tr.fila-sale-anim { animation: none; }
    }
</style>

<!--MODAL INSERTAR FILES CASOS-->
<div class="modal fade" tabindex="-1" id="modalArchivo">
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
        <div class="modal-content ">
            <div class="modal-header">
                <h5 class="modal-title">Gestión de archivos del caso</h5>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <i class="ki-duotone ki-cross fs-2x"><span class="path1"></span><span class="path2"></span></i>
                </div>
            </div>
            <input type="hidden" name="codCaso" id="codCaso"/>
            <div class="modal-body" id="tbBodyArchivos">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnSaveFile">Grabar</button>
            </div>
        </div>
    </div>
</div>

<!--MODAL VISUALIZAR ARCHIVOS PDF-->
<div class="modal fade" tabindex="-1" id="modalVisualizar">
    <div class="modal-dialog modal-dialog-scrollable modal-xl">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title">
                    <i class="ki-duotone ki-folder fs-2 me-2"><span class="path1"></span><span class="path2"></span></i>
                    Archivos cargados del caso
                </h5>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <i class="ki-duotone ki-cross fs-2x"><span class="path1"></span><span class="path2"></span></i>
                </div>
            </div>
            <div class="modal-body" id="bodyVisualizar">
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
            </div>
        </div>
    </div>
</div>

<!--MODAL VISOR PDF-->
<div class="modal fade" tabindex="-1" id="modalVisorPdf">
    <div class="modal-dialog modal-dialog-scrollable modal-fullscreen">
        <div class="modal-content">
            <div class="modal-header py-3">
                <h5 class="modal-title text-truncate" id="tituloVisorPdf">Visor de PDF</h5>
                <div class="d-flex align-items-center gap-2">
                    <a href="#" target="_blank" id="btnAbrirPestana" class="btn btn-sm btn-light-primary">
                        <i class="ki-duotone ki-exit-right-corner fs-3"><span class="path1"></span><span class="path2"></span></i>
                        Abrir en pestaña
                    </a>
                    <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                        <i class="ki-duotone ki-cross fs-2x"><span class="path1"></span><span class="path2"></span></i>
                    </div>
                </div>
            </div>
            <div class="modal-body p-0">
                <iframe id="iframeVisorPdf" src="" style="width:100%; height:100%; min-height:80vh; border:0;"></iframe>
            </div>
        </div>
    </div>
</div>

<!--MODAL ACTUALIZAR CASOS-->
<div class="modal fade" tabindex="-1" id="modalCasoUpdate">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content ">
            <div class="modal-header">
                <h5 class="modal-title">Edición de casos</h5>

                <!--begin::Close-->
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <i class="ki-duotone ki-cross fs-2x"><span class="path1"></span><span class="path2"></span></i>
                </div>
                <!--end::Close-->
            </div>

            <div class="modal-body">
                
                    <div class="row">
                        <div class="col-md-12">
                            <form id="frmCasosUpdate">
                                <div class="input-group mb-5">
                                    <span class="input-group-text" id="basic-addon1">
                                        <i class="ki-duotone ki-profile-circle fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                    </span>
                                    <input type="text" class="form-control" placeholder="Patrocinado" aria-label="Patrocinado" aria-describedby="basic-txtPatrocinadoUpdate" id="txtPatrocinadoUpdate" name="txtPatrocinadoUpdate"/>
                                </div>
                                <div class="input-group flex-nowrap mb-5">
                                    <span class="input-group-text">
                                        <i class="ki-duotone ki-notepad-bookmark fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i>
                                    </span>
                                    <div class="overflow-hidden flex-grow-1">
                                        <select class="form-select rounded-start-0" id="cmbMateriaUpdate" name="cmbMateriaUpdate" data-placeholder="Selecciona una materia">
                                            <option selected value="0">Seleccione materia</option>
                                            <option value="Penal">Penal</option>
                                            <option value="Civil">Civil</option>
                                            <option value="Laboral">Laboral</option>
                                            <option value="Familia">Familia</option>
                                            <option value="Constitucional">Constitucional</option>
                                            <option value="Contencioso_administrativo">Constencioso administrativo</option>
                                            <option value="Administrativo">Administrativo</option>
                                            <option value="Casos_libres">Casos libres</option>
                                        </select>
                                    </div>
                                </div>
                                <div class="input-group mb-5" id="divEJudicialUpdate" hidden>
                                    <span class="input-group-text" id="basic-addon1">
                                    <i class="ki-duotone ki-book-open fs-1">
                                        <span class="path1"></span>
                                        <span class="path2"></span>
                                        <span class="path3"></span>
                                        <span class="path4"></span>
                                    </i>
                                    </span>
                                    <input type="text" class="form-control" placeholder="Expediente Judicial" aria-label="EJudicialUpdate" aria-describedby="basic-ejudicialupdate" id="txtExpJudicialUpdate" name="txtExpJudicialUpdate"/>
                                </div>
                                <div class="input-group mb-5" id="divCFiscalUpdate" hidden>
                                    <span class="input-group-text" id="basic-addon1">
                                        <i class="ki-duotone ki-briefcase fs-1">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                    </span>
                                    <input type="text" class="form-control" placeholder="Carpeta Fiscal" aria-label="CFiscalUpdate" aria-describedby="basic-cfiscalupdate" id="txtCarpetaFiscalUpdate" name="txtCarpetaFiscalUpdate"/>
                                </div>
                                <div class="input-group mb-5" id="divIncidenteUpdate" hidden>
                                    <span class="input-group-text" id="basic-addon1">
                                        <i class="ki-duotone ki-message-edit fs-1">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                        </i>
                                    </span>
                                    <input type="text" class="form-control" placeholder="Incidente" aria-label="incidenteupdate" aria-describedby="basic-incidenteupdate" id="txtIncidenteUpdate" name="txtIncidenteUpdate"/>
                                </div>
                                <div class="input-group mb-5" id="divMCautelarUpdate" hidden>
                                    <span class="input-group-text" id="basic-addon1">
                                        <i class="ki-duotone ki-book-square fs-1">
                                            <span class="path1"></span>
                                            <span class="path2"></span>
                                            <span class="path3"></span>
                                        </i>
                                    </span>
                                    <input type="text" class="form-control" placeholder="Medida Cautelar" aria-label="mcautelarupdate" aria-describedby="basic-mcautelarupdate" id="txtMCautelarUpdate" name="txtMCautelarUpdate"/>
                                </div>
                                <input type="hidden" name="txtIdCasoHidden" id="txtIdCasoHidden">
                            </form>
                        </div>
                    </div>
                
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-warning" id="btnSaveUpdateCase">Guardar</button>
            </div>
        </div>
    </div>
</div>

