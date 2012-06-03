kindling.module(function () {
	'use strict';

	var HISTORY_LIMIT = 30;
	var HISTORY_PREFIX = 'kc-';

	var isEnabled = false;
	var currentId = 0;
	var tempContent = '';

	function onNewMessage(e, options, username) {
		if (!options || username === '') {
			return;
		}

		kindling.unbindNewMessages();
		try {
			var $insertedMessage = $('#message_pending div.body');
			if ($insertedMessage.length > 0) {
        addCommand($insertedMessage.text());
			}
		} catch (err) {
		} finally {
			kindling.bindNewMessages();
		}
	}

	function addCommand(command) {
		if (!command || command === '') {
			return;
		}

		currentId = 0;

		var lastId = getLastId();
		if (lastId > 0 && localStorage[getPrefix() + lastId] == command) {
			return;
		}

		lastId++;
		localStorage[getPrefix() + lastId] = command;
		localStorage[getPrefix() + 'last-id'] = lastId;
		loop();
	}

	function loop() {
		var idToDelete = getLastId() - HISTORY_LIMIT;
		if (idToDelete > 0 && localStorage[getPrefix() + idToDelete] !== undefined) {
			localStorage.removeItem(getPrefix() + idToDelete);
		}
	}

	function reset() {
		var i = 0;
		var key;
		var keys = [];

		while ((key = localStorage.key(i))) {
			if(key.substr(0, HISTORY_PREFIX.length) === HISTORY_PREFIX) {
				keys.push(key);
			}
  		i++;
  	}

  	for (key in keys) {
			localStorage.removeItem(keys[key]);
		}
	}

	function getLastId() {
		return (localStorage[getPrefix() + 'last-id'] === undefined) ? 0 : localStorage[getPrefix() + 'last-id'];
	}

	function history(event) {
		var lastId = getLastId();
		if (lastId == 0) {
			return;
		}

    switch (event.keyCode) {
      case 38:
      	if (currentId == 0) {
      		tempContent = $('#input').val();
      		currentId = lastId;
      	} else {
      		currentId = (currentId > lastId - HISTORY_LIMIT + 1 && currentId > 1) ? currentId - 1 : currentId;
      	}
      	$('#input').val(localStorage[getPrefix() + currentId]);
        break;

     	case 40:
     		if (currentId == 0) {
     			return;
     		}

     		if (currentId == lastId) {
	      	currentId = 0;
	      	$('#input').val(tempContent);
     		} else {
     			currentId++;
	      	$('#input').val(localStorage[getPrefix() + currentId]);
     		}
	      break;
    }
  }

  function getPrefix() {
  	return HISTORY_PREFIX + kindling.getRoomId(window.location.href) + '-';
  }

	function onOptionsChanged(e, options) {
		if (!options) {
			return;
		}
		var newValue = options.history === 'true';
		if (newValue !== isEnabled) {
			isEnabled = newValue;
			if (isEnabled) {
				$.subscribe('newMessage', onNewMessage);
				$('#input').bind('keydown', history);
			} else {
				$.unsubscribe('newMessage', onNewMessage);
        $('#input').unbind('keydown', history);
				reset();
			}
		}
	}

	return {
		init: function () {
			$.subscribe('loaded optionsChanged', onOptionsChanged);
		}
	};
}());
