var express = require('express');
var router = express.Router();
var multer = require("multer");
var path = require('path');
const crypto = require('crypto');


//----------------- LABORATORIO----------------- 


//upfiles
var upfileCtrl = require('../controllers/lab/upfile.controller');
router.get( '/upfile/list', upfileCtrl.upfile_list);
router.get( '/upfile/:id', upfileCtrl.upfile_uno);
router.get( '/upfiled/:id', upfileCtrl.upfile_listd);
router.get( '/upfileupdate/:id', upfileCtrl.upfile_spupdate);

var storage_upfile = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'cliente/assets/estudios')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
  }
});
var upload_upfile = multer({storage: storage_upfile});
router.post('/upfile/new', upload_upfile.single("file"),upfileCtrl.upfile_new);


//links
var linkCtrl = require('../controllers/lab/link.controller');
var storage_estudios = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'cliente/assets/estudios')
  },
  filename: (req, file, cb) => {
    cb(null, file.fieldname + '-' + Date.now()+ path.extname(file.originalname))
  }
});
var upload_estudios = multer({storage: storage_estudios});

router.post('/link/new', upload_estudios.single("file"),linkCtrl.link_new);
router.get( '/link/:id', linkCtrl.link_list);
router.get( '/linkd/:id', linkCtrl.link_listd);


//CANCELACIO Y REUTILIZACION DE FOLIO
var cancelacionCtrl = require('../controllers/lab/cancelacion.controller');
router.get( '/cancelacion/:id', cancelacionCtrl.cancelacion_uno);
router.get( '/cancelaciones/:id', cancelacionCtrl.cancelacion_list);


//WFEstado
var wfestadoCtrl = require('../controllers/lab/wfestado.controller');
router.put('/wfestado/:id', wfestadoCtrl.wfestado_edit);

//RESULTADO
var resultadoCtrl = require('../controllers/lab/resultado.controller');
router.get( '/resultado/:id', resultadoCtrl.resultado_list);
router.get( '/resultadosp/:id', resultadoCtrl.resultado_listsp);
router.put('/resultado/:id', resultadoCtrl.resultado_edit);

//BANCO
var bancoCtrl = require('../controllers/lab/banco.controller');
router.get( '/banco/:id', bancoCtrl.banco_list);
router.get( '/banco2/:id', bancoCtrl.banco_list2);
router.post('/banco/new', bancoCtrl.banco_new);

//MONEDA
var monedaCtrl = require('../controllers/lab/moneda.controller');
router.get( '/moneda',     monedaCtrl.moneda_list);
router.get( '/moneda/:id', monedaCtrl.moneda_uno);

//FORMA PAGO COBRO
var formapagcobCtrl = require('../controllers/lab/formapagcob.controller');
router.get( '/formapagcob',     formapagcobCtrl.formapagcob_list);
router.post('/formapagcob/new', formapagcobCtrl.formapagcob_new);
router.get( '/formapagcob/:id', formapagcobCtrl.formapagcob_uno);
router.put( '/formapagcob/:id', formapagcobCtrl.formapagcob_edit);

//SOLICITUDES
var solicitudCtrl = require('../controllers/lab/solicitud.controller');
router.get( '/solicitud',     solicitudCtrl.solicitud_list);
router.post('/solicitud/new', solicitudCtrl.solicitud_new);
router.get( '/solicitud/:id', solicitudCtrl.solicitud_uno);
router.put( '/solicitud/:id', solicitudCtrl.solicitud_edit);
router.get( '/solicitudD/:id',solicitudCtrl.solicitud_unodetalle);

//ARTICULO
var artCtrl = require('../controllers/lab/art.controller');
router.get( '/art',     artCtrl.art_list);
router.get( '/art2',     artCtrl.art_list2);
router.post('/art/new', artCtrl.art_new);
router.get( '/art/:id', artCtrl.art_uno);
router.put( '/art/:id', artCtrl.art_edit);
router.get( '/artic',  artCtrl.art_list_topten);
router.get('./arteti:id',  artCtrl.art_etiqueta_lst);


