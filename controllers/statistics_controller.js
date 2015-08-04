var models = require('../models/models.js');

var data;
var errors;
// Inicializamos contadores
data = {
		totalPreguntas: 0,
		totalComentarios: 0,
		mediaPreguntasComentarios: 0,
		nocomentarioPreguntas: 0,
		sicomentarioPreguntas: 0
	};
errors =[];
	

// GET /statistics
exports.show = function(req, res) {
	
	
	// Numero de preguntas:
	models.Quiz.count().then(function(numPreguntas) {
		data.totalPreguntas = numPreguntas;
		console.log("Preguntas: "+data.totalPreguntas);
		return 1;
	}).then(function(cuenta) {
	// Numero de comentarios
		models.Comment.count().then(function(numComentarios) {
			data.totalComentarios = numComentarios;
			console.log("Comentarios: "+data.totalComentarios);
			// Media
			if (data.totalComentarios) { // Si hay comentarios (evitamos division por cero)
				data.mediaPreguntasComentarios = data.totalPreguntas/data.totalComentarios;
				console.log("Media: "+data.mediaPreguntasComentarios);
				}
		})
		return 1;
	})
		
	// Preguntas sin comentarios
	.then(function(cuenta) {
		models.Comment.aggregate('QuizId', 'count', {'distinct': true }).then(function(conComentarios) {
				console.log("Sin Comentarios: "+conComentarios);
				data.sicomentarioPreguntas = conComentarios;
				data.nocomentarioPreguntas = data.totalPreguntas-conComentarios;
			})
		})
	.then(function(cuenta) {
		res.render('statistics/showstatistics', {data: data, errors: errors});
	});
};