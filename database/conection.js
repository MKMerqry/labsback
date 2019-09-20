'use strict'
const dbconfig = require('./config')
const mysql = require('mysql');
module.exports = () =>{
    return mysql.createConnection({
        host: dbconfig.host,
        user: dbconfig.user,
        password: dbconfig.password,
        database: dbconfig.database
    })
}