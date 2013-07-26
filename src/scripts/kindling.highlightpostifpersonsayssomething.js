kindling.module(function () {
	'use strict';

	function highlightPostIfPersonSaysSomething(e, options, username) {
		
		if (!options || username === '') {
			return;
		}

		$('#chat-wrapper div:contains("something")').css("border","9px solid red");
		
	}

	return {
		init: function () {
			$.subscribe('newMessage', highlightPostIfPersonSaysSomething);
		}
	};
}());
