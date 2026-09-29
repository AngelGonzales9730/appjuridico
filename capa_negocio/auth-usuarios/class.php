<?php
    require("model.php");
    class UsuarioNegocio{
        private $pdo;

        public function __construct($pdo){
            $this->pdo = $pdo;
        }

        public function listarUsuarios(){
            return ModelUsuario::listarUsuarios($this->pdo);
        }
        public function listarRoles(){
            return ModelUsuario::listarRoles($this->pdo);
        }
        public function obtenerUsuario($id){
            return ModelUsuario::obtenerUsuario($id,$this->pdo);
        }
        public function guardarUsuario($id,$nombre,$apellido,$celular,$usuario,$claveHash,$claveVisible,$foto,$idRol){
            return ModelUsuario::guardarUsuario($id,$nombre,$apellido,$celular,$usuario,$claveHash,$claveVisible,$foto,$idRol,$this->pdo);
        }
        public function cambiarClave($id,$claveHash,$claveVisible){
            return ModelUsuario::cambiarClave($id,$claveHash,$claveVisible,$this->pdo);
        }
        public function eliminarUsuario($id){
            return ModelUsuario::eliminarUsuario($id,$this->pdo);
        }
        public function obtenerPorCredencial($usuario){
            return ModelUsuario::obtenerPorCredencial($usuario,$this->pdo);
        }
        public function menuPorRol($idRol){
            return ModelUsuario::menuPorRol($idRol,$this->pdo);
        }
    }
?>
