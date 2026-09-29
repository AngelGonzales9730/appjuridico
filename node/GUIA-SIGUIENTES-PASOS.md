# Guía: Qué hacer después (Realtime con WebSocket)

Documento de seguimiento para implementar las notificaciones en tiempo real
de **ApplicationJuridico**. Marca cada paso a medida que lo completas.

---

## 0. Qué se creó (estado actual)

En la carpeta `node/` ya existen estos archivos **listos**:

| Archivo | Función |
|---|---|
| `server.js` | Servidor WebSocket (Express + Socket.IO) |
| `package.json` | Dependencias |
| `cliente-ejemplo.html` | Ejemplo de cliente que se conecta y suscribe |
| `emitir-desde-php.php` | Función PHP para disparar notificaciones |
| `README-cpanel.md` | Pasos de despliegue en cPanel |
| `GUIA-SIGUIENTES-PASOS.md` | Este documento |

> El código **funciona tal cual**, pero hay que personalizarlo (claves, dominio)
> e integrarlo en la app antes de usarlo en producción.

---

## 1. Antes de subir — Personalizar (OBLIGATORIO)

- [ ] **Generar una `API_KEY` secreta** (cadena larga y aleatoria).
      Sugerencia: `openssl rand -hex 32` o cualquier generador de contraseñas.
- [ ] Poner esa misma clave en:
  - [ ] `server.js` → constante `API_KEY` (o como variable de entorno en cPanel).
  - [ ] `emitir-desde-php.php` → variable `$apiKey`.
- [ ] Reemplazar `TU-DOMINIO.com` por el dominio/subdominio real en:
  - [ ] `cliente-ejemplo.html` (línea del `io("https://...")`).
  - [ ] `emitir-desde-php.php` (variable `$url`).
- [ ] Definir `ALLOWED_ORIGINS` con tu dominio real (no dejar `*` en producción).

> ⚠️ La `API_KEY` debe ser IDÉNTICA en `server.js` y en el PHP, o el endpoint
> `/emit` rechazará las peticiones con error 401.

---

## 2. Probar en local (XAMPP) — Opcional pero recomendado

- [ ] Abrir terminal en `C:\xampp\htdocs\ApplicationJuridico\node`.
- [ ] Ejecutar `npm install`.
- [ ] Ejecutar `npm start` (debe decir "escuchando en el puerto 3000").
- [ ] Abrir en el navegador `http://localhost:3000/health` → debe responder `{"status":"ok",...}`.
- [ ] Abrir `cliente-ejemplo.html` (apuntando a `http://localhost:3000`) y ver "Conectado".
- [ ] Probar `emitir-desde-php.php` desde XAMPP y confirmar que la notificación llega al cliente.

---

## 3. Desplegar en cPanel

Seguir `README-cpanel.md`. Checklist rápido:

- [ ] Subir la carpeta `node/` **sin** `node_modules`.
- [ ] cPanel → **Setup Node.js App** → **Create Application**.
  - [ ] Startup file: `server.js`
  - [ ] Application root: la carpeta subida
  - [ ] Application URL: dominio/subdominio
- [ ] Agregar **Environment variables**: `API_KEY` y `ALLOWED_ORIGINS`.
- [ ] **Run NPM Install**.
- [ ] **Start**.
- [ ] Verificar: `https://TU-DOMINIO.com/health`.

---

## 4. Integrar en la aplicación PHP (lo que falta de verdad)

Aquí es donde conviertes el ejemplo en algo real:

### 4.1 Lado servidor (PHP)
- [ ] Copiar la función `notificarTiempoReal()` a un archivo de utilidades
      dentro de `capa_negocio/` (ej. `capa_negocio/realtime.php`).
- [ ] Llamarla en los puntos donde ocurren los eventos importantes, por ejemplo:
  - [ ] Al **crear/editar un expediente** → canal `expediente-{id}`, evento `actualizacion_data`.
  - [ ] Al **asignar una tarea o audiencia a un usuario** → canal `usuario-{id}`, evento `nueva_notificacion`.
  - [ ] Avisos generales → `/broadcast` o canal `notificaciones`.

### 4.2 Lado cliente (navegador)
- [ ] Incluir el script de Socket.IO en tu `capa_presentacion`
      (layout o `menu.php`), no solo en el ejemplo.
- [ ] Suscribir al usuario logueado a su canal: `usuario-{id_sesion}`.
- [ ] Suscribir a `expediente-{id}` cuando se abra la vista de un expediente.
- [ ] Definir qué hace la UI al recibir cada evento (toast, badge, recargar tabla, etc.).

---

## 5. Definir el "diccionario" de canales y eventos

Documentar aquí los nombres acordados para que cliente y servidor coincidan:

| Canal | Quién se suscribe | Eventos que recibe |
|---|---|---|
| `usuario-{id}` | El usuario logueado | `nueva_notificacion` |
| `expediente-{id}` | Quien ve ese expediente | `actualizacion_data` |
| `notificaciones` | Todos | `aviso_general` |

> Añade/renombra según las necesidades reales de ApplicationJuridico.

---

## 6. Buenas prácticas / pendientes a futuro

- [ ] Forzar **HTTPS** (los WebSocket sobre HTTP suelen fallar por SSL).
- [ ] No exponer la `API_KEY` en el frontend (solo vive en el servidor PHP).
- [ ] (Opcional) Validar identidad: pasar el `id_usuario` desde la sesión PHP
      y no permitir que un cliente se suscriba a `usuario-X` que no es suyo.
- [ ] (Opcional) Reconexión: Socket.IO reconecta solo, pero conviene re-suscribir
      a los canales en el evento `connect`.
- [ ] (Opcional) Logs / monitoreo del servidor node en cPanel.
- [ ] Recordar pulsar **Restart** en cPanel tras cada cambio en `server.js`.

---

## Resumen del flujo (para no olvidar cómo encaja todo)

```
[ PHP capa_negocio ]                    [ Navegador del usuario ]
   ocurre un evento                         socket.emit("subscribe",
        |                                       ["usuario-45"])
        v                                           ^
   notificarTiempoReal()                            | (suscrito)
   POST /emit  (con x-api-key)                       |
        |                                            |
        v                                            |
   [ server.js  -  Socket.IO ]  --- io.to(canal).emit(evento) --->
   reenvía SOLO a los suscritos a ese canal
```
