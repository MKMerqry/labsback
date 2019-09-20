'use strict'
const dbconection = require('../../database/conection');

function muestra_list (req,res){
    const con =dbconection();
    const linea='Muestra';

    con.query('SELECT * FROM articulo WHERE linea=?',[linea],(err,muestra)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!muestra) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({muestra})
                con.end();
            }
        }
    });
}


function muestra_etiqueta_lst (req,res){
    const con =dbconection() , Recipiente=''
    var mkID=req.params.id;
    if (mkID) {    
        con.query('SELECT a.ID,a.articulo,a.KitRenglonID,b.descripcion,b.Linea,b.Tipo,b.Categoria,a.RenglonID, b.TipoMuestra,b.Recipiente,b.Metodo,b.TiempoProceso,a.precio '+
                'FROM ventad a '+
                'JOIN articulo b ON a.articulo=b.articulo '+
                'WHERE 1=1 '+
                'and b.Recipiente <> "" and  a.ID=? order by RenglonID;',[mkID],(err,etiqueta)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!etiqueta) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    res.status(200).send({etiqueta})
                    con.end();
                }
            }
        });
    }else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}



function muestra_new(req,res){  
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
                    res.status(200).send({muestra:'El registro se inserto correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function muestra_edit(req,res){  
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
                    res.status(200).send({muestra:'El registro se actualizo correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function muestra_uno (req,res){
    const con =dbconection(), clientetipo='Paciente', clienteestatus='ACTIVO';
    var key=req.params.id;
    
    if (key){
        const linea='Muestra';    
        con.query('SELECT * FROM articulo WHERE articulo=? and  linea=?',[key,linea],(err,muestra)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!muestra) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    res.status(200).send({muestra})
                    con.end();
                }
            }
        });
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}
module.exports={
    muestra_list,
    muestra_new,
    muestra_edit,
    muestra_uno,
    muestra_etiqueta_lst

};