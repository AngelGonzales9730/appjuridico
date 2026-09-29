
var loadingEl = "";

// Con <base href> activo en menu.php, los enlaces "#" navegarían a la base.
// Este guard evita esa navegación no deseada conservando sus onclick.
$(document).on("click", 'a[href="#"]', function(e){
    e.preventDefault();
});

// Mostrar/ocultar contraseña (ojito). El botón debe tener data-target con el id del input.
$(document).on("click", ".toggle-clave", function(){
    var inp = document.getElementById($(this).data("target"));
    if(!inp) return;
    if(inp.type === "password"){
        inp.type = "text";
        $(this).html('<i class="ki-duotone ki-eye-slash fs-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>');
    }else{
        inp.type = "password";
        $(this).html('<i class="ki-duotone ki-eye fs-3"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>');
    }
});

function getScript(caso){
    $.getScript(`../${caso}/interface.js`);
}

function loading(){
    loadingEl = document.createElement("div");
    document.body.prepend(loadingEl);
    loadingEl.classList.add("page-loader");
    loadingEl.classList.add("flex-column");
    loadingEl.innerHTML = `
        <span class="spinner-border text-primary" role="status"></span>
        <span class="text-muted fs-6 fw-semibold mt-5">Cargando...</span>
    `;
    KTApp.showPageLoading();
}

function hideLoading(){
    KTApp.hidePageLoading();
    loadingEl.remove();
}

function modal(param,type){
    if(type == 1){
        $(`#${param}`).modal("show");
    }else if(type == 0){
        $(`#${param}`).modal("hide");
    }
}


//Group SWAL
function swal(params){
    Swal.fire({
        title:"Sistema Jurídico",
        html:`${params.message}`,
        icon:`${params.type}`,
        showConfirmButton:false,
        timerProgressBar:true,
        timer:4000
    });
}

function swalLoading(){
    Swal.fire({
        html: "Eliminando registro seleccionado...",
        backdrop: `rgba(172, 172, 173, 0.4)`,
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
    })
}

function setText(params){
    $("#txtTituloModulo").text(params.titulo);
    $("#txtPadre").text(params.padre);
    $("#txtHijo").text(params.hijo);
}