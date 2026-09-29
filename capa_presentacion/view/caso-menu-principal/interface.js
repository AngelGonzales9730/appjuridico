// Dashboard inicial (pantalla por defecto al ingresar, mientras no se elige un módulo)
function irAlDashboard(){
    $("#containerMenu").css("display", "block").show();
    $("#containerMenu").load("../dashboard/index.php", function(response, status){
        if(status === "success"){
            setText({ titulo: "Panel principal", padre: "Inicio", hijo: "Dashboard" });
            getScript("dashboard");
        }
    });
}
irAlDashboard();

// Al hacer clic en el logo del sistema, volver al dashboard
$(document).off("click.dashboard", ".ir-dashboard").on("click.dashboard", ".ir-dashboard", function(e){
    e.preventDefault();
    irAlDashboard();
});

// Carga genérica de vistas desde el menú dinámico (generado por rol desde la BD)
$(document).off("click.menu", ".menu-dinamico").on("click.menu", ".menu-dinamico", function(e){
    e.preventDefault();
    var vista     = $(this).data("vista");
    var script    = $(this).data("script");
    var modulo    = $(this).data("modulo");
    var submodulo = $(this).data("submodulo");

    $("#containerMenu").css("display", "block").show();
    $("#containerMenu").load(vista, function(response, status, xhr){
        if(status == "success"){
            setText({ titulo: modulo, padre: modulo, hijo: submodulo });
            getScript(script);
        }else{
            $("#containerMenu").html('<div class="alert alert-danger m-5">No se pudo cargar la vista solicitada.</div>');
        }
    });
});

// Cerrar sesión (botón del sidebar y opción del menú de perfil)
$(document).off("click.logout", ".cerrar-sesion").on("click.logout", ".cerrar-sesion", function(e){
    e.preventDefault();
    $.post("../../../capa_negocio/auth-usuarios/logic.php", { method: "logout" })
        .always(function(){
            window.location.href = "../../../index.php";
        });
});

// Cambio de contraseña obligatorio en el primer ingreso.
// Se usa la API nativa de Bootstrap 5 (no el bridge jQuery, que aún no está listo a esta altura).
function modalCambioClave(accion){
    var el = document.getElementById("modalCambioClave");
    if(el && window.bootstrap){
        bootstrap.Modal.getOrCreateInstance(el)[accion]();
    }
}

$(window).on("load", function(){
    if($("#cambioPendiente").val() === "1"){
        modalCambioClave("show");
    }
});

$(document).off("click.cambioclave", "#btnGuardarNuevaClave").on("click.cambioclave", "#btnGuardarNuevaClave", function(){
    var nueva = $("#txtNuevaClave").val();
    var conf  = $("#txtConfirmarClave").val();
    if(nueva.length < 4){
        swal({ type:"error", message:"La contraseña debe tener al menos 4 caracteres." });
        return false;
    }
    if(nueva !== conf){
        swal({ type:"error", message:"Las contraseñas no coinciden." });
        return false;
    }
    $.post("../../../capa_negocio/auth-usuarios/logic.php", { method:"cambiarClave", clave:nueva }, function(resp){
        try { resp = JSON.parse(resp); } catch(e){ swal({type:"error",message:"Error del servidor."}); return; }
        if(resp.status == 1){
            swal({ type:"success", message: resp.message });
            $("#cambioPendiente").val("0");
            modalCambioClave("hide");
        }else{
            swal({ type:"error", message: resp.message || "No se pudo cambiar la contraseña." });
        }
    });
});
