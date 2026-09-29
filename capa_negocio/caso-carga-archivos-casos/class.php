<?php 
    require("model.php");
    class CasoFile{
        private $pdo;

        public function __construct($pdo){
            $this->pdo = $pdo;
        }

        public function getDataCaso($params){
            die(ModelCasoFile::getDataCaso($params,$this->pdo));
        }

        public function insertCasoFile($params){
            die(ModelCasoFile::insertCasoFile($params,$this->pdo));
        }

        public function listarRegistrosCaso($params){
            return ModelCasoFile::listarRegistrosCaso($params,$this->pdo);
        }

        public function eliminarRegistroFile($params){
            return ModelCasoFile::eliminarRegistroFile($params,$this->pdo);
        }

        public function actualizarCasoFile($params){
            return ModelCasoFile::actualizarCasoFile($params,$this->pdo);
        }

        public function eliminarArchivoFile($id,$tipo){
            return ModelCasoFile::eliminarArchivoFile($id,$tipo,$this->pdo);
        }
    }
?>