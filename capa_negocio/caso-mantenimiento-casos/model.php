<?php
    require("daocaso.php");
    class ModelCasoMantenimiento{

        public static function loadCase($pdo){
            $object = new DaoCaso($pdo);
            die($object->loadCase());
        }

        public static function insertCase($params,$pdo){
            $object = new DaoCaso($pdo);
            die($object->insertCase($params));
        }

        public static function dropCase($params,$pdo){
            $object = new DaoCaso($pdo);
            die($object->dropCase($params));
        }

        public static function getDataCaso($params,$pdo){
            $object = new DaoCaso($pdo);
            die($object->getDataCaso($params));
        }

        public static function updateCase($params,$pdo){
            $object = new DaoCaso($pdo);
            die($object->updateCase($params));
        }
    }
?>