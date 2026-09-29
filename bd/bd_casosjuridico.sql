-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1
-- Tiempo de generación: 17-06-2026 a las 06:37:13
-- Versión del servidor: 10.4.28-MariaDB
-- Versión de PHP: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `bd_casosjuridico`
--

DELIMITER $$
--
-- Procedimientos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_actualizar` (IN `_id_caso` INT, IN `_desc_patrocinado` VARCHAR(250), IN `_desc_materia` VARCHAR(250), IN `_desc_ejudicial` VARCHAR(250), IN `_desc_cfiscal` VARCHAR(250), IN `_desc_incidente` VARCHAR(250), IN `_desc_mcautelar` VARCHAR(250))   BEGIN
	START TRANSACTION;
    UPDATE caso
        SET desc_patrocinado = _desc_patrocinado,
        desc_materia = _desc_materia,
        desc_ejudicial = _desc_ejudicial,
        desc_cfiscal = _desc_cfiscal,
        desc_incidente = _desc_incidente,
        desc_mcautelar = _desc_mcautelar
    WHERE 
    	id_caso = _id_caso;
    COMMIT;
    SELECT 1 estado, 'Caso actualizado con exito' resultado;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_eliminar` (IN `_id_caso` INT)   BEGIN
	START TRANSACTION;
    UPDATE caso 
    SET flg_estado = 0
    WHERE id_caso = _id_caso;
    COMMIT;
    SELECT 1 estado, CONCAT('Caso eliminado con exito.') resultado;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_getdata` (IN `_id_caso` INT)   BEGIN
	SELECT id_caso,cod_caso,desc_patrocinado,desc_materia,desc_ejudicial,desc_cfiscal,desc_incidente,desc_mcautelar 
    FROM caso WHERE flg_estado = 1 AND id_caso = _id_caso; 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_insertar` (IN `_desc_patrocinado` VARCHAR(250), IN `_desc_materia` VARCHAR(100), IN `_desc_ejudicial` VARCHAR(100), IN `_desc_cfiscal` VARCHAR(100), IN `_desc_incidente` VARCHAR(350), IN `_desc_mcautelar` VARCHAR(100), IN `_desc_usuario_crea` CHAR(20))   BEGIN
	DECLARE _totalcasos INT;
    DECLARE _codcaso CHAR(50);

	START TRANSACTION;
    SET _totalcasos = (SELECT COUNT(*) FROM caso);
    SET _codcaso = CONCAT('CASO-',_totalcasos+1);
    
    INSERT INTO caso (cod_caso,desc_patrocinado,desc_materia,desc_ejudicial,desc_cfiscal,desc_incidente,desc_mcautelar,desc_usuario_crea) 
    VALUES (_codcaso,_desc_patrocinado,_desc_materia,_desc_ejudicial,_desc_cfiscal,_desc_incidente,_desc_mcautelar,_desc_usuario_crea);
    
    COMMIT;
    SELECT 1 estado, CONCAT('Caso registrado con exito.<br/> <strong>Código autogenerado: (',_codcaso,') </strong>') resultado; 
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_listar` ()   BEGIN
	SELECT id_caso,cod_caso,desc_patrocinado,desc_materia,desc_ejudicial,desc_cfiscal,desc_incidente,desc_mcautelar FROM caso WHERE flg_estado = 1
ORDER BY 1 DESC;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_caso_update_file_insertar` (IN `_cod_caso` INT, IN `_desc_petitorio` VARCHAR(250), IN `_fech_uno` DATE, IN `_resuelve` INT, IN `_fech_dos` DATE, IN `_desc_resumen` TEXT, IN `_escrito_file` CHAR(100), IN `_fiscalia_file` CHAR(100), IN `_desc_usuario_crea` INT, IN `_orden` INT)   BEGIN
	START TRANSACTION;
    
    INSERT INTO t_caso_update_file (cod_caso,desc_petitorio,fech_uno,resuelve,fech_dos,desc_resumen,escrito_file,fiscalia_file,desc_usuario_crea,orden_registro) VALUES (_cod_caso,_desc_petitorio,_fech_uno,_resuelve,_fech_dos,_desc_resumen,_escrito_file,_fiscalia_file,_desc_usuario_crea,_orden);
    
    COMMIT;
    
    SELECT 1 estado, CONCAT('Muy bien!. Se ha registrado su informacion correctamente.') resultado;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `spx_t_relacion_caso_file` (IN `_id_caso` INT)   BEGIN
	SELECT cant_files,name_files,_id_caso FROM t_relacion_caso_file 
    WHERE name_materia = (
							SELECT desc_materia
    						FROM caso WHERE flg_estado = 1 AND id_caso = _id_caso
    					 ); 
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `caso`
--

