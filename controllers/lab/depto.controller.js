'use strict'
const dbconection = require('../../database/conection');

function depto_list (req,res){
    const con =dbconection();
    con.query('SELECT * FROM articulogrupo ',(err,depto)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!depto) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({depto})
                con.end();
            }
        }
    });
}

function depto_new(req,res){  
    const con =dbconection(), hoy= new Date()

    var params=req.body;
    if ( params.depto ){
        con.query('INSERT INTO articulogrupo '+
        '(Grupo,Comanda,Color,ContCuenta) '+
        'VALUES (?, ?, ?, ?)',
        [params.depto,'0',null,null],(err,insert,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {

                if (insert.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                } else {
                    res.status(200).send({depto:'El registro se inserto correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function depto_edit(req,res){  
    const con =dbconection();
    var key=req.params.id; 
    var params=req.body;
    if (params.depto ){
        con.query('UPDATE articulogrupo '+  
        'SET Grupo=? Where Grupo = ?',[params.depto,key],(err,update,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (update.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la actualizacion'});
                } else {
                    res.status(200).send({depto:'El registro se actualizo correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function depto_uno (req,res){
    const con =dbconection()
    var key=req.params.id;
    
    if (key){
         
        con.query('SELECT * FROM articulogrupo where Grupo=?',[key],(err,depto)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!depto) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    res.status(200).send({depto})
                    con.end();
                }
            }
        });
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}


module.exports={
    depto_list,
    depto_new,
    depto_edit,
    depto_uno

};