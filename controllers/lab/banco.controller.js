'use strict'
const dbconection = require('../../database/conection');

function banco_list (req,res){
    const con =dbconection(),  movimiento='Nota',estatusP='Pendiente',estatusC='Concluido', movanticipo='INGRESO'
    var key=req.params.id;
    if (key) {    
        con.query('SELECT a.ID,a.Empresa,a.Mov,a.Sucursal,a.Folio,a.FechaEmision,a.Usuario,a.Moneda, '+
                'a.TipoCambio,a.Estatus, '+
                'a.Referencia,a.Contacto,a.Importe,a.Impuestos,(a.Importe+a.Impuestos) as Total,a.Saldo, '+
                'b.Nombre as UsuarioNombre, '+
                'concat(ifnull(c.nombre, ""), " " ,ifnull(c.apellidopaterno, ""), " " ,ifnull(c.apellidomaterno, "")) as nombrecontacto, '+
                'concat(ifnull(cc.nombre, ""), " " ,ifnull(cc.apellidopaterno, ""), " " ,ifnull(cc.apellidomaterno, "")) as nombredoctor, '+
                'v.ID as VentaID, a.WFEstado, '+
                '(select Sum(bbb.Importe) '+
                'from movrastreo aaa  '+
                'join bc bbb on aaa.DID=bbb.ID '+
                'where 1=1  '+
                'and aaa.OID=a.ID '+
                'and aaa.DMov=?  '+
                'and aaa.Cancelado=0)  as Anticipo '+
                'FROM bc a '+
                'LEFT JOIN venta v on a.Folio=v.Folio and a.Sucursal = v.Sucursal and a.Empresa = v.Empresa '+
                'LEFT JOIN contacto cc ON v.Vendedor=cc.contacto '+
                'LEFT JOIN usuario b on a.Usuario=b.Usuario '+
                'LEFT JOIN contacto c on a.Contacto=c.Contacto '+
                'WHERE 1=1 '+
                'AND a.Sucursal=? '+
                'AND a.Mov=? '+
                'AND a.Estatus in ( ?,? ) '+
                'ORDER BY a.FechaEmision DESC, a.ID DESC;',[movanticipo,key,movimiento,estatusP,estatusC],(err,banco)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!banco) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    res.status(200).send({banco})
                    con.end();
                }
            }
        });
    }else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}


function banco_list2 (req,res){
    const con =dbconection(),  movimiento='Nota',estatusP='Pendiente',estatusC='Concluido'
    var key=req.params.id;
    if (key) {    
        con.query('SELECT a.ID,a.Empresa,a.Mov,a.Sucursal,a.Folio,a.FechaEmision,a.Usuario,a.Moneda, '+
                'a.TipoCambio,a.Estatus, '+
                'a.Referencia,a.Contacto,a.Importe,a.Impuestos,(a.Importe+a.Impuestos) as Total,a.Saldo, '+
                'b.Nombre as UsuarioNombre, '+
                'concat(ifnull(c.nombre, ""), " " ,ifnull(c.apellidopaterno, ""), " " ,ifnull(c.apellidomaterno, "")) as nombrecontacto, '+
                'concat(ifnull(cc.nombre, ""), " " ,ifnull(cc.apellidopaterno, ""), " " ,ifnull(cc.apellidomaterno, "")) as nombredoctor, '+
                'v.ID as VentaID, a.WFEstado '+
                'FROM bc a '+
                'LEFT JOIN venta v on a.Folio=v.Folio and a.Sucursal = v.Sucursal and a.Empresa = v.Empresa '+
                'LEFT JOIN contacto cc ON v.Vendedor=cc.contacto '+
                'LEFT JOIN usuario b on a.Usuario=b.Usuario '+
                'LEFT JOIN contacto c on a.Contacto=c.Contacto '+
                'WHERE 1=1 '+
                'AND a.Sucursal=? '+
                'AND a.Mov=? '+
                'AND a.Estatus in ( ?,? ) '+
                'ORDER BY a.FechaEmision DESC, a.ID DESC LIMIT 10',[key,movimiento,estatusP,estatusC],(err,banco)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!banco) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    res.status(200).send({banco})
                    con.end();
                }
            }
        });
    }else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function banco_new(req,res){  
    const con =dbconection(), modulo='BC',accion='AVANZAR',base='TODO',movgenerar='Ingreso'
    var hoy= new Date();
    var params=req.body;   
    console.log(params);
    console.log(params.bancoID);
    if (params.bancoID){
        var query_str = "CALL spAplicar( ?, ?, ?, ?, ?, ?, ?, ?, @vg_OK, @vg_OkMensaje)";
              con.query(query_str,[params.bancoID,modulo,accion,base, movgenerar,params.empresa,0,0],(err,spAplicar,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (1==98888){
                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                } else {
                    //console.log(spAplicar);
                   // console.log(spAplicar[0][0].vl_IDGenerado);
                    var banco_NuevoID=spAplicar[0][0].vl_IDGenerado;                    
                    var bancoP= params.pago;
                    for (let i = 0; i < bancoP.length; i++) {                    
                       // console.log(i);
                        con.query('INSERT INTO bcformapagocobro '+
                        '(ID, ImporteD, FormaPagoCobro,  Referencia, Moneda, TipoCambio, ImporteAplica) '+
                         'VALUES (?,?,?,?,?,?,?)',[banco_NuevoID,bancoP[i].importe,bancoP[i].formapago,bancoP[i].referencia,params.moneda,params.tipocambio,bancoP[i].importe],(err,insertfp,fields) => {
                            if (err){
                                res.status(500).send({message:err.sqlMessage});
                            } else {
                                if (insertfp.affectedRows===0){
                                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                                } else {
                                    console.log('formas de pago insertadas');
                                }
                            }
                        })
                    }    
                    con.query('UPDATE bc SET CuentaBanco = ? WHERE ID = ? ',[params.ctaBanco,banco_NuevoID],(err,insertcta,fields) => {
                        if (err){
                            res.status(500).send({message:err.sqlMessage});
                        } else {
                            if (insertcta.affectedRows===0){
                                res.status(500).send({message:'Ocurrio un error en la insercion'});
                            } else {
                                console.log('Caja y Cajero  insertadas');
                            }
                        }
                    })
                    
                    // web_ventaID, 'VENTA', 'APLICAR', 'TODO', '', '1', 0, 0, NULL, NULL ; SELECT @vg_OK, @vg_OkMensaje
                    var query_str = "CALL spAplicar( ?, ?, ?, ?, ?, ?, ?, ?, @vg_OK, @vg_OkMensaje)";
                    con.query(query_str,[banco_NuevoID,'BC', 'APLICAR', 'TODO', '', params.empresa, 0, 0],(err,exec,fields) => {
                        if (err){
                            res.status(500).send({message:err.sqlMessage});
                        } else {
                            if (exec.affectedRows===0){
                                res.status(500).send({message:'Ocurrio un error en la insercion'});
                            } else {
                                console.log(exec);
                                res.status(200).send({banco:'Tipo'+exec[0][0].vl_OkTipo+', Descripcion '+exec[0][0].vl_OkDesc+', '+exec[0][0].vg_OkMensaje});
                                con.end();

                            }
                        }
                    })

                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}
module.exports={
   banco_list,
   banco_new,
   banco_list2

};