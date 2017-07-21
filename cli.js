//basic card constructor
var BasicCard = require("./basiccard.js");
//cloze card constructor
var ClozeCard = require("./clozecard.js");
var inquirer = require('inquirer');
var fs = require('fs');

//arrays to store users selected questions 
var basicQuestions = [];
var clozeQuestions = [];

//number of flashcards we are starting with 
var count = 0;

//inquirer prompts
var basicCardQuestions = 	[{
	type:'input',
	name: 'basicQuestion',
	message: 'Type in the question'
},
{
	type:'input',
	name: 'answer',
	message: 'Type in the answer'
}];

var initialPrompt = {
	type:'list',
	name:'quizOrCreate',
	message: 'Do you want to quiz yourself, or create a new set of flashcards?',
	choices: ['Quiz', 'Create New']
};

var secondPrompt = {
	type:'list',
	name: 'basicOrCloze',
	message: 'Do you want to quiz yourself on the basic or cloze set of flashcards?',
	choices: ['Basic', 'Cloze']
};

var flashcardTypeQuestion = 	{
	type:'list',
	name: 'cardType',
	message: 'Choose what kind of flashcard you want to make',
	choices: ['Basic','Cloze']
};

var clozeCardQuestions = 	[{
	type:'input',
	name: 'clozeQuestion',
	message: 'Type in the full question with the answer'
},
{
	type:'input',
	name: 'answer',
	message: 'Type in the answer'
}
];

//recursive function that creates 5 questions
function createBasicQuestion(){
	if(count < 5){
		inquirer.prompt(basicCardQuestions).then(function(answers){
			var newBasicCard = new BasicCard(answers.basicQuestion, answers.answer);
			basicQuestions.push(newBasicCard);
			createBasicQuestion();
		});
		count++;
	} else {
		//once all 5 flashcards are created, adds the flashcards to json file 
		fs.writeFile("basicQuestions.json", JSON.stringify(basicQuestions));
	}
}
//same function as above but for cloze cards
function createClozeQuestion(){
	if(count < 5){
		inquirer.prompt(clozeCardQuestions).then(function(answers){
			var newClozeCard = new ClozeCard(answers.clozeQuestion, answers.answer);
			clozeQuestions.push(newClozeCard);
			createClozeQuestion();
		});
		count++;
	} else {
		fs.writeFile("clozeQuestions.json", JSON.stringify(clozeQuestions));
	}
}
//recursive function that runs the quiz, tqkes in the json file as a parameter and reads from that file
function executeQuiz(file){
	var question;
	var answer;
	fs.readFile(file, "utf8", function(error,data) {
			data = JSON.parse(data);
			if(count<5){
				if(file === 'basicQuestions.json'){
					question = data[count].front;
					answer = data[count].back;
				} else {
					question = data[count].partial;
					answer = data[count].cloze;
				}
				if(error){
					console.log(error);
				} else{
					inquirer.prompt([{
						type: 'input',
						name: 'currentGuess',
						message: question
					}]).then(function(answers){
						if(answers.currentGuess === answer){
							console.log('you guessed right');
						} else {
							console.log('incorrect');
						}
						count++;
						executeQuiz(file);
					});
				}
			}
		});
}

//initial function that asks if the user wants to be quizzed or wants to create flash cards to quiz themselves on
function initFlashcards(){
	inquirer.prompt(initialPrompt).then(function(answers){
		if(answers.quizOrCreate === 'Create New'){
			//creating flash cards
			inquirer.prompt(flashcardTypeQuestion).then(function(answers){
				if (answers.cardType === 'Basic'){
					createBasicQuestion();
				} else {
					createClozeQuestion();
				}
			});
		} else {
			//prompts for user input on which type of card they want to quiz on and then executes corresponding quiz 
			inquirer.prompt(secondPrompt).then(function(answers){
				if(answers.basicOrCloze === 'Basic'){
					executeQuiz("basicQuestions.json");
				} else {
					executeQuiz("clozeQuestions.json");
				}
			});
		}
	});
}

initFlashcards();