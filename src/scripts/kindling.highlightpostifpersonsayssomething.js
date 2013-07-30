kindling.module(function () {
	'use strict';

	function resetPostBorders(){
		$('#chat-wrapper div').css("border", "");
	}

	function changePostsBorder(wordList, borderStyle){
		if(wordList == "") return;
		
		var words = wordList.split('\n');
		for(var i = 0; i < words.length; i++){
			$('#chat-wrapper div:contains(' + words[i] + ')').css("border", borderStyle);
		}
	}

	function highlightPostIfPersonSaysSomething(e, options, username) {
		
		if(options.highlightPostIfPersonSaysSomething === 'true'){
			changePostsBorder(options.highlightPostWordList, "9px solid red");
		}
		
	}

	function onOptionsChanged(e, options) {

		resetPostBorders();
		
		if(options.highlightPostIfPersonSaysSomething === 'true'){
			changePostsBorder(options.highlightPostWordList, "9px solid red")
		}
	}

	return {
		init: function () {
			$.subscribe('newMessage', highlightPostIfPersonSaysSomething);
			$.subscribe('optionsChanged', onOptionsChanged);
		}
	};
}());
