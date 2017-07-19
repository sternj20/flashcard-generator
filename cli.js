var BasicCard = require("./basiccard.js");
var ClozeCard = require("./clozecard.js");

var inquirer = require('inquirer');

inquirer.prompt([
	{
		type:'list',
		name: 'cardType',
		message: 'Choose what kind of flashcard you want to make',
		choices: ['Basic','Cloze']
	},
	{
		type:'input',
		name: 'fullQuestion',
		message: 'Type in the question'
	},
	{
		type:'input',
		name: 'answer',
		message: 'Type in the answer'
	}
])

.then(function (answers) {

	console.log(answers.cardType);
	if(answers.cardType === 'Basic'){
		var newBasicCard = new BasicCard(answers.fullQuestion, answers.answer);
		console.log(newBasicCard);
	} else{
		var newClozeCard = new ClozeCard(answers.fullQuestion, answers.answer);
		console.log(newClozeCard);
	}
});
