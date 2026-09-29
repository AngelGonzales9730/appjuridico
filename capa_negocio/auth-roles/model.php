<?php
    require("dao.php");
    class ModelRol{
        public static function listarRoles($pdo){
            $obj = new DaoRol($pdo);
            return $obj->listarRoles();
        }
        public static function arbolModulos($pdo){
            $obj = new DaoRol($pdo);
            return $obj->arbolModulos();
        }
        public static function submodulosDeRol($idRol,$pdo){
            $obj = new DaoRol($pdo);
            return $obj->submodulosDeRol($idRol);
        }
        public static function guardarRol($idRol,$nombre,$modulosCsv,$pdo){
            $obj = new DaoRol($pdo);
            return $obj->guardarRol($idRol,$nombre,$modulosCsv);
        }
        public static function verificarEliminarRol($idRol,$pdo){
            $obj = new DaoRol($pdo);
            return $obj->verificarEliminarRol($idRol);
        }
        public static function eliminarRol($idRol,$pdo){
            $obj = new DaoRol($pdo);
            return $obj->eliminarRol($idRol);
        }
        public static function reasignarYEliminar($idRol,$idDestino,$pdo){
            $obj = new DaoRol($pdo);
            return $obj->reasignarYEliminar($idRol,$idDestino);
        }
    }
?>
