<?php
    if (!empty($_FILES)) {
        $uploadDir = 'uploads/'; // Asegúrate de que esta carpeta exista y sea escribible        
        //Validar extension
        $nombreFile = pathinfo($_FILES["file"]["name"]);
        $extension = strtolower($nombreFile["extension"]);
        if($extension != "pdf"){
            die(json_encode(
                [
                    "status"  => -1,
                    "message" => "El archivo cargado no tiene formato pdf"
                ]
            ));
        }
    }
?>