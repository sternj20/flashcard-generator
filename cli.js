var BasicCard = require("./basiccard.js");
var ClozeCard = require("./clozecard.js");
var inquirer = require('inquirer');
var fs = require('fs');

//arrays to store users selected questions 
var basicQuestions = [];
var clozeQuestions = [];

var count = 0;

var basicCardQuestions = 	[{
	type:'input',
	name: 'basicQuestion',
	message: 'Type in the question'
},
{
	type:'input',
	name: 'answer',
	message: 'Type in the answer'
}
];

var initialPrompt = {
	type:'list',
	name:'quizOrCreate',
	message: 'Do you want to quiz yourself, or create a new set of flashcards?',
	choices: ['Quiz', 'Create New']
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
			console.log(basicQuestions);
			createBasicQuestion();
		});
		count++;
	} else {
		//adds the flashcards to json file 
		fs.writeFile("basicQuestions.json", JSON.stringify(basicQuestions));
	}
}

function createClozeQuestion(){
	if(count < 5){
		inquirer.prompt(clozeCardQuestions).then(function(answers){
			var newClozeCard = new ClozeCard(answers.clozeQuestion, answers.answer);
			clozeQuestions.push(newClozeCard);
			console.log(clozeQuestions);
			createClozeQuestion();
		});
		count++;
	}

}

//ask if the user wants to be quizzed or wants to create flash cards to quiz themselves on
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
		fs.readFile("basicQuestions.json", "utf8", function(error,data) {
			data = JSON.parse(data);
			if(error){
				console.log(error);
			} else{
				data.forEach(function(element){
					console.log(element.front);
				});
			}
		});
	}
});
