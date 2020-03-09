if (typeof navigator.serviceWorker !== 'undefined') {
	navigator.serviceWorker.register('./service-workers.js').then(function(registration) {
		// Si es exitoso
		console.debug('SW registrado correctamente');
	}, function(err) {
		// Si falla
		console.debug('SW error', err);
	});
}

var wrap_difficulty = document.getElementById('wrap-difficulty');
var list_difficulty = document.getElementById('difficulty');

var wrap_categories = document.getElementById('wrap-categories');
var list_categories = document.getElementById('categories');

var wrap_trivia = document.getElementById('wrap-trivia');
var elemnt_question = document.getElementById('question');
var elemnt_options = document.getElementById('options');
var elemnt_result = document.getElementById('result');
var elemnt_description = document.getElementById('description');

async function getQuestions() {

	// read our JSON
	var misCabeceras = new Headers();

	var miInit = { 
		method: 'GET'
		, headers: misCabeceras
		, mode: 'cors'
		//, mode: 'no-cors'
		, cache: 'default'
	};
	
	let response = await fetch('./data/questions.json', miInit);
	let questions = await response.json();

	return questions;
}

getQuestions().then(function(questions) {

	// clear list difficulty
	list_difficulty.innerHTML = '';

	var difficulty = Object.keys(questions);
	difficulty.sort();

	// show difficulty
	difficulty.forEach(d => {

		var li_difficulty = document.createElement('li');
		li_difficulty.classList.add('bt-difficulty');

		var t = document.createTextNode(d.replace('d_',''));
		li_difficulty.appendChild(t);
		list_difficulty.appendChild(li_difficulty);
	});

	var bt_difficulty = '';
	var bt_category = '';
	var list_questions = '';

	// add click event
	document.addEventListener('click', function(e) {

		// bt difficulty
		if(e.target && e.toElement.className == 'bt-difficulty') {
			//console.debug(e);
			var _difficulty = e.toElement.innerText;

			// set difficulty
			var ds = document.getElementsByClassName('difficulty-selected')[0];
			ds.innerHTML = _difficulty;

			bt_difficulty = 'd_' + _difficulty;
			var categories = Object.keys(questions[bt_difficulty]);
			categories.sort();

			// clear list categories
			list_categories.innerHTML = '';

			// show categories
			categories.forEach(cat => {

				var li_category = document.createElement('li');
				li_category.classList.add('bt-cat');

				var t = document.createTextNode(cat);
				li_category.appendChild(t);
				list_categories.appendChild(li_category);
			});
			wrap_categories.classList.remove('hide');
		}

		// bt Category
		if(e.target && e.toElement.className == 'bt-cat') {
			//console.debug(e.target);
			bt_category = e.toElement.innerText;
			
			// list questions by category
			var list_questions = questions[bt_difficulty][bt_category];

			// random question
			var min = 1;
			var max = list_questions.length;
			var item = Math.floor(Math.random()*(max));
			var question = list_questions[item];

			// show question
			if (typeof question !== 'undefined') {

				// show question
				elemnt_question.innerHTML = question.t;
				delete question.t;
				
				// set description
				var description = question.de;
				elemnt_description.innerHTML = '';
				delete question.de;

				// set answer
				var answer = question.r;
				delete question.r;

				// clear options
				elemnt_options.innerHTML = '';
				
				// show options
				var options = Object.keys(question);
				options.forEach(opt => {

					var li_opt = document.createElement('li');
					var t = document.createTextNode(question[opt]);
					li_opt.appendChild(t);

					// action correct/wrong option
					li_opt.onclick = () => {

						if (opt == answer) {

							li_opt.classList.add('correct');
						} else {
							
							li_opt.classList.add('wrong');
						}
						
						elemnt_description.innerHTML = description;
					};

					// add option to list options
					elemnt_options.appendChild(li_opt);
				});

				// delete question
				delete questions[bt_difficulty][bt_category][item];
				questions[bt_difficulty][bt_category] = questions[bt_difficulty][bt_category].filter(Boolean);

				//
				wrap_trivia.classList.remove('hide');
			}

			// remove empty category
			if (questions[bt_difficulty][bt_category].length == 0) {
				console.debug('No hay mas preguntas');
				e.target.parentNode.removeChild(e.target);
			}
		}

		if(e.target && e.toElement.className == 'bt-close') {
			e.target.parentNode.classList.add('hide');
		}
	});
});