//ESTUDIO
var estudioCtrl = require('../controllers/lab/estudio.controller');
router.get( '/estudio',     estudioCtrl.estudio_list);
router.post('/estudio/new', estudioCtrl.estudio_new);
router.get( '/estudio/:id', estudioCtrl.estudio_uno);
router.put( '/estudio/:id', estudioCtrl.estudio_edit);

//PRUEBA
var pruebaCtrl = require('../controllers/lab/prueba.controller');
router.get( '/prueba',     pruebaCtrl.prueba_list);
router.post('/prueba/new', pruebaCtrl.prueba_new);
router.get( '/prueba/:id', pruebaCtrl.prueba_uno);
router.put( '/prueba/:id', pruebaCtrl.prueba_edit);

//DOC
var docCtrl = require('../controllers/lab/doc.controller');
router.get( '/doc',     docCtrl.doc_list);
router.post('/doc/new', docCtrl.doc_new);
router.get( '/doc/:id', docCtrl.doc_uno);
router.put( '/doc/:id', docCtrl.doc_edit); 
router.get( '/docid', docCtrl.doc_getID); 

//DEPTO
var deptoCtrl = require('../controllers/lab/depto.controller');
router.get( '/depto',     deptoCtrl.depto_list);
router.post('/depto/new', deptoCtrl.depto_new);
router.get( '/depto/:id', deptoCtrl.depto_uno);
router.put( '/depto/:id', deptoCtrl.depto_edit); 

//MUESTRA
var muestraCtrl = require('../controllers/lab/muestra.controller');
router.get( '/muestra',     muestraCtrl.muestra_list);
router.post('/muestra/new', muestraCtrl.muestra_new);
router.get( '/muestra/:id', muestraCtrl.muestra_uno);
router.put( '/muestra/:id', muestraCtrl.muestra_edit); 
router.get( '/muestraeti/:id', muestraCtrl.muestra_etiqueta_lst);


//RECIPIENTE
var recipienteCtrl = require('../controllers/lab/recipiente.controller');
router.get( '/recipiente',     recipienteCtrl.recipiente_list);
router.post('/recipiente/new', recipienteCtrl.recipiente_new);
router.post('/recipiente/newmov', recipienteCtrl.recipiente_newmov);
router.get( '/recipiente/:id', recipienteCtrl.recipiente_uno);
router.put( '/recipiente/:id', recipienteCtrl.recipiente_edit); 
router.get( '/recipientemov/:id', recipienteCtrl.recipiente_mov);


//AUTORIZACION
var autorizaCtrl = require('../controllers/lab/autoriza.controller'); 
router.get('/autoriza/:id', autorizaCtrl.autoriza_check);
router.put('/autoriza/:id', autorizaCtrl.autoriza_edit);


//PACIENTE
var pacienteCtrl = require('../controllers/lab/paciente.controller');
router.get( '/paciente',     pacienteCtrl.paciente_list);
router.post('/paciente/new', pacienteCtrl.paciente_new);
router.get( '/paciente/:id', pacienteCtrl.paciente_uno);
router.put( '/paciente/:id', pacienteCtrl.paciente_edit); 
router.get( '/pacienteid', pacienteCtrl.paciente_getID); 
router.post('/pacienteexpress/new', pacienteCtrl.paciente_newexpress, pacienteCtrl.paciente_new);

//LOGIN
var loginCtrl = require('../controllers/login/login.controller');
router.post('/login',loginCtrl.login_mq);
router.get( '/empresa',loginCtrl.empresa_list);
router.get( '/sucursal',loginCtrl.sucursal_list);


// PERFIL
var perfilCtrl = require('../controllers/login/perfil.controller');
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


/* GET users listing. */
router.get('/merqry', function(req, res, next) {
    res.send('MKSD-BACK PORTAL DE LABORATORIO');
  });
  
  
  module.exports = router;