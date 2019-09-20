'use strict'
const dbconection = require('../../database/conection');

function doc_list (req,res){
    const con =dbconection(), AgenteTipo='Doctor', AgenteEstatus='ACTIVO',EsAgente='1'
    con.query('SELECT *, CONCAT(IFNULL(Nombre,"")," ",IFNULL(ApellidoPaterno,"")," ",IFNULL(ApellidoMaterno,"")) AS MKNombre '+
              'FROM contacto '+
              'WHERE 1=1 '+
              'AND AgenteTipo=? '+
              'AND AgenteEstatus =? '+
              'AND EsAgente= ? ',[AgenteTipo,AgenteEstatus,EsAgente],(err,doc)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!doc) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({doc})
                con.end();
            }
        }
    });
}

function doc_new(req,res){  
    const con =dbconection(), cero='0',uno='1',domicilio='DOMICILIO CONOCIDO',guion='-',cp='XXXXX',pais='México',vacio='',
    estatus='ACTIVO',numero='SN',doctor='Doctor',hoy= new Date()
    
    //recoger parametros de peticion
    var params=req.body;
    if (params.contacto && params.nombre){
        con.query('INSERT INTO contacto '+
        '(Contacto, Nombre, ApellidoPaterno, ApellidoMaterno, Direccion, Colonia, Poblacion, Estado, CodigoPostal, Pais, '+
        'RFC, UsoComprobante,Utilizado, Email, RegimenFiscal, EsCliente,EsAgente, ClienteCredito,ClienteEstatus, '+
        'EsProveedor,EsPersonal,NumeroExterior,ClienteLimiteCredito,ClienteVentaConsignacion,UltimoCambio, '+
        'CuentaRelacionada,EsSocioOAccionista,AgenteTipo,ClienteRetencion5PM,ClienteCreditoRelacionado, '+
        'ClienteDiaCorte,ClienteLimiteCredFecha,ContactoPorEmpresa,Edad,Sexo,AgenteEstatus,ClienteTipo) '+ //35
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?)',//35
        [params.contacto,params.nombre,params.paterno,params.materno,domicilio,guion,guion,guion,cp,pais,
        params.rfc,params.usocomprobante,cero,params.correo,'Persona Fisica',cero,uno,cero,params.estatus,
        cero,cero,numero,cero,cero,hoy,cero,cero,doctor,cero,cero,uno,cero,cero,'','',params.estatus,null],(err,insert,fields) => { //35
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {

                if (insert.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la insercion'});
                } else {
                    res.status(200).send({paciente:'El registro se inserto correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function doc_edit(req,res){  
    const con =dbconection();
    var key=req.params.id; 
    var params=req.body;
    console.log(key);
    console.log(params);

    if (params.contacto && params.nombre){
        con.query('UPDATE contacto '+  
        'SET Nombre=?, ApellidoPaterno=?, ApellidoMaterno=?, UsoComprobante=? ,Email=? , RFC=? WHERE Contacto=?',[params.nombre, params.paterno, params.materno, params.usocomprobante,params.correo, params.rfc, key],(err,update,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (update.affectedRows===0){
                    res.status(500).send({message:'Ocurrio un error en la actualizacion'});
                } else {
                    res.status(200).send({doc:'El registro se actualizo correctamente'});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}

function doc_uno (req,res){
    const con =dbconection(), AgenteTipo='Doctor', AgenteEstatus='ACTIVO',EsAgente='1'
    var key=req.params.id;   
    console.log(key) ;
    if (key){
        con.query('SELECT * '+
        'FROM contacto '+
        'WHERE 1=1 '+
        'AND Contacto= ? '+
        'AND AgenteTipo= ? '+
        'AND EsAgente=? '+
        'AND AgenteEstatus= ? ',[key,AgenteTipo,EsAgente,AgenteEstatus],(err,doc,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (!doc){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    res.status(200).send({doc});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}


function doc_getID (req,res){
    const con =dbconection(), clientetipo='Agente'  
    con.query('CALL spJamcoContactoAlta(?, ?); ' ,[clientetipo,'1'],(err,docID,fields) => {

        if (err){
            res.status(500).send({message:err.sqlMessage});
        } else {
            if (!docID){
                res.status(400).send({message:'No se pudo realizar la consulta'});
            } else {
                //console.log(pacienteID)
                res.status(200).send({docID});
                con.end();
            }
        }
    })

}

module.exports={
    doc_list,
    doc_new,
    doc_edit,
    doc_uno,
    doc_getID

};