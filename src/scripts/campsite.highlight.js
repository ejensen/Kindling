(function () {
	"use strict";

	var $chat;

	var highlightName = function (e, options, username) {
		if (!options || username === '') {
			return;
		}

		$chat = $chat || $('#chat-wrapper');
		var $messages = $chat.find('div:.body');

		campsite.unbindNewMessages();
		try {
			var highlightOptions = { className: 'nameHighlight', tagType: 'mark' };
			$messages.highlightRegex(undefined, highlightOptions);

			if (options.highlightName === 'true') {
				$messages.highlightRegex(campsite.getUsernameRegex(username), highlightOptions);
			}
		} catch (err) {
		} finally {
			campsite.bindNewMessages();
		}
	};

	$.subscribe('loaded optionsChanged newMessage', highlightName);
}());
