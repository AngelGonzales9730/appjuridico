<?php
    date_default_timezone_set("America/Lima");
    require("class.php");
    require("../../capa_datos/conexion.php");

    $id  = isset($_GET["id"]) ? intval($_GET["id"]) : 0;
    $obj = new UsuarioNegocio($pdo);
    $data = json_decode($obj->obtenerUsuario($id), true);

    if(!isset($data["data"][0]) || empty($data["data"][0])){
        die("Usuario no encontrado.");
    }
    $u = $data["data"][0];

    $nombreCompleto = trim($u["nombre"]." ".$u["apellido"]);
    $celular        = $u["celular"] !== null && $u["celular"] !== "" ? $u["celular"] : "—";
    $rol            = $u["nombre_rol"];
    $modulos        = array_filter(array_map('trim', explode(",", isset($u["modulos"]) ? $u["modulos"] : "")));

    $meses = [1=>'enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre'];
    $fechaTexto = date('d')." de ".$meses[(int)date('n')]." de ".date('Y');
    $fechaHora  = date('d/m/Y')." a las ".date('H:i:s');

    $safe = preg_replace('/[^A-Za-z0-9_]/', '_', $nombreCompleto);
    $filename = "Contrato_acceso_".$safe.".doc";

    header("Content-Type: application/msword; charset=utf-8");
    header("Content-Disposition: attachment; filename=\"$filename\"");
    header("Pragma: no-cache");
    header("Expires: 0");

    function e($t){ return htmlspecialchars($t, ENT_QUOTES, 'UTF-8'); }

    $filasModulos = "";
    if(count($modulos) > 0){
        $i = 1;
        foreach($modulos as $m){
            $filasModulos .= "<tr>
                <td style='border:1px solid #888; padding:6px; text-align:center; width:40px;'>{$i}</td>
                <td style='border:1px solid #888; padding:6px;'>".e($m)."</td>
            </tr>";
            $i++;
        }
    }else{
        $filasModulos = "<tr><td colspan='2' style='border:1px solid #888; padding:6px; text-align:center;'>Sin módulos asignados</td></tr>";
    }
?>
<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:w="urn:schemas-microsoft-com:office:word" xmlns="http://www.w3.org/TR/REC-html40">
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=utf-8"/>
    <title>Contrato de acceso</title>
</head>
<body style="font-family:'Calibri',Arial,sans-serif; font-size:12pt; color:#1a1a1a;">

    <div style="text-align:center; margin-bottom:24px;">
        <h2 style="margin:0;">AGENCIA DE SERVICIOS LEGALES DEL PERÚ</h2>
        <h3 style="margin:4px 0; color:#444;">Constancia de Acceso al Sistema</h3>
    </div>

    <p style="text-align:justify;">
        Por medio del presente documento se deja constancia que el/la usuario(a)
        <strong><?= e($nombreCompleto) ?></strong>, con número de celular
        <strong><?= e($celular) ?></strong>, ha sido registrado(a) en el sistema jurídico
        con el rol de <strong><?= e($rol) ?></strong>, otorgándosele acceso a los módulos
        que se detallan a continuación.
    </p>

    <h4 style="margin-bottom:6px;">Datos del usuario</h4>
    <table style="border-collapse:collapse; width:100%; margin-bottom:18px;">
        <tr>
            <td style="border:1px solid #888; padding:6px; width:180px; background:#f2f2f2;"><strong>Nombre completo</strong></td>
            <td style="border:1px solid #888; padding:6px;"><?= e($nombreCompleto) ?></td>
        </tr>
        <tr>
            <td style="border:1px solid #888; padding:6px; background:#f2f2f2;"><strong>Celular</strong></td>
            <td style="border:1px solid #888; padding:6px;"><?= e($celular) ?></td>
        </tr>
        <tr>
            <td style="border:1px solid #888; padding:6px; background:#f2f2f2;"><strong>Rol asignado</strong></td>
            <td style="border:1px solid #888; padding:6px;"><?= e($rol) ?></td>
        </tr>
    </table>

    <h4 style="margin-bottom:6px;">Módulos con acceso autorizado</h4>
    <table style="border-collapse:collapse; width:100%; margin-bottom:24px;">
        <tr>
            <td style="border:1px solid #888; padding:6px; background:#2b2b35; color:#fff; text-align:center; width:40px;"><strong>#</strong></td>
            <td style="border:1px solid #888; padding:6px; background:#2b2b35; color:#fff;"><strong>Módulo</strong></td>
        </tr>
        <?= $filasModulos ?>
    </table>

    <p style="text-align:justify;">
        El presente acceso se concede para el desempeño de las funciones propias del rol asignado.
        Cualquier modificación de los privilegios deberá ser gestionada por el área correspondiente.
    </p>

    <p style="margin-top:24px;">
        Documento generado el <strong><?= e($fechaTexto) ?></strong> (<?= e($fechaHora) ?>).
    </p>

    <div style="margin-top:60px; text-align:center;">
        _______________________________<br/>
        <strong>Administrador del Sistema</strong>
    </div>

</body>
</html>
