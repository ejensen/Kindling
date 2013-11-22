kindling.module(function () {
	'use strict';

	var UP = 38;
	var DOWN = 40;
	var history = [];
	var historyPosition = 0;

	// This function is called when the options change
	// if the option to disable history is on then it will 
	// no longer respond to the up and down arrow keys
	function toggleHistory(e, options, username, message){
		if(options.disableMessageHistory == 'false'){
			$('#input').keydown(onKeyPress);
		} else{
			$('#input').unbind('keydown',onKeyPress);	
		}
	}

	function addHistory(e, options, username, message) {
		var $message = $(message);
		var messageBody = $message.find('td.body  div.body').html();
		var messageUser = $message.find('td.body h4.inline-author').html();

		if ($message.hasClass('text_message') && messageUser === username) {
			addToHistory(messageBody);
			resetHistoryPosition();
		}
	}

	function addToHistory(text) {
		// if the last item in history is the same as this one
		// dont insert it	
		if (history[history.length -1] !== text) {
			history.push(text);
		}
	}

	// insert into history when this text is not currently in history
	// This is used when a message is being typed, but has not been sent
	// if the user presses an up or down arrow key it will store it in history
	function insertIntoHistory(text,position){
		if(text && history.indexOf(text) == -1) {
			history.splice(position,0,text);
		}
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
		var insertPosition = 0;

		if (keyCode === UP) {
			decrementHistoryPosition();
			insertPosition = historyPosition + 1;
		} else if (keyCode === DOWN) {
			incrementHistoryPosition();
			insertPosition = historyPosition - 1;
		}

		if (keyCode === UP || keyCode === DOWN) {
			if (this.value.substr(0, this.selectionStart).split('\n').length <= 1) {
				var value = getCurrentPosition();
				var oldValue = this.value;
				if (value) {
					this.value = value;
					insertIntoHistory(oldValue,insertPosition);
					e.preventDefault();
				}
			}
		}
	}

	return {
		init: function () {
			$.subscribe('optionsChanged', toggleHistory);
			$.subscribe('newMessage', addHistory);
		}
	};
}());
