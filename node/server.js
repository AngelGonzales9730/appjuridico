/**
 * Servidor WebSocket en tiempo real para ApplicationJuridico
 * -----------------------------------------------------------
 * Tecnologia: Express + Socket.IO
 *
 * Por que Socket.IO y no "ws" puro:
 *   En hosting compartido / cPanel los proxies a veces bloquean el upgrade
 *   a WebSocket. Socket.IO intenta WebSocket y, si falla, cae a long-polling
 *   automaticamente, asi la conexion nunca se cae.
 *
 * Como funciona la suscripcion:
 *   - El cliente se conecta y emite "subscribe" con uno o varios canales.
 *   - El servidor mete al cliente en esas "rooms" (canales).
 *   - Cualquier notificacion enviada a un canal llega solo a los suscritos.
 *
 * Como dispara notificaciones tu PHP:
 *   Hace un POST a  /emit  con el header  x-api-key  y un JSON:
 *   { "channel": "expediente-123", "event": "nueva_notificacion", "data": {...} }
 */

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');

// ---------------------------------------------------------------------------
// Configuracion
// ---------------------------------------------------------------------------
// En cPanel ("Setup Node.js App") puedes definir estas variables de entorno.
// PORT lo asigna Passenger automaticamente; si no existe, usa 3000 en local.
const PORT = process.env.PORT || 3000;

// Clave secreta para que SOLO tu backend PHP pueda emitir notificaciones.
// CAMBIALA por una cadena larga y aleatoria, y ponla igual en tu PHP.
const API_KEY = process.env.API_KEY || 'CAMBIA_ESTA_CLAVE_SECRETA_123456';

// Origenes permitidos (tu dominio). Usa "*" solo para pruebas.
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',').map((s) => s.trim())
  : '*';

// ---------------------------------------------------------------------------
// App HTTP + Socket.IO
// ---------------------------------------------------------------------------
const app = express();
app.use(cors({ origin: ALLOWED_ORIGINS }));
app.use(express.json());

const server = http.createServer(app);

const io = new Server(server, {
  cors: { origin: ALLOWED_ORIGINS, methods: ['GET', 'POST'] },
  // El "path" debe coincidir en el cliente. En cPanel a veces conviene
  // cambiarlo si tienes la app bajo un subdirectorio.
  path: '/socket.io',
});

// ---------------------------------------------------------------------------
// Logica de conexion / suscripcion
// ---------------------------------------------------------------------------
io.on('connection', (socket) => {
  console.log(`[+] Cliente conectado: ${socket.id}`);

  // El cliente se suscribe a uno o varios canales.
  // Acepta un string ("expediente-123") o un array (["a", "b"]).
  socket.on('subscribe', (channels, ack) => {
    const list = Array.isArray(channels) ? channels : [channels];
    list
      .filter((c) => typeof c === 'string' && c.trim() !== '')
      .forEach((channel) => {
        socket.join(channel);
        console.log(`    ${socket.id} -> suscrito a "${channel}"`);
      });
    if (typeof ack === 'function') ack({ ok: true, channels: list });
  });

  // El cliente cancela una suscripcion.
  socket.on('unsubscribe', (channels, ack) => {
    const list = Array.isArray(channels) ? channels : [channels];
    list.forEach((channel) => socket.leave(channel));
    if (typeof ack === 'function') ack({ ok: true });
  });

  socket.on('disconnect', (reason) => {
    console.log(`[-] Cliente desconectado: ${socket.id} (${reason})`);
  });
});

// ---------------------------------------------------------------------------
// Rutas HTTP
// ---------------------------------------------------------------------------

// Salud del servidor (util para probar que esta vivo desde el navegador).
app.get('/health', (req, res) => {
  res.json({ status: 'ok', clientes: io.engine.clientsCount });
});

// Endpoint que usa tu PHP para emitir notificaciones a un canal.
// Protegido con la cabecera x-api-key.
app.post('/emit', (req, res) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ ok: false, error: 'No autorizado' });
  }

  const { channel, event, data } = req.body || {};
  if (!channel || !event) {
    return res
      .status(400)
      .json({ ok: false, error: 'Faltan campos: channel y event son obligatorios' });
  }

  // Envia el evento solo a los clientes suscritos a ese canal.
  io.to(channel).emit(event, data ?? {});
  console.log(`>> emit canal="${channel}" evento="${event}"`);

  return res.json({ ok: true });
});

// Emitir a TODOS los clientes conectados (broadcast global).
app.post('/broadcast', (req, res) => {
  if (req.headers['x-api-key'] !== API_KEY) {
    return res.status(401).json({ ok: false, error: 'No autorizado' });
  }
  const { event, data } = req.body || {};
  if (!event) return res.status(400).json({ ok: false, error: 'Falta: event' });

  io.emit(event, data ?? {});
  return res.json({ ok: true });
});

// ---------------------------------------------------------------------------
// Arranque
// ---------------------------------------------------------------------------
server.listen(PORT, () => {
  console.log(`Servidor en tiempo real escuchando en el puerto ${PORT}`);
});
