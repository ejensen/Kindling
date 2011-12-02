kindling.module(function () {
	'use strict';

	var $chat;

	var highlightName = function (e, options, username) {
		if (!options || username === '') {
			return;
		}

		$chat = $chat || $('#chat-wrapper');
		var $messages = $chat.find('div:.body');

		kindling.unbindNewMessages();
		try {
			var highlightOptions = { className: 'nameHighlight', tagType: 'mark' };
			$messages.highlightRegex(undefined, highlightOptions);

			if (options.highlightName === 'true') {
				$messages.highlightRegex(kindling.getUsernameRegex(username), highlightOptions);
			}
		} catch (err) {
		} finally {
			kindling.bindNewMessages();
		}
	};

	return {
		init: function () {
			$.subscribe('loaded optionsChanged newMessage', highlightName);
		}
	};
}());
