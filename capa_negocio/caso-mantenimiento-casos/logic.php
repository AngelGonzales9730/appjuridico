<?php
    session_start();
    require("class.php");
    require("../../capa_datos/conexion.php");
    
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        $params = isset($_POST["params"]) ? $_POST["params"] : "";
        $method = isset($_POST["method"]) ? $_POST["method"] : "";
    }else{
        $params = isset($_GET["params"]) ? $_GET["params"] : "";
        $method = isset($_GET["method"]) ? $_GET["method"] : "";
    }
    
    $object = new CasoMantenimiento($pdo);
    switch($method){
        case "loadCase":
                        $object->loadCase();
                        die($object);
                        ;break;
        case "insertCase":
                        parse_str($params,$resultArray);
                        validDataInsert($resultArray);
                        $resultArray["usuarioCrea"] = isset($_SESSION["usuario"]) && $_SESSION["usuario"] !== "" ? $_SESSION["usuario"] : "SISTEMA";
                        $object->insertCase($resultArray);
                        die($object);
                        break;
        case "dropCase":
                        $object->dropCase($params);
                        die($object);
                        break;
        case "getDataCaso":
                        $object->getDataCaso($params);
                        die($object);
                        break;
        case "updateCaso":
                        parse_str($params,$resultArray);
                        $newArray = [];
                        foreach ($resultArray as $key => $value) {
                            $newName = preg_replace('/Update$/','',$key);
                            $newArray[$newName] = $value;
                        }
                        validDataInsert($newArray);
                        $newArrayF = validSendDataUpdate($newArray);
                        $object->updateCase($newArrayF);
                        die($object);
                        ;break;
    }

    function validDataInsert($params){
        if(strlen($params["txtPatrocinado"]) <= 0){
            die(json_encode(["status"=>-1,"message"=>"El patrocinado es obligatorio"]));
        }
        if(($params["cmbMateria"] == -1 ? "Y":"N") == "Y"){
            die(json_encode(["status"=>-1,"message"=>"La materia es obligatoria."]));
        }
        if($params["cmbMateria"] == "Penal"){
            $arreglo = [
                "expJudicial"=>$params["txtExpJudicial"],
                "carpfiscal"=>$params["txtCarpetaFiscal"],
                "incidente"=>$params["txtIncidente"]];
            
            validEmpty($arreglo);
        }
        if($params["cmbMateria"] == "Civil" || $params["cmbMateria"] == "Laboral" || $params["cmbMateria"] == "Familia"
        || $params["cmbMateria"] == "Constitucional" || $params["cmbMateria"] == "Contencioso_administrativo"){
            $arreglo = [
                "expJudicial"=>$params["txtExpJudicial"],
                "medcautelar"=>$params["txtMCautelar"],
            ];
            validEmpty($arreglo);
        }
        if($params["cmbMateria"] == "Administrativo" || $params["cmbMateria"] == "Casos_libres"){
            $arreglo = [
                "expJudicial"=>$params["txtExpJudicial"],
            ];
            validEmpty($arreglo);
        }
    }

    function validEmpty($param){
        foreach ($param as $key => $value) {
            if(strlen($value) <= 0){
                $texto = "";
                switch($key){
                    case "expJudicial"  : $texto = "Expediente judicial es obligatorio";break;
                    case "carpfiscal"   : $texto = "Carpeta Fiscal es obligatorio";break;
                    case "incidente"    : $texto = "Incidente es obligatorio";break;
                    case "medcautelar"  : $texto = "Medida cautelar es obligatorio";break;
                }
                die(json_encode(["status"=>-1,"message"=>"{$texto}"]));
            }
        }
    }

    function validSendDataUpdate($params){
        if($params["cmbMateria"] == "Penal"){
            $arreglo = [
                "txtExpJudicial"        =>  $params["txtExpJudicial"],
                "txtCarpetaFiscal"      =>  $params["txtCarpetaFiscal"],
                "txtIncidente"          =>  $params["txtIncidente"],
                "txtMCautelar"          =>  "",
            ];
        }
        if($params["cmbMateria"] == "Civil" || $params["cmbMateria"] == "Laboral" || $params["cmbMateria"] == "Familia"
        || $params["cmbMateria"] == "Constitucional" || $params["cmbMateria"] == "Contencioso_administrativo"){
            $arreglo = [
                "txtExpJudicial"        =>  $params["txtExpJudicial"],
                "txtMCautelar"          =>  $params["txtMCautelar"],
                "txtCarpetaFiscal"      =>  "",
                "txtIncidente"          =>  "",
            ];
        }
        if($params["cmbMateria"] == "Administrativo" || $params["cmbMateria"] == "Casos_libres"){
            $arreglo = [
                "txtExpJudicial"    =>  $params["txtExpJudicial"],
                "txtMCautelar"      =>  "",
                "txtCarpetaFiscal"  =>  "",
                "txtIncidente"      =>  "",
            ];
        }
        $arreglo["txtIdCasoHidden"] = $params["txtIdCasoHidden"];
        $arreglo["txtPatrocinado"]  = $params["txtPatrocinado"];
        $arreglo["cmbMateria"]      = $params["cmbMateria"];
        return $arreglo;
    }
?>