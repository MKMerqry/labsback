'use strict'
const dbconection = require('../../database/conection');

function cancelacion_uno (req,res){
    const con =dbconection(); 
    var key=req.params.id;
    console.log(key);
    if (key){
        var query_str = "CALL mksp_cancelar (?);";
        con.query(query_str,[key],(err,cancelacion)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!cancelacion) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    //console.log(cancelacion);
                    res.status(200).send({cancelacion})
                    con.end();
                }
            }
        });
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function cancelacion_list (req,res){
    const con =dbconection(); 
    var key=req.params.id;
    console.log('cabecero',key);
    if (key){
        var query_str = "SELECT * FROM mktbl_labfolios WHERE folio=? ;";
        con.query(query_str,[key],(err,cancelacion)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!cancelacion) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    //console.log(cancelacion);
                    res.status(200).send({cancelacion})
                    con.end();
                }
            }
        });
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function cancelacion_listdet (req,res){
    const con =dbconection(); 
    var key=req.params.id;
    console.log('Detalle',key);
    if (key){
        var query_str = 'Select a.folio,b.* '+
        'from mktbl_labfolios a '+
        'join mktbl_labfoliosDet b on a.ID=b.ID '+
        'where a.Folio=? ;';
        con.query(query_str,[key],(err,cancelaciondet)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!cancelaciondet) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    //console.log(cancelacion);
                    res.status(200).send({cancelaciondet})
                    con.end();
                }
            }
        });
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

module.exports={
    cancelacion_uno,
    cancelacion_list,
    cancelacion_listdet
};