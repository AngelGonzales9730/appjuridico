<div class="row g-5 g-xl-8 mt-1">
    <!--Clientes-->
    <div class="col-md-4">
        <div class="card card-flush h-100 shadow-sm">
            <div class="card-body d-flex align-items-center">
                <div class="symbol symbol-60px symbol-circle me-4">
                    <span class="symbol-label bg-light-primary">
                        <i class="ki-duotone ki-profile-user fs-2x text-primary"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>
                    </span>
                </div>
                <div>
                    <div class="fs-1 fw-bolder text-gray-900" id="dashTotalClientes">0</div>
                    <div class="fs-6 fw-semibold text-muted">Clientes</div>
                </div>
            </div>
        </div>
    </div>
    <!--Casos-->
    <div class="col-md-4">
        <div class="card card-flush h-100 shadow-sm">
            <div class="card-body d-flex align-items-center">
                <div class="symbol symbol-60px symbol-circle me-4">
                    <span class="symbol-label bg-light-info">
                        <i class="ki-duotone ki-address-book fs-2x text-info"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                    </span>
                </div>
                <div>
                    <div class="fs-1 fw-bolder text-gray-900" id="dashTotalCasos">0</div>
                    <div class="fs-6 fw-semibold text-muted">Casos registrados</div>
                </div>
            </div>
        </div>
    </div>
    <!--Usuarios-->
    <div class="col-md-4">
        <div class="card card-flush h-100 shadow-sm">
            <div class="card-body d-flex align-items-center">
                <div class="symbol symbol-60px symbol-circle me-4">
                    <span class="symbol-label bg-light-success">
                        <i class="ki-duotone ki-user-tick fs-2x text-success"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>
                    </span>
                </div>
                <div>
                    <div class="fs-1 fw-bolder text-gray-900" id="dashTotalUsuarios">0</div>
                    <div class="fs-6 fw-semibold text-muted">Usuarios</div>
                </div>
            </div>
        </div>
    </div>
</div>

<div class="row g-5 mt-1">
    <!--Casos por tipo-->
    <div class="col-md-6">
        <div class="card card-flush h-100 shadow-sm">
            <div class="card-header">
                <h3 class="card-title fw-bold text-gray-900">Casos por tipo</h3>
            </div>
            <div class="card-body pt-2" id="dashCasosMateria">
                <div class="text-muted">Cargando…</div>
            </div>
        </div>
    </div>
    <!--Clientes-->
    <div class="col-md-6">
        <div class="card card-flush h-100 shadow-sm">
            <div class="card-header">
                <h3 class="card-title fw-bold text-gray-900">Clientes y sus casos</h3>
            </div>
            <div class="card-body pt-2">
                <div class="table-responsive" style="max-height:420px; overflow:auto;">
                    <table class="table table-row-dashed align-middle gy-3">
                        <thead>
                            <tr class="fw-bold text-gray-500 fs-7 text-uppercase">
                                <th>Cliente</th>
                                <th class="text-end">Casos</th>
                            </tr>
                        </thead>
                        <tbody id="dashClientes">
                            <tr><td colspan="2" class="text-muted">Cargando…</td></tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    </div>
</div>
