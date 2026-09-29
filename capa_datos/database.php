<?php
    //Metronic library path
    DEFINE("URL_METRONIC","capa_presentacion/library/assets");
    //Icons
    DEFINE("URL_ICONS","capa_presentacion/library/assets/media");
    //Images
    DEFINE("URL_IMAGES","capa_presentacion/images");
    //Path Final
    DEFINE("DOCUMENT_ROOT","{$_SERVER['DOCUMENT_ROOT']}/ApplicationJuridico");
    //URL
    DEFINE("URL_NEGOCIO","http://localhost:81/ApplicationJuridico/capa_negocio");
    //URL REQUEST caso_mantenimiento_casos
    DEFINE("URL_REQUEST_CASOS","../../../capa_negocio/caso-mantenimiento-casos/logic.php");
    //URL REQUEST caso-carga-archivos-casos
    DEFINE("URL_REQUEST_FILES","../../../capa_negocio/caso-carga-archivos-casos/logic.php");
    //URL pública a la carpeta de archivos PDF cargados
    DEFINE("URL_REQUEST_UPLOADS","../../../uploads/");
    //URL REQUEST auth-roles
    DEFINE("URL_REQUEST_ROLES","../../../capa_negocio/auth-roles/logic.php");
    //URL REQUEST auth-usuarios
    DEFINE("URL_REQUEST_USUARIOS","../../../capa_negocio/auth-usuarios/logic.php");
    //URL para generar el contrato Word del usuario
    DEFINE("URL_REQUEST_CONTRATO","../../../capa_negocio/auth-usuarios/contrato.php");
    //URL REQUEST dashboard
    DEFINE("URL_REQUEST_DASHBOARD","../../../capa_negocio/dashboard/logic.php");
?>