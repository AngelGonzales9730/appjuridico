<?php
    class DaoDashboard{
        private $pdo;

        public function __construct($pdo){
            $this->pdo = $pdo;
        }

        public function getDashboard(){
            $result = ["status"=>0, "message"=>"", "totales"=>[], "casosMateria"=>[], "clientes"=>[]];
            try {
                // Totales
                $stmt = $this->pdo->prepare("CALL spx_dashboard_totales()");
                $stmt->execute();
                $rows = $stmt->fetchAll();
                $result["totales"] = isset($rows[0]) ? $rows[0] : [];
                $stmt->closeCursor();

                // Casos por materia
                $stmt = $this->pdo->prepare("CALL spx_dashboard_casos_materia()");
                $stmt->execute();
                $result["casosMateria"] = $stmt->fetchAll();
                $stmt->closeCursor();

                // Clientes
                $stmt = $this->pdo->prepare("CALL spx_dashboard_clientes()");
                $stmt->execute();
                $result["clientes"] = $stmt->fetchAll();
                $stmt->closeCursor();

                $result["status"]  = 0;
                $result["message"] = "Consulta exitosa";
            } catch (\Throwable $e) {
                $result["status"]  = -1;
                $result["message"] = $e->getMessage();
            }
            return json_encode($result);
        }
    }
?>
