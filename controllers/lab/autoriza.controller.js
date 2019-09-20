'use strict'
const dbconection = require('../../database/conection');

function autoriza_check(req,res){  
    const con =dbconection();
    var key=req.params.id;    
    //console.log(params);
    //console.log(key);
    con.query('SELECT * '+
                'FROM usuario a '+
                'LEFT JOIN contacto b on a.AgenteOmision=b.Contacto '+
                'WHERE a.Usuario=? ',[key],(err,usuario,fields) => {
        if (err){
            res.status(500).send({message:err.sqlMessage});
        } else {            
            if (!usuario) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({usuario})
                con.end();
            }
        }
    })

}


function autoriza_edit(req,res){  
    const con =dbconection();
    var key=req.params.id; 
    var params=req.body;
    console.log(params);
    console.log(key);

    if (key){
        con.query('UPDATE bc set bc.DiotExcluir=1 where bc.ID=? ',[key],(err,update,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (update.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la actualizacion'});
                } else {
                    res.status(200).send({autoriza:'El registro se actualizo correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'El usuario no puede autorizar'});
    }
}


module.exports={
    autoriza_edit,
    autoriza_check
};