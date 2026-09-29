<div class="row">
    <div class="col-md-12 mt-5">
        <div class="table-responsive">
            <!--begin::Toolbar-->
            <div class="d-flex flex-stack mb-5">
                <div class="d-flex align-items-center position-relative my-1">
                    <i class="ki-duotone ki-magnifier fs-1 position-absolute ms-6"><span class="path1"></span><span class="path2"></span></i>
                    <input type="text" id="txtBuscarRol" class="form-control form-control-solid w-250px ps-15" placeholder="Buscar rol" autocomplete="off"/>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-primary" id="btnNuevoRol">
                        <i class="ki-duotone ki-plus fs-2"></i> Nuevo rol
                    </button>
                </div>
            </div>
            <!--end::Toolbar-->

            <table id="tbRoles" class="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                    <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                        <th class="w-40px"></th>
                        <th>#</th>
                        <th>Rol</th>
                        <th>Accesos</th>
                        <th class="text-center">Usuarios</th>
                        <th class="text-end min-w-100px">Acciones</th>
                    </tr>
                </thead>
                <tbody class="text-gray-600 fw-semibold"></tbody>
            </table>
        </div>
    </div>
</div>

<!--MODAL CREAR / EDITAR ROL-->
<div class="modal fade" tabindex="-1" id="modalRol">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="tituloModalRol">Nuevo rol</h5>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal">
                    <i class="ki-duotone ki-cross fs-2x"><span class="path1"></span><span class="path2"></span></i>
                </div>
            </div>
            <div class="modal-body">
                <form id="frmRol">
                    <input type="hidden" id="txtIdRol" name="txtIdRol"/>
                    <div class="fv-row mb-7">
                        <label class="required fw-semibold fs-6 mb-2">Nombre del rol</label>
                        <input type="text" class="form-control form-control-solid" placeholder="Ej. Administrador" id="txtNombreRol" name="txtNombreRol" autocomplete="off"/>
                    </div>
                    <div class="fv-row">
                        <div class="d-flex justify-content-between align-items-center mb-3">
                            <label class="required fw-semibold fs-6 m-0">Módulos y submódulos con acceso</label>
                            <label class="form-check form-check-custom form-check-solid form-check-sm">
                                <input class="form-check-input" type="checkbox" id="chkTodosGlobal"/>
                                <span class="form-check-label fw-bold ms-2">Seleccionar todo</span>
                            </label>
                        </div>
                        <div id="contenedorModulos"></div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnGuardarRol">Guardar</button>
            </div>
        </div>
    </div>
</div>

<!--MODAL REASIGNAR (al eliminar rol con usuarios)-->
<div class="modal fade" tabindex="-1" id="modalReasignar">
    <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title text-danger">Rol con usuarios asignados</h5>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal">
                    <i class="ki-duotone ki-cross fs-2x"><span class="path1"></span><span class="path2"></span></i>
                </div>
            </div>
            <div class="modal-body">
                <input type="hidden" id="txtRolEliminar"/>
                <div class="alert alert-warning" id="msgReasignar"></div>
                <label class="required fw-semibold fs-6 mb-2">Reasignar esos usuarios al rol:</label>
                <select class="form-select form-select-solid" id="cmbRolDestino"></select>
                <div class="fs-7 text-muted mt-2">Los usuarios se moverán al rol seleccionado y luego se eliminará el rol actual.</div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cancelar</button>
                <button type="button" class="btn btn-danger" id="btnReasignarEliminar">Reasignar y eliminar</button>
            </div>
        </div>
    </div>
</div>
