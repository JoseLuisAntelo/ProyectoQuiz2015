var models = require('../models/models.js');

// Autoload - factoriza el codigo si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
	models.Quiz.find(quizId).then(
		function(quiz) {
			if (quiz) {
				req.quiz = quiz;
				next();
			} else {next(new Error('No existe quizId='+quizId));}
		}
	).catch(function(error) {next(error);});
};

//GET /quizes/:id
exports.show = function (req, res) {
	res.render('quizes/show',{quiz: req.quiz, errors: []});
	};


//GET /quizes/:id/answer
exports.answer = function (req, res) {
	var resultado="Incorrecto";
	if (req.query.respuesta === req.quiz.respuesta) {
		resultado="Correcto";
	}
	res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});

};

// GET /quizes
exports.index = function(req, res) {

// Aquí distinguimos si hay búsqueda o no
	if (req.query.search) {
	// Hay busqueda
		var texto=("%"+req.query.search+"%").replace(/\s+/ig,"%");  // Reemplazamos los espacios en blanco por %
		console.log("Texto a buscar: "+texto);
		models.Quiz.findAll({where:["lower(pregunta) like lower(?)",texto], order: 'pregunta ASC'}).then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
			});
	} else {
	// No hay busqueda
		models.Quiz.findAll().then(function(quizes) {
			res.render('quizes/index.ejs', {quizes: quizes, errors: []});
			})
	};
};

// GET /quizes/new
exports.new = function (req, res) {
	var quiz = models.Quiz.build( //Crea un objeto quiz
		{pregunta:"Pregunta", respuesta:"Respuesta"}
	);
	res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
	var quiz = models.Quiz.build(req.body.quiz);
	// guarda en la DB los campos pregunta y respuesta de quiz
	quiz
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('quizes/new', {quiz: quiz, errors: err.errors});
			} else {
				quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then(function() {res.redirect('/quizes')})
			}
		}); // Redirección HHTP (URL relativo). Lista de preguntas

};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
	var quiz = req.quiz; // Se hace autoload por tener quizId
	res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
	req.quiz.pregunta = req.body.quiz.pregunta;
	req.quiz.respuesta = req.body.quiz.respuesta;
	
	// guarda en la DB los campos pregunta y respuesta de quiz
	req.quiz
	.validate()
	.then(
		function(err) {
			if (err) {
				res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
			} else {
				req.quiz
				.save({fields: ["pregunta", "respuesta"]})
				.then(function() {res.redirect('/quizes')})
			}
		}); // Redirección HHTP (URL relativo). Lista de preguntas

};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
	req.quiz.destroy().then( function() {
		res.redirect('/quizes');
	}).catch(function(error){next(error)});
};