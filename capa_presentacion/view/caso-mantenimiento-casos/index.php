<div class="row">
    
    <div class="col-md-12">
        <button type="button" id="btnOpenModalCaso" class="btn btn-primary font-weight-bold hover-scale"><i class="fa-solid fa-plus"></i>  Casos en giro</button>
    </div>
    <div class="col-md-12 mt-5">
        <div class="table-responsive">




            <!--begin::Wrapper-->
            <div class="d-flex flex-stack mb-5">
                <!--begin::Search-->
                <div class="d-flex align-items-center position-relative my-1">
                    <i class="ki-duotone ki-magnifier fs-1 position-absolute ms-6"><span class="path1"></span><span class="path2"></span></i>
                    <input type="text" data-kt-docs-table-filter="search" id="txtBuscarCaso" class="form-control form-control-solid w-250px ps-15" placeholder="Buscar caso"/>
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



<!--MODAL INSERTAR CASOS-->
<div class="modal fade" tabindex="-1" id="modalCaso">
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
        <div class="modal-content ">
            <div class="modal-header">
                <h5 class="modal-title">Mantenimiento de casos</h5>

                <!--begin::Close-->
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal" aria-label="Close">
                    <i class="ki-duotone ki-cross fs-2x"><span class="path1"></span><span class="path2"></span></i>
                </div>
                <!--end::Close-->
            </div>

            <div class="modal-body">
                
                    <div class="row">
                        <div class="col-md-12">
                            <form id="frmCasos">
                                <div class="fv-row mb-5">
                                    <label class="form-label fw-semibold required">Patrocinado</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-profile-circle fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="Nombre del patrocinado" aria-label="Patrocinado" id="txtPatrocinado" name="txtPatrocinado"/>
                                    </div>
                                </div>
                                <div class="fv-row mb-5">
                                    <label class="form-label fw-semibold required">Materia</label>
                                    <div class="input-group flex-nowrap">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-notepad-bookmark fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span><span class="path5"></span><span class="path6"></span></i>
                                        </span>
                                        <div class="overflow-hidden flex-grow-1">
                                            <select class="form-select rounded-start-0" id="cmbMateria" name="cmbMateria" data-placeholder="Selecciona una materia">
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
                                </div>
                                <div class="fv-row mb-5" id="divEJudicial" hidden>
                                    <label class="form-label fw-semibold">Expediente Judicial</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-book-open fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="N.° de expediente judicial" aria-label="EJudicial" id="txtExpJudicial" name="txtExpJudicial"/>
                                    </div>
                                </div>
                                <div class="fv-row mb-5" id="divCFiscal" hidden>
                                    <label class="form-label fw-semibold">Carpeta Fiscal</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-briefcase fs-1"><span class="path1"></span><span class="path2"></span></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="N.° de carpeta fiscal" aria-label="CFiscal" id="txtCarpetaFiscal" name="txtCarpetaFiscal"/>
                                    </div>
                                </div>
                                <div class="fv-row mb-5" id="divIncidente" hidden>
                                    <label class="form-label fw-semibold">Incidente</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-message-edit fs-1"><span class="path1"></span><span class="path2"></span></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="Detalle del incidente" aria-label="incidente" id="txtIncidente" name="txtIncidente"/>
                                    </div>
                                </div>
                                <div class="fv-row mb-5" id="divMCautelar" hidden>
                                    <label class="form-label fw-semibold">Medida Cautelar</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-book-square fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="Detalle de la medida cautelar" aria-label="mcautelar" id="txtMCautelar" name="txtMCautelar"/>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                
            </div>

            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnSaveCase">Guardar</button>
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
                                <div class="fv-row mb-5">
                                    <label class="form-label fw-semibold required">Patrocinado</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-profile-circle fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="Nombre del patrocinado" aria-label="Patrocinado" id="txtPatrocinadoUpdate" name="txtPatrocinadoUpdate"/>
                                    </div>
                                </div>
                                <div class="fv-row mb-5">
                                    <label class="form-label fw-semibold required">Materia</label>
                                    <div class="input-group flex-nowrap">
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
                                </div>
                                <div class="fv-row mb-5" id="divEJudicialUpdate" hidden>
                                    <label class="form-label fw-semibold">Expediente Judicial</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-book-open fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="N.° de expediente judicial" aria-label="EJudicialUpdate" id="txtExpJudicialUpdate" name="txtExpJudicialUpdate"/>
                                    </div>
                                </div>
                                <div class="fv-row mb-5" id="divCFiscalUpdate" hidden>
                                    <label class="form-label fw-semibold">Carpeta Fiscal</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-briefcase fs-1"><span class="path1"></span><span class="path2"></span></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="N.° de carpeta fiscal" aria-label="CFiscalUpdate" id="txtCarpetaFiscalUpdate" name="txtCarpetaFiscalUpdate"/>
                                    </div>
                                </div>
                                <div class="fv-row mb-5" id="divIncidenteUpdate" hidden>
                                    <label class="form-label fw-semibold">Incidente</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-message-edit fs-1"><span class="path1"></span><span class="path2"></span></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="Detalle del incidente" aria-label="incidenteupdate" id="txtIncidenteUpdate" name="txtIncidenteUpdate"/>
                                    </div>
                                </div>
                                <div class="fv-row mb-5" id="divMCautelarUpdate" hidden>
                                    <label class="form-label fw-semibold">Medida Cautelar</label>
                                    <div class="input-group">
                                        <span class="input-group-text">
                                            <i class="ki-duotone ki-book-square fs-1"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                        </span>
                                        <input type="text" class="form-control" placeholder="Detalle de la medida cautelar" aria-label="mcautelarupdate" id="txtMCautelarUpdate" name="txtMCautelarUpdate"/>
                                    </div>
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