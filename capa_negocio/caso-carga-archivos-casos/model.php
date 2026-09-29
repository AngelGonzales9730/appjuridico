<?php
    require("daocaso.php");
    class ModelCasoFile{
        public static function getDataCaso($params,$pdo){
            $object = new DaoCasoFile($pdo);
            die($object->getDataCaso($params));
        }

        public static function insertCasoFile($params,$pdo){
            $object = new DaoCasoFile($pdo);
            die($object->insertCasoFile($params));
        }

        public static function listarRegistrosCaso($params,$pdo){
            $object = new DaoCasoFile($pdo);
            return $object->listarRegistrosCaso($params);
        }

        public static function eliminarRegistroFile($params,$pdo){
            $object = new DaoCasoFile($pdo);
            return $object->eliminarRegistroFile($params);
        }

        public static function actualizarCasoFile($params,$pdo){
            $object = new DaoCasoFile($pdo);
            return $object->actualizarCasoFile($params);
        }

        public static function eliminarArchivoFile($id,$tipo,$pdo){
            $object = new DaoCasoFile($pdo);
            return $object->eliminarArchivoFile($id,$tipo);
        }
    }
?>