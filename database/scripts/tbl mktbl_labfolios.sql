DROP TABLE `mktbl_labfolios`;

CREATE TABLE `mktbl_labfolios` (
  `ID` mediumint(9) NOT NULL AUTO_INCREMENT,
  `empresa` varchar(225) DEFAULT NULL,
  `sucursal` varchar(225) DEFAULT NULL,
  `modulo` varchar(225) DEFAULT NULL,
  `folio` varchar(225) DEFAULT NULL,
  `tiponota` varchar(225) DEFAULT NULL,
  `tipo` varchar(225) DEFAULT NULL,
  `contacto` varchar(225) DEFAULT NULL,
  `corporativo` varchar(225) DEFAULT NULL,
  `doctor` varchar(225) DEFAULT NULL,
  `encuesta` varchar(225) DEFAULT NULL,
  `servicio` varchar(225) DEFAULT NULL,
  `muestra` varchar(225) DEFAULT NULL,
  `envio` varchar(225) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=27 DEFAULT CHARSET=latin1;

DROP TABLE `mktbl_labfoliosDet`;

CREATE TABLE `mktbl_labfoliosDet` (
  `ID` mediumint(9) NOT NULL,
  `articulo` varchar(225) DEFAULT NULL,
  `cantidad` varchar(225) DEFAULT NULL
)
