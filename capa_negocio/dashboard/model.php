<?php
    require("dao.php");
    class ModelDashboard{
        public static function getDashboard($pdo){
            $obj = new DaoDashboard($pdo);
            return $obj->getDashboard();
        }
    }
?>
