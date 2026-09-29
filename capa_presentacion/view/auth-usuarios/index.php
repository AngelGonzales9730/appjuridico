<div class="row">
    <div class="col-md-12 mt-5">
        <div class="table-responsive">
            <!--begin::Toolbar-->
            <div class="d-flex flex-stack mb-5">
                <div class="d-flex align-items-center position-relative my-1">
                    <i class="ki-duotone ki-magnifier fs-1 position-absolute ms-6"><span class="path1"></span><span class="path2"></span></i>
                    <input type="text" id="txtBuscarUsuario" class="form-control form-control-solid w-250px ps-15" placeholder="Buscar usuario" autocomplete="off"/>
                </div>
                <div class="d-flex justify-content-end">
                    <button type="button" class="btn btn-primary" id="btnNuevoUsuario">
                        <i class="ki-duotone ki-plus fs-2"></i> Nuevo usuario
                    </button>
                </div>
            </div>
            <!--end::Toolbar-->

            <table id="tbUsuarios" class="table align-middle table-row-dashed fs-6 gy-5">
                <thead>
                    <tr class="text-start text-gray-500 fw-bold fs-7 text-uppercase gs-0">
                        <th>#</th>
                        <th>Nombre completo</th>
                        <th>Celular</th>
                        <th>Rol</th>
                        <th class="text-end min-w-125px">Acciones</th>
                    </tr>
                </thead>
                <tbody class="text-gray-600 fw-semibold"></tbody>
            </table>
        </div>
    </div>
</div>

<!--MODAL CREAR / EDITAR USUARIO-->
<div class="modal fade" tabindex="-1" id="modalUsuario">
    <div class="modal-dialog modal-dialog-centered modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="tituloModalUsuario">Nuevo usuario</h5>
                <div class="btn btn-icon btn-sm btn-active-light-primary ms-2" data-bs-dismiss="modal">
                    <i class="ki-duotone ki-cross fs-2x"><span class="path1"></span><span class="path2"></span></i>
                </div>
            </div>
            <div class="modal-body">
                <form id="frmUsuario">
                    <input type="hidden" id="txtIdUsuario" name="txtIdUsuario"/>

                    <div class="d-flex flex-column align-items-center mb-6">
                        <div class="symbol symbol-100px symbol-circle mb-3">
                            <img id="fotoPreview" src="" alt="Foto" style="object-fit:cover; display:none;"/>
                            <span id="fotoIniciales" class="symbol-label fs-2 fw-bold text-primary bg-light-primary">US</span>
                        </div>
                        <label class="btn btn-sm btn-light-primary">
                            <i class="ki-duotone ki-picture fs-4"><span class="path1"></span><span class="path2"></span></i> Cargar foto (opcional)
                            <input type="file" id="txtFoto" accept="image/*" hidden/>
                        </label>
                    </div>

                    <div class="row g-4 mb-4">
                        <div class="col-md-6">
                            <label class="required fw-semibold fs-6 mb-2">Nombre</label>
                            <input type="text" class="form-control form-control-solid" id="txtNombre" name="txtNombre" autocomplete="off"/>
                        </div>
                        <div class="col-md-6">
                            <label class="required fw-semibold fs-6 mb-2">Apellido</label>
                            <input type="text" class="form-control form-control-solid" id="txtApellido" name="txtApellido" autocomplete="off"/>
                        </div>
                        <div class="col-md-6">
                            <label class="fw-semibold fs-6 mb-2">Celular</label>
                            <input type="text" class="form-control form-control-solid" id="txtCelular" name="txtCelular" autocomplete="off"/>
                        </div>
                        <div class="col-md-6">
                            <label class="required fw-semibold fs-6 mb-2">Rol</label>
                            <select class="form-select form-select-solid" id="cmbRol" name="cmbRol">
                                <option value="">Seleccione un rol...</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="required fw-semibold fs-6 mb-2">Usuario (para iniciar sesión)</label>
                            <input type="text" class="form-control form-control-solid" id="txtUsuario" name="txtUsuario" autocomplete="off"/>
                        </div>
                        <div class="col-md-6">
                            <label class="fw-semibold fs-6 mb-2">Contraseña temporal</label>
                            <div class="position-relative">
                                <input type="password" class="form-control form-control-solid pe-12" id="txtClave" name="txtClave" autocomplete="new-password"/>
                                <span class="toggle-clave position-absolute top-50 end-0 translate-middle-y me-3" data-target="txtClave" style="cursor:pointer;">
                                    <i class="ki-duotone ki-eye fs-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                                </span>
                            </div>
                            <div class="fs-8 text-muted mt-1" id="hintClave">El usuario deberá cambiarla en su primer ingreso.</div>
                        </div>
                    </div>
                    <div class="fv-row">
                        <label class="fw-semibold fs-6 mb-2">Módulos a los que podrá ingresar</label>
                        <div id="panelAccesos" class="border border-dashed rounded p-4 bg-light-primary">
                            <span class="text-muted">Seleccione un rol para ver sus accesos.</span>
                        </div>
                    </div>
                </form>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-light" data-bs-dismiss="modal">Cerrar</button>
                <button type="button" class="btn btn-primary" id="btnGuardarUsuario">Guardar</button>
            </div>
        </div>
    </div>
</div>
