<?php
    require("class.php");
    require("../../capa_datos/conexion.php");
    
    if($_SERVER["REQUEST_METHOD"] == "POST"){
        if(isset($_POST['metodoFormData'])){
            $params = [
                "id"        => isset($_POST['id'])         ? $_POST['id']        : "",
                "numero"    => isset($_POST['numero'])     ? $_POST['numero']    : "",
                "codcaso"   => isset($_POST['codCaso'])    ? $_POST['codCaso']    : "",
                "petitorio" => isset($_POST['petitorio'])  ? $_POST['petitorio']  : "",
                "fechaUno"  => isset($_POST['fechaUno'])   ? $_POST['fechaUno']   : "",
                "resolvio"  => isset($_POST['resolvio'])   ? $_POST['resolvio']   : "", 
                "fechaDos"  => isset($_POST['fechaDos'])   ? $_POST['fechaDos']   : "",
                "resumen"  => isset($_POST['resumen'])    ? $_POST['resumen']    : "",
                "escritos"  => isset($_FILES['escritos'])  ? $_FILES['escritos']  : "",
                "fiscalia"  => isset($_FILES['fiscalia'])  ? $_FILES['fiscalia']  : ""
            ];
            $method = isset($_POST["metodoFormData"]) ? $_POST["metodoFormData"] : "";
        }else{
            $params = isset($_POST["params"]) ? $_POST["params"] : "";
            $method = isset($_POST["method"]) ? $_POST["method"] : "";
        }
    }else{
        $params = isset($_GET["params"]) ? $_GET["params"] : "";
        $method = isset($_GET["method"]) ? $_GET["method"] : "";
    }
    
    $object = new CasoFile($pdo);
    switch($method){
        case "getDataCaso":
                            $object->getDataCaso($params);
                            die($object);
                            break;
        case "insertDetailFilesCasos":
                            // Validar que ambos archivos hayan sido cargados correctamente
                            if(!esArchivoValido($params['escritos']) || !esArchivoValido($params['fiscalia'])){
                                die(json_encode([
                                    "status"  => 0,
                                    "type"    => "error",
                                    "message" => "Debe cargar el archivo de Escritos y el de Fiscalía antes de grabar."
                                ]));
                            }

                            // Directorio de carga
                            $upload_dir  = '../../uploads/';
                            if(!is_dir($upload_dir)){
                                mkdir($upload_dir, 0777, true);
                            }


                            $tmp_name    = $params['escritos']['tmp_name'];
                            $newFileName = generarNombreArchivo($params['escritos']['name'],("escrito".$params["numero"]));

                            $upload_file = $upload_dir .$params["codcaso"]. "_" .$newFileName;
                            $validar = 0;
                            if (move_uploaded_file($tmp_name, $upload_file)) {
                                $params["escritoFileName"] = $params["codcaso"]. "_" .$newFileName;
                                $validar++;
                            }


                            $tmp_name    = $params['fiscalia']['tmp_name'];
                            $newFileName = generarNombreArchivo($params['fiscalia']['name'],("fiscalia".$params["numero"]));

                            $upload_file = $upload_dir .$params["codcaso"]. "_" .$newFileName;
                            if (move_uploaded_file($tmp_name, $upload_file)) {
                                $params["fiscaliaFileName"] = $params["codcaso"]. "_" .$newFileName;
                                $validar++;
                            }

                            if($validar == 2){
                                $object->insertCasoFile($params);
                                die($object);
                            }

                            die(json_encode([
                                "status"  => 0,
                                "type"    => "error",
                                "message" => "No se pudieron guardar los archivos. Intente nuevamente."
                            ]));
                            break;
        case "listarRegistrosCaso":
                            die($object->listarRegistrosCaso($params));
                            break;
        case "eliminarRegistroFile":
                            die($object->eliminarRegistroFile($params));
                            break;
        case "eliminarArchivoFile":
                            $tipo      = isset($_POST["tipo"]) ? $_POST["tipo"] : "";
                            $respuesta = $object->eliminarArchivoFile($params, $tipo);

                            // Borrar el archivo físico que quedó desvinculado
                            $data = json_decode($respuesta, true);
                            if(isset($data["data"]["archivoAnterior"]) && !empty($data["data"]["archivoAnterior"])){
                                $rutaAnterior = '../../uploads/' . trim($data["data"]["archivoAnterior"]);
                                if(is_file($rutaAnterior)){
                                    @unlink($rutaAnterior);
                                }
                            }

                            die($respuesta);
                            break;
        case "updateDetailFilesCasos":
                            // Directorio de carga
                            $upload_dir  = '../../uploads/';
                            if(!is_dir($upload_dir)){
                                mkdir($upload_dir, 0777, true);
                            }

                            // Los archivos son opcionales en la edición: solo se procesan si
                            // el usuario cargó uno nuevo para reemplazar el existente.
                            $params["escritoFileName"]  = "";
                            $params["fiscaliaFileName"] = "";

                            if(esArchivoValido($params['escritos'])){
                                $newFileName = generarNombreArchivo($params['escritos']['name'],("escrito".$params["numero"]));
                                $upload_file = $upload_dir .$params["codcaso"]. "_" .$newFileName;
                                if (move_uploaded_file($params['escritos']['tmp_name'], $upload_file)) {
                                    $params["escritoFileName"] = $params["codcaso"]. "_" .$newFileName;
                                }
                            }

                            if(esArchivoValido($params['fiscalia'])){
                                $newFileName = generarNombreArchivo($params['fiscalia']['name'],("fiscalia".$params["numero"]));
                                $upload_file = $upload_dir .$params["codcaso"]. "_" .$newFileName;
                                if (move_uploaded_file($params['fiscalia']['tmp_name'], $upload_file)) {
                                    $params["fiscaliaFileName"] = $params["codcaso"]. "_" .$newFileName;
                                }
                            }

                            $respuesta = $object->actualizarCasoFile($params);

                            // Si se reemplazaron archivos, borrar del disco los anteriores
                            $data = json_decode($respuesta, true);
                            if(isset($data["data"]) && is_array($data["data"])){
                                foreach (["escritoAnterior","fiscaliaAnterior"] as $campo) {
                                    if(!empty($data["data"][$campo])){
                                        $rutaAnterior = $upload_dir . trim($data["data"][$campo]);
                                        if(is_file($rutaAnterior)){
                                            @unlink($rutaAnterior);
                                        }
                                    }
                                }
                            }

                            die($respuesta);
                            break;
    }

    // Verifica que el valor sea un archivo subido válido (array de $_FILES sin errores)
    function esArchivoValido($file) {
        return is_array($file)
            && isset($file['tmp_name'], $file['error'])
            && $file['error'] === UPLOAD_ERR_OK
            && is_uploaded_file($file['tmp_name']);
    }

    // Función para generar un nombre de archivo único
    function generarNombreArchivo($originalName,$type) {
        $timestamp = date('Ymd_His');
        $uniqueId = uniqid();
        $extension = pathinfo($originalName, PATHINFO_EXTENSION);
        return $type. "_" .$timestamp . '_' . $uniqueId . '.' . $extension;
    }
?>