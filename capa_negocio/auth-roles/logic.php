<?php
    require("class.php");
    require("../../capa_datos/conexion.php");

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $params = isset($_POST["params"]) ? $_POST["params"] : "";
        $method = isset($_POST["method"]) ? $_POST["method"] : "";
    }else{
        $params = isset($_GET["params"]) ? $_GET["params"] : "";
        $method = isset($_GET["method"]) ? $_GET["method"] : "";
    }

    $object = new RolNegocio($pdo);
    switch($method){
        case "listarRoles":
                        die($object->listarRoles());
                        break;
        case "arbolModulos":
                        die($object->arbolModulos());
                        break;
        case "submodulosDeRol":
                        die($object->submodulosDeRol($params));
                        break;
        case "guardarRol":
                        parse_str($params, $d);
                        $idRol = isset($d["txtIdRol"])     ? intval($d["txtIdRol"]) : 0;
                        $nombre = isset($d["txtNombreRol"]) ? trim($d["txtNombreRol"]) : "";
                        $subs  = isset($d["submodulos"])   ? $d["submodulos"] : [];

                        if($nombre === ""){
                            die(json_encode(["status"=>-1,"message"=>"El nombre del rol es obligatorio."]));
                        }
                        if(!is_array($subs) || count($subs) === 0){
                            die(json_encode(["status"=>-1,"message"=>"Debe seleccionar al menos un submódulo."]));
                        }
                        $csv = implode(",", array_map('intval', $subs));
                        die($object->guardarRol($idRol, $nombre, $csv));
                        break;
        case "verificarEliminarRol":
                        die($object->verificarEliminarRol($params));
                        break;
        case "eliminarRol":
                        die($object->eliminarRol($params));
                        break;
        case "reasignarEliminarRol":
                        parse_str($params, $d);
                        $idRol   = isset($d["idRol"])     ? intval($d["idRol"])     : 0;
                        $destino = isset($d["idDestino"]) ? intval($d["idDestino"]) : 0;
                        if($destino <= 0){
                            die(json_encode(["status"=>-1,"message"=>"Debe seleccionar un rol destino."]));
                        }
                        die($object->reasignarYEliminar($idRol, $destino));
                        break;
    }
?>
