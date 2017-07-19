var ClozeCard = function(text, cloze){
	if(text.indexOf(cloze) === -1) {
		console.log ('you need to have the cloze in your text');
	} else {
		this.text = text;
		this.cloze = cloze;
		this.partial = text.replace(cloze,'');
		this.fulltext = text;
	}
};

module.exports = ClozeCard;

