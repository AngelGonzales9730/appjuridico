<?php
    require("dao.php");
    class ModelUsuario{
        public static function listarUsuarios($pdo){
            $obj = new DaoUsuario($pdo);
            return $obj->listarUsuarios();
        }
        public static function listarRoles($pdo){
            $obj = new DaoUsuario($pdo);
            return $obj->listarRoles();
        }
        public static function obtenerUsuario($id,$pdo){
            $obj = new DaoUsuario($pdo);
            return $obj->obtenerUsuario($id);
        }
        public static function guardarUsuario($id,$nombre,$apellido,$celular,$usuario,$claveHash,$claveVisible,$foto,$idRol,$pdo){
            $obj = new DaoUsuario($pdo);
            return $obj->guardarUsuario($id,$nombre,$apellido,$celular,$usuario,$claveHash,$claveVisible,$foto,$idRol);
        }
        public static function cambiarClave($id,$claveHash,$claveVisible,$pdo){
            $obj = new DaoUsuario($pdo);
            return $obj->cambiarClave($id,$claveHash,$claveVisible);
        }
        public static function eliminarUsuario($id,$pdo){
            $obj = new DaoUsuario($pdo);
            return $obj->eliminarUsuario($id);
        }
        public static function obtenerPorCredencial($usuario,$pdo){
            $obj = new DaoUsuario($pdo);
            return $obj->obtenerPorCredencial($usuario);
        }
        public static function menuPorRol($idRol,$pdo){
            $obj = new DaoUsuario($pdo);
            return $obj->menuPorRol($idRol);
        }
    }
?>
