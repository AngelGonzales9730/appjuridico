<?php
// Este endpoint solo debe emitir JSON. Cualquier warning/notice de PHP impreso
// en el cuerpo corrompe la respuesta y hace que el DataTable muestre
// "invalid JSON response". Se desactiva la salida de errores (siguen en el log).
ini_set('display_errors', '0');
error_reporting(0);

require('../../globals/utils/class-list-util.php');
require('../../../capa_datos/database.php');
require('../../../capa_datos/conexion.php');                       // define $pdo
require('../../../capa_negocio/caso-mantenimiento-casos/daocaso.php'); // clase DaoCaso

class DataTableApi
{
    public $columnsDefault = [
        'id_caso'          => true,
        'cod_caso'         => true,
        'desc_patrocinado' => true,
        'desc_materia'     => true,
        'desc_ejudicial'   => true,
        'desc_cfiscal'     => true,
        'desc_incidente'   => true,
        'desc_mcautelar'   => true,
    ];

    public function __construct()
    {
        header('Content-Type: application/json');
        header('Access-Control-Allow-Origin: *');
        header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
        header('Access-Control-Allow-Headers: *');
    }

    public function init()
    {
        
        if (isset($_REQUEST['columnsDef']) && is_array($_REQUEST['columnsDef'])) {
            foreach ($_REQUEST['columnsDef'] as $field) {
                $columnsDefault[$field] = true;
            }
        }
        
        // get all raw data
        $alldata = $this->getJsonDecode();
        $data = [];
        // internal use; filter selected columns only from raw data
        foreach ($alldata as $d) {
            $data[] = $this->filterArray($d, $this->columnsDefault);
        }

        // filter by general search keyword
        if (isset($_REQUEST['search']['value']) && $_REQUEST['search']['value']) {
            $data = $this->arraySearch($data, $_REQUEST['search']['value']);
        }

        // count data
        $totalRecords = $totalDisplay = count($data);

        // sort
        if (isset($_REQUEST['order'][0]['column']) && isset($_REQUEST['order'][0]['dir'])) {
            $column = $_REQUEST['order'][0]['column'];
            $dir    = $_REQUEST['order'][0]['dir'];
            usort($data, function ($a, $b) use ($column, $dir) {
                $a = array_slice($a, $column, 1);
                $b = array_slice($b, $column, 1);
                $a = array_pop($a);
                $b = array_pop($b);

                if ($dir === 'asc') {
                    return $a > $b ? 1 : -1;
                }

                return $a < $b ? 1 : -1;
            });
        }

        // pagination length
        if (isset($_REQUEST['length'])) {
            $start  = isset($_REQUEST['start']) ? (int) $_REQUEST['start'] : 0;
            $length = (int) $_REQUEST['length'];
            // length = -1 significa "mostrar todos"; solo paginamos si es positivo
            if ($length > 0) {
                $data = array_splice($data, $start, $length);
            }
        }

        // $data = $this->reformat($data);

        $result = [
            'recordsTotal'    => $totalRecords,
            'recordsFiltered' => $totalDisplay,
            'data'            => $data,
        ];

        echo json_encode($result, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    }

    public function filterArray($array, $allowed = [])
    {
        return array_filter(
            $array,
            function ($val, $key) use ($allowed) { // N.b. $val, $key not $key, $val
                return isset($allowed[$key]) && ($allowed[$key] === true || $allowed[$key] === $val);
            },
            ARRAY_FILTER_USE_BOTH
        );
    }

    public function filterKeyword($data, $search, $field = '')
    {
        $filter = '';
        if (isset($search['value'])) {
            $filter = $search['value'];
        }
        if (!empty($filter)) {
            if (!empty($field)) {
                if (strpos(strtolower($field), 'date') !== false) {
                    // filter by date range
                    $data = $this->filterByDateRange($data, $filter, $field);
                } else {
                    // filter by column
                    $data = array_filter($data, function ($a) use ($field, $filter) {
                        return (boolean) preg_match("/$filter/i", $a[$field]);
                    });
                }

            } else {
                // general filter
                $data = array_filter($data, function ($a) use ($filter) {
                    return (boolean) preg_grep("/$filter/i", (array) $a);
                });
            }
        }

        return $data;
    }

    public function filterByDateRange($data, $filter, $field)
    {
        // filter by range
        if (!empty($range = array_filter(explode('|', $filter)))) {
            $filter = $range;
        }

        if (is_array($filter)) {
            foreach ($filter as &$date) {
                // hardcoded date format
                $date = date_create_from_format('m/d/Y', stripcslashes($date));
            }
            // filter by date range
            $data = array_filter($data, function ($a) use ($field, $filter) {
                // hardcoded date format
                $current = date_create_from_format('m/d/Y', $a[$field]);
                $from    = $filter[0];
                $to      = $filter[1];
                if ($from <= $current && $to >= $current) {
                    return true;
                }

                return false;
            });
        }

        return $data;
    }

    public function getJsonDecode(): mixed
    {
        // Se obtiene la data directamente del DAO (misma capa que usa logic.php),
        // sin auto-petición HTTP a localhost:81. Esto elimina la dependencia del
        // puerto y los fallos intermitentes de cURL que dejaban la grilla vacía.
        global $pdo;

        $dao      = new DaoCaso($pdo);
        $response = $dao->loadCase();           // devuelve un string JSON
        $decoded  = json_decode($response, true);

        return is_array($decoded) ? $decoded : [];
    }

    /**
     * @param  array  $data
     *
     * @return array
     */
    public function reformat($data): array
    {
        return array_map(function ($item) {
            // hide credit card number
            $item['CreditCardNumber'] = '**** '.substr($item['CreditCardNumber'], -4);

            $item['CreditCardType'] = $item['CreditCardType'] === 'americanexpress' ? 'american-express' : $item['CreditCardType'];

            // reformat datetime
            $item['Datetime'] = date('d M Y, g:i a', strtotime($item['Datetime']));

            return $item;
        }, $data);
    }

    public function arraySearch($array, $keyword)
    {
        return array_filter($array, function ($a) use ($keyword) {
            return (boolean) preg_grep("/$keyword/i", (array) $a);
        });
    }

}

$api = new DataTableApi;
$api->init();