<?php
    require("class.php");
    require("../../capa_datos/conexion.php");

    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $method = isset($_POST["method"]) ? $_POST["method"] : "";
    }else{
        $method = isset($_GET["method"]) ? $_GET["method"] : "";
    }

    $object = new DashboardNegocio($pdo);
    switch($method){
        case "getDashboard":
                        die($object->getDashboard());
                        break;
    }
?>
