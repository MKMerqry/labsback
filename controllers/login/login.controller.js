'use strict'
const dbconection = require('../../database/conection');
//  Empresa Lista
function empresa_list (req,res){
    const con =dbconection();
    con.query('SELECT empresa,nombre FROM empresa',(err,empresa)=>{
        if (err) {
            res.status(500).send({message:'La consulta no se pudo realizar'});
        } else {
            if (!empresa) {
                res.status(404).send({message:'No se encontraron registros'});                
            } else {
                res.status(200).send({empresa})
                con.end();
            }
        }
    });    
}
//  sucursal Lista
function sucursal_list (req,res){
    const con =dbconection();

    con.query('select sucursal,nombre from sucursal',(err,sucursal)=>{
        if (err) {
            res.status(500).send({message:'La consulta no se pudo realizar'});
        } else {
            if (!sucursal) {
                res.status(404).send({message:'No se encontraron registros'});                
            } else {
                res.status(200).send({sucursal})
                con.end();
            }
        }
    }); 
    
}
//Login
function login_mq(req,res){
	const con = dbconection();
	var params = req.body;
	var surname = params.surname;
	var password = params.password;
	var empresa = params.empresa;
	var sucursal = params.sucursal;
    var fechatrabajo = params.fechatrabajo;

    con.query('SELECT usuario, nombre, email '+
                'FROM usuario '+
                'WHERE usuario=? '+
                'AND contrasena=?',[surname,password],(err,user)=>{

            if (err){                
				res.status(500).send({message:'Error al comprobar el usuario'})
			} else  {                
				if (!user){                    
                    res.status(400).send({message:'El usuario o el password son incorrectos'});
                } else {
                    console.log(user);
                    res.status(200).send(user);		
                    con.end();					
					console.log('shalom');
                }
			}		
        });
        
	}

    function perfil_list (req,res){
        const con =dbconection();
        var perfil_id=req.params.id;
        var modulo='PERFIL';
        //link_id=457;    
        //console.log(plan);
        if (perfil_id){
        var modulo='PERFIL';
            con.query('SELECT * FROM linkmov where Modulo=? and Usuario=? Order by IDInterno desc LIMIT 1',[modulo,perfil_id],(err,perfil,fields) => {
    
                if (err){
                    //console.log(err);
                    res.status(500).send({message:err.sqlMessage});
                } else {
                    
                    if (!perfil){
                        res.status(400).send({message:'No se pudo realizar la consulta'});
                    } else {
                        res.status(200).send({perfil});
                        //console.log(perfil);
                        con.end();
                    }
                }
            })
        } else {
            res.status(404).send({message:'la informacion no esta completa'});
        }
    }
    
    // Insertar 
    function perfil_new(req,res){  
        const con =dbconection();
        var params=req.body; 
        var mk_file = req.file.filename;
        var mk_type = req.file.mimetype;   
        var mk_data = null;
        //console.log(req.file);
        if (params.usuario  ){
            con.query('INSERT INTO linkmov '+
            '(ID, Modulo, Nombre, Tipo, Archivo, Nota, Vinculo, Usuario, Fecha,ArchivoDatos ) '+
            'VALUES (?,?,?,?,?,?,?,?,?,?);',[params.renglon,params.modulo,mk_file,mk_type,mk_file,'','',params.usuario,'',mk_data],(err,perfil,fields) => {
                if (err){
                    console.log(err.sqlMessage);
                    res.status(500).send({message:err.sqlMessage});
                } else {
                    if (perfil.affectedRows===0){                            
                        res.status(400).send({message:'No se pudo realizar la insercion'});
                    } else {
                        res.status(200).send({perfil:'Se inserto correctamente'});
                        con.end();
                    }
                }
            })
        } else {
            res.status(404).send({message:'la informacion no esta completa'});
        }
    
    }
    

module.exports={
    empresa_list,
    sucursal_list,
    login_mq,
    perfil_new,
    perfil_list
};