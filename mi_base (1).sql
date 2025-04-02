-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Servidor: 127.0.0.1:3306
-- Tiempo de generación: 02-04-2025 a las 13:04:02
-- Versión del servidor: 8.3.0
-- Versión de PHP: 8.2.18

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `mi_base`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `empleados`
--

DROP TABLE IF EXISTS `empleados`;
CREATE TABLE IF NOT EXISTS `empleados` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `email` varchar(100) NOT NULL,
  `puesto` varchar(100) NOT NULL,
  `fechaNacimiento` date DEFAULT NULL,
  `curp` varchar(18) DEFAULT NULL,
  `rfc` varchar(13) DEFAULT NULL,
  `nss` varchar(11) DEFAULT NULL,
  `genero` enum('Masculino','Femenino','Otro') DEFAULT NULL,
  `tipoContrato` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`id`)
) ENGINE=MyISAM AUTO_INCREMENT=22 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- Volcado de datos para la tabla `empleados`
--

INSERT INTO `empleados` (`id`, `nombre`, `email`, `puesto`, `fechaNacimiento`, `curp`, `rfc`, `nss`, `genero`, `tipoContrato`) VALUES
(12, 'Carlos peakyblinder', 'carlos.perez@email.com', 'Desarrollador', '2025-04-06', 'CURP1234567890', 'RFC1234567890', 'NSS12345678', 'Masculino', 'Tiempo completo'),
(13, 'Ana López', 'ana.lopez@email.com', 'Diseñadora', '1995-08-22', 'CURP0987654321', 'RFC0987654321', 'NSS09876543', 'Femenino', 'Tiempo completo'),
(14, 'Miguel Sánchez', 'miguel.sanchez@email.com', 'Analista', '1987-03-10', 'CURP2345678901', 'RFC2345678901', 'NSS23456789', 'Masculino', 'Media tiempo'),
(15, 'Lucía Fernández', 'lucia.fernandez@email.com', 'Gerente', '1985-12-05', 'CURP3456789012', 'RFC3456789012', 'NSS34567890', 'Femenino', 'Tiempo completo'),
(16, 'Javier Gómez', 'javier.gomez@email.com', 'Soporte Técnico', '1992-06-18', 'CURP4567890123', 'RFC4567890123', 'NSS45678901', 'Masculino', 'Media tiempo'),
(17, 'Sofía Ramírez', 'sofia.ramirez@email.com', 'Recursos Humanos', '1998-11-30', 'CURP5678901234', 'RFC5678901234', 'NSS56789012', 'Femenino', 'Tiempo completo'),
(18, 'Daniel Torres', 'daniel.torres@email.com', 'Administrador', '1983-09-25', 'CURP6789012345', 'RFC6789012345', 'NSS67890123', 'Masculino', 'Por proyecto'),
(19, 'Valeria Castro', 'valeria.castro@email.com', 'Marketing', '1994-07-12', 'CURP7890123456', 'RFC7890123456', 'NSS78901234', 'Femenino', 'Por proyecto'),
(20, 'Pedro Ríos', 'pedro.rios@email.com', 'Contador', '1980-04-08', 'CURP8901234567', 'RFC8901234567', 'NSS89012345', 'Masculino', 'Media tiempo'),
(21, 'Elena Vargas', 'elena.vargas@email.com', 'Asistente', '1996-01-20', 'CURP9012345678', 'RFC9012345678', 'NSS90123456', 'Femenino', 'Por proyecto');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `usuarios`
--

DROP TABLE IF EXISTS `usuarios`;
CREATE TABLE IF NOT EXISTS `usuarios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `username` varchar(50) COLLATE utf8mb4_general_ci NOT NULL,
  `password` varchar(255) COLLATE utf8mb4_general_ci NOT NULL,
  `role` varchar(20) COLLATE utf8mb4_general_ci DEFAULT 'user',
  PRIMARY KEY (`id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Volcado de datos para la tabla `usuarios`
--

INSERT INTO `usuarios` (`id`, `username`, `password`, `role`) VALUES
(1, 'admin', '$2b$10$RxG4UYhB3AQ5Rvf.C/qL2OHJsIc6hvSi6cIIjawPU4BR7lQZ83mKC', 'admin'),
(2, 'charly', '123456', 'admin'),
(3, 'thomas', '$2b$10$6NX.lzPwvdYkq81tDjgDQuaHdqa/6HEDIHxPNIrnzjryUocf8xbru', 'admin'),
(4, 'thomas_user', '$2b$10$n3KjP8OkphxlzLE8yz0gMeSllrZV36XmFGVzfxFqsXVGF7st0AXxq', 'user');
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
