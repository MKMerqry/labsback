'use strict'
const dbconection = require('../../database/conection');

function paciente_list (req,res){
    const con =dbconection();
    const clientetipo='Paciente';
    const clienteestatus='ACTIVO';
    con.query('SELECT *, CONCAT(IFNULL(Nombre,"")," ",IFNULL(ApellidoPaterno,"")," ",IFNULL(ApellidoMaterno,"")) AS MKNombre '+
    'FROM contacto '+
    'WHERE 1=1 '+
    'AND ClienteTipo= ? '+
    'AND ClienteEstatus=? ',[clientetipo,clienteestatus],(err,pacientes)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!pacientes) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({pacientes})
                con.end();
            }
        }
    });
}

function paciente_new(req,res){  
    const con =dbconection(), cero='0',uno='1',domicilio='DOMICILIO CONOCIDO',guion='-',cp='XXXXX',pais='México',vacio='',
    estatus='ACTIVO',numero='SN',doctor='Doctor',hoy= new Date()
    console.log(req.body);
    //recoger parametros de peticion
    var params=req.body;
    if (params.contacto && params.nombre){
        con.query('INSERT INTO contacto '+
        '(Contacto, Nombre, ApellidoPaterno, ApellidoMaterno, Direccion, Colonia, Poblacion, Estado, CodigoPostal, Pais, '+
        'RFC, UsoComprobante,Utilizado, Email, RegimenFiscal, EsCliente,EsAgente, ClienteCredito,ClienteEstatus, EsProveedor, '+
        'EsPersonal,NumeroExterior,ClienteLimiteCredito,ClienteVentaConsignacion,UltimoCambio, CuentaRelacionada,EsSocioOAccionista,AgenteTipo,ClienteRetencion5PM,ClienteCreditoRelacionado, '+
        'ClienteDiaCorte,ClienteLimiteCredFecha,ContactoPorEmpresa,Edad,Sexo,AgenteEstatus,ClienteTipo,Telefono,FechaNacimientoE) '+ //35
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '+
        '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '+
        '?, ?, ?, ?, ?, ?, ?, ?, ?, ?, '+
        '?, ?, ?, ?, ?, ?, ?, ?, ?)',//39
        [params.contacto, params.nombre, params.paterno, params.materno, domicilio, guion, guion, guion, cp, pais,
        'XAXX010101000','G03',cero, params.correo,'Persona Fisica',uno,cero,uno,params.estatus,cero,
        cero,numero,cero,cero,hoy,cero,cero,'',cero,cero,
        uno,cero,cero,params.edad,params.sexo,params.estatus,'Paciente',params.telefono,params.nacimiento],(err,insert,fields) => { //35
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

function paciente_edit(req,res){  
    const con =dbconection();
    var key=req.params.id; 
    var params=req.body;
    console.log(key);
    console.log(params);

    if (params.contacto && params.nombre){
        con.query('UPDATE contacto '+  
        'SET Nombre=?, ApellidoPaterno=?, ApellidoMaterno=?, Email=? ,Edad=?, Sexo=?, FechaNacimientoE=?,Telefono=? WHERE Contacto=?',[params.nombre, params.paterno, params.materno, params.correo, params.edad, params.sexo,params.nacimiento,params.telefono, key],(err,update,fields) => {
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

function paciente_uno (req,res){
    const con =dbconection(), clientetipo='Paciente', clienteestatus='ACTIVO';
    var key=req.params.id;

    
    if (key){
        con.query('SELECT * '+
        'FROM contacto '+
        'WHERE 1=1 '+
        'AND Contacto= ? '+
        'AND ClienteTipo= ? '+
        'AND ClienteEstatus= ? ',[key,clientetipo,clienteestatus],(err,paciente,fields) => {
            if (err){
                res.status(500).send({message:err.sqlMessage});
            } else {
                if (!paciente){
                    res.status(400).send({message:'No se pudo realizar la consulta'});
                } else {
                    res.status(200).send({paciente});
                    con.end();
                }
            }
        })
    } else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}


function paciente_getID (req,res){
    const con =dbconection(), clientetipo='Cliente'  
    con.query('CALL spJamcoContactoAlta(?, ?); ' ,[clientetipo,'1'],(err,pacienteID,fields) => {

        if (err){
            res.status(500).send({message:err.sqlMessage});
        } else {
            if (!pacienteID){
                res.status(400).send({message:'No se pudo realizar la consulta'});
            } else {
                //console.log(pacienteID)
                res.status(200).send({pacienteID});
                con.end();
            }
        }
    })
}

function paciente_newexpress (req,res,next){
    const con =dbconection(), clientetipo='Cliente'  
    con.query('CALL spJamcoContactoAlta(?, ?); ' ,[clientetipo,'1'],(err,pacienteID,fields) => {

        if (err){
            res.status(500).send({message:err.sqlMessage});
        } else {
            if (!pacienteID){
                res.status(400).send({message:'No se pudo realizar la consulta'});
            } else {
                console.log(pacienteID)  
                req.body.contacto=pacienteID[0][0].Clave;
                con.end();
                next(); 
            }
        }
    })

}


module.exports={
    paciente_list,
    paciente_new,
    paciente_edit,
    paciente_uno,
    paciente_getID,
    paciente_newexpress

};