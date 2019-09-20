'use strict'
const dbconection = require('../../database/conection');
const fs = require("fs");
const readline = require("readline");



function upfile_list (req,res){
    const con =dbconection()
    
    con.query('Select * from mk_UpResultado Order by ID ',(err,upfile)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!upfile) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({upfile});
                con.end();
            }
        }
    });
}


//  Empresa Lista
function upfile_listd (req,res){
    const con =dbconection();
    var link_id=req.params.id;
    //link_id=457;    
    console.log(link_id);
    if (link_id){
        con.query('SELECT * '+
        'FROM mk_UpResultado a '+
        'JOIN mktbl_labarchivos b on a.IDInterno=b.linkID '+
        'WHERE a.IDInterno = ? ',[link_id],(err,upfiled,fields) => {

            if (err){
                //console.log(err);
                res.status(500).send({message:err.sqlMessage});
            } else {
                //console.log(planact);
                if (!upfiled){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    res.status(200).send({upfiled});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}



// Insertar 
function upfile_new(req,res){  
    const con =dbconection();
    console.log(req.file);
    var params=req.body;   
    var mk_file = req.file.originalname;
    var mk_type = req.file.mimetype;   
    var mk_data = req.file.buffer;
    var mk_path = req.file.path;
    var mk_fin= false;
    var linkID=0;  
    var tableID=0;  
    console.log(params); 

    if (params.usuario && params.fecha ){
        con.query('INSERT INTO mk_UpResultado '+
        '(ID, Modulo, Nombre, Tipo, Descripcion,  Usuario, Fecha,Estatus ) '+
        'VALUES (?,?,?,?,?,?,?,?);',['666','VENTAS',mk_file,mk_type,params.descripcion,params.usuario,params.fecha,params.estatus],(err,link,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (link.affectedRows===0){                            
                    res.status(400).send({message:'No se pudo realizar la insercion'});
                } else {
                    console.log(link.insertId);
                    linkID = link.insertId;
                    let mkinput= fs.createReadStream(mk_path, {encoding: 'binary',terminal: false});
                    let lector = readline.createInterface({
                        input: mkinput                        
                    });
                    //console.log(lector);

                    setTimeout(() => {
                        res.status(200).send({link:'El registro se actualizo correctamente'});
                        con.end();
                       }, 9000);

                    mkinput.on("end", () => {
                        console.log('************************')
                        mk_fin= true;
                        // res.status(200).send({resultado:'El registro se actualizo correctamente'});
                        // con.end();
                      });

                    lector.on("line", linea => {
                        console.log(mk_fin);


                        var mk_linea=linea;
                        console.log(mk_linea);
                        var renglon=mk_linea.split("\t");
                        console.log(renglon);
                        var query_str = "INSERT INTO mktbl_labarchivos (ID,linkID,linea) values (?,?,?) ";
                        //console.log(query_str,mk_linea,linkID);
                        con.query(query_str,[null,linkID, mk_linea],(err,insert,fields) => {
                            if (err){
                                res.status(500).send({message:err.sqlMessage});
                                //console.log(err)
                            } else {
                                    tableID = insert.insertId;
                                    console.log(insert);

                                    //console.log(tableID);
                                    //console.log('se inserto la fila correctamente');
                                    //console.log("Linea", renglon);
                                    //setTimeout(function () {

                                    for (let i = 0; i < renglon.length; i++) {
                                        var colum=i;
                                        console.log(colum,mk_fin);
                                        var query_str2 = "UPDATE mktbl_labarchivos SET mk_"+colum.toString()+"=? WHERE ID=? AND linkID=? ";
                                           
                                        con.query(query_str2,[renglon[i],tableID,linkID],(err,update,fields) => {
                                            if (err){
                                                res.status(500).send({message:err.sqlMessage});
                                                //console.log(err)
                                            } else {   
                                                 // if (i == renglon.length-1 && mk_fin )  {
                                                    console.log('aqui',mk_fin);
                                                    console.log(query_str2,renglon[i],tableID,linkID);  

                                                //}
                                                   
                                            }    
                                        }) 

                                    }  
                            }

                        })  
 
                        
                    }) 

                }

                // setTimeout(() => {
                //  res.status(200).send({upfiled:'El registro se actualizo correctamente'});
                //  con.end();
                // }, 8000);

            }
        })
    } else {
            res.status(404).send({message:'la informacion no esta completa'});
        }
        

}


function upfile_spupdate (req,res){
    const con =dbconection();
    var link_id=req.params.id;
    //link_id=457;       
    if (link_id){
        con.query('CALL mksp_update_resultados (?) ',[link_id],(err,upfile,fields) => {

            if (err){
                //console.log(err);
                res.status(500).send({message:err.sqlMessage});
            } else {
                //console.log(planact);
                if (!upfile){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    res.status(200).send({upfile});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }

}

function upfile_edit(req,res){  
    const con =dbconection();
    var key=req.params.paciente; 
    var params=req.body;
    if (params.paciente && params.nombre){
        con.query('UPDATE contacto '+  
        'SET Nombre=?, ApellidoPaterno=?, ApellidoMaterno=?, Email=? ,Edad=?,Sexo=? WHERE Contacto=?',[params.nombre, params.paterno, params.materno, params.email, params.edad, params.sexo, key],(err,update,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (update.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la actualizacion'});
                } else {
                    res.status(200).send({paciente:'El registro se actualizo correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}
//  Empresa Lista
function upfile_uno (req,res){
    const con =dbconection();
    var link_id=req.params.id;
    //link_id=457;       
    if (link_id){
        con.query('Select * from mk_UpResultado where IDInterno=? ',[link_id],(err,upfile,fields) => {

            if (err){
                //console.log(err);
                res.status(500).send({message:err.sqlMessage});
            } else {
                //console.log(planact);
                if (!upfile){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    res.status(200).send({upfile});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

module.exports={
    upfile_list,
    upfile_listd,
    upfile_new,
    upfile_edit,
    upfile_uno,
    upfile_spupdate
};