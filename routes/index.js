var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz', errors: []});
});

// Autoload de comandos con :quizId
router.param('quizId', quizController.load); //autoload :quizId

// Definicion de rutas /quizes
router.get('/quizes', quizController.index);
router.get('/quizes/:quizId(\\d+)', quizController.show);
router.get('/quizes/:quizId(\\d+)/answer', quizController.answer);
router.get('/quizes/new', quizController.new);
router.post('/quizes/create', quizController.create);


router.get('/author', function(req, res) {
	res.render('author', {autores: [{nombre: 'Jose Luis Antelo', urlfoto: '/images/jose.jpg', urlvideo:'/videos/PlayasMallorca.mp4'}, {nombre: 'Enjuto Mojamuto', urlfoto: '/images/enjuto.jpg'}], errors: []});
});


module.exports = router;
