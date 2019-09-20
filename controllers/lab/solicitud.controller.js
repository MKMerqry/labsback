'use strict'
const dbconection = require('../../database/conection');

function solicitud_list (req,res){
    const con =dbconection(), empresa='1', estatus='APLICADO', movanticipo='INGRESO'
    con.query('SELECT v.*, '+ 
            'concat(ifnull(c.nombre, ""), " " ,ifnull(c.apellidopaterno, ""), " " ,ifnull(c.apellidomaterno, "")) as nombrecontacto, '+ 
            'e.nombre as nombrecontactoentrega, '+
            'c.clientecondicion as condicion, '+
            'u.descripcion as usodescripcion, '+
            'cg.descripcion as descripciongrado, '+ 
            'ci.descripcion as descripcionciclo, '+
            'concat(ifnull(c2.nombre, ""), " " ,ifnull(c2.apellidopaterno, ""), " " ,ifnull(c2.apellidomaterno, "")) as nombrealumno, '+
            'concat(trim(ag.nombre)," ",ifnull(trim(ag.apellidopaterno),"")," ",ifnull(trim(ag.apellidomaterno),"")) as vendedornombre, '+
            'bco.ID as BancoID, '+
            '(select Sum(bbb.Importe) '+
                'from movrastreo aaa  '+
                'join bc bbb on aaa.DID=bbb.ID '+
                'where 1=1  '+
                'and aaa.OID=bco.ID '+
                'and aaa.DMov=?  '+
                'and aaa.Cancelado=0)  as Anticipo '+
            'FROM venta v '+
            'left outer join contacto c on v.contacto = c.contacto '+
            'left outer join contacto c2 on v.alumno = c2.contacto '+
            'left outer join contactoentrega e on v.contacto = e.contacto and v.contactoentrega = e.numero '+
            'left outer join usocomprobante u on v.uso = u.uso '+
            'left outer join cenivelgrado cg on cg.grado = v.grado and v.nivel = cg.nivel '+
            'left outer join ceciclo ci on ci.ciclo = v.ciclo '+
            'left outer join contacto ag on v.vendedor = ag.contacto '+
            'left outer join bc bco on v.mov = bco.mov AND  v.folio = bco.folio and  v.empresa = bco.empresa and  v.sucursal = bco.sucursal '+
            'WHERE v.Empresa=? '+
            'AND v.Estatus=?'+
            'ORDER BY v.id DESC',[movanticipo,empresa,estatus],(err,solicitud)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!solicitud) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({solicitud})
                con.end();
            }
        }
    });
}

