var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});


router.get('/quizes/question', quizController.question);
router.get('/quizes/answer', quizController.answer);

router.get('/author', function(req, res) {
	res.render('author', {autores: [{nombre: 'Jose Luis Antelo', urlfoto: '/images/jose.jpg', urlvideo:'/videos/PlayasMallorca.mp4'}, {nombre: 'Enjuto Mojamuto', urlfoto: '/images/enjuto.jpg'}]});
});


module.exports = router;
