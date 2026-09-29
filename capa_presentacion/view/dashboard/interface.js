function escaparHtml(texto){
    if(texto === null || texto === undefined) return "";
    return String(texto)
        .replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")
        .replace(/"/g,"&quot;").replace(/'/g,"&#39;");
}

// Color por materia (consistente con el resto del sistema)
function colorMateria(materia){
    var m = String(materia || "").toLowerCase();
    var colores = {
        "penal":"danger", "civil":"primary", "laboral":"warning", "familia":"info",
        "constitucional":"success", "contencioso_administrativo":"dark",
        "administrativo":"primary", "casos_libres":"secondary"
    };
    return colores[m] || "secondary";
}

KTUtil.onDOMContentLoaded(function(){
    cargarDashboard();
});

function cargarDashboard(){
    $.ajax({
        type:"GET",
        url:`${$("#urlRequestDashboard").val()}`,
        data:{ method:"getDashboard" },
        beforeSend:()=>{ loading(); },
        success:(response)=>{
            hideLoading();
            try { response = JSON.parse(response); } catch(e){ return; }
            if(response.status != 0){ return; }

            var t = response.totales || {};
            $("#dashTotalClientes").text(t.total_clientes || 0);
            $("#dashTotalCasos").text(t.total_casos || 0);
            $("#dashTotalUsuarios").text(t.total_usuarios || 0);

            pintarCasosMateria(response.casosMateria || []);
            pintarClientes(response.clientes || []);
        },
        error:()=>{ hideLoading(); }
    });
}

function pintarCasosMateria(data){
    if(data.length === 0){
        $("#dashCasosMateria").html(`<div class="text-muted">No hay casos registrados.</div>`);
        return;
    }
    var total = data.reduce((a,r)=> a + (parseInt(r.total,10)||0), 0);
    var html = "";
    data.forEach(r=>{
        var n   = parseInt(r.total,10) || 0;
        var pct = total > 0 ? Math.round((n*100)/total) : 0;
        var col = colorMateria(r.materia);
        var label = String(r.materia || "—").replace(/_/g," ");
        html += `
            <div class="mb-4">
                <div class="d-flex justify-content-between mb-1">
                    <span class="fw-semibold text-gray-800 text-capitalize">${escaparHtml(label)}</span>
                    <span class="fw-bold text-gray-900">${n} <span class="text-muted fw-normal fs-8">(${pct}%)</span></span>
                </div>
                <div class="progress h-8px bg-light">
                    <div class="progress-bar bg-${col}" role="progressbar" style="width:${pct}%;"></div>
                </div>
            </div>`;
    });
    $("#dashCasosMateria").html(html);
}

function pintarClientes(data){
    if(data.length === 0){
        $("#dashClientes").html(`<tr><td colspan="2" class="text-muted">No hay clientes registrados.</td></tr>`);
        return;
    }
    var html = "";
    data.forEach(c=>{
        html += `
            <tr>
                <td class="fw-semibold text-gray-800">${escaparHtml(c.cliente)}</td>
                <td class="text-end"><span class="badge badge-light-primary">${parseInt(c.casos,10)||0}</span></td>
            </tr>`;
    });
    $("#dashClientes").html(html);
}
