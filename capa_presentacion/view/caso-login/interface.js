$("document").ready(function(){
    $("#txtUsuario").focus();
});

function msgLogin(texto, icon){
    if(window.Swal){
        Swal.fire({
            title: "Sistema Jurídico",
            html: texto,
            icon: icon || "error",
            buttonsStyling: false,
            confirmButtonText: "Entendido",
            customClass: { confirmButton: "btn btn-primary" }
        });
    }else{
        alert(texto);
    }
}

var procesandoLogin = false;

function finLogin(){
    procesandoLogin = false;
    $("#btnSign").prop("disabled", false);
}

function iniciarSesion(){
    // Evita doble envío mientras se procesa una petición en curso
    if(procesandoLogin) return false;

    var usuario = $("#txtUsuario").val().trim();
    var clave   = $("#txtPassword").val();

    if(usuario === "" || clave === ""){
        msgLogin("Ingrese su usuario y contraseña.", "warning");
        return false;
    }

    procesandoLogin = true;
    $("#btnSign").prop("disabled", true);

    // Popup de proceso (no cerrable) mientras se validan las credenciales
    Swal.fire({
        title: "Verificando credenciales",
        html: "Estamos validando tu acceso, un momento por favor…",
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => { Swal.showLoading(); }
    });

    $.ajax({
        type: "POST",
        url: "capa_negocio/auth-usuarios/logic.php",
        data: { method: "login", usuario: usuario, clave: clave },
        success: (response)=>{
            try { response = JSON.parse(response); }
            catch(e){ finLogin(); msgLogin("Error inesperado del servidor."); return; }
            if(response.status == 1){
                // Mantiene el popup mientras carga el panel
                Swal.update({ title: "¡Bienvenido!", html: response.message || "Ingresando…" });
                Swal.showLoading();
                window.location.href = "menu.php";
                return false;
            }
            finLogin();
            msgLogin(response.message || "Usuario o contraseña incorrectos.");
        },
        error: ()=>{ finLogin(); msgLogin("No se pudo conectar con el servidor."); }
    });
}

$("#btnSign").on("click", iniciarSesion);

// Permitir iniciar sesión con Enter
$("#txtUsuario, #txtPassword").on("keypress", function(e){
    if(e.which === 13){ iniciarSesion(); }
});

// Mostrar / ocultar contraseña (ojito)
$(document).on("click", ".toggle-clave", function(){
    var inp = document.getElementById($(this).data("target"));
    if(!inp) return;
    if(inp.type === "password"){
        inp.type = "text";
        $(this).html('<i class="ki-duotone ki-eye-slash fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span><span class="path4"></span></i>');
    }else{
        inp.type = "password";
        $(this).html('<i class="ki-duotone ki-eye fs-2"><span class="path1"></span><span class="path2"></span><span class="path3"></span></i>');
    }
});
