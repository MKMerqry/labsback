
DROP PROCEDURE IF EXISTS mksp_articulos;
DELIMITER $$
CREATE PROCEDURE mksp_articulos (IN mkEmpresa varchar(50),IN mkListaPrecio varchar(50))
BEGIN
   DECLARE mkValor varchar(255);
   DECLARE mkIngresoID varchar(255);
   

   DECLARE mkcontacto varchar(25);

   DECLARE mkKitRenglonID int;
   DECLARE BanderaCursor INT DEFAULT 0; 
   DECLARE vg_OK varchar(255);
   DECLARE vg_OkMensaje varchar(255);
   
   
   DECLARE mkfolio varchar(255);
   DECLARE mkMov varchar(255);
   DECLARE mksucursal varchar(255);
   
   select valor 
   from empresaconfig 
   where empresa = mkEmpresa
   and Modulo='VENTA' 
   and Configuracion='PrecioImpuestoIncluido'
   into mkValor;
   
   -- PrecioImpuestoIncluido NO
   IF mkValor = 0 THEN
   
       SELECT a.*,
        b.Precio as PrecioBruto, b.Precio+ b.Precio*(a.Impuesto1/100.0)  as PrecioNeto, 1 as MKCantidad, 
        b.Precio+ b.Precio*(a.Impuesto1/100.0) as pxcNeto,
        0 as MKDescuento 
        FROM articulo a 
        LEFT JOIN listapreciosd b ON a.Articulo=b.Articulo 
        WHERE a.Linea in ('Estudio','Paquete') 
        AND a.Estatus='ACTIVO'
        AND b.Lista=mkListaPrecio
        UNION 
        SELECT a.*,
        b.Precio as PrecioBruto, b.Precio+ b.Precio*(a.Impuesto1/100.0)  as PrecioNeto, 1 as MKCantidad, 
        b.Precio+ b.Precio*(a.Impuesto1/100.0) as pxcNeto,
        0 as MKDescuento 
        FROM articulo a 
        LEFT JOIN listapreciosd b ON a.Articulo=b.Articulo 
        WHERE 1=1 
        and a.Articulo='URGE'
        AND a.Estatus='ACTIVO'
        AND b.Lista=mkListaPrecio;
        
    END IF; 
    
   -- PrecioImpuestoIncluido SI
   IF mkValor = 1 THEN
   
        SELECT a.*,
        b.Precio - b.Precio*(a.Impuesto1/100.0) as PrecioBruto,b.Precio  as PrecioNeto, 1 as MKCantidad, 
        b.Precio as pxcNeto,
        0 as MKDescuento 
        FROM articulo a 
        LEFT JOIN listapreciosd b ON a.Articulo=b.Articulo 
        WHERE a.Linea in ('Estudio','Paquete') 
        AND a.Estatus='ACTIVO'
        AND b.Lista=mkListaPrecio
        UNION
        SELECT a.*,
        b.Precio - b.Precio*(a.Impuesto1/100.0) as PrecioBruto,b.Precio  as PrecioNeto, 1 as MKCantidad, 
        b.Precio as pxcNeto,
        0 as MKDescuento 
        FROM articulo a 
        LEFT JOIN listapreciosd b ON a.Articulo=b.Articulo 
        WHERE 1=1 
        and a.Articulo='URGE'
        AND a.Estatus='ACTIVO'
        AND b.Lista=mkListaPrecio;
        
   END IF;  
  
     
END$$
DELIMITER


-- CALL mksp_articulos ('1','General');









