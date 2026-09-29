<?php
/**
 * Ejemplo: enviar una notificacion en tiempo real desde tu backend PHP.
 *
 * Llama a esta funcion en tu capa_negocio cuando ocurra algo:
 * un nuevo expediente, un cambio de estado, un mensaje, etc.
 *
 * El servidor node reenvia el evento SOLO a los clientes suscritos al canal.
 */

function notificarTiempoReal($channel, $event, $data = [])
{
    // Debe ser la MISMA clave que pusiste en server.js (API_KEY).
    $apiKey = 'CAMBIA_ESTA_CLAVE_SECRETA_123456';

    // URL del endpoint /emit de tu servidor node en cPanel.
    $url = 'https://TU-DOMINIO.com/emit';

    $payload = json_encode([
        'channel' => $channel,
        'event'   => $event,
        'data'    => $data,
    ]);

    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_POST           => true,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS     => $payload,
        CURLOPT_HTTPHEADER     => [
            'Content-Type: application/json',
            'x-api-key: ' . $apiKey,
        ],
        CURLOPT_TIMEOUT        => 5,
    ]);

    $resp = curl_exec($ch);
    $err  = curl_error($ch);
    curl_close($ch);

    return $err ? false : $resp;
}

// ---------------------------------------------------------------------------
// Ejemplos de uso
// ---------------------------------------------------------------------------

// Avisar al usuario 45 que tiene una notificacion nueva:
notificarTiempoReal('usuario-45', 'nueva_notificacion', [
    'titulo'  => 'Nueva audiencia programada',
    'mensaje' => 'Su expediente 123 tiene una audiencia el 20/06/2026',
    'fecha'   => date('Y-m-d H:i:s'),
]);

// Avisar a todos los que ven el expediente 123 que la data cambio:
notificarTiempoReal('expediente-123', 'actualizacion_data', [
    'estado' => 'En proceso',
    'id'     => 123,
]);
