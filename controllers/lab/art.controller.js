'use strict'
const dbconection = require('../../database/conection');

function art_list (req,res){
    const con =dbconection(), lista='General'
    var key=req.params.id;
    console.log('articulos',key)
    con.query('CALL mksp_articulos (?,?)',[key,lista],(err,articulo)=>{
        if (err) {
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!articulo) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                //console.log(articulo);
                res.status(200).send({articulo});
                con.end();
            }
        }
    });
}


function art_etiqueta_lst (req,res){
    const con =dbconection() 
    var mkID=req.params.id;
    if (mkID) {    
        con.query('SELECT a.ID,a.articulo,b.descripcion,b.Linea,b.Tipo,b.Categoria,a.RenglonID, b.TipoMuestra,b.Recipiente,b.Metodo,b.TiempoProceso '+
                'FROM ventad a '+
                'JOIN articulo b ON a.articulo=b.articulo '+
                'WHERE a.ID=? order by RenglonID;',[mkID],(err,etiqueta)=>{
            if (err) {
                res.status(500).send({message:'Ocurrio un error en su consulta'});
            } else {
                if (!etiqueta) {
                    res.status(404).send({message:'la consulta esta vacia'});                
                } else {
                    res.status(200).send({etiqueta})
                    con.end();
                }
            }
        });
    }else {
        res.status(404).send({message:'la informacion no esta completa'});
    }
}



function art_list2 (req,res){
    var key=req.params.id;
    //console.log(key);
    const con =dbconection(), linea1='Estudio', linea2='Paquete', estatus='ACTIVO',lista='General'
    con.query('SELECT b.Articulo, c.Descripcion ,Sum(b.Cantidad ) AS Cantidad '+
    'FROM venta a '+
    'LEFT JOIN ventad b ON  a.Id=b.Id '+
    'left join articulo c on b.Articulo=c.Articulo '+
    'WHERE 1=1 '+
    'AND a.Sucursal=? '+
    'AND c.Linea in ( ?, ? ) '+
    'AND c.Estatus = ? '+
    'AND a.Estatus = ? '+
    'group by b.Articulo,c.Descripcion '+
    'Order by 3 Desc '+
    'Limit 10; ',[key,'Estudio','Paquete','ACTIVO','Aplicado'],(err,articulo)=>{
        if (err) {
            console.log(err);
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!articulo) {
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                res.status(200).send({articulo})
                con.end();
            }
        }
    });
}

function art_list_topten (req,res){
    var key=req.params.id;
    //console.log(key);
    const con =dbconection(), linea1='Estudio', linea2='Paquete', estatusa='ACTIVO',estatusa='General',estatusv='Aplicado'
    con.query('SELECT b.Articulo, c.Descripcion ,Sum(b.Cantidad ) AS Cantidad '+
    'FROM venta a '+
    'LEFT JOIN ventad b ON  a.Id=b.Id '+
    'left join articulo c on b.Articulo=c.Articulo '+
    'WHERE 1=1 '+
    'AND a.Sucursal=? '+
    'AND c.Linea in ( ?, ? ) '+
    'AND c.Estatus = ? '+
    'AND a.Estatus = ? '+
    'group by b.Articulo,c.Descripcion '+
    'Order by 3 Desc '+
    'Limit 10; ',[key,'Estudio','Paquete','ACTIVO','Aplicado'],(err,articulo)=>{
        if (err) {
            console.log(err);
            res.status(500).send({message:'Ocurrio un error en su consulta'});
        } else {
            if (!articulo) {
                console.log(articulo);
                res.status(404).send({message:'la consulta esta vacia'});                
            } else {
                console.log(articulo);
                res.status(200).send({articulo})
                con.end();
            }
        }
    });
}

function art_new(req,res){  
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

function art_edit(req,res){  
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

function art_uno (req,res){
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
    art_list,
    art_new,
    art_edit,
    art_uno,
    art_list_topten,
    art_list2,
    art_etiqueta_lst

};