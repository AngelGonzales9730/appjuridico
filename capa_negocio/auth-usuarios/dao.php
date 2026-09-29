<?php
    class DaoUsuario{
        private $pdo;

        public function __construct($pdo){
            $this->pdo = $pdo;
        }

        public function listarUsuarios(){
            $result = ["status"=>0, "message"=>"", "data"=>[]];
            try {
                $stmt = $this->pdo->prepare("CALL spx_usuario_listar()");
                $stmt->execute();
                $result["data"]    = $stmt->fetchAll();
                $result["message"] = "Consulta exitosa";
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        public function listarRoles(){
            $result = ["status"=>0, "message"=>"", "data"=>[]];
            try {
                $stmt = $this->pdo->prepare("CALL spx_rol_listar()");
                $stmt->execute();
                $result["data"] = $stmt->fetchAll();
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        public function obtenerUsuario($id){
            $result = ["status"=>0, "message"=>"", "data"=>[]];
            try {
                $stmt = $this->pdo->prepare("CALL spx_usuario_obtener(:id)");
                $stmt->bindValue(":id", $id, PDO::PARAM_INT);
                $stmt->execute();
                $result["data"] = $stmt->fetchAll();
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        public function guardarUsuario($id, $nombre, $apellido, $celular, $usuario, $claveHash, $claveVisible, $foto, $idRol){
            $result = ["status"=>0, "message"=>"", "id_usuario"=>0];
            try {
                $stmt = $this->pdo->prepare("CALL spx_usuario_guardar(:id, :nombre, :apellido, :celular, :usuario, :clave, :clavevis, :foto, :idrol)");
                $stmt->bindValue(":id",       $id,           PDO::PARAM_INT);
                $stmt->bindValue(":nombre",   $nombre,       PDO::PARAM_STR);
                $stmt->bindValue(":apellido", $apellido,     PDO::PARAM_STR);
                $stmt->bindValue(":celular",  $celular,      PDO::PARAM_STR);
                $stmt->bindValue(":usuario",  $usuario,      PDO::PARAM_STR);
                $stmt->bindValue(":clave",    $claveHash,    PDO::PARAM_STR);
                $stmt->bindValue(":clavevis", $claveVisible, PDO::PARAM_STR);
                $stmt->bindValue(":foto",     $foto,         PDO::PARAM_STR);
                $stmt->bindValue(":idrol",    $idRol,        PDO::PARAM_INT);
                $stmt->execute();
                foreach ($stmt->fetchAll() as $v) {
                    $result["status"]     = $v["estado"];
                    $result["message"]    = $v["resultado"];
                    $result["id_usuario"] = $v["id_usuario"];
                }
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        public function cambiarClave($id, $claveHash, $claveVisible){
            $result = ["status"=>0, "message"=>""];
            try {
                $stmt = $this->pdo->prepare("CALL spx_usuario_cambiar_clave(:id, :clave, :clavevis)");
                $stmt->bindValue(":id",       $id,           PDO::PARAM_INT);
                $stmt->bindValue(":clave",    $claveHash,    PDO::PARAM_STR);
                $stmt->bindValue(":clavevis", $claveVisible, PDO::PARAM_STR);
                $stmt->execute();
                foreach ($stmt->fetchAll() as $v) {
                    $result["status"]  = $v["estado"];
                    $result["message"] = $v["resultado"];
                }
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        public function eliminarUsuario($id){
            $result = ["status"=>0, "message"=>""];
            try {
                $stmt = $this->pdo->prepare("CALL spx_usuario_eliminar(:id)");
                $stmt->bindValue(":id", $id, PDO::PARAM_INT);
                $stmt->execute();
                foreach ($stmt->fetchAll() as $v) {
                    $result["status"]  = $v["estado"];
                    $result["message"] = $v["resultado"];
                }
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        // Devuelve el usuario (con su hash de clave) para validar el login
        public function obtenerPorCredencial($usuario){
            $result = ["status"=>0, "message"=>"", "data"=>[]];
            try {
                $stmt = $this->pdo->prepare("CALL spx_usuario_por_credencial(:u)");
                $stmt->bindValue(":u", $usuario, PDO::PARAM_STR);
                $stmt->execute();
                $result["data"] = $stmt->fetchAll();
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        // Módulos + submódulos del rol (para el menú dinámico)
        public function menuPorRol($idRol){
            $rows = [];
            try {
                $stmt = $this->pdo->prepare("CALL spx_menu_por_rol(:id)");
                $stmt->bindValue(":id", $idRol, PDO::PARAM_INT);
                $stmt->execute();
                $rows = $stmt->fetchAll();
            } catch (\Throwable $e) {
                $rows = [];
            }
            return $rows;
        }
    }
?>
