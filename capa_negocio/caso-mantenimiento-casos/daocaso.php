<?php
    class DaoCaso{
        private $pdo;

        public function __construct($pdo){
            $this->pdo = $pdo;
        }

        public function loadCase(){
            $result = array();
            try {
                $stmt = $this->pdo->prepare("CALL spx_t_caso_listar");
                $stmt->execute();
                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $key => $value) {
                    $result[] = [
                            "id_caso" => $value["id_caso"],
                            "cod_caso" => $value["cod_caso"],
                            "desc_patrocinado" => $value["desc_patrocinado"],
                            "desc_materia"=>$value["desc_materia"],
                            "desc_ejudicial"=>$value["desc_ejudicial"],
                            "desc_cfiscal"=>$value["desc_cfiscal"],
                            "desc_incidente"=>$value["desc_incidente"],
                            "desc_mcautelar"=>$value["desc_mcautelar"],
                            "total_registros"=>isset($value["total_registros"]) ? $value["total_registros"] : 0,
                            "tiene_archivos"=>isset($value["tiene_archivos"]) ? $value["tiene_archivos"] : 0,
                            "archivos_cargados"=>isset($value["archivos_cargados"]) ? $value["archivos_cargados"] : 0,
                            "archivos_esperados"=>isset($value["archivos_esperados"]) ? $value["archivos_esperados"] : 0,
                    ];
                }
            } catch (\Throwable $th) {
                //throw $th;
            }
            return (json_encode($result)); 
        }

        public function insertCase($params){
            $result["status"] = 0;
            $result["message"] = "";

            try {
                $stmt = $this->pdo->prepare("CALL spx_t_caso_insertar(:_desc_patrocinado,
                :_desc_materia,:_desc_ejudicial,:_desc_cfiscal,
                :_desc_incidente,:_desc_mcautelar,:_desc_usuario_crea)");

                $stmt->bindValue(":_desc_patrocinado"   ,$params["txtPatrocinado"]  ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_materia"       ,$params["cmbMateria"]      ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_ejudicial"     ,$params["txtExpJudicial"]  ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_cfiscal"       ,$params["txtCarpetaFiscal"],PDO::PARAM_STR);
                $stmt->bindValue(":_desc_incidente"     ,$params["txtIncidente"]    ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_mcautelar"     ,$params["txtMCautelar"]    ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_usuario_crea"  ,(isset($params["usuarioCrea"]) ? $params["usuarioCrea"] : "SISTEMA") ,PDO::PARAM_STR);
                
                $stmt->execute();
                
                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $key => $value) {
                    $result["status"] = $value["estado"];
                    $result["message"] = $value["resultado"];
                }
            } catch (\Throwable $ex) {
                $result["status"] = -1;
                $result["message"] = $ex->getMessage();
            }
            return (json_encode($result));
        }

        public function dropCase($params){
            $result["status"] = 0;
            $result["message"] = "";

            try {
                $stmt = $this->pdo->prepare("CALL spx_t_caso_eliminar(:_id_caso)");

                $stmt->bindValue(":_id_caso"   ,$params  ,PDO::PARAM_INT);
                
                $stmt->execute();
                
                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $key => $value) {
                    $result["status"] = $value["estado"];
                    $result["message"] = $value["resultado"];
                }
            } catch (\Throwable $ex) {
                $result["status"] = -1;
                $result["message"] = $ex->getMessage();
            }
            return (json_encode($result));
        }

        public function getDataCaso($params){
            $result["status"] = 0;
            $result["message"] = "";
            $result["data"] = "";
            $lista = array();
            try {
                $stmt = $this->pdo->prepare("CALL spx_t_caso_getdata(:_id_caso)");
                $stmt->bindValue(":_id_caso",$params,PDO::PARAM_INT);
                $stmt->execute();
                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $key => $value) {
                    $lista[] = [
                            "id_caso"           =>  $value["id_caso"],
                            "cod_caso"          =>  $value["cod_caso"],
                            "desc_patrocinado"  =>  $value["desc_patrocinado"],
                            "desc_materia"      =>  $value["desc_materia"],
                            "desc_ejudicial"    =>  $value["desc_ejudicial"],
                            "desc_cfiscal"      =>  $value["desc_cfiscal"],
                            "desc_incidente"    =>  $value["desc_incidente"],
                            "desc_mcautelar"    =>  $value["desc_mcautelar"],
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

        public function updateCase($params){
            $result["status"] = 0;
            $result["message"] = "";
            try {
                $stmt = $this->pdo->prepare("CALL spx_t_caso_actualizar(:_id_caso,:_desc_patrocinado,
                :_desc_materia,:_desc_ejudicial,:_desc_cfiscal,
                :_desc_incidente,:_desc_mcautelar)");

                $stmt->bindValue(":_id_caso"            ,intval($params["txtIdCasoHidden"])  ,PDO::PARAM_INT);
                $stmt->bindValue(":_desc_patrocinado"   ,$params["txtPatrocinado"]  ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_materia"       ,$params["cmbMateria"]      ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_ejudicial"     ,$params["txtExpJudicial"]  ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_cfiscal"       ,$params["txtCarpetaFiscal"],PDO::PARAM_STR);
                $stmt->bindValue(":_desc_incidente"     ,$params["txtIncidente"]    ,PDO::PARAM_STR);
                $stmt->bindValue(":_desc_mcautelar"     ,$params["txtMCautelar"]    ,PDO::PARAM_STR);
                
                $stmt->execute();
                
                $recorrido = $stmt->fetchAll();
                foreach ($recorrido as $key => $value) {
                    $result["status"] = $value["estado"];
                    $result["message"] = $value["resultado"];
                }
            } catch (\Throwable $ex) {
                $result["status"] = -1;
                $result["message"] = $ex->getMessage();
            }
            return (json_encode($result));
        }
    }
?>