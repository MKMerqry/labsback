'use strict'
const dbconection = require('../../database/conection');

function resultado_listsp (req,res){
    const con =dbconection(), empresa='1', sucursal='1', movimiento='Nota',estatusP='Pendiente',estatusC='Concluido'
    var key=req.params.id;
    if (key) {    
        con.query('select * FROM mktbl_venta_lab_resultados WHERE VentaID = ? order by NewOrder ',[key],(err,resultado)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!resultado) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    res.status(200).send({resultado})
                    con.end();
                }
            }
        });
    }else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function resultado_list (req,res){
    const con =dbconection(), empresa='1', sucursal='1', movimiento='Nota',estatusP='Pendiente',estatusC='Concluido'
    var key=req.params.id;
    if (key) {    
        var query_str = "CALL mksp_venta_lab_resultados (?);";
        con.query(query_str,[key],(err,resultado)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!resultado) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    con.query('select a.VentaID as id, a.NewOrder as renglon, a.Articulo, a.Estudio as descripcion, '+
                                'a.ValorCapturado,a.ValorMinimo,a.ValorMaximo,a.ValorTexto,a.Unidad  '+
                                'from mktbl_venta_lab_resultados a '+
                                'join ventad b on VentaID=b.ID and a.Articulo= b.Articulo '+

                                'where 1=1 '+
                               
                                'and b.Precio=? '+
                                'and VentaID=? ',[0,key],(err,resultado)=>{
                        if (err) {
                            res.status(500).send({message:'Ocurrio un error en su consulta'});
                        } else {
                            if (!resultado) {
                                res.status(404).send({message:'la consulta esta vacia'});                
                            } else {
                                res.status(200).send({resultado})
                                con.end();
                            }
                        }
                    });
                }
            }
        });
    }else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}


function resultado_edit(req,res){  
    console.log('params');
    const con =dbconection(), modulo='BC',accion='AVANZAR',base='TODO',movgenerar='Ingreso'
    var hoy= new Date();
    var params=req.body;  
    var key=req.params.id; 
    console.log(params);
    console.log(params.vid);
    if (key){
        var ventaID=key;                    
        var ventaD= params.mkres;
        for (let i = 0; i < ventaD.length; i++) {                    
            //console.log(i);
            //console.log(ventaD.length-1);
            con.query('UPDATE mktbl_venta_lab_resultados '+
                      'SET ValorCapturado=? '+ 
                      'WHERE VentaID=? '+
                      'AND NewOrder=? ',[ventaD[i].ValorCapturado,key,ventaD[i].renglon],(err,updatevd,fields) => {
                if (err){
                    //console.log(err);
                    res.status(500).send({message:err.sqlMessage});
                } else {
                    console.log(updatevd);
                    //if (updatevd.affectedRows===0){
                    //    res.status(500).send({message:'Ocurrio un error en la insercion'});
                    //} else {
                        console.log(ventaD[i].renglon);
                        console.log(updatevd);
                        console.log(i);

                        if (i == ventaD.length-1){
                            res.status(200).send({resultado:'El registro se actualizo correctamente'});
                            con.end();
                        }
                    //}
                }
            })
        }


        
        
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}
module.exports={
   resultado_list,
   resultado_edit,
   resultado_listsp,
};