CREATE TABLE `caso` (
  `id_caso` int(11) NOT NULL,
  `cod_caso` char(50) NOT NULL,
  `desc_patrocinado` varchar(250) NOT NULL,
  `desc_materia` varchar(100) NOT NULL,
  `desc_ejudicial` varchar(100) NOT NULL,
  `desc_cfiscal` varchar(100) NOT NULL,
  `desc_incidente` varchar(350) NOT NULL,
  `desc_mcautelar` varchar(100) NOT NULL,
  `desc_usuario_crea` char(20) NOT NULL,
  `fec_hora_creacion` datetime DEFAULT current_timestamp(),
  `flg_estado` bit(1) DEFAULT b'1'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `caso`
--

INSERT INTO `caso` (`id_caso`, `cod_caso`, `desc_patrocinado`, `desc_materia`, `desc_ejudicial`, `desc_cfiscal`, `desc_incidente`, `desc_mcautelar`, `desc_usuario_crea`, `fec_hora_creacion`, `flg_estado`) VALUES
(8, 'CASO-1', 'Luis Fuentes', 'penal', 'EXP-JUD-001', 'CARP-001', 'INC-001', '', 'ADMIN', '2024-06-23 12:57:00', b'1'),
(9, 'CASO-2', 'Luis Fuentes', 'penal', 'EXP-JUD-001', 'CARP-001', 'INC-001', '', 'ADMIN', '2024-06-23 12:57:09', b'1'),
(10, 'CASO-3', 'Pruebita', 'penal', 'we', '12', '3', '', 'ADMIN', '2024-06-23 13:09:49', b'1'),
(11, 'CASO-4', 'dqwe', 'penal', 're', 'r', '123', '', 'ADMIN', '2024-06-23 13:10:08', b'1'),
(12, 'CASO-5', 'dqwe', 'penal', 're', 'r', '123', '', 'ADMIN', '2024-06-23 13:10:17', b'1'),
(13, 'CASO-6', 'Jose Perez', 'penal', 'ewe', '23', 'rq3r', '', 'ADMIN', '2024-06-23 13:10:52', b'1'),
(14, 'CASO-7', 'qweqw', 'penal', '234', '235', '23', '', 'ADMIN', '2024-06-23 13:11:26', b'1'),
(15, 'CASO-8', 'wrewr', 'penal', 'wer', '234', 'er', '', 'ADMIN', '2024-06-23 13:11:53', b'1'),
(16, 'CASO-9', 'wrewr', 'penal', 'wer', '234', 'er', '', 'ADMIN', '2024-06-23 13:14:37', b'1'),
(17, 'CASO-10', 'wrewr', 'penal', 'wer', '234', 'er', '', 'ADMIN', '2024-06-23 13:15:17', b'1'),
(18, 'CASO-11', 'qweqwe', 'penal', 'ewt', 'wery', 'we', '', 'ADMIN', '2024-06-23 13:15:58', b'1'),
(19, 'CASO-12', 'qweqwe', 'penal', 'ewt', 'wery', 'we', '', 'ADMIN', '2024-06-23 13:16:02', b'0'),
(20, 'CASO-13', 'qweqwe', 'penal', 'ewt', 'wery', 'we', '', 'ADMIN', '2024-06-23 13:16:04', b'0'),
(21, 'CASO-14', 'qweqwe', 'penal', 'ewt', 'wery', 'we', '', 'ADMIN', '2024-06-23 13:16:22', b'0'),
(22, 'CASO-15', 'qweqwe', 'penal', 'ewt', 'wery', 'we', '', 'ADMIN', '2024-06-23 13:16:26', b'0'),
(23, 'CASO-16', 'qweqwe', 'penal', 'ewt', 'wery', 'we', '', 'ADMIN', '2024-06-23 13:16:31', b'0'),
(24, 'CASO-17', 'we', 'penal', 'ewe', '23', 'r3', '', 'ADMIN', '2024-06-23 14:52:06', b'0'),
(25, 'CASO-18', 'Fuentes Luis Jose', 'penal', '12', '23', '4', '', 'ADMIN', '2024-06-23 14:55:51', b'0'),
(26, 'CASO-19', 'Pruebita final', 'penal', '', '', '', '', 'ADMIN', '2024-06-23 17:01:57', b'0'),
(27, 'CASO-20', 'Jose Luis Perez Garcia', 'penal', 'EX-JUD-001', 'CARP-FIS-001', 'El patrocinado comenta: \"La experiencia en este evento ha sido increíble. Desde el primer momento, la organización y el apoyo del patrocinador han sido excepcionales. No solo nos proporcionaron todo el equipo necesario, sino que también se aseguraron de que tuviéramos la mejor formación y asistencia técnica. Esto no solo nos permitió centrarnos en ', '', 'ADMIN', '2024-06-24 00:05:51', b'1'),
(28, 'CASO-21', '', '0', '', '', '', '', 'ADMIN', '2024-06-24 00:49:52', b'0'),
(29, 'CASO-22', '', '0', '', '', '', '', 'ADMIN', '2024-06-24 00:50:08', b'0'),
(30, 'CASO-23', '', '0', '', '', '', '', 'ADMIN', '2024-06-24 00:50:14', b'0'),
(31, 'CASO-24', 'qweqwe', 'Civil', '', '', '', '', 'ADMIN', '2024-06-24 01:00:26', b'0'),
(32, 'CASO-25', 'qwe', 'Laboral', 'we', '', '', 'we', 'ADMIN', '2024-06-24 01:09:53', b'1'),
(33, 'CASO-26', 'wefwe', 'Administrativo', 'eff', '', '', '', 'ADMIN', '2024-06-24 01:10:36', b'1'),
(34, 'CASO-27', 'wewrwr', 'Laboral', 'qwr', '', '', 'ffef', 'ADMIN', '2024-06-24 01:13:51', b'1'),
(35, 'CASO-28', 'fwef', 'Penal', 'wef', 'we', '12', '', 'ADMIN', '2024-06-24 01:14:31', b'1'),
(36, 'CASO-29', 'qweqwe', 'Penal', 'er', '234', '124', '', 'ADMIN', '2024-06-24 01:16:04', b'1'),
(37, 'CASO-30', 'qwe', 'Penal', '123', 'qwr', 'qwr', '', 'ADMIN', '2024-06-24 01:37:44', b'1'),
(38, 'CASO-31', 'qwe', 'Penal', 'qwr', '312', '12', '', 'ADMIN', '2024-06-24 01:39:15', b'0'),
(39, 'CASO-32', 'Prueba', 'Contencioso_administrativo', 'EXP-FIS-00001234442', '', '', 'ffff', 'ADMIN', '2024-07-06 12:06:00', b'1');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `t_caso_update_file`
--

CREATE TABLE `t_caso_update_file` (
  `cod_t_caso_update_file` int(11) NOT NULL,
  `cod_caso` int(11) NOT NULL,
  `desc_petitorio` varchar(250) NOT NULL,
  `fech_uno` date NOT NULL,
  `resuelve` int(11) NOT NULL,
  `fech_dos` date NOT NULL,
  `desc_resumen` text NOT NULL,
  `escrito_file` char(100) DEFAULT NULL,
  `fiscalia_file` char(100) DEFAULT NULL,
  `desc_usuario_crea` int(11) NOT NULL,
  `fec_hora_creacion` datetime DEFAULT current_timestamp(),
  `desc_usuario_actualiza` int(11) NOT NULL,
  `fec_hora_actualiza` datetime DEFAULT NULL,
  `flg_estado` bit(1) DEFAULT b'1',
  `orden_registro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `t_relacion_caso_file`
--

CREATE TABLE `t_relacion_caso_file` (
  `cod_caso_file` int(11) NOT NULL,
  `name_materia` varchar(100) NOT NULL,
  `cant_files` int(11) NOT NULL,
  `name_files` varchar(80) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `t_relacion_caso_file`
--

INSERT INTO `t_relacion_caso_file` (`cod_caso_file`, `name_materia`, `cant_files`, `name_files`) VALUES
(1, 'Contencioso_administrativo', 2, 'Expediente Judicial,Medida Cautelar'),
(2, 'penal', 3, 'Expediente Judicial,Carpeta Fiscal,Incidente'),
(3, 'Civil', 2, 'Expediente Judicial,Medida Cautelar'),
(4, 'Laboral', 2, 'Expediente Judicial,Medida Cautelar'),
(5, 'Familia', 2, 'Expediente Judicial,Medida Cautelar'),
(6, 'Constitucional', 2, 'Expediente Judicial,Medida Cautelar'),
(7, 'Administrativo', 1, 'Expediente Judicial'),
(8, 'Casos_libres', 1, 'Expediente Judicial');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `caso`
--
ALTER TABLE `caso`
  ADD PRIMARY KEY (`id_caso`);

--
-- Indices de la tabla `t_caso_update_file`
--
ALTER TABLE `t_caso_update_file`
  ADD PRIMARY KEY (`cod_t_caso_update_file`),
  ADD KEY `cod_caso` (`cod_caso`);

--
-- Indices de la tabla `t_relacion_caso_file`
--
ALTER TABLE `t_relacion_caso_file`
  ADD PRIMARY KEY (`cod_caso_file`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `caso`
--
ALTER TABLE `caso`
  MODIFY `id_caso` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=40;

--
-- AUTO_INCREMENT de la tabla `t_caso_update_file`
--
ALTER TABLE `t_caso_update_file`
  MODIFY `cod_t_caso_update_file` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `t_relacion_caso_file`
--
ALTER TABLE `t_relacion_caso_file`
  MODIFY `cod_caso_file` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `t_caso_update_file`
--
ALTER TABLE `t_caso_update_file`
  ADD CONSTRAINT `t_caso_update_file_ibfk_1` FOREIGN KEY (`cod_caso`) REFERENCES `caso` (`id_caso`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
