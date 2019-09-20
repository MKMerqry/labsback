'use strict'
const dbconection = require('../../database/conection');

function moneda_list (req,res){
    const con =dbconection()
    con.query('SELECT * FROM moneda',[],(err,moneda)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!moneda) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({moneda})
                con.end();
            }
        }
    });
}

function moneda_uno (req,res){
    const con =dbconection()
    var key=req.params.id;
    
    if (key){
        con.query('SELECT * FROM moneda WHERE Moneda=? ',[key],(err,moneda,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (!moneda){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    res.status(200).send({moneda});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

module.exports={
    moneda_list,
    moneda_uno

};