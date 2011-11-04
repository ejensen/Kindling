(function () {
	var $chat;

 	var highlightName = function (e, options, username) {
 		if (!options || username === '') {
 			return;
 		}

 		$chat = $chat || $('#chat-wrapper');
 		var $messages = $chat.find('div:.body');

 		chromefire.unbindNewMessages();
 		try {
 			var highlightOptions = { className: 'nameHighlight', tagType: 'mark' };
 			$messages.highlightRegex(undefined, highlightOptions);

 			if (options.highlightName === 'true') {
 				$messages.highlightRegex(chromefire.getUsernameRegex(username), highlightOptions);
 			}
 		} catch (err) {
 		} finally {
 			chromefire.bindNewMessages();
 		}
 	};

	$.subscribe('loaded optionsChanged newMessage', highlightName);
})();
