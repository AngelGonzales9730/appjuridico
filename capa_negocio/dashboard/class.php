<?php
    require("model.php");
    class DashboardNegocio{
        private $pdo;

        public function __construct($pdo){
            $this->pdo = $pdo;
        }

        public function getDashboard(){
            return ModelDashboard::getDashboard($this->pdo);
        }
    }
?>
