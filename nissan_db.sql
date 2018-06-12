-- phpMyAdmin SQL Dump
-- version 4.8.0.1
-- https://www.phpmyadmin.net/
--
-- Servidor: localhost
-- Tiempo de generación: 12-06-2018 a las 06:58:43
-- Versión del servidor: 10.1.32-MariaDB
-- Versión de PHP: 7.2.5

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Base de datos: `nissan_db`
--

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `customers`
--

CREATE TABLE `customers` (
  `id_customer` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `phone` varchar(13) NOT NULL,
  `address` varchar(55) NOT NULL,
  `city` varchar(35) NOT NULL,
  `state` varchar(35) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `country` varchar(45) NOT NULL,
  `id_seller` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `customers`
--

INSERT INTO `customers` (`id_customer`, `name`, `lastname`, `phone`, `address`, `city`, `state`, `postal_code`, `country`, `id_seller`) VALUES
(1, 'Arturito', 'Buensamo', '3125672345', 'Centro calle nose #0394', 'Colima', 'Colima', '28867', 'Mexico', 1),
(2, 'Lolita', 'Valladares', '3140989231', 'Centro calle Nose #8753', 'Manzanillo', 'Colima', '29235', 'Mexico', 2),
(3, 'Paul N', 'Betancur', '3141230077', 'Calle nose #2113', 'Manzanillo', 'Colima', '3233', 'Mexico', 2),
(4, 'Francisco', 'Cazarez', '7384238', 'sdnbm', 'Colima', 'Colima', '28010', 'Mexico', 1),
(9, 'Andres', 'Rodriguez', '3129874567', 'Calle U #1 Col. Uno', 'Manzanillo', 'Colima', '28000', 'Mexico', 2),
(10, 'Jesús', 'Martínez', '3140928302', 'Calle D #2 Col. Dos', 'Manzanillo', 'Colima', '28000', 'Mexico', 2),
(11, 'a', 'a', 'a', 'a', 'a', 'a', 'a', 'a', 5),
(12, 'Manuel', 'Torres', '3144957653', 'Calle T #3 Col. Tres', 'Manzanillo', 'Colima', '28000', 'Mexico', 2),
(14, 'Gerardo', 'Carrasco', '3129090909', 'Calle N #1 Col. General', 'Colima', 'Colima', '21000', 'Mexico', 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `globals_managers`
--

CREATE TABLE `globals_managers` (
  `id_global_manager` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `phone` varchar(13) NOT NULL,
  `address` varchar(55) NOT NULL,
  `city` varchar(35) NOT NULL,
  `state` varchar(35) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `country` varchar(45) NOT NULL,
  `job` varchar(45) DEFAULT 'Globar Manager',
  `id_user` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `globals_managers`
--

INSERT INTO `globals_managers` (`id_global_manager`, `name`, `lastname`, `phone`, `address`, `city`, `state`, `postal_code`, `country`, `job`, `id_user`) VALUES
(1, 'Pepe', 'Valencia', '3123453456', 'Street starts #3456', 'Guadalajara', 'Jalisco', '28078', 'Mexico', 'Globar Manager', 7);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `offices`
--

CREATE TABLE `offices` (
  `id_office` int(11) NOT NULL,
  `name_office` varchar(50) NOT NULL,
  `phone` varchar(13) NOT NULL,
  `address` varchar(55) NOT NULL,
  `city` varchar(35) NOT NULL,
  `state` varchar(35) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `country` varchar(45) NOT NULL,
  `id_global_manager` int(11) NOT NULL,
  `id_office_manager` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `offices`
--

INSERT INTO `offices` (`id_office`, `name_office`, `phone`, `address`, `city`, `state`, `postal_code`, `country`, `id_global_manager`, `id_office_manager`) VALUES
(1, 'Sucursal Colima', '3123450956', 'Centro calle nose #8643', 'Colima', 'Colima', '28034', 'Mexico', 1, 1),
(2, 'Sucursal Manzanillo', '3143478051', 'Zona Centro #3773', 'Manzanillo', 'Colima', '28077', 'Mexico', 1, 2),
(6, 'Sucursal Villa de Álvarez', '3129922836', 'Calle jksahda', 'Villa de Álvarez', 'Colima', '123', 'Mexico', 1, 6);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `offices_managers`
--

CREATE TABLE `offices_managers` (
  `id_office_manager` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `phone` varchar(13) NOT NULL,
  `address` varchar(55) NOT NULL,
  `city` varchar(35) NOT NULL,
  `state` varchar(35) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `country` varchar(45) NOT NULL,
  `job` varchar(45) NOT NULL DEFAULT 'S/A',
  `id_user` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `offices_managers`
--

INSERT INTO `offices_managers` (`id_office_manager`, `name`, `lastname`, `phone`, `address`, `city`, `state`, `postal_code`, `country`, `job`, `id_user`) VALUES
(1, 'Linda', 'Mendoza González', '3122567809', 'Calle Nose #3456', 'Colima', 'Colima', '28045', 'Mexico', 'Office Manager', 5),
(2, 'Antonio', 'Llanos Pineda', '3122534857', 'Av. Miguel de la Madrid #3356', 'Manzanillo', 'Colima', '28019', 'Mexico', 'Office Manager', 6),
(3, 'fg', 'fg', 'f', 'gf', 'gf', 'Colima', 'fg', 'fg', 'S/A', 9),
(4, 'adaaad', 'gj', 'glkj', 'h', 'fyui', 'Colima', 'bmncty', 'yg', 'S/A', 10),
(5, 'yu', 'yu', 'yu', 'yu', 'y', 'Colima', 'yu', 'yu', 'S/A', 8),
(6, 'Mike', 'Ramos', '3122983472', '321', 'Villa de Álvarez', 'Colima', '231', 'Mexico', 'Office Manager', 15),
(7, 'Luis Juan', 'Herrera', '18269', 'm,bwwbrw', 'Tecomán', 'Colima', '1231231', 'Mexico', 'S/A', 16);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders`
--

CREATE TABLE `orders` (
  `id_order` int(11) NOT NULL,
  `date_at` varchar(30) NOT NULL,
  `amount` double DEFAULT NULL,
  `coments` varchar(250) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `orders`
--

INSERT INTO `orders` (`id_order`, `date_at`, `amount`, `coments`) VALUES
(1, '10/04/2018 11:03:50 pm', 631000, 'Auto a plazos'),
(2, '04/05/2018 11:03:50 pm', 416900, 'Versa drive automático a plazos'),
(3, '14/04/2018 11:03:50 pm', 526200, 'Auto a plazos'),
(4, '10/06/2018 11:03:50 pm', 421000, 'Altima pagado a plazos'),
(5, '11/06/2018 7:07:56 pm', 373000, 'Kiks bitono a plazos'),
(6, '11/06/2018 7:17:31 pm', 373000, 'Kisk Bitono Apartado con 10mil'),
(7, '11/06/2018 10:07:40 pm', 271300, 'Versa exclusive a plazos'),
(8, '11/06/2018 10:11:44 pm', 201000, 'Versa Drive automático a plazos'),
(9, '11/06/2018 10:15:27 pm', 217900, 'Versa Sense Manual al contado');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders_details`
--

CREATE TABLE `orders_details` (
  `id_order` int(11) NOT NULL,
  `id_vehicle` int(11) NOT NULL,
  `id_customer` int(11) NOT NULL,
  `id_seller` int(11) NOT NULL,
  `id_order_type` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `orders_details`
--

INSERT INTO `orders_details` (`id_order`, `id_vehicle`, `id_customer`, `id_seller`, `id_order_type`) VALUES
(1, 2, 1, 1, 4),
(2, 7, 2, 2, 4),
(3, 11, 3, 2, 2),
(4, 15, 2, 2, 4),
(5, 5, 2, 2, 4),
(6, 5, 3, 2, 3),
(7, 12, 10, 2, 4),
(8, 7, 10, 2, 4),
(9, 8, 12, 2, 2);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `orders_types`
--

CREATE TABLE `orders_types` (
  `id_order_type` int(11) NOT NULL,
  `order_type` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `orders_types`
--

INSERT INTO `orders_types` (`id_order_type`, `order_type`) VALUES
(1, 'Disponible'),
(2, 'Vendido y liquidado'),
(3, 'Apartado'),
(4, 'Vendido a plazos');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payments`
--

CREATE TABLE `payments` (
  `id_payment` int(11) NOT NULL,
  `deposit_amount` double NOT NULL,
  `rest_amount` double NOT NULL,
  `id_order` int(11) NOT NULL,
  `id_payment_status` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `payments`
--

INSERT INTO `payments` (`id_payment`, `deposit_amount`, `rest_amount`, `id_order`, `id_payment_status`) VALUES
(1, 150000, 481000, 1, 3),
(2, 150000, 266900, 2, 3),
(3, 329900, 196300, 3, 3),
(4, 100000, 321000, 4, 3),
(5, 50000, 271000, 4, 3),
(6, 50000, 323000, 5, 3),
(7, 10000, 363000, 6, 3),
(8, 3000, 360000, 6, 3),
(9, 900, 266000, 2, 3),
(10, 500, 265500, 2, 3),
(11, 1500, 321500, 5, 3),
(12, 1000, 264500, 2, 3),
(13, 10000, 261300, 7, 3),
(14, 2000, 199000, 8, 3),
(15, 217900, 0, 9, 1),
(16, 271000, 0, 4, 1),
(17, 100, 321400, 5, 3),
(18, 3000, 261500, 2, 3),
(19, 1000, 320400, 5, 3),
(20, 261300, 0, 7, 1);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `payments_status`
--

CREATE TABLE `payments_status` (
  `id_payment_status` int(11) NOT NULL,
  `payment_status` varchar(35) NOT NULL,
  `details` varchar(55) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `payments_status`
--

INSERT INTO `payments_status` (`id_payment_status`, `payment_status`, `details`) VALUES
(1, 'Liquidado', 'sin comentarios'),
(2, 'Sin pagar', 'sin comentarios'),
(3, 'Pagando', 'sin comentarios');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `sellers`
--

CREATE TABLE `sellers` (
  `id_seller` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `lastname` varchar(50) NOT NULL,
  `phone` varchar(13) NOT NULL,
  `address` varchar(55) NOT NULL,
  `city` varchar(35) NOT NULL,
  `state` varchar(35) NOT NULL,
  `postal_code` varchar(10) NOT NULL,
  `country` varchar(45) NOT NULL,
  `job` varchar(45) DEFAULT 'Seller',
  `id_office_manager` int(11) NOT NULL,
  `id_user` int(11) NOT NULL DEFAULT '1'
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `sellers`
--

INSERT INTO `sellers` (`id_seller`, `name`, `lastname`, `phone`, `address`, `city`, `state`, `postal_code`, `country`, `job`, `id_office_manager`, `id_user`) VALUES
(1, 'Carlos', 'Gastron', '3128906534', 'Centro calle nose #4343', 'Colima', 'Colima', '28023', 'Mexico', 'Seller', 1, 2),
(2, 'Alberto A.', 'Rubio', '3148635543', 'Centro calle nose #3343', 'Manzanillo', 'Colima', '29326', 'Mexico', 'Seller', 2, 4),
(5, 'Alan', 'Sanchez', '1231231232', 'asdasdasczx', 'Colima', 'Colima', '28010', 'Mexico', 'Seller', 1, 3);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stocks`
--

CREATE TABLE `stocks` (
  `id_stock` int(11) NOT NULL,
  `data_at` varchar(30) NOT NULL,
  `id_vehicle` int(11) NOT NULL,
  `id_office` int(11) NOT NULL,
  `cantidad` int(4) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `stocks`
--

INSERT INTO `stocks` (`id_stock`, `data_at`, `id_vehicle`, `id_office`, `cantidad`) VALUES
(1, '02/05/2018 11:03:50 pm', 1, 1, 20),
(2, '02/05/2018 11:13:50 pm', 2, 1, 30),
(3, '02/05/2018 11:23:50 pm', 3, 1, 10),
(4, '02/05/2018 11:33:50 pm', 4, 1, 0),
(5, '02/05/2018 11:43:50 pm', 5, 1, 10),
(6, '25/05/2018 10:23:50 pm', 6, 2, 40),
(7, '25/05/2018 10:33:50 pm', 7, 2, 40),
(8, '25/05/2018 10:37:50 pm', 8, 2, 20),
(9, '25/05/2018 10:43:50 pm', 9, 2, 0),
(10, '25/05/2018 11:03:50 pm', 10, 2, 30),
(11, '25/05/2018 11:05:50 pm', 11, 2, 40),
(12, '25/05/2018 11:15:50 pm', 12, 2, 19),
(13, '25/05/2018 11:25:50 pm', 5, 2, 19),
(14, '25/05/2018 11:35:50 pm', 5, 2, 40),
(15, '25/05/2018 11:40:50 pm', 5, 2, 40),
(20, '08/06/2018 12:03:50 am', 16, 1, 25),
(21, '08/06/2018 12:08:11 am', 13, 1, 100);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `stock_matrix`
--

CREATE TABLE `stock_matrix` (
  `id_stock_matrix` int(11) NOT NULL,
  `id_stock` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `stock_matrix`
--

INSERT INTO `stock_matrix` (`id_stock_matrix`, `id_stock`) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5),
(6, 6),
(7, 7),
(8, 8),
(9, 9),
(10, 10),
(11, 11),
(12, 12);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `users`
--

CREATE TABLE `users` (
  `id_user` int(11) NOT NULL,
  `username` varchar(15) NOT NULL,
  `email` varchar(100) NOT NULL,
  `password` varchar(60) NOT NULL,
  `typeUser` varchar(60) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `users`
--

INSERT INTO `users` (`id_user`, `username`, `email`, `password`, `typeUser`) VALUES
(1, 'root', 'root@root.com', 'root', 'r'),
(2, 'seller1', 'seller1@gmail.com', 'seller1', 's'),
(3, 'seller2', 'seller2@gmail.com', 'seller2', 's'),
(4, 'seller3', 'seller3@gmail.com', 'seller3', 's'),
(5, 'officeman1', 'officeman1@gmail.com', 'officeman1', 'o'),
(6, 'officeman2', 'officeman2@gmail.com', 'officeman2', 'o'),
(7, 'globalman1', 'globalman1@gmail.com', 'globalman1', 'g'),
(8, 'officeman3', 'officeman3@gmail.com', 'officeman3', 'o'),
(9, 'officeman4', 'officeman4@gmail.com', 'officeman4', 'o'),
(10, 'officeman5', 'officeman5@gmail.com', 'officeman5', 'o'),
(11, 'officeman6', 'officeman6@gmail.com', 'officeman6', 'o'),
(12, 'officeman7', 'officeman7@gmail.com', 'officeman7', 'o'),
(13, 'officeman8', 'officeman8@gmail.com', 'officeman8', 'o'),
(14, 'officeman9', 'officeman9@gmail.com', 'officeman9', 'o'),
(15, 'officeman10', 'officeman10@gmail.com', 'officeman10', 'o'),
(16, 'officeman11', 'officeman11@gmail.com', 'officeman11', 'o');

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehicles`
--

CREATE TABLE `vehicles` (
  `id_vehicle` int(11) NOT NULL,
  `name` varchar(35) NOT NULL,
  `details` varchar(250) NOT NULL,
  `id_vehicle_model` int(11) NOT NULL,
  `id_vehicle_status` int(11) NOT NULL,
  `cantidadTotal` int(5) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `vehicles`
--

INSERT INTO `vehicles` (`id_vehicle`, `name`, `details`, `id_vehicle_model`, `id_vehicle_status`, `cantidadTotal`) VALUES
(1, 'KIKS EDICION ESPECIAL DARK LIGHT', 'Sin descripción', 1, 1, 500),
(2, 'KIKS SENSE 5MT', 'Sin descripción', 2, 1, 500),
(3, 'KIKS ADVANCE CVT', 'Sin descripción', 3, 1, 500),
(4, 'KIKS EXCLUSIVE CVT', 'Sin descripción', 4, 1, 500),
(5, 'KIKS BITONO', 'Sin descripción', 5, 1, 500),
(6, 'VERSA DRIVE T/M 1.6L', 'Sin descripción', 6, 1, 500),
(7, 'VERSA DRIVE T/A 1.6L', 'Sin descripción', 7, 1, 500),
(8, 'VERSA SENSE T/M 1.6L', 'No description', 8, 1, 500),
(9, 'VERSA SENSE T/A 1.6L', 'Sin descripción', 9, 1, 500),
(10, 'VERSA ADVANCE T/M 1.6L', 'Sin descripción', 10, 1, 500),
(11, 'VERSA ADVANCE T/A 1.6L', 'Sin descripción', 11, 1, 500),
(12, 'VERSA EXCLUSIVE T/A 1.6L', 'No description', 12, 1, 500),
(13, 'FRONTIER PRO-4X T/A', 'Motor de Diesel', 13, 1, 400),
(14, 'X-TRAIL DELUXE T/A', 'Quemacocos y sensores de aproximación', 18, 1, 150),
(15, 'ALTIMA ADVANCE T/M', 'Sin descripción', 19, 1, 399),
(16, 'TIIDA STANDARD T/A', 'Sin descripción', 20, 1, 205);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehicles_models`
--

CREATE TABLE `vehicles_models` (
  `id_vehicle_model` int(11) NOT NULL,
  `model` varchar(100) NOT NULL,
  `details` varchar(550) NOT NULL,
  `cost` double NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `vehicles_models`
--

INSERT INTO `vehicles_models` (`id_vehicle_model`, `model`, `details`, `cost`) VALUES
(1, 'KIKS EDICION ESPECIAL DARK LIGHT', 'Sin descripción', 374800),
(2, 'KIKS SENSE 5MT', 'Sin descripción', 298000),
(3, 'KIKS ADVANCE CVT', 'Sin descripción', 333300),
(4, 'KIKS EXCLUSIVE CVT', 'Sin descripción', 371800),
(5, 'KIKS BITONO', 'Sin descripción', 373000),
(6, 'VERSA DRIVE T/M 1.6L', 'Sin descripción', 184500),
(7, 'VERSA DRIVE T/A 1.6L', 'Sin descripción', 201000),
(8, 'VERSA SENSE T/M 1.6L', 'No description', 217900),
(9, 'VERSA SENSE T/A 1.6L', 'Sin descripción', 235300),
(10, 'VERSA ADVANCE T/M 1.6L', 'Sin descripción', 237300),
(11, 'VERSA ADVANCE T/A 1.6L', 'Sin descripción', 254900),
(12, 'VERSA EXCLUSIVE T/A 1.6L', 'No description', 271300),
(13, 'FRONTIER PRO-4X T/A', 'Motor de Diesel', 832500),
(18, 'X-TRAIL DELUXE T/A', 'Quemacocos y sensores de aproximación', 999300),
(19, 'ALTIMA ADVANCE T/M', 'Sin descripción', 421000),
(20, 'TIIDA STANDARD T/A', 'Sin descripción', 333800);

-- --------------------------------------------------------

--
-- Estructura de tabla para la tabla `vehicles_status`
--

CREATE TABLE `vehicles_status` (
  `id_vehicle_status` int(11) NOT NULL,
  `status` varchar(35) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

--
-- Volcado de datos para la tabla `vehicles_status`
--

INSERT INTO `vehicles_status` (`id_vehicle_status`, `status`) VALUES
(1, 'Disponible'),
(2, 'Vendido'),
(3, 'Apartado'),
(4, 'Agotado');

--
-- Índices para tablas volcadas
--

--
-- Indices de la tabla `customers`
--
ALTER TABLE `customers`
  ADD PRIMARY KEY (`id_customer`,`id_seller`),
  ADD KEY `id_seller` (`id_seller`);

--
-- Indices de la tabla `globals_managers`
--
ALTER TABLE `globals_managers`
  ADD PRIMARY KEY (`id_global_manager`,`id_user`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `offices`
--
ALTER TABLE `offices`
  ADD PRIMARY KEY (`id_office`,`id_global_manager`,`id_office_manager`),
  ADD KEY `id_global_manager` (`id_global_manager`),
  ADD KEY `id_office_manager` (`id_office_manager`);

--
-- Indices de la tabla `offices_managers`
--
ALTER TABLE `offices_managers`
  ADD PRIMARY KEY (`id_office_manager`,`id_user`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id_order`);

--
-- Indices de la tabla `orders_details`
--
ALTER TABLE `orders_details`
  ADD KEY `id_order` (`id_order`,`id_vehicle`,`id_customer`,`id_seller`,`id_order_type`),
  ADD KEY `orders_details_ibfk_2` (`id_vehicle`),
  ADD KEY `orders_details_ibfk_3` (`id_customer`),
  ADD KEY `orders_details_ibfk_4` (`id_seller`),
  ADD KEY `orders_details_ibfk_5` (`id_order_type`);

--
-- Indices de la tabla `orders_types`
--
ALTER TABLE `orders_types`
  ADD PRIMARY KEY (`id_order_type`);

--
-- Indices de la tabla `payments`
--
ALTER TABLE `payments`
  ADD PRIMARY KEY (`id_payment`,`id_order`,`id_payment_status`),
  ADD KEY `id_order` (`id_order`),
  ADD KEY `id_payment_status` (`id_payment_status`);

--
-- Indices de la tabla `payments_status`
--
ALTER TABLE `payments_status`
  ADD PRIMARY KEY (`id_payment_status`);

--
-- Indices de la tabla `sellers`
--
ALTER TABLE `sellers`
  ADD PRIMARY KEY (`id_seller`,`id_office_manager`,`id_user`),
  ADD KEY `id_office_manager` (`id_office_manager`),
  ADD KEY `id_user` (`id_user`);

--
-- Indices de la tabla `stocks`
--
ALTER TABLE `stocks`
  ADD PRIMARY KEY (`id_stock`,`id_vehicle`,`id_office`),
  ADD KEY `id_vehicle` (`id_vehicle`),
  ADD KEY `id_office` (`id_office`);

--
-- Indices de la tabla `stock_matrix`
--
ALTER TABLE `stock_matrix`
  ADD PRIMARY KEY (`id_stock_matrix`,`id_stock`),
  ADD KEY `id_stock` (`id_stock`);

--
-- Indices de la tabla `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`id_user`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`);

--
-- Indices de la tabla `vehicles`
--
ALTER TABLE `vehicles`
  ADD PRIMARY KEY (`id_vehicle`,`id_vehicle_status`,`id_vehicle_model`),
  ADD KEY `id_vehicle_model` (`id_vehicle_model`),
  ADD KEY `id_vehicle_status` (`id_vehicle_status`);

--
-- Indices de la tabla `vehicles_models`
--
ALTER TABLE `vehicles_models`
  ADD PRIMARY KEY (`id_vehicle_model`);

--
-- Indices de la tabla `vehicles_status`
--
ALTER TABLE `vehicles_status`
  ADD PRIMARY KEY (`id_vehicle_status`);

--
-- AUTO_INCREMENT de las tablas volcadas
--

--
-- AUTO_INCREMENT de la tabla `customers`
--
ALTER TABLE `customers`
  MODIFY `id_customer` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=18;

--
-- AUTO_INCREMENT de la tabla `globals_managers`
--
ALTER TABLE `globals_managers`
  MODIFY `id_global_manager` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de la tabla `offices`
--
ALTER TABLE `offices`
  MODIFY `id_office` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT de la tabla `offices_managers`
--
ALTER TABLE `offices_managers`
  MODIFY `id_office_manager` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT de la tabla `orders`
--
ALTER TABLE `orders`
  MODIFY `id_order` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- AUTO_INCREMENT de la tabla `orders_types`
--
ALTER TABLE `orders_types`
  MODIFY `id_order_type` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT de la tabla `payments`
--
ALTER TABLE `payments`
  MODIFY `id_payment` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `payments_status`
--
ALTER TABLE `payments_status`
  MODIFY `id_payment_status` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT de la tabla `sellers`
--
ALTER TABLE `sellers`
  MODIFY `id_seller` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- AUTO_INCREMENT de la tabla `stocks`
--
ALTER TABLE `stocks`
  MODIFY `id_stock` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=22;

--
-- AUTO_INCREMENT de la tabla `stock_matrix`
--
ALTER TABLE `stock_matrix`
  MODIFY `id_stock_matrix` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT de la tabla `users`
--
ALTER TABLE `users`
  MODIFY `id_user` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `vehicles`
--
ALTER TABLE `vehicles`
  MODIFY `id_vehicle` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT de la tabla `vehicles_models`
--
ALTER TABLE `vehicles_models`
  MODIFY `id_vehicle_model` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT de la tabla `vehicles_status`
--
ALTER TABLE `vehicles_status`
  MODIFY `id_vehicle_status` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Restricciones para tablas volcadas
--

--
-- Filtros para la tabla `customers`
--
ALTER TABLE `customers`
  ADD CONSTRAINT `customers_ibfk_1` FOREIGN KEY (`id_seller`) REFERENCES `sellers` (`id_seller`);

--
-- Filtros para la tabla `globals_managers`
--
ALTER TABLE `globals_managers`
  ADD CONSTRAINT `globals_managers_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Filtros para la tabla `offices`
--
ALTER TABLE `offices`
  ADD CONSTRAINT `offices_ibfk_1` FOREIGN KEY (`id_global_manager`) REFERENCES `globals_managers` (`id_global_manager`),
  ADD CONSTRAINT `offices_ibfk_2` FOREIGN KEY (`id_office_manager`) REFERENCES `offices_managers` (`id_office_manager`);

--
-- Filtros para la tabla `offices_managers`
--
ALTER TABLE `offices_managers`
  ADD CONSTRAINT `offices_managers_ibfk_1` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Filtros para la tabla `orders_details`
--
ALTER TABLE `orders_details`
  ADD CONSTRAINT `orders_details_ibfk_1` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id_order`),
  ADD CONSTRAINT `orders_details_ibfk_2` FOREIGN KEY (`id_vehicle`) REFERENCES `vehicles` (`id_vehicle`),
  ADD CONSTRAINT `orders_details_ibfk_3` FOREIGN KEY (`id_customer`) REFERENCES `customers` (`id_customer`),
  ADD CONSTRAINT `orders_details_ibfk_4` FOREIGN KEY (`id_seller`) REFERENCES `sellers` (`id_seller`),
  ADD CONSTRAINT `orders_details_ibfk_5` FOREIGN KEY (`id_order_type`) REFERENCES `orders_types` (`id_order_type`);

--
-- Filtros para la tabla `payments`
--
ALTER TABLE `payments`
  ADD CONSTRAINT `payments_ibfk_1` FOREIGN KEY (`id_order`) REFERENCES `orders` (`id_order`),
  ADD CONSTRAINT `payments_ibfk_2` FOREIGN KEY (`id_payment_status`) REFERENCES `payments_status` (`id_payment_status`);

--
-- Filtros para la tabla `sellers`
--
ALTER TABLE `sellers`
  ADD CONSTRAINT `sellers_ibfk_1` FOREIGN KEY (`id_office_manager`) REFERENCES `offices_managers` (`id_office_manager`),
  ADD CONSTRAINT `sellers_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `users` (`id_user`);

--
-- Filtros para la tabla `stocks`
--
ALTER TABLE `stocks`
  ADD CONSTRAINT `stocks_ibfk_1` FOREIGN KEY (`id_vehicle`) REFERENCES `vehicles` (`id_vehicle`),
  ADD CONSTRAINT `stocks_ibfk_2` FOREIGN KEY (`id_office`) REFERENCES `offices` (`id_office`);

--
-- Filtros para la tabla `stock_matrix`
--
ALTER TABLE `stock_matrix`
  ADD CONSTRAINT `stock_matrix_ibfk_1` FOREIGN KEY (`id_stock`) REFERENCES `stocks` (`id_stock`);

--
-- Filtros para la tabla `vehicles`
--
ALTER TABLE `vehicles`
  ADD CONSTRAINT `vehicles_ibfk_1` FOREIGN KEY (`id_vehicle_model`) REFERENCES `vehicles_models` (`id_vehicle_model`),
  ADD CONSTRAINT `vehicles_ibfk_2` FOREIGN KEY (`id_vehicle_status`) REFERENCES `vehicles_status` (`id_vehicle_status`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
