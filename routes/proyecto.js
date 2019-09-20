var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require('path');
const crypto = require('crypto');


//----------------- LABORATORIO----------------- 

//PACIENTE
var pacienteCtrl = require('../controllers/lab/paciente.controller');
router.get( '/paciente',     pacienteCtrl.paciente_list);
router.post('/paciente/new', pacienteCtrl.paciente_new);
router.get( '/paciente/:id', pacienteCtrl.paciente_uno);
router.put( '/paciente/:id', pacienteCtrl.paciente_edit); 

//LOGIN
var loginCtrl = require('../controllers/login/login.controller');
router.post('/login',loginCtrl.login_mq);
router.get( '/empresa',loginCtrl.empresa_list);
router.get( '/sucursal',loginCtrl.sucursal_list);


//----------------- LABORATORIO----------------- 



var ayudasCtlr = require('../controllers/ayudas');
var planCtrl = require('../controllers/plan.controller');
var proyCtrl = require('../controllers/proyecto.controller');
var proyplanCtrl = require('../controllers/proyplan.controller');
var proytipoCtrl = require('../controllers/proytipo.controller');
var proyfaseCtrl = require('../controllers/proyfase.controller');
var proytipocatCtrl = require('../controllers/proytipocat.controller');
var proycatCtrl = require('../controllers/proycat.controller');
var proyequipoCtrl = require('../controllers/proyequipo.controller');
var proyeventoCtrl = require('../controllers/proyevento.controller');
var proyplandCtrl = require('../controllers/proypland.controller');
var proyplandfCtrl = require('../controllers/proyplandf.controller');
var planactCtrl = require('../controllers/planact.controller');
var proytrabplanCtrl = require('../controllers/proyectotrabajoplan.controller');
var proydireccionCtrl = require('../controllers/proydireccion.controller');
var proyactlinkCtrl = require ('../controllers/planactlink.controller');
var perfilCtrl = require('../controllers/perfil.controller');
var notificacionCtrl = require('../controllers/notificaciones.controler');

/*AYUDAS EN CAPTURA*/
//router.post('/login', ayudasCtlr.login_mq);
//router.get('/empresa', ayudasCtlr.empresa_list);
//router.get('/sucursal', ayudasCtlr.sucursal_list);
router.get('/contacto',ayudasCtlr.contacto_list);
router.get('/evento',ayudasCtlr.evento_list);
router.post('/evento/new',ayudasCtlr.evento_new);
router.get('/tipo', ayudasCtlr.tipo_list);
router.get('/cp/:id',ayudasCtlr.cp_list);
router.get('/plan',planCtrl.plan_list);
router.get('/proycat',proycatCtrl.proycat_list);
router.get('/proyplan',proyplanCtrl.proyplan_list);
router.post('/proyplan/new',proyplanCtrl.proyplan_new);
router.get('/proyplan/:id',proyplanCtrl.proyplan_uno);
router.put('/proyplan/:id', proyplanCtrl.proyplan_edit); 
router.get('/proy',proyCtrl.proy_list);
router.post('/proy/new',proyCtrl.proy_new);
router.get('/proy/:id',proyCtrl.proy_uno);
router.put('/proy/:id', proyCtrl.proy_edit); 
router.get('/proyequipo/:id',proyequipoCtrl.proyequipo_list);
router.post('/proyequipo/new',proyequipoCtrl.proyequipo_new);
router.get('/proyevento/:id',proyeventoCtrl.proyevento_list);
router.get('/proyeventoreg/:id',proyeventoCtrl.proyevento_reg_list);
router.get('/proyeventoregd/:id',proyeventoCtrl.proyevento_regd_list);
router.post('/proyevento/new',proyeventoCtrl.proyevento_new);
router.get('/proypland/:id',proyplandCtrl.proypland_list);
router.post('/proypland/new',proyplandCtrl.proypland_new);
router.get('/proyplandf',proyplandfCtrl.proyplandf_list);
router.post('/proyplandf/new',proyplandfCtrl.proyplandf_new);
router.get('/proytipo',proytipoCtrl.proytipo_list);
router.post('/proytipo/new',proytipoCtrl.proytipo_new);
router.get('/proytipocat',proytipocatCtrl.proytipocat_list);
router.post('/proytipocat/new',proytipocatCtrl.proytipocat_new);
router.get('/proyfase',proyfaseCtrl.proyfase_list);
router.post('/proyfase/new',proyfaseCtrl.proyfase_new);
router.get('/planact/:id',planactCtrl.planact_list);
router.post('/planact/new',planactCtrl.planact_new);
router.get('/proytrabplan/:id',proytrabplanCtrl.proytrabplan_list);
router.post('/proytrabplan/new',proytrabplanCtrl.proytrabplan_new);

var upload_actfile = multer({ storage: multer.memoryStorage() });
router.post('/planactlink/new', upload_actfile.single("file"),proyactlinkCtrl.planactlink_new);


var storage_perfil = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'cliente/assets/img/users')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
  }
});
var upload_perfil = multer({storage: storage_perfil});
router.post('/perfil/new', upload_perfil.single("file"),perfilCtrl.perfil_new);
router.get('/perfil/:id', perfilCtrl.perfil_list);


router.get('/notificaciones/:id',notificacionCtrl.notificacion_list);
router.put('/notificaciones/:id',notificacionCtrl.notificacion_update);

router.get('/planactlinkdown/:id', proyactlinkCtrl.planactlink_donwload);
router.get('/planactlink/:id',proyactlinkCtrl.planactlink_list);
router.get('/proytrabplanuno/:id',proytrabplanCtrl.proytrabplan_uno);
router.put('/proytrabplan/:id',notificacionCtrl.notificacion_new,proytrabplanCtrl.proytrabplan_edit);
router.get('/proydireccion/:id',proydireccionCtrl.proydirec_list);
router.post('/proydireccion/new',proydireccionCtrl.proydirec_new);
router.get('/proydireccionuno/:id',proydireccionCtrl.proydirec_uno);
router.put('/proydireccion/:id',proydireccionCtrl.proydirec_edit);
router.get('/dasboar',ayudasCtlr.das_list);
router.get('/dasavancefase/:id',ayudasCtlr.das_avancefase);
router.get('/dasruta/:id',ayudasCtlr.das_rutacritica);



/* GET users listing. */
router.get('/merqry', function(req, res, next) {
  res.send('MKSD modulo de proyectos');
});


module.exports = router;