-- =============================================================================
-- Procedimientos para la gestión de archivos cargados por caso
-- (listar, actualizar y eliminar registros de la tabla t_caso_update_file)
--
-- Ejecutar este script en la base de datos `bd_casosjuridico`.
-- Es idempotente: elimina los procedimientos si ya existen antes de crearlos.
-- =============================================================================

DELIMITER $$

-- -----------------------------------------------------------------------------
-- Lista los casos para la grilla, incluyendo el indicador `tiene_archivos`
-- (cantidad de registros activos del caso que tengan al menos un PDF cargado).
-- Reemplaza al procedimiento original agregando esa columna calculada; las
-- demás grillas que lo usan simplemente ignoran la columna extra.
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `spx_t_caso_listar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_listar` ()   BEGIN
    SELECT id_caso, cod_caso, desc_patrocinado, desc_materia,
           desc_ejudicial, desc_cfiscal, desc_incidente, desc_mcautelar,
           -- Registros de carga activos del caso (con o sin archivos)
           (
               SELECT COUNT(*)
               FROM t_caso_update_file f
               WHERE f.cod_caso = caso.id_caso
                 AND f.flg_estado = 1
           ) AS total_registros,
           -- Registros que conservan al menos un PDF
           (
               SELECT COUNT(*)
               FROM t_caso_update_file f
               WHERE f.cod_caso = caso.id_caso
                 AND f.flg_estado = 1
                 AND (f.escrito_file IS NOT NULL OR f.fiscalia_file IS NOT NULL)
           ) AS tiene_archivos,
           -- Archivos PDF efectivamente cargados (escrito + fiscalía por registro)
           (
               SELECT IFNULL(SUM((f.escrito_file IS NOT NULL) + (f.fiscalia_file IS NOT NULL)), 0)
               FROM t_caso_update_file f
               WHERE f.cod_caso = caso.id_caso
                 AND f.flg_estado = 1
           ) AS archivos_cargados,
           -- Archivos esperados según la materia: (tipos definidos) x 2 (escrito + fiscalía)
           (
               SELECT IFNULL(r.cant_files, 0) * 2
               FROM t_relacion_caso_file r
               WHERE r.name_materia = caso.desc_materia
               LIMIT 1
           ) AS archivos_esperados
    FROM caso
    WHERE flg_estado = 1
    ORDER BY id_caso DESC;
END$$

-- -----------------------------------------------------------------------------
-- Lista los registros de archivos activos de un caso.
-- Devuelve además el name_files de la materia para mapear orden -> tipo.
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `spx_t_caso_update_file_listar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_update_file_listar` (IN `_cod_caso` INT)   BEGIN
    SELECT
        f.cod_t_caso_update_file,
        f.cod_caso,
        f.desc_petitorio,
        f.fech_uno,
        f.resuelve,
        f.fech_dos,
        f.desc_resumen,
        f.escrito_file,
        f.fiscalia_file,
        f.orden_registro,
        (
            SELECT r.name_files
            FROM t_relacion_caso_file r
            WHERE r.name_materia = c.desc_materia
            LIMIT 1
        ) AS name_files
    FROM t_caso_update_file f
    INNER JOIN caso c ON c.id_caso = f.cod_caso
    WHERE f.cod_caso = _cod_caso
      AND f.flg_estado = 1
    ORDER BY f.orden_registro ASC, f.cod_t_caso_update_file ASC;
END$$

-- -----------------------------------------------------------------------------
-- Eliminación lógica de un registro de archivos (conserva el PDF físico).
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `spx_t_caso_update_file_eliminar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_update_file_eliminar` (IN `_cod_t_caso_update_file` INT)   BEGIN
    START TRANSACTION;
    UPDATE t_caso_update_file
        SET flg_estado = 0
    WHERE cod_t_caso_update_file = _cod_t_caso_update_file;
    COMMIT;
    SELECT 1 estado, 'Registro eliminado con exito.' resultado;
END$$

