'use strict'
const dbconection = require('../../database/conection');

function prueba_list (req,res){
    const con =dbconection(), linea='Determinacion';    
    con.query('SELECT * FROM articulo WHERE linea=?',[linea],(err,prueba)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!prueba) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({prueba})
                con.end();
            }
        }
    });
}

function prueba_new(req,res){  
    const con =dbconection(), hoy= new Date()

    var params=req.body;
    if (params.articulo && params.descripcion){
        con.query('INSERT INTO articulo '+
        '(Articulo,Descripcion,Estatus,Tipo,Linea,UnidadVenta) '+
        'VALUES (?, ?, ?, ?, ?)',
        [params.articulo,params.descripcion,params.estatus,params.tipo,params.linea,params.unidad],(err,insert,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {

                if (insert.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                } else {
                    res.status(200).send({prueba:'El registro se inserto correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function prueba_edit(req,res){  
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
                    res.status(200).send({prueba:'El registro se actualizo correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function prueba_uno (req,res){
    const con =dbconection(), clientetipo='Paciente', clienteestatus='ACTIVO';
    var key=req.params.id;
    
    if (key){
        const linea='Determinacion';    
        con.query('SELECT * FROM articulo WHERE articulo=? and  linea=?',[key,linea],(err,prueba)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!prueba) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    res.status(200).send({prueba})
                    con.end();
                }
            }
        });
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

module.exports={
    prueba_list,
    prueba_new,
    prueba_edit,
    prueba_uno

};