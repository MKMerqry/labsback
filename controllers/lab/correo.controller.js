'use strict'
const dbconection = require('../../database/conection');
var nodemailer = require('nodemailer');
var buildHTML = require('../../correo/correo');
// var correo = require('../../config.correo');
var transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
           user: 'hrosales@trustcityint.com',
           pass: 'Dell2019'
       }
   });

   const mailOptions = {
    from: 'hrosales@trustcityint.com', // sender address
    to: 'hrosales@mksoftwaredev.com', // list of receivers
    subject: '' // Subject line
    //html: '<p>Your html here</p>'// plain text body    
  };

function correo_new(req,res){  
    const con =dbconection();    
    //recoger parametros de peticion
  //params=req.body;
  var params=req.body;
  console.log(params);
    if (params.formawfe){
        con.query('INSERT INTO mktbl_correo (Folio) VALUES (?)',['MKFOLIO'],(err,insert,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {

                if (insert.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                } else {                    
                    // Envio de Correo
                    mailOptions.subject= 'Notificacion Proyecto: Prueba'; // Subject line
                    mailOptions.html = buildHTML.getemail('Hector','params.proy','params.fase','params.act');
                    //console.log(mailOptions);
                    transporter.sendMail(mailOptions, function (err, info) {
                        if(err){
                          console.log(err);
                        }
                        else {
                          console.log('Se envio correo',info);                         

                        };
                     });
                    res.status(200).send({correo:'El correo se envio correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}


module.exports={
    correo_new
};