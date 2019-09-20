'use strict'
const dbconection = require('../../database/conection');

function recipiente_list (req,res){
    const con =dbconection(), linea='Recipiente';    
    con.query('SELECT *, 1 as MKCantidad  FROM articulo WHERE linea=?',[linea],(err,recipientes)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!recipientes) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({recipientes})
                con.end();
            }
        }
    });
}

function recipiente_mov (req,res){
    const con =dbconection(), linea='Recipiente'; 
    var key=req.params.id   
    con.query('SELECT * '+
            'FROM inv a join invd b on a.ID=b.ID '+
            'WHERE 1=1 '+
            'AND a.OrigenModulo=? and a.OrigenID=? ',['VENTA',key],(err,recipientesmov)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!recipientesmov) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({recipientesmov})
                con.end();
            }
        }
    });
}




function recipiente_newmov(req,res){  
    const con =dbconection(), hoy= new Date(),estatus='SINAPLICAR'
    var params=req.body;
    //console.log(params);
    if (params.mov && params.usuario){
        con.query('INSERT INTO inv '+
        '(Empresa, Mov, Sucursal, FechaEmision, Usuario, Moneda, TipoCambio, Estatus, Referencia, Observaciones, Almacen, Embarcar,OrigenModulo, OrigenID) '+
        ' VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ',[params.empresa,params.mov,params.sucursal,hoy, params.usuario,
            params.moneda,params.tipoCambio,estatus,params.referencia,params.observaciones,params.almacen,params.embarcar,'VENTA',params.ventaID],(err,insert,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (insert.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                } else {
                    //res.status(200).send({recipientemov:'El registro se inserto correctamente'});
                    var invID=insert.insertId;
                    var invDetalle =params.detalle;
                    for (let i = 0; i < invDetalle.length; i++) {  
                        con.query('INSERT INTO invd '+
                        '(ID, Articulo, Cantidad, CantidadUnidad, Unidad, Factor) '+
                        ' VALUES   (?, ?, ?, ?, ?, ?) ',[invID,invDetalle[i].Articulo,invDetalle[i].MKCantidad,invDetalle[i].MKCantidad,invDetalle[i].UnidadVenta,1],(err,insertD,fields) => {
                            if (err){
                                res.status(500).send({message:err.sqlMessage});
                            } else {
                                if (insertD.affectedRows===0){
                                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                                } else {
                                    //res.status(200).send({recipientemov:'El registro se inserto correctamente'});
                                    console.log(invDetalle[i].Articulo);
                                    //con.end();
                                }
                            }
                        })
                    } 
                    //CALL spAplicar('34', 'INV', 'APLICAR', 'TODO', '', '1', 0, 0, @vg_OK, @vg_OkMensaje)
                    var query_str = "CALL spAplicar( ?, ?, ?, ?, ?, ?, ?, ?, @vg_OK, @vg_OkMensaje)";
                    con.query(query_str,[invID,'INV', 'APLICAR', 'TODO', '', params.empresa, 0, 0],(err,exec,fields) => {
                        if (err){
                            res.status(500).send({message:err.sqlMessage});
                        } else {
                            if (exec.affectedRows===0){
                                res.status(500).send({message:'Ocurrio un error en la insercion'});
                            } else {
                                //console.log(exec[0][0].vl_OkDesc);
                                //console.log(exec);
                                res.status(200).send({movsalida:'Tipo'+exec[0][0].vl_OkTipo+', Descripcion '+exec[0][0].vl_OkDesc+', '+exec[0][0].vg_OkMensaje});
                                con.end();
                                //console.log('');
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

function recipiente_new(req,res){  
    const con =dbconection(), hoy= new Date()
    var params=req.body;
    if (params.articulo && params.descripcion){
        con.query('INSERT INTO articulo '+
        '(Articulo,Descripcion,Estatus,Tipo,Linea,UnidadVenta) '+
        'VALUES (?, ?, ?, ?, ?,?)',
        [params.articulo,params.descripcion,params.estatus,params.tipo,params.linea,params.unidad],(err,insert,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {

                if (insert.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                } else {
                    res.status(200).send({recipiente:'El registro se inserto correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function recipiente_edit(req,res){  
    const con =dbconection();
    var key=req.params.id; 
    var params=req.body;
    if (params.articulo && params.descripcion){
        con.query('UPDATE articulo '+  
        'SET Descripcion=? Where articulo = ?',[params.descripcion,params.articulo],(err,update,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (update.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la actualizacion'});
                } else {
                    res.status(200).send({recipiente:'El registro se actualizo correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function recipiente_uno (req,res){
    const con =dbconection(), clientetipo='Paciente', clienteestatus='ACTIVO';
    var key=req.params.id;
    
    if (key){
        const linea='Recipiente';    
        con.query('SELECT * FROM articulo WHERE articulo=? and  linea=?',[key,linea],(err,recipiente)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!recipiente) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    res.status(200).send({recipiente})
                    con.end();
                }
            }
        });
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

module.exports={
    recipiente_list,
    recipiente_new,
    recipiente_newmov,
    recipiente_edit,
    recipiente_uno,
    recipiente_mov

};