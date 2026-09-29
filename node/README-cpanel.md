# Servidor WebSocket en tiempo real — Despliegue en cPanel

## Archivos
- `server.js` — el servidor (Express + Socket.IO).
- `package.json` — dependencias.
- `cliente-ejemplo.html` — cómo se conecta y suscribe el navegador.
- `emitir-desde-php.php` — cómo dispara notificaciones tu backend PHP.

## 1. Subir a cPanel
1. Comprime esta carpeta `node` (sin `node_modules`) y súbela por el **Administrador de archivos**, por ejemplo a `/home/USUARIO/realtime`.
2. En cPanel abre **Setup Node.js App** (Configurar aplicación Node.js).
3. **Create Application**:
   - **Node version**: 16 o superior.
   - **Application mode**: Production.
   - **Application root**: `realtime` (la carpeta que subiste).
   - **Application URL**: el dominio o subdominio (ej. `realtime.tudominio.com`).
   - **Application startup file**: `server.js`.
4. En **Environment variables** agrega:
   - `API_KEY` = una clave larga y secreta (la misma que pondrás en el PHP).
   - `ALLOWED_ORIGINS` = `https://tudominio.com` (tu dominio real).
5. Click en **Run NPM Install** (instala las dependencias del `package.json`).
6. Click en **Start / Restart**.

## 2. Probar
Abre en el navegador: `https://realtime.tudominio.com/health`
Debe responder: `{"status":"ok","clientes":0}`

## 3. Conectar el cliente
Edita `cliente-ejemplo.html`: cambia `https://TU-DOMINIO.com` por tu URL real
y ábrelo. Verás "Conectado" y "Suscrito a...".

## 4. Disparar notificaciones desde PHP
En `emitir-desde-php.php` cambia `$apiKey` y `$url`, e incorpora la función
`notificarTiempoReal()` en tu `capa_negocio`.

## Notas importantes para cPanel
- Usa **HTTPS** siempre (los WebSocket sobre HTTP suelen fallar por el SSL del dominio).
- Si el dominio bloquea el upgrade a WebSocket, Socket.IO sigue funcionando vía polling.
- Tras cada cambio en `server.js` debes pulsar **Restart** en Setup Node.js App.
