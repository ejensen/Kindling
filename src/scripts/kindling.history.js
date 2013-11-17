kindling.module(function () {
	'use strict';

	var UP = 38;
	var DOWN = 40;
	var history = [];
	var historyPosition = 0;

	function addHistory(e, options, username, message) {
		var $message = $(message);
		var messageBody = $message.find('td.body  div.body').html();
		var messageUser = $message.find('td.body h4.inline-author').html();

		if ($message.hasClass('text_message') && messageUser === username) {
			addToHistory(messageBody);
		}
	}

	function addToHistory(text) {
		// if the last item in history is the same as this one
		// dont insert it	
		if (history[history.length -1] !== text) {
			history.push(text);
		}

		resetHistoryPosition();
	}

	// move to  the end of the history
	function resetHistoryPosition() {
		historyPosition = history.length;
	}

	// move one closer to the start of history
	// but dont go past it
	function decrementHistoryPosition() {
		if (historyPosition > 0) {
			historyPosition--;
		}
	}

	// move one position closer to the end of history
	// allow position to move one past the end of history
	// this allows for the blank entry one past the end 
	// of history
	function incrementHistoryPosition() {
		if (historyPosition < history.length) {
			historyPosition++;
		}
	}

	// If we are one past the end of history
	// return the blank entry
	// otherwise return the current position in 
	// history
	function getCurrentPosition() {
		if (historyPosition === history.length) {
			return '';
		}

		return history[historyPosition];
	}

	function onKeyPress(e) {
		var keyCode = e.keyCode;

		if (keyCode === UP) {
			decrementHistoryPosition();
		} else if (keyCode === DOWN) {
			incrementHistoryPosition();
		}

		if (keyCode === UP || keyCode === DOWN) {
			if (this.value.substr(0, this.selectionStart).split('\n').length <= 1) {
				var value = getCurrentPosition();
				if (value) {
					this.value = value;
					e.preventDefault();
				}
			}
		}
	}

	return {
		init: function () {
			$.subscribe('newMessage', addHistory);
			$('#input').keydown(onKeyPress);
		}
	};
}());
