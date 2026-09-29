<?php
    require("model.php");
    class RolNegocio{
        private $pdo;

        public function __construct($pdo){
            $this->pdo = $pdo;
        }

        public function listarRoles(){
            return ModelRol::listarRoles($this->pdo);
        }
        public function arbolModulos(){
            return ModelRol::arbolModulos($this->pdo);
        }
        public function submodulosDeRol($idRol){
            return ModelRol::submodulosDeRol($idRol,$this->pdo);
        }
        public function guardarRol($idRol,$nombre,$modulosCsv){
            return ModelRol::guardarRol($idRol,$nombre,$modulosCsv,$this->pdo);
        }
        public function verificarEliminarRol($idRol){
            return ModelRol::verificarEliminarRol($idRol,$this->pdo);
        }
        public function eliminarRol($idRol){
            return ModelRol::eliminarRol($idRol,$this->pdo);
        }
        public function reasignarYEliminar($idRol,$idDestino){
            return ModelRol::reasignarYEliminar($idRol,$idDestino,$this->pdo);
        }
    }
?>
