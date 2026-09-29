<?php 
    require("model.php");
    class CasoMantenimiento{
        private $pdo;

        public function __construct($pdo){
            $this->pdo = $pdo;
        }

        public function loadCase(){
            die(ModelCasoMantenimiento::loadCase($this->pdo));
        }

        public function insertCase($params){
            die(ModelCasoMantenimiento::insertCase($params,$this->pdo));
        }

        public function dropCase($params){
            die(ModelCasoMantenimiento::dropCase($params,$this->pdo));
        }

        public function getDataCaso($params){
            die(ModelCasoMantenimiento::getDataCaso($params,$this->pdo));
        }

        public function updateCase($params){
            die(ModelCasoMantenimiento::updateCase($params,$this->pdo));
        }
    }
?>