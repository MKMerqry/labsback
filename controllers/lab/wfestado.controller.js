'use strict'
const dbconection = require('../../database/conection');



function wfestado_edit(req,res){  
    const con =dbconection();
    var key=req.params.id; 
    var params=req.body;
    console.log(params);
    console.log(key);
    if (key){
        con.query('UPDATE bc SET WFEstado=? WHERE id=?',[params.formawfe,key],(err,update,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (update.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la actualizacion'});
                } else {
                    //console.log('aqui')
                    res.status(200).send({wfestado:'El registro se actualizo correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}



module.exports={
    wfestado_edit

};