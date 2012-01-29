kindling.module(function () {
	'use strict';

	function highlightName(e, options, username) {
		if (!options || username === '') {
			return;
		}

		var $messages = $('#chat-wrapper').find('div:.body');

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
	}

	return {
		init: function () {
			$.subscribe('loaded optionsChanged newMessage', highlightName);
		}
	};
}());
