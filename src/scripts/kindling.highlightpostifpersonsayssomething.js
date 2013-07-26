kindling.module(function () {
	'use strict';

	function changePostsBorder(borderStyle){
		$('#chat-wrapper div:contains("something")').css("border", borderStyle);
	}

	function highlightPostIfPersonSaysSomething(e, options, username) {
		
		if(options.highlightPostIfPersonSaysSomething === 'true'){
			changePostsBorder("9px solid red");
		}
		
	}

	function onOptionsChanged(e, options) {
		if(options.highlightPostIfPersonSaysSomething === 'true'){
			changePostsBorder("9px solid red")
		}else{
			changePostsBorder("");
		}
	}

	return {
		init: function () {
			$.subscribe('newMessage', highlightPostIfPersonSaysSomething);
			$.subscribe('optionsChanged', onOptionsChanged);
		}
	};
}());
