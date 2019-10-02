
  
DROP PROCEDURE IF EXISTS mksp_cancelar;
DELIMITER $$
CREATE PROCEDURE mksp_cancelar (IN mkVentaID int)
BEGIN
   DECLARE mkBancoID varchar(255);
   DECLARE mkIngresoID varchar(255);
   
   DECLARE mkempresa varchar(255);
   DECLARE mkcontacto varchar(25);

   DECLARE mkKitRenglonID int;
   DECLARE BanderaCursor INT DEFAULT 0; 
   DECLARE vg_OK varchar(255);
   DECLARE vg_OkMensaje varchar(255);
   DECLARE mkIDFolios int;
   
   DECLARE mkfolio varchar(255);
   DECLARE mkMov varchar(255);
   DECLARE mksucursal varchar(255);
   
   
  DECLARE mkcorporativo varchar(225);
  DECLARE mkdoctor varchar(225) ;
  DECLARE mkencuesta varchar(225) ;
  DECLARE mkservicio varchar(225);
  DECLARE mkmuestra varchar(225) ;
  DECLARE mkenvio varchar(225) ;
  DECLARE mktiponota varchar(225) ;
   
   
   
   
   
   SELECT Folio ,Empresa, Sucursal, Mov, paciente, corporativo, Vendedor, encuesta, tiposervicio, tomamuestra,envio,tiponota
     FROM venta 
    WHERE ID=mkVentaID
     INTO mkfolio, mkempresa, mksucursal, mkMov, mkcontacto, mkcorporativo, mkdoctor, mkencuesta, mkservicio, mkmuestra, mkenvio,mktiponota;
    

    
   SELECT ID 
   FROM bc 
   WHERE Folio = mkfolio 
   AND Sucursal = mksucursal
   AND Mov='NOTA'
   AND Estatus in ('PENDIENTE','CONCLUIDO')
   INTO mkBancoID;
   
        
   SELECT DID 
   FROM movrastreo
   WHERE OModulo='BC'
   AND OID=mkBancoID
   AND OMov=mkMov
   AND OFolio=mkfolio
   AND DMov='Ingreso'
   INTO mkIngresoID;

-- select mkIngresoID;

  IF mkIngresoID > 0 THEN  
  
      CALL spAplicar(mkIngresoID, 'BC', 'CANCELAR', 'TODO', '', '1', 1, 0, vg_OK, vg_OkMensaje);
--    CALL spAplicar(vl_ID,     'CONT', 'CANCELAR', 'TODO', '', '1', 1, 0, vg_OK, vg_OkMensaje);
  END IF;
  
  IF vg_OK IS NULL THEN
    CALL spAplicar(mkVentaID, 'VENTA', 'CANCELAR', 'TODO', '', '1', 1, 0, vg_OK, vg_OkMensaje);    
  END IF;

  
  IF vg_OkMensaje IS NULL THEN
   UPDATE venta SET Folio=Concat(Folio,'*') WHERE id=mkVentaID;
 
   INSERT INTO mktbl_labfolios (ID,empresa,sucursal,modulo,folio,contacto,corporativo, doctor, encuesta, servicio, muestra,envio,tiponota) 
   VALUES (null,  mkempresa, mksucursal, 'VENTAS', mkfolio,  mkcontacto, mkcorporativo, mkdoctor, mkencuesta, mkservicio, mkmuestra, mkenvio,mktiponota);
 
   
   INSERT INTO mktbl_labfoliosDet (ID,Articulo,Cantidad)
  select last_insert_id(),a.Articulo,a.Cantidad 
  from ventad a 
  join articulo b on a.Articulo = b.Articulo
  WHERE b.Linea in ('Estudio','Paquete') 
  AND b.Estatus='ACTIVO'
  and a.Precio>0
  and a.id=mkVentaID;
   
   
   
    SET vg_OK='';

    SET vg_OkMensaje='El proceso de cancelacion fue exitoso';
    

    
  END IF;
  
  SELECT CONCAT(vg_OK,vg_OkMensaje)  as Mensaje;
      
  
     
END$$
DELIMITER




--   call mksp_cancelar (290)

