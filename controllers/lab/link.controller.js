'use strict'
var express = require('express');
var cors = require('cors')
var path = require('path');
var stream = require('stream');
const dbconection = require('../../database/conection');

const fs = require("fs");
const readline = require("readline");

//  Empresa Lista
function link_listd (req,res){
    const con =dbconection();
    var link_id=req.params.id;
    //link_id=457;    
    //console.log(plan);
    if (link_id){
        con.query('SELECT * '+
        'FROM linkmov a '+
        'JOIN mktbl_labarchivos b on a.IDInterno=b.linkID '+
        'WHERE a.ID = ? '+
        'AND a.Modulo=? ',[link_id,'VENTAS'],(err,link,fields) => {

            if (err){
                //console.log(err);
                res.status(500).send({message:err.sqlMessage});
            } else {
                //console.log(planact);
                if (!link){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    res.status(200).send({link});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

//  Empresa Lista
function link_list (req,res){
    const con =dbconection();
    var link_id=req.params.id;
    //link_id=457;       
    if (link_id){
        con.query('SELECT * From linkmov Where ID=? order by IDInterno ',[link_id],(err,link,fields) => {

            if (err){
                //console.log(err);
                res.status(500).send({message:err.sqlMessage});
            } else {
                //console.log(planact);
                if (!link){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    res.status(200).send({link});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

// Insertar 
function link_donwload(req,res){ 
  const con =dbconection();
    var link_id=req.params.id;
    if (link_id){
        con.query('SELECT * From linkmov Where IDInterno=? ',[link_id],(err,link,fields) => {

            if (err){                
                res.status(500).send({message:err.sqlMessage});
            } else {                
                if (!link){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    //console.log(link[0].ArchivoDatos);
                    //console.log(link[0].Archivo);
                    //console.log(link[0].Tipo);
                    var fileContents = new Buffer(link[0].ArchivoDatos, "base64");
		            var readStream = new stream.PassThrough();
		            readStream.end(fileContents);		
                    res.set('Content-disposition', 'attachment; filename=' + link[0].Archivo);
                    res.set('Content-Type', link[0].Tipo);
                    readStream.pipe(res);
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }

 
} 

// Insertar 
function link_new(req,res){  
    const con =dbconection();
    var params=req.body;   
    var mk_file = req.file.originalname;
    var mk_type = req.file.mimetype;   
    var mk_data = req.file.buffer;
    var mk_path = req.file.path;
    var linkID=0;  
    var tableID=0;   

    if (params.idventa && params.idbanco ){

        con.query('INSERT INTO linkmov '+
        '(ID, Modulo, Nombre, Tipo, Archivo, Nota, Vinculo, Usuario, Fecha,ArchivoDatos ) '+
        'VALUES (?,?,?,?,?,?,?,?,?,?);',[params.idventa,'VENTAS',mk_file,mk_type,mk_file,'','',params.usuario,params.fecha,mk_data],(err,link,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (link.affectedRows===0){                            
                    res.status(400).send({message:'No se pudo realizar la insercion'});
                } else {

                    linkID = link.insertId;
                    let lector = readline.createInterface({
                        input: fs.createReadStream(mk_path, {encoding: 'binary'})
                       // input: fs.createReadStream(mk_path, {encoding: 'binari'})
                    });

                    lector.on("line", linea => {
                        var mk_linea=linea;
                        var renglon=mk_linea.split("\t");
                        var query_str = "INSERT INTO mktbl_labarchivos (ID,linkID,linea) values (?,?,?) ";
                        //console.log(query_str,mk_linea,linkID);
                        con.query(query_str,[null,linkID, mk_linea],(err,insert,fields) => {
                            if (err){
                                res.status(500).send({message:err.sqlMessage});
                                //console.log(err)
                            } else {
                                    tableID = insert.insertId;
                                    //console.log(tableID);
                                    //console.log('se inserto la fila correctamente');
                                    //console.log("Linea", renglon);
                                    //setTimeout(function () {
                                    for (let i = 0; i < renglon.length; i++) {
                                        var colum=i;
                                        //console.log(colum);
                                        var query_str2 = "UPDATE mktbl_labarchivos SET mk_"+colum.toString()+"=? WHERE ID=? AND linkID=? ";
                                        //console.log(query_str2,renglon[i],tableID,linkID);     
                                        con.query(query_str2,[renglon[i],tableID,linkID],(err,update,fields) => {
                                            if (err){
                                                res.status(500).send({message:err.sqlMessage});
                                                //console.log(err)
                                            } else {                                        
                                                console.log('se actualizo la columna correctamente')
                                            }    
                                        }) 
                                    }  
                            }

                        }) 

                                     
                    })                     
                    setTimeout(function () {
                        res.status(200).send({link:'El archivo subio correctamente'});
                        con.end();
                    }, 9000); 
                }

            }
        })
    } else {
            res.status(404).send({message:'la informacion no esta completa'});
        }
        

}

module.exports={
    link_list,
    link_listd,
    link_new,
    link_donwload,
};






                    


