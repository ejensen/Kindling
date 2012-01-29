kindling.module(function () {
	'use strict';

	function showHideElements(key, value) {
		var $chat = $('#chat-wrapper');
		if (value === 'false' && $chat.hasClass(key) === false) {
			$chat.addClass(key);
		} else if (value === 'true' && $chat.hasClass(key) === true) {
			$chat.removeClass(key);
		}
	}

	function filterMessages(e, options) {
		if (options) {
			showHideElements('noEnterRoom', options.enterRoom);
			showHideElements('noLeaveRoom', options.leaveRoom);
			showHideElements('noTimeStamp', options.timeStamps);
		}
	}

	return {
		init: function () {
			$.subscribe('optionsChanged', filterMessages);
		}
	};
}());