function solicitud_new(req,res){  
    console.log('Entro aqui');
    const con =dbconection();
    var hoy= new Date();
    var params=req.body;    
    //recoger parametros de peticion
     console.log(params);
    if (params.paciente && params.doctor){
        con.query('INSERT INTO venta '+
        '(Concepto,Folio,Descuento,DescuentoPorc,DescuentoImporte,Importe,Impuestos, Observaciones, Referencia, Empresa, Contacto, Mov, Sucursal, FechaEmision, Usuario, Moneda, TipoCambio, Estatus, Almacen, ListaPrecios, Vendedor, WFEstado) '+//,   Almacen, Vendedor, ListaPrecios, CentroCostos, WFEstado, ZonaImpuesto, Embarcar, Uso, Credito,Importe,Impuestos) '+
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',[params.concepto,params.folio,'Descuento',params.descuentopct,params.descuentoimp,params.importe,params.impuesto,params.observaciones,params.referencia,params.empresa,params.paciente,params.mov, params.sucursal, hoy, params.usuario, params.moneda, params.tipocambio, params.estatus,params.almacen,params.listaprecio,params.doctor,'Comprobante'],(err,insert,fields) => {
            // contacto, almacen, vendedor, listaprecios, centrocostos, wfestado, zonaimpuesto, embarcar, uso, credito,importe,impuestos            
        //, , ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?,?) '
            if (err){
                //console.log(err);
                res.status(500).send({message:err.sqlMessage});
            } else {
                //console.log(insert);
               // console.log('insert');
                if (insert.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                } else {
                   // console.log(insert);
                    var ventaID=insert.insertId;
                    var ventaD =params.detalle;
                    var ventaP= params.pago;
                    //console.log(ventaP);
                    //console.log(ventaD);
                    for (let i = 0; i < ventaD.length; i++) {                                        
                        //console.log(i);
                        //web_speed,web_ventaID,web_art,web_cant,web_almacen,web_precio,web_listaPrecio,web_empresa,web_impuesto1,web_moneda,web_tipocambio
                        var speed=con.threadId
                        con.query('CALL sp_web_insert_artkit (?,?,?,?,?,?,?,?,?,?,?,?); ',[speed,ventaID,ventaD[i].Articulo,ventaD[i].MKCantidad,params.almacen,ventaD[i].PrecioBruto,params.listaprecio,params.empresa,ventaD[i].Impuesto1,params.moneda,params.tipocambio,ventaD[i].MKDescuento],(err,insertd,fields) => {
                            if (err){
                                res.status(500).send({message:err.sqlMessage});
                            } else {
                                if (insertd.affectedRows===0){
                                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                                } else {
                                    //res.status(200).send({solicitud:'la nota se genero con el ID'});
                                    //con.end();
                                    console.log('articulos detalle insertadas');
                                }
                            }
                        })                        
                    }    

                    var mk_FormaPagoCobro='';
                    var mk_Moneda='';
                    var mk_TipoCambio='';
                    var mk_ImporteAplica='';
                    var mk_Importe='';

                    for (let i = 0; i < ventaP.length; i++) {                    
                        console.log(i);
                        mk_FormaPagoCobro='';
                        mk_Moneda='';
                        mk_TipoCambio='';
                        mk_ImporteAplica='';
                        mk_Importe='';

                        if (ventaP[i].formapago=='Dolares') {
                            mk_FormaPagoCobro=ventaP[i].formapago;
                            mk_Moneda='Dolares';
                            mk_TipoCambio=ventaP[i].tipocambio;
                            mk_ImporteAplica=ventaP[i].importe*ventaP[i].tipocambio;
                            mk_Importe=ventaP[i].importe;
                        } else {
                            mk_FormaPagoCobro=ventaP[i].formapago;
                            mk_Moneda='Pesos';
                            mk_TipoCambio='1';
                            mk_ImporteAplica=ventaP[i].importe;
                            mk_Importe=ventaP[i].importe;
                        }
                        con.query('INSERT INTO ventaformapagocobro '+
                        '(ID, Importe, FormaPagoCobro,  Referencia, Moneda, TipoCambio, ImporteAplica) '+
                         'VALUES (?,?,?,?,?,?,?)',[ventaID,mk_Importe,mk_FormaPagoCobro,ventaP[i].referencia,mk_Moneda,mk_TipoCambio,mk_ImporteAplica],(err,insertfp,fields) => {
                            if (err){
                                res.status(500).send({message:err.sqlMessage});
                            } else {
                                if (insertfp.affectedRows===0){
                                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                                } else {
                                    //res.status(200).send({solicitud:'la nota se genero con el ID'});
                                    //con.end();
                                    console.log('formas de pago insertadas');
                                }
                            }
                        })
                    }    
                    con.query('INSERT INTO ventaimporte '+
                    '(ID, CuentaBanco,Cajero,Cambio) '+
                     'VALUES (?,?,?,?)',[ventaID,'CJ-R01',params.doctor,0],(err,insertvi,fields) => {
                        if (err){
                            res.status(500).send({message:err.sqlMessage});
                        } else {
                            if (insertvi.affectedRows===0){
                                res.status(500).send({message:'Ocurrio un error en la insercion'});
                            } else {
                                //res.status(200).send({solicitud:'la nota se genero con el ID'});
                                //con.end();
                                console.log('Caja y Cajero  insertadas');
                            }
                        }
                    })
                    
                    // web_ventaID, 'VENTA', 'APLICAR', 'TODO', '', '1', 0, 0, NULL, NULL ; SELECT @vg_OK, @vg_OkMensaje
                    var query_str = "CALL spAplicar( ?, ?, ?, ?, ?, ?, ?, ?, @vg_OK, @vg_OkMensaje)";
                    con.query(query_str,[ventaID,'VENTA', 'APLICAR', 'TODO', '', params.empresa, 0, 0],(err,exec,fields) => {
                        if (err){
                            res.status(500).send({message:err.sqlMessage});
                        } else {
                            if (exec.affectedRows===0){
                                res.status(500).send({message:'Ocurrio un error en la insercion'});
                            } else {
                                //console.log(exec[0][0].vl_OkDesc);
                                console.log(exec);
                                res.status(200).send({solicitud:'Tipo'+exec[0][0].vl_OkTipo+', Descripcion '+exec[0][0].vl_OkDesc+', '+exec[0][0].vg_OkMensaje});
                                con.end();
                                //console.log('');
                            }
                        }
                    })
                    //res.status(200).send({solicitud:'El registro se actualizo correctamente'});
                    //con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function solicitud_edit(req,res){  
    const con =dbconection();
    var key=req.params.paciente; 
    var params=req.body;
    if (params.paciente && params.nombre){
        con.query('UPDATE contacto '+  
        'SET Nombre=?, ApellidoPaterno=?, ApellidoMaterno=?, Email=? ,Edad=?,Sexo=? WHERE Contacto=?',[params.nombre, params.paterno, params.materno, params.email, params.edad, params.sexo, key],(err,update,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (update.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la actualizacion'});
                } else {
                    res.status(200).send({paciente:'El registro se actualizo correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function solicitud_uno (req,res){
    const con =dbconection(), movanticipo='INGRESO'
    //console.log('aqui');
    //console.log(req.params.id);
    //req.params.id
    var key=req.params.id;    
    if (key){
        con.query('SELECT e.Nombre as EmpresaNombre,e.Direccion as EmpresaDireccion,v.FechaEmision,v.Mov,v.Folio, '+
                  'e.CorreoServidorSaliente as EmpresaCorreo,s.Nombre as SucursalNombre,s.Direccion  as SucursalDireccion,v.Referencia, '+
                  'concat(ifnull(c.nombre, ""), " " ,ifnull(c.apellidopaterno, ""), " " ,ifnull(c.apellidomaterno, "")) as ContactoNombre, '+
                  'c.Sexo  as ContactoSexo, c.Edad  as ContactoEdad ,c.Email  as ContactoCorreo ,v.Uso, v.DescuentoImporte, v.Importe, v.Impuestos,bco.Saldo,  '+
                  '((v.Importe + v.Impuestos) - v.DescuentoImporte) as Total, '+
                  'bco.ID as BancoID, '+
                  'concat(trim(ag.nombre)," ",ifnull(trim(ag.apellidopaterno),"")," ",ifnull(trim(ag.apellidomaterno),"")) as vendedornombre, '+  
                  '(select Sum(bbb.Importe) '+
                  'from movrastreo aaa  '+
                  'join bc bbb on aaa.DID=bbb.ID '+
                  'where 1=1  '+
                  'and aaa.OID=bco.ID '+
                  'and aaa.DMov=?  '+
                  'and aaa.Cancelado=0)  as Anticipo, bco.DiotExcluir, bco.Estatus  '+
                  'FROM venta v '+
                  'LEFT JOIN empresa e on v.Empresa = e.Empresa '+
                  'LEFT JOIN sucursal s on v.Sucursal = s.Sucursal '+
                  'LEFT JOIN contacto c on v.Contacto = c.Contacto '+
                  'left join bc bco on v.mov = bco.mov AND  v.folio = bco.folio and  v.empresa = bco.empresa and  v.sucursal = bco.sucursal '+
                  'left join contacto ag on v.vendedor = ag.contacto '+
                  'WHERE v.ID=?',[movanticipo,key],(err,solicitud,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (!solicitud){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    res.status(200).send({solicitud});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function solicitud_unodetalle (req,res){
    const con =dbconection()
    //console.log('aqui');
    //console.log(req.params.id);
    //req.params.id
    var key=req.params.id;    
    if (key){
        con.query('SELECT v.*,a.Descripcion, (v.ImporteD+Impuesto1ImporteD) as TotalD '+
                'FROM ventad v '+
                'JOIN articulo a on v.Articulo = a.Articulo '+
                'WHERE 1=1 '+
                'AND v.Precio > 0 '+
                'AND ID=?',[key],(err,solicitudd,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (!solicitudd){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    res.status(200).send({solicitudd});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

module.exports={
    solicitud_list,
    solicitud_new,
    solicitud_edit,
    solicitud_uno,
    solicitud_unodetalle

};