-- -----------------------------------------------------------------------------
-- Actualiza los datos y/o archivos de un registro.
-- Si _escrito_file / _fiscalia_file llegan vacíos o NULL, se conserva el
-- archivo actual (no se reemplaza). Devuelve el nombre del archivo anterior
-- cuando sí hay reemplazo, para que la capa de negocio pueda borrarlo del disco.
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `spx_t_caso_update_file_actualizar`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_update_file_actualizar` (
    IN `_cod_t_caso_update_file` INT,
    IN `_desc_petitorio` VARCHAR(250),
    IN `_fech_uno` DATE,
    IN `_resuelve` INT,
    IN `_fech_dos` DATE,
    IN `_desc_resumen` TEXT,
    IN `_escrito_file` CHAR(100),
    IN `_fiscalia_file` CHAR(100),
    IN `_desc_usuario_actualiza` INT
)   BEGIN
    DECLARE _escrito_anterior  CHAR(100) DEFAULT NULL;
    DECLARE _fiscalia_anterior CHAR(100) DEFAULT NULL;

    -- Capturar los archivos actuales solo cuando llega un reemplazo
    SELECT
        CASE WHEN _escrito_file  IS NOT NULL AND _escrito_file  <> '' THEN escrito_file  ELSE NULL END,
        CASE WHEN _fiscalia_file IS NOT NULL AND _fiscalia_file <> '' THEN fiscalia_file ELSE NULL END
    INTO _escrito_anterior, _fiscalia_anterior
    FROM t_caso_update_file
    WHERE cod_t_caso_update_file = _cod_t_caso_update_file;

    START TRANSACTION;
    UPDATE t_caso_update_file
        SET desc_petitorio          = _desc_petitorio,
            fech_uno                = _fech_uno,
            resuelve                = _resuelve,
            fech_dos                = _fech_dos,
            desc_resumen            = _desc_resumen,
            escrito_file            = IF(_escrito_file  IS NULL OR _escrito_file  = '', escrito_file,  _escrito_file),
            fiscalia_file           = IF(_fiscalia_file IS NULL OR _fiscalia_file = '', fiscalia_file, _fiscalia_file),
            desc_usuario_actualiza  = _desc_usuario_actualiza,
            fec_hora_actualiza      = NOW()
    WHERE cod_t_caso_update_file = _cod_t_caso_update_file;
    COMMIT;

    SELECT 1 estado,
           'Registro actualizado con exito.' resultado,
           _escrito_anterior  escrito_anterior,
           _fiscalia_anterior fiscalia_anterior;
END$$

-- -----------------------------------------------------------------------------
-- Elimina únicamente un archivo PDF (escrito o fiscalía) de un registro,
-- conservando el resto de la información. Pone el campo a NULL y devuelve el
-- nombre del archivo anterior para que la capa de negocio lo borre del disco.
-- _tipo: 'escrito' | 'fiscalia'
-- -----------------------------------------------------------------------------
DROP PROCEDURE IF EXISTS `spx_t_caso_update_file_eliminar_archivo`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_update_file_eliminar_archivo` (
    IN `_cod_t_caso_update_file` INT,
    IN `_tipo` VARCHAR(20)
)   BEGIN
    DECLARE _archivo_anterior CHAR(100) DEFAULT NULL;

    START TRANSACTION;
    IF _tipo = 'escrito' THEN
        SELECT escrito_file INTO _archivo_anterior
        FROM t_caso_update_file WHERE cod_t_caso_update_file = _cod_t_caso_update_file;

        UPDATE t_caso_update_file
            SET escrito_file = NULL
        WHERE cod_t_caso_update_file = _cod_t_caso_update_file;
    ELSEIF _tipo = 'fiscalia' THEN
        SELECT fiscalia_file INTO _archivo_anterior
        FROM t_caso_update_file WHERE cod_t_caso_update_file = _cod_t_caso_update_file;

        UPDATE t_caso_update_file
            SET fiscalia_file = NULL
        WHERE cod_t_caso_update_file = _cod_t_caso_update_file;
    END IF;
    COMMIT;

    SELECT 1 estado,
           'Archivo eliminado con exito.' resultado,
           _archivo_anterior archivo_anterior;
END$$

DELIMITER ;
