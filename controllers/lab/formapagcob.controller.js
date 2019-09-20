'use strict'
const dbconection = require('../../database/conection');

function formapagcob_list (req,res){
    const con =dbconection(), modena='Pesos', pv='1'
    con.query('SELECT * '+
    'FROM formapagocobro f '+
    //'JOIN moneda m ON f.Moneda = m.Moneda '+ f.Moneda = ? modena
    'WHERE 1=1 and f.PV = ? ',[pv],(err,formapagcob)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!formapagcob) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({formapagcob})
                con.end();
            }
        }
    });
}

function formapagcob_new(req,res){  
    const con =dbconection(), cero='0',uno='1',domicilio='DOMICILIO CONOCIDO',guion='-',cp='XXXXX',pais='México',vacio='',
    estatus='ACTIVO',numero='SN',doctor='Doctor',hoy= new Date()
    
    //recoger parametros de peticion
    var params=req.body;
    if (params.paciente && params.nombre){
        con.query('INSERT INTO contacto '+
        '(Contacto, Nombre, ApellidoPaterno, ApellidoMaterno, Direccion, Colonia, Poblacion, Estado, CodigoPostal, Pais, '+
        'RFC, UsoComprobante,Utilizado, Email, RegimenFiscal, EsCliente,EsAgente, ClienteCredito,AgenteEstatus, '+
        'EsProveedor,EsPersonal,NumeroExterior,ClienteLimiteCredito,ClienteVentaConsignacion,UltimoCambio, '+
        'CuentaRelacionada,EsSocioOAccionista,UsoComprobante,AgenteTipo,ClienteRetencion5PM,ClienteCreditoRelacionado, '+
        'ClienteDiaCorte,ClienteLimiteCredFecha,ContactoPorEmpresa,Edad,Sexo) '+
        'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [params.paciente,params.nombre,params.paterno,params.materno,domicilio,guion,guion,guion,cp,pais,
        params.rfc,params.uso,cero,params.email,params.regimen,cero,uno,cero,estatus,
        cero,cero,numero,cero,cero,hoy,cero,cero,vacio,doctor,cero,cero,uno,cero,cero,params.edad,params.sexo],(err,insert,fields) => {
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

function formapagcob_edit(req,res){  
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

function formapagcob_uno (req,res){
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

module.exports={
    formapagcob_list,
    formapagcob_new,
    formapagcob_edit,
    formapagcob_uno

};