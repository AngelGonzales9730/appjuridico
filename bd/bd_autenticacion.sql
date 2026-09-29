-- =============================================================================
-- Módulo de Autenticación (v2): Roles, Usuarios, Módulos y Submódulos
-- Permisos a nivel de SUBMÓDULO. Login con credenciales. Foto de usuario.
-- Ejecutar en `bd_casosjuridico`. Idempotente (re-ejecutable sin perder datos).
-- =============================================================================

-- ----------------------------- TABLAS ---------------------------------------

CREATE TABLE IF NOT EXISTS `modulo` (
  `id_modulo` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `flg_estado` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id_modulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `modulo`
  ADD COLUMN IF NOT EXISTS `icono` varchar(50) DEFAULT 'ki-element-11',
  ADD COLUMN IF NOT EXISTS `orden` int(11) DEFAULT 0;

CREATE TABLE IF NOT EXISTS `submodulo` (
  `id_submodulo` int(11) NOT NULL AUTO_INCREMENT,
  `id_modulo` int(11) NOT NULL,
  `nombre` varchar(100) NOT NULL,
  `vista` varchar(150) NOT NULL,
  `script` varchar(100) NOT NULL,
  `orden` int(11) DEFAULT 0,
  `flg_estado` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id_submodulo`),
  KEY `idx_sub_modulo` (`id_modulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `rol` (
  `id_rol` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `fec_hora_creacion` datetime DEFAULT current_timestamp(),
  `flg_estado` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `rol_submodulo` (
  `id_rol_submodulo` int(11) NOT NULL AUTO_INCREMENT,
  `id_rol` int(11) NOT NULL,
  `id_submodulo` int(11) NOT NULL,
  PRIMARY KEY (`id_rol_submodulo`),
  KEY `idx_rs_rol` (`id_rol`),
  KEY `idx_rs_sub` (`id_submodulo`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE IF NOT EXISTS `usuario` (
  `id_usuario` int(11) NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `apellido` varchar(100) NOT NULL,
  `celular` varchar(20) DEFAULT NULL,
  `id_rol` int(11) NOT NULL,
  `fec_hora_creacion` datetime DEFAULT current_timestamp(),
  `flg_estado` bit(1) DEFAULT b'1',
  PRIMARY KEY (`id_usuario`),
  KEY `idx_usuario_rol` (`id_rol`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

ALTER TABLE `usuario`
  ADD COLUMN IF NOT EXISTS `usuario` varchar(50) DEFAULT NULL AFTER `celular`,
  ADD COLUMN IF NOT EXISTS `clave` varchar(255) DEFAULT NULL AFTER `usuario`,
  ADD COLUMN IF NOT EXISTS `clave_visible` varchar(255) DEFAULT NULL AFTER `clave`,
  ADD COLUMN IF NOT EXISTS `cambio_pendiente` bit(1) DEFAULT b'1' AFTER `clave_visible`,
  ADD COLUMN IF NOT EXISTS `foto` varchar(150) DEFAULT NULL AFTER `cambio_pendiente`;

-- --------------------------- DATOS BASE --------------------------------------

-- Módulos (idempotente por nombre)
INSERT INTO `modulo` (`nombre`,`icono`,`orden`)
SELECT 'Casos','ki-address-book',1 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `modulo` WHERE `nombre`='Casos');
INSERT INTO `modulo` (`nombre`,`icono`,`orden`)
SELECT 'Documentos','ki-element-plus',2 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `modulo` WHERE `nombre`='Documentos');
INSERT INTO `modulo` (`nombre`,`icono`,`orden`)
SELECT 'Autenticación','ki-user',3 FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `modulo` WHERE `nombre`='Autenticación');

-- Asegurar iconos/orden aunque el módulo ya existiera
UPDATE `modulo` SET `icono`='ki-address-book', `orden`=1 WHERE `nombre`='Casos';
UPDATE `modulo` SET `icono`='ki-element-plus', `orden`=2 WHERE `nombre`='Documentos';
UPDATE `modulo` SET `icono`='ki-user',          `orden`=3 WHERE `nombre`='Autenticación';

-- Submódulos (idempotente por modulo + nombre)
INSERT INTO `submodulo` (`id_modulo`,`nombre`,`vista`,`script`,`orden`)
SELECT m.id_modulo,'Mantenimiento','../caso-mantenimiento-casos/index.php','caso-mantenimiento-casos',1
FROM `modulo` m WHERE m.nombre='Casos'
  AND NOT EXISTS (SELECT 1 FROM `submodulo` s WHERE s.id_modulo=m.id_modulo AND s.nombre='Mantenimiento');

INSERT INTO `submodulo` (`id_modulo`,`nombre`,`vista`,`script`,`orden`)
SELECT m.id_modulo,'Cargas','../caso-carga-archivos-casos/index.php','caso-carga-archivos-casos',1
FROM `modulo` m WHERE m.nombre='Documentos'
  AND NOT EXISTS (SELECT 1 FROM `submodulo` s WHERE s.id_modulo=m.id_modulo AND s.nombre='Cargas');

INSERT INTO `submodulo` (`id_modulo`,`nombre`,`vista`,`script`,`orden`)
SELECT m.id_modulo,'Mantenimiento de roles','../auth-roles/index.php','auth-roles',1
FROM `modulo` m WHERE m.nombre='Autenticación'
  AND NOT EXISTS (SELECT 1 FROM `submodulo` s WHERE s.id_modulo=m.id_modulo AND s.nombre='Mantenimiento de roles');

INSERT INTO `submodulo` (`id_modulo`,`nombre`,`vista`,`script`,`orden`)
SELECT m.id_modulo,'Mantenimiento de usuarios','../auth-usuarios/index.php','auth-usuarios',2
FROM `modulo` m WHERE m.nombre='Autenticación'
  AND NOT EXISTS (SELECT 1 FROM `submodulo` s WHERE s.id_modulo=m.id_modulo AND s.nombre='Mantenimiento de usuarios');

-- --------------------------- PROCEDIMIENTOS ----------------------------------

DELIMITER $$

-- Árbol completo de módulos con sus submódulos (para la vista de roles)
DROP PROCEDURE IF EXISTS `spx_modulo_submodulo_arbol`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_modulo_submodulo_arbol` ()   BEGIN
    SELECT m.id_modulo, m.nombre AS modulo, s.id_submodulo, s.nombre AS submodulo
    FROM modulo m
    INNER JOIN submodulo s ON s.id_modulo = m.id_modulo AND s.flg_estado = 1
    WHERE m.flg_estado = 1
    ORDER BY m.orden, m.id_modulo, s.orden, s.id_submodulo;
END$$

-- Submódulos permitidos de un rol (ids)
DROP PROCEDURE IF EXISTS `spx_rol_submodulos`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_rol_submodulos` (IN `_id_rol` INT)   BEGIN
    SELECT id_submodulo FROM rol_submodulo WHERE id_rol = _id_rol;
END$$

-- Inserta/actualiza rol y regenera sus submódulos desde un CSV de ids
DROP PROCEDURE IF EXISTS `spx_rol_guardar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_rol_guardar` (IN `_id_rol` INT, IN `_nombre` VARCHAR(100), IN `_subs` TEXT)   BEGIN
    DECLARE _idr  INT;
    DECLARE _pos  INT;
    DECLARE _val  VARCHAR(20);
    DECLARE _rest TEXT;

    START TRANSACTION;
    IF _id_rol IS NULL OR _id_rol = 0 THEN
        INSERT INTO rol (nombre) VALUES (_nombre);
        SET _idr = LAST_INSERT_ID();
    ELSE
        SET _idr = _id_rol;
        UPDATE rol SET nombre = _nombre WHERE id_rol = _idr;
    END IF;

    DELETE FROM rol_submodulo WHERE id_rol = _idr;

    SET _rest = _subs;
    WHILE _rest IS NOT NULL AND LENGTH(_rest) > 0 DO
        SET _pos = LOCATE(',', _rest);
        IF _pos = 0 THEN
            SET _val = _rest; SET _rest = '';
        ELSE
            SET _val  = LEFT(_rest, _pos - 1);
            SET _rest = SUBSTRING(_rest, _pos + 1);
        END IF;
        IF LENGTH(TRIM(_val)) > 0 THEN
            INSERT INTO rol_submodulo (id_rol, id_submodulo) VALUES (_idr, CAST(_val AS UNSIGNED));
        END IF;
    END WHILE;

    COMMIT;
    SELECT 1 estado,
           IF(_id_rol IS NULL OR _id_rol = 0, 'Rol registrado con exito.', 'Rol actualizado con exito.') resultado,
           _idr id_rol;
END$$

-- Lista de roles con sus submódulos (concatenados) y conteo de usuarios
DROP PROCEDURE IF EXISTS `spx_rol_listar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_rol_listar` ()   BEGIN
    SELECT
        r.id_rol, r.nombre,
        (
            SELECT GROUP_CONCAT(s.nombre ORDER BY s.id_submodulo SEPARATOR ', ')
            FROM rol_submodulo rs
            INNER JOIN submodulo s ON s.id_submodulo = rs.id_submodulo
            WHERE rs.id_rol = r.id_rol
        ) AS submodulos,
        -- Relación módulo::submódulo (separadas por ||) para construir el árbol
        (
            SELECT GROUP_CONCAT(CONCAT(m.nombre,'::',s.nombre) ORDER BY m.orden, m.id_modulo, s.id_submodulo SEPARATOR '||')
            FROM rol_submodulo rs
            INNER JOIN submodulo s ON s.id_submodulo = rs.id_submodulo
            INNER JOIN modulo m    ON m.id_modulo   = s.id_modulo
            WHERE rs.id_rol = r.id_rol
        ) AS arbol,
        (SELECT COUNT(DISTINCT s.id_modulo)
            FROM rol_submodulo rs INNER JOIN submodulo s ON s.id_submodulo = rs.id_submodulo
            WHERE rs.id_rol = r.id_rol) AS total_modulos,
        (SELECT COUNT(*) FROM rol_submodulo rs WHERE rs.id_rol = r.id_rol) AS total_submodulos,
        (SELECT COUNT(*) FROM usuario u WHERE u.id_rol = r.id_rol AND u.flg_estado = 1) AS total_usuarios
    FROM rol r
    WHERE r.flg_estado = 1
    ORDER BY r.id_rol DESC;
END$$

DROP PROCEDURE IF EXISTS `spx_rol_contar_usuarios`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_rol_contar_usuarios` (IN `_id_rol` INT)   BEGIN
    SELECT COUNT(*) total,
           GROUP_CONCAT(CONCAT(nombre,' ',apellido) ORDER BY nombre SEPARATOR ', ') nombres
    FROM usuario WHERE id_rol = _id_rol AND flg_estado = 1;
END$$

DROP PROCEDURE IF EXISTS `spx_rol_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_rol_eliminar` (IN `_id_rol` INT)   BEGIN
    START TRANSACTION;
    UPDATE rol SET flg_estado = 0 WHERE id_rol = _id_rol;
    DELETE FROM rol_submodulo WHERE id_rol = _id_rol;
    COMMIT;
    SELECT 1 estado, 'Rol eliminado con exito.' resultado;
END$$

-- ---------- USUARIOS ----------
DROP PROCEDURE IF EXISTS `spx_usuario_listar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_usuario_listar` ()   BEGIN
    SELECT u.id_usuario, u.nombre, u.apellido, u.celular, u.usuario, u.clave_visible,
           (u.cambio_pendiente+0) cambio_pendiente, u.foto, u.id_rol, r.nombre nombre_rol
    FROM usuario u
    INNER JOIN rol r ON r.id_rol = u.id_rol
    WHERE u.flg_estado = 1
    ORDER BY u.id_usuario DESC;
END$$

DROP PROCEDURE IF EXISTS `spx_usuario_obtener`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_usuario_obtener` (IN `_id_usuario` INT)   BEGIN
    SELECT
        u.id_usuario, u.nombre, u.apellido, u.celular, u.usuario, u.foto, u.id_rol,
        u.fec_hora_creacion, r.nombre nombre_rol,
        (
            SELECT GROUP_CONCAT(s.nombre ORDER BY s.id_submodulo SEPARATOR ', ')
            FROM rol_submodulo rs
            INNER JOIN submodulo s ON s.id_submodulo = rs.id_submodulo
            WHERE rs.id_rol = u.id_rol
        ) AS modulos
    FROM usuario u
    INNER JOIN rol r ON r.id_rol = u.id_rol
    WHERE u.id_usuario = _id_usuario;
END$$

-- Inserta/actualiza usuario. La clave y la foto solo se cambian si llegan no vacías.
DROP PROCEDURE IF EXISTS `spx_usuario_guardar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_usuario_guardar` (
    IN `_id_usuario` INT, IN `_nombre` VARCHAR(100), IN `_apellido` VARCHAR(100),
    IN `_celular` VARCHAR(20), IN `_usuario` VARCHAR(50), IN `_clave` VARCHAR(255),
    IN `_clave_visible` VARCHAR(255), IN `_foto` VARCHAR(150), IN `_id_rol` INT
)   BEGIN
    DECLARE _idu INT;
    DECLARE _dup INT;

    -- Validar que el nombre de usuario no esté en uso por otra cuenta activa
    SELECT COUNT(*) INTO _dup
    FROM usuario
    WHERE usuario = _usuario AND flg_estado = 1 AND id_usuario <> IFNULL(_id_usuario, 0);

    IF _dup > 0 THEN
        SELECT 0 estado, 'El nombre de usuario ya está en uso por otra cuenta activa.' resultado, 0 id_usuario;
    ELSE
    START TRANSACTION;
    IF _id_usuario IS NULL OR _id_usuario = 0 THEN
        -- Al crear, la clave la asigna el admin: es temporal y debe cambiarse en el primer ingreso
        INSERT INTO usuario (nombre, apellido, celular, usuario, clave, clave_visible, cambio_pendiente, foto, id_rol)
        VALUES (_nombre, _apellido, _celular, _usuario, _clave, _clave_visible, b'1', NULLIF(_foto,''), _id_rol);
        SET _idu = LAST_INSERT_ID();
    ELSE
        SET _idu = _id_usuario;
        UPDATE usuario SET
            nombre   = _nombre,
            apellido = _apellido,
            celular  = _celular,
            usuario  = _usuario,
            -- Si el admin asigna una nueva clave, vuelve a ser temporal (cambio pendiente)
            clave            = IF(_clave IS NULL OR _clave = '', clave, _clave),
            clave_visible    = IF(_clave IS NULL OR _clave = '', clave_visible, _clave_visible),
            cambio_pendiente = IF(_clave IS NULL OR _clave = '', cambio_pendiente, b'1'),
            foto     = IF(_foto  IS NULL OR _foto  = '', foto,  _foto),
            id_rol   = _id_rol
        WHERE id_usuario = _idu;
    END IF;
    COMMIT;
    SELECT 1 estado,
           IF(_id_usuario IS NULL OR _id_usuario = 0, 'Usuario registrado con exito.', 'Usuario actualizado con exito.') resultado,
           _idu id_usuario;
    END IF;
END$$

-- Cambio de contraseña por el propio usuario (deja de estar pendiente)
DROP PROCEDURE IF EXISTS `spx_usuario_cambiar_clave`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_usuario_cambiar_clave` (IN `_id_usuario` INT, IN `_clave` VARCHAR(255), IN `_clave_visible` VARCHAR(255))   BEGIN
    START TRANSACTION;
    UPDATE usuario
        SET clave = _clave, clave_visible = _clave_visible, cambio_pendiente = b'0'
    WHERE id_usuario = _id_usuario;
    COMMIT;
    SELECT 1 estado, 'Contraseña actualizada con exito.' resultado;
END$$

DROP PROCEDURE IF EXISTS `spx_usuario_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_usuario_eliminar` (IN `_id_usuario` INT)   BEGIN
    START TRANSACTION;
    UPDATE usuario SET flg_estado = 0 WHERE id_usuario = _id_usuario;
    COMMIT;
    SELECT 1 estado, 'Usuario eliminado con exito.' resultado;
END$$

DROP PROCEDURE IF EXISTS `spx_usuario_reasignar_rol`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_usuario_reasignar_rol` (IN `_id_rol_origen` INT, IN `_id_rol_destino` INT)   BEGIN
    START TRANSACTION;
    UPDATE usuario SET id_rol = _id_rol_destino WHERE id_rol = _id_rol_origen AND flg_estado = 1;
    COMMIT;
    SELECT 1 estado, 'Usuarios reasignados con exito.' resultado;
END$$

-- Login: devuelve el usuario (con su hash de clave) buscando por nombre de usuario
DROP PROCEDURE IF EXISTS `spx_usuario_por_credencial`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_usuario_por_credencial` (IN `_usuario` VARCHAR(50))   BEGIN
    SELECT u.id_usuario, u.nombre, u.apellido, u.usuario, u.clave, u.foto, u.id_rol, r.nombre nombre_rol,
           (u.cambio_pendiente+0) cambio_pendiente
    FROM usuario u
    INNER JOIN rol r ON r.id_rol = u.id_rol
    WHERE u.usuario = _usuario AND u.flg_estado = 1
    LIMIT 1;
END$$

-- Menú (módulos + submódulos) al que tiene acceso un rol, para armar el sidebar
DROP PROCEDURE IF EXISTS `spx_menu_por_rol`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_menu_por_rol` (IN `_id_rol` INT)   BEGIN
    SELECT m.id_modulo, m.nombre AS modulo, m.icono,
           s.id_submodulo, s.nombre AS submodulo, s.vista, s.script
    FROM rol_submodulo rs
    INNER JOIN submodulo s ON s.id_submodulo = rs.id_submodulo AND s.flg_estado = 1
    INNER JOIN modulo m    ON m.id_modulo   = s.id_modulo      AND m.flg_estado = 1
    WHERE rs.id_rol = _id_rol
    ORDER BY m.orden, m.id_modulo, s.orden, s.id_submodulo;
END$$

DELIMITER ;

-- --------------------------- DATOS SEMILLA -----------------------------------
-- Rol Administrador con acceso total + usuario inicial (usuario: admin / clave: admin123)

INSERT INTO `rol` (`nombre`)
SELECT 'Administrador' FROM DUAL
WHERE NOT EXISTS (SELECT 1 FROM `rol` WHERE `nombre`='Administrador' AND `flg_estado`=1);

-- Asignar al rol Administrador todos los submódulos que aún no tenga
INSERT INTO `rol_submodulo` (`id_rol`,`id_submodulo`)
SELECT r.id_rol, s.id_submodulo
FROM `rol` r CROSS JOIN `submodulo` s
WHERE r.nombre='Administrador' AND r.flg_estado=1
  AND NOT EXISTS (SELECT 1 FROM `rol_submodulo` rs WHERE rs.id_rol=r.id_rol AND rs.id_submodulo=s.id_submodulo);

-- Usuario inicial (clave admin123, ya cifrada con password_hash). El admin no requiere cambio.
INSERT INTO `usuario` (`nombre`,`apellido`,`celular`,`usuario`,`clave`,`clave_visible`,`cambio_pendiente`,`id_rol`)
SELECT 'Administrador','del Sistema','', 'admin',
       '$2y$10$MjZJtt6dPkNNxe/l5v5rnuIUcWPt6EqPHhb1qRvi6n5447gHzNVcy', 'admin123', b'0', r.id_rol
FROM `rol` r
WHERE r.nombre='Administrador' AND r.flg_estado=1
  AND NOT EXISTS (SELECT 1 FROM `usuario` WHERE `usuario`='admin')
LIMIT 1;

-- Si el admin ya existía de una versión anterior, completar sus nuevos campos
UPDATE `usuario` SET `clave_visible`='admin123', `cambio_pendiente`=b'0'
WHERE `usuario`='admin' AND (`clave_visible` IS NULL OR `clave_visible`='');
