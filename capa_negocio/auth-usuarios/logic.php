<?php
    session_start();
    require("class.php");
    require("../../capa_datos/conexion.php");

    // El guardado de usuario llega como FormData (puede incluir foto)
    if(isset($_POST['metodoFormData'])){
        $method = $_POST['metodoFormData'];
        $params = "";
    }else if($_SERVER["REQUEST_METHOD"] == "POST"){
        $params = isset($_POST["params"]) ? $_POST["params"] : "";
        $method = isset($_POST["method"]) ? $_POST["method"] : "";
    }else{
        $params = isset($_GET["params"]) ? $_GET["params"] : "";
        $method = isset($_GET["method"]) ? $_GET["method"] : "";
    }

    $object = new UsuarioNegocio($pdo);

    switch($method){
        case "listarUsuarios":
                        die($object->listarUsuarios());
                        break;
        case "listarRoles":
                        die($object->listarRoles());
                        break;
        case "menuRol":
                        $rows = $object->menuPorRol($params);
                        die(json_encode(["status"=>0, "data"=>$rows]));
                        break;
        case "obtenerUsuario":
                        die($object->obtenerUsuario($params));
                        break;
        case "eliminarUsuario":
                        die($object->eliminarUsuario($params));
                        break;
        case "guardarUsuario":
                        $id        = isset($_POST['txtIdUsuario']) ? intval($_POST['txtIdUsuario']) : 0;
                        $nombre    = isset($_POST['txtNombre'])    ? trim($_POST['txtNombre'])    : "";
                        $apellido  = isset($_POST['txtApellido'])  ? trim($_POST['txtApellido'])  : "";
                        $celular   = isset($_POST['txtCelular'])   ? trim($_POST['txtCelular'])   : "";
                        $usuario   = isset($_POST['txtUsuario'])   ? trim($_POST['txtUsuario'])   : "";
                        $clavePlano= isset($_POST['txtClave'])     ? $_POST['txtClave']           : "";
                        $idRol     = isset($_POST['cmbRol'])       ? intval($_POST['cmbRol'])     : 0;

                        if($nombre === "")   die(json_encode(["status"=>-1,"message"=>"El nombre es obligatorio."]));
                        if($apellido === "") die(json_encode(["status"=>-1,"message"=>"El apellido es obligatorio."]));
                        if($usuario === "")  die(json_encode(["status"=>-1,"message"=>"El usuario es obligatorio."]));
                        if($idRol <= 0)      die(json_encode(["status"=>-1,"message"=>"Debe seleccionar un rol."]));
                        if($id === 0 && $clavePlano === "") die(json_encode(["status"=>-1,"message"=>"La contraseña es obligatoria."]));

                        $claveHash    = $clavePlano !== "" ? password_hash($clavePlano, PASSWORD_DEFAULT) : "";
                        $claveVisible = $clavePlano;

                        // Foto opcional
                        $fotoName = "";
                        if(isset($_FILES['foto']) && $_FILES['foto']['error'] === UPLOAD_ERR_OK && is_uploaded_file($_FILES['foto']['tmp_name'])){
                            $dir = '../../uploads/fotos/';
                            if(!is_dir($dir)){ mkdir($dir, 0777, true); }
                            $ext = strtolower(pathinfo($_FILES['foto']['name'], PATHINFO_EXTENSION));
                            $permitidas = ['jpg','jpeg','png','webp','gif'];
                            if(in_array($ext, $permitidas)){
                                $fotoName = "user_".uniqid().".".$ext;
                                if(!move_uploaded_file($_FILES['foto']['tmp_name'], $dir.$fotoName)){
                                    $fotoName = "";
                                }
                            }else{
                                die(json_encode(["status"=>-1,"message"=>"La foto debe ser una imagen (jpg, png, webp o gif)."]));
                            }
                        }

                        die($object->guardarUsuario($id, $nombre, $apellido, $celular, $usuario, $claveHash, $claveVisible, $fotoName, $idRol));
                        break;
        case "login":
                        $usuario = isset($_POST["usuario"]) ? trim($_POST["usuario"]) : "";
                        $clave   = isset($_POST["clave"])   ? $_POST["clave"]         : "";
                        if($usuario === "" || $clave === ""){
                            die(json_encode(["status"=>0,"message"=>"Ingrese usuario y contraseña."]));
                        }
                        $resp = json_decode($object->obtenerPorCredencial($usuario), true);
                        if(empty($resp["data"])){
                            die(json_encode(["status"=>0,"message"=>"Usuario o contraseña incorrectos."]));
                        }
                        $u = $resp["data"][0];
                        if(!$u["clave"] || !password_verify($clave, $u["clave"])){
                            die(json_encode(["status"=>0,"message"=>"Usuario o contraseña incorrectos."]));
                        }
                        $_SESSION["id_usuario"]      = $u["id_usuario"];
                        $_SESSION["usuario"]         = $u["usuario"];
                        $_SESSION["nombre"]          = $u["nombre"];
                        $_SESSION["apellido"]        = $u["apellido"];
                        $_SESSION["foto"]            = $u["foto"];
                        $_SESSION["id_rol"]          = $u["id_rol"];
                        $_SESSION["nombre_rol"]      = $u["nombre_rol"];
                        $_SESSION["cambio_pendiente"] = intval($u["cambio_pendiente"]);
                        die(json_encode(["status"=>1,"message"=>"Bienvenido(a) ".$u["nombre"]]));
                        break;
        case "cambiarClave":
                        if(!isset($_SESSION["id_usuario"])){
                            die(json_encode(["status"=>0,"message"=>"Sesión no válida. Vuelva a iniciar sesión."]));
                        }
                        $nueva = isset($_POST["clave"]) ? $_POST["clave"] : "";
                        if(strlen($nueva) < 4){
                            die(json_encode(["status"=>0,"message"=>"La contraseña debe tener al menos 4 caracteres."]));
                        }
                        $hash = password_hash($nueva, PASSWORD_DEFAULT);
                        $resp = $object->cambiarClave($_SESSION["id_usuario"], $hash, $nueva);
                        $_SESSION["cambio_pendiente"] = 0;
                        die($resp);
                        break;
        case "logout":
                        session_destroy();
                        die(json_encode(["status"=>1]));
                        break;
    }
?>
