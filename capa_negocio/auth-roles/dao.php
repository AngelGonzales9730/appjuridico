<?php
    class DaoRol{
        private $pdo;

        public function __construct($pdo){
            $this->pdo = $pdo;
        }

        public function listarRoles(){
            $result = ["status"=>0, "message"=>"", "data"=>[]];
            try {
                $stmt = $this->pdo->prepare("CALL spx_rol_listar()");
                $stmt->execute();
                $result["data"]    = $stmt->fetchAll();
                $result["status"]  = 0;
                $result["message"] = "Consulta exitosa";
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        // Árbol de módulos con sus submódulos (para construir el formulario de rol)
        public function arbolModulos(){
            $result = ["status"=>0, "message"=>"", "data"=>[]];
            try {
                $stmt = $this->pdo->prepare("CALL spx_modulo_submodulo_arbol()");
                $stmt->execute();
                $result["data"]   = $stmt->fetchAll();
                $result["status"] = 0;
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        public function submodulosDeRol($idRol){
            $result = ["status"=>0, "message"=>"", "data"=>[]];
            try {
                $stmt = $this->pdo->prepare("CALL spx_rol_submodulos(:id)");
                $stmt->bindValue(":id", $idRol, PDO::PARAM_INT);
                $stmt->execute();
                $ids = [];
                foreach ($stmt->fetchAll() as $r) {
                    $ids[] = $r["id_submodulo"];
                }
                $result["data"] = $ids;
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        public function guardarRol($idRol, $nombre, $modulosCsv){
            $result = ["status"=>0, "message"=>""];
            try {
                $stmt = $this->pdo->prepare("CALL spx_rol_guardar(:id, :nombre, :modulos)");
                $stmt->bindValue(":id",      $idRol,      PDO::PARAM_INT);
                $stmt->bindValue(":nombre",  $nombre,     PDO::PARAM_STR);
                $stmt->bindValue(":modulos", $modulosCsv, PDO::PARAM_STR);
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

        // Verifica si el rol puede eliminarse. status 0 = sin usuarios (listo);
        // status 2 = tiene usuarios asignados (requiere reasignación previa)
        public function verificarEliminarRol($idRol){
            $result = ["status"=>0, "message"=>"", "total"=>0, "nombres"=>""];
            try {
                $stmt = $this->pdo->prepare("CALL spx_rol_contar_usuarios(:id)");
                $stmt->bindValue(":id", $idRol, PDO::PARAM_INT);
                $stmt->execute();
                $total = 0; $nombres = "";
                foreach ($stmt->fetchAll() as $v) {
                    $total   = intval($v["total"]);
                    $nombres = isset($v["nombres"]) ? $v["nombres"] : "";
                }
                if($total > 0){
                    $result["status"]  = 2;
                    $result["total"]   = $total;
                    $result["nombres"] = $nombres;
                    $result["message"] = "Este rol tiene {$total} usuario(s) asignado(s).";
                }
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }

        // Elimina el rol directamente (el frontend ya verificó que no tenga usuarios)
        public function eliminarRol($idRol){
            $result = ["status"=>0, "message"=>""];
            try {
                $stmt = $this->pdo->prepare("CALL spx_rol_eliminar(:id)");
                $stmt->bindValue(":id", $idRol, PDO::PARAM_INT);
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

        public function reasignarYEliminar($idRol, $idDestino){
            $result = ["status"=>0, "message"=>""];
            try {
                $stmt = $this->pdo->prepare("CALL spx_usuario_reasignar_rol(:o, :d)");
                $stmt->bindValue(":o", $idRol,     PDO::PARAM_INT);
                $stmt->bindValue(":d", $idDestino, PDO::PARAM_INT);
                $stmt->execute();
                $stmt->fetchAll();
                $stmt->closeCursor();

                $stmt2 = $this->pdo->prepare("CALL spx_rol_eliminar(:id)");
                $stmt2->bindValue(":id", $idRol, PDO::PARAM_INT);
                $stmt2->execute();
                foreach ($stmt2->fetchAll() as $v) {
                    $result["status"]  = $v["estado"];
                    $result["message"] = "Usuarios reasignados y rol eliminado con exito.";
                }
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }
    }
?>
