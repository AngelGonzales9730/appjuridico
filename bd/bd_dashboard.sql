-- =============================================================================
-- Procedimientos para el Dashboard (panel principal)
-- Ejecutar en `bd_casosjuridico`. Idempotente.
-- =============================================================================

DELIMITER $$

-- Totales generales (clientes distintos, casos, usuarios)
DROP PROCEDURE IF EXISTS `spx_dashboard_totales`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_dashboard_totales` ()   BEGIN
    SELECT
        (SELECT COUNT(DISTINCT desc_patrocinado) FROM caso WHERE flg_estado = 1 AND TRIM(desc_patrocinado) <> '') AS total_clientes,
        (SELECT COUNT(*) FROM caso WHERE flg_estado = 1) AS total_casos,
        (SELECT COUNT(*) FROM usuario WHERE flg_estado = 1) AS total_usuarios;
END$$

-- Cantidad de casos agrupados por materia (tipo)
DROP PROCEDURE IF EXISTS `spx_dashboard_casos_materia`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_dashboard_casos_materia` ()   BEGIN
    SELECT desc_materia AS materia, COUNT(*) AS total
    FROM caso
    WHERE flg_estado = 1
    GROUP BY desc_materia
    ORDER BY total DESC;
END$$

-- Clientes (patrocinados) con su cantidad de casos
DROP PROCEDURE IF EXISTS `spx_dashboard_clientes`$$
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_dashboard_clientes` ()   BEGIN
    SELECT desc_patrocinado AS cliente, COUNT(*) AS casos
    FROM caso
    WHERE flg_estado = 1 AND TRIM(desc_patrocinado) <> ''
    GROUP BY desc_patrocinado
    ORDER BY casos DESC, cliente ASC;
END$$

DELIMITER ;
