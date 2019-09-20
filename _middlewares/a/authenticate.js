'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var secret='MKSoftwareDevelopers2018@'

exports.ensureAuth=function(req,res,next){
	console.log(req.headers);
	if(!req.headers.authorization){
		return res.status(403).send({message:'la peticion no tiene cabecera de autenticaciónnnn'});
	}

	var token=req.headers.authorization.replace(/['"]+/g,'');
	try{
		var payload=jwt.decode(token, secret);
		if(payload.sub && (payload<=moment().unix())){
			return res.status(401).send({message:'El token ha Expirado'});
		}
	}catch(ex){
		return res.status(401).send({message:'El token no es valido'});

	}

	req.user=payload;
	next();
}