<?php
    class DaoCasoFile{
        private $pdo;

        public function __construct($pdo){
            $this->pdo = $pdo;
        }

        public function getDataCaso($params){
            $result["status"] = 0;
            $result["message"] = "";
            $result["data"] = "";
            $lista = array();
            try {
                $stmt = $this->pdo->prepare("CALL spx_t_relacion_caso_file(:_id_caso)");
                $stmt->bindValue(":_id_caso",$params,PDO::PARAM_INT);
                $stmt->execute();
                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $key => $value) {
                    $lista[] = [
                            "cant_files"            =>  $value["cant_files"],
                            "name_files"            =>  $value["name_files"],
                            "id_caso"              =>  $value["_id_caso"],
                    ];
                }
                $result["status"] = 0;
                $result["message"] = "Consulta exitosa";
                $result["data"] = $lista;
            } catch (\Throwable $ex) {
                $result["status"] = -1;
                $result["message"] = $ex->getMessage();
                $result["data"] = [];
            }
            return (json_encode($result)); 
        }

        public function insertCasoFile($params){
            $result["status"] = 0;
            $result["message"] = "";
            
            try {
                $stmt = $this->pdo->prepare("
                CALL spx_t_caso_update_file_insertar(
                :_cod_caso,
                :_desc_petitorio,
                :_fech_uno,
                :_resuelve,
                :_fech_dos,
                :_desc_resumen,
                :_escrito_file,
                :_fiscalia_file,
                :_desc_usuario_crea,
                :_orden
                )");

                $stmt->bindValue(":_cod_caso"                       ,$params["codcaso"]                         ,PDO::PARAM_INT);
                $stmt->bindValue(":_desc_petitorio"                 ,$params["petitorio"]                       ,PDO::PARAM_STR);
                $stmt->bindValue(":_fech_uno"                       ,$params["fechaUno"]                        ,PDO::PARAM_STR);
                $stmt->bindValue(":_resuelve"                       ,($params["resolvio"] == "false" ? 0 : 1)   ,PDO::PARAM_INT);
                $stmt->bindValue(":_fech_dos"                       ,$params["fechaDos"]                        ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_resumen"                   ,$params["resumen"]                         ,PDO::PARAM_STR);
                $stmt->bindValue(":_escrito_file"                   ,$params["escritoFileName"]                 ,PDO::PARAM_STR);
                $stmt->bindValue(":_fiscalia_file"                  ,$params["fiscaliaFileName"]                ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_usuario_crea"              ,1                                          ,PDO::PARAM_INT);
                $stmt->bindValue(":_orden"                          ,$params["numero"]                          ,PDO::PARAM_INT);
                
                $stmt->execute();
                
                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $key => $value) {
                    $result["status"]  = $value["estado"];
                    $result["message"] = $value["resultado"];
                }

            } catch (\Throwable $ex) {
                $result["status"] = -1;
                $result["message"] = $ex->getMessage();
            }
            return (json_encode($result));
        }

        public function listarRegistrosCaso($params){
            $result["status"]  = 0;
            $result["message"] = "";
            $result["data"]    = [];
            $lista = array();
            try {
                $stmt = $this->pdo->prepare("CALL spx_t_caso_update_file_listar(:_cod_caso)");
                $stmt->bindValue(":_cod_caso",$params,PDO::PARAM_INT);
                $stmt->execute();
                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $value) {
                    $lista[] = [
                        "id"            => $value["cod_t_caso_update_file"],
                        "cod_caso"      => $value["cod_caso"],
                        "petitorio"     => $value["desc_petitorio"],
                        "fechaUno"      => $value["fech_uno"],
                        "resuelve"      => $value["resuelve"],
                        "fechaDos"      => $value["fech_dos"],
                        "resumen"       => $value["desc_resumen"],
                        "escritoFile"   => $value["escrito_file"],
                        "fiscaliaFile"  => $value["fiscalia_file"],
                        "orden"         => $value["orden_registro"],
                        "nameFiles"     => $value["name_files"]
                    ];
                }
                $result["status"]  = 0;
                $result["message"] = "Consulta exitosa";
                $result["data"]    = $lista;
            } catch (\Throwable $ex) {
                $result["status"]  = -1;
                $result["message"] = $ex->getMessage();
            }
            return (json_encode($result));
        }

        public function eliminarRegistroFile($params){
            $result["status"]  = 0;
            $result["message"] = "";
            try {
                $stmt = $this->pdo->prepare("CALL spx_t_caso_update_file_eliminar(:_cod_t_caso_update_file)");
                $stmt->bindValue(":_cod_t_caso_update_file",$params,PDO::PARAM_INT);
                $stmt->execute();
                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $value) {
                    $result["status"]  = $value["estado"];
                    $result["message"] = $value["resultado"];
                }
            } catch (\Throwable $ex) {
                $result["status"]  = -1;
                $result["message"] = $ex->getMessage();
            }
            return (json_encode($result));
        }

        public function eliminarArchivoFile($id, $tipo){
            $result["status"]  = 0;
            $result["message"] = "";
            $result["data"]    = [];
            try {
                $stmt = $this->pdo->prepare("CALL spx_t_caso_update_file_eliminar_archivo(:_cod_t_caso_update_file,:_tipo)");
                $stmt->bindValue(":_cod_t_caso_update_file",$id,PDO::PARAM_INT);
                $stmt->bindValue(":_tipo",$tipo,PDO::PARAM_STR);
                $stmt->execute();
                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $value) {
                    $result["status"]  = $value["estado"];
                    $result["message"] = $value["resultado"];
                    $result["data"]    = [ "archivoAnterior" => $value["archivo_anterior"] ];
                }
            } catch (\Throwable $ex) {
                $result["status"]  = -1;
                $result["message"] = $ex->getMessage();
            }
            return (json_encode($result));
        }

        public function actualizarCasoFile($params){
            $result["status"]  = 0;
            $result["message"] = "";
            $result["data"]    = [];
            try {
                $stmt = $this->pdo->prepare("
                CALL spx_t_caso_update_file_actualizar(
                :_cod_t_caso_update_file,
                :_desc_petitorio,
                :_fech_uno,
                :_resuelve,
                :_fech_dos,
                :_desc_resumen,
                :_escrito_file,
                :_fiscalia_file,
                :_desc_usuario_actualiza
                )");

                $stmt->bindValue(":_cod_t_caso_update_file" ,$params["id"]                              ,PDO::PARAM_INT);
                $stmt->bindValue(":_desc_petitorio"         ,$params["petitorio"]                       ,PDO::PARAM_STR);
                $stmt->bindValue(":_fech_uno"               ,$params["fechaUno"]                        ,PDO::PARAM_STR);
                $stmt->bindValue(":_resuelve"               ,($params["resolvio"] == "false" ? 0 : 1)   ,PDO::PARAM_INT);
                $stmt->bindValue(":_fech_dos"               ,$params["fechaDos"]                        ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_resumen"           ,$params["resumen"]                         ,PDO::PARAM_STR);
                $stmt->bindValue(":_escrito_file"           ,$params["escritoFileName"]                 ,PDO::PARAM_STR);
                $stmt->bindValue(":_fiscalia_file"          ,$params["fiscaliaFileName"]                ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_usuario_actualiza" ,1                                          ,PDO::PARAM_INT);

                $stmt->execute();

                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $value) {
                    $result["status"]  = $value["estado"];
                    $result["message"] = $value["resultado"];
                    $result["data"]    = [
                        "escritoAnterior"  => $value["escrito_anterior"],
                        "fiscaliaAnterior" => $value["fiscalia_anterior"]
                    ];
                }
            } catch (\Throwable $ex) {
                $result["status"]  = -1;
                $result["message"] = $ex->getMessage();
            }
            return (json_encode($result));
        }
    }
?>