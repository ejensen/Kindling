(function () {
	"use strict";

	var $chat;

	function showHideElements (key, value) {
		$chat = $chat || $('#chat-wrapper');
		if (value === 'false' && $chat.hasClass(key) === false) {
			$chat.addClass(key);
		} else if (value === 'true' && $chat.hasClass(key) === true) {
			$chat.removeClass(key);
		}
	}

	var filterMessages = function (e, options) {
		if (options) {
			showHideElements('noEnterRoom', options.enterRoom);
			showHideElements('noLeaveRoom', options.leaveRoom);
			showHideElements('noTimeStamp', options.timeStamps);
		}
	};

	$.subscribe('optionsChanged', filterMessages);
}());
