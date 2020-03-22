if (typeof navigator.serviceWorker !== 'undefined') {
	navigator.serviceWorker.register('./service-workers.js').then(function(registration) {
		// Si es exitoso
		console.debug('SW registrado correctamente');
	}, function(err) {
		// Si falla
		console.debug('SW error', err);
	});
}

// ---------------- 1. Containers
var wrap_difficulty = document.getElementById('wrap-difficulty');
var list_difficulty = document.getElementById('difficulty');

var wrap_categories = document.getElementById('wrap-categories');
var list_categories = document.getElementById('categories');

var wrap_trivia = document.getElementById('wrap-trivia');
var elemnt_question = document.getElementById('question');
var elemnt_options = document.getElementById('options');
var elemnt_description = document.getElementById('description');

// ---------------- 2. function getQuestions
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

// ---------------- 3. Execute getQuestions
getQuestions().then(function(questions) {

	function showQuestion(bt_difficulty, bt_category) {
			
		// list questions by category
		var list_questions = questions[bt_difficulty][bt_category];

		// random question
		var min = 1;
		var max = list_questions.length;
		var item = Math.floor(Math.random()*(max));
		const question = Object.assign({}, list_questions[item]);

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
			var opt_correct = 0;
			options.forEach((opt, i=0) => {

				if (opt == answer) {
					opt_correct = i;
				}
				i++;

				var li_opt = document.createElement('li');
				var t = document.createTextNode(question[opt]);
				li_opt.appendChild(t);

				// action correct/wrong option
				li_opt.onclick = () => {

					if (opt == answer) {

						li_opt.classList.add('correct');
					} else {
						
						li_opt.classList.add('wrong');
						elemnt_options.childNodes[opt_correct].classList.add('correct');
					}
					
					elemnt_description.innerHTML = description;

					// delete question 
					delete questions[bt_difficulty][bt_category][item];
					questions[bt_difficulty][bt_category] = questions[bt_difficulty][bt_category].filter(Boolean);
				};

				// add option to list options
				elemnt_options.appendChild(li_opt);
			});

			// show container question
			wrap_trivia.classList.remove('hide');
		}
	}

	// ---------------- 4. clear container list difficulty
	list_difficulty.innerHTML = '';

	// ---------------- 5. show list difficulty
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

	// ---------------- 6. listen click event
	var bt_difficulty = '';
	var bt_category = '';
	var current_category = '';

	document.addEventListener('click', function(e) {

		// ---------------- 7. listen click bt difficulty
		if(e.target && e.toElement.className == 'bt-difficulty') {

			// difficulty value
			var _difficulty = e.toElement.innerText;

			// show difficulty value
			var ds = document.getElementsByClassName('difficulty-selected');
			for (let item of ds) {
				item.innerHTML = _difficulty;
			}

			// difficulty value in array questions
			bt_difficulty = 'd_' + _difficulty;
			var categories = Object.keys(questions[bt_difficulty]);
			categories.sort();

			// ---------------- 8. clear container list categories
			list_categories.innerHTML = '';

			// ---------------- 9. set list categories
			categories.forEach(cat => {

				var li_category = document.createElement('li');
				li_category.classList.add('bt-cat');

				var t = document.createTextNode(cat);
				li_category.appendChild(t);
				list_categories.appendChild(li_category);
			});

			// ---------------- 10. show list categories
			wrap_categories.classList.remove('hide');
		}

		// ---------------- 11. listen click bt Category
		if(e.target && e.toElement.className == 'bt-cat') {

			current_category = e.target;

			// category value
			bt_category = e.toElement.innerText;

			if (questions[bt_difficulty][bt_category].length > 0) {

				// show category value
				var ds = document.getElementsByClassName('category-selected');
				for (let item of ds) {
					item.innerHTML = bt_category;
				}

				// ---------------- 12. show question
				showQuestion(bt_difficulty, bt_category);

			} else {
				console.debug('No hay mas preguntas');
				e.target.parentNode.removeChild(e.target);
			}
		}

		// hide section
		if(e.target && e.toElement.className == 'bt-close') {
			e.target.parentNode.parentNode.classList.add('hide');
		}

		// next question
		if(e.target && e.toElement.className == 'bt-next') {

			if (questions[bt_difficulty][bt_category].length > 0) {
			
				showQuestion(bt_difficulty, bt_category);

			} else {

				// remove empty category
				//console.debug('No hay mas preguntas');

				// remove category in list categories
				current_category.parentNode.removeChild(current_category);

				// remove category in objet categories
				delete questions[bt_difficulty][bt_category];

				// hide container question
				wrap_trivia.classList.add('hide');
			}
		}
	});
});