(function () {
	function showHideElements (key, value) {
		this.$chat = this.$chat || $('#chat-wrapper');
		if (value === 'false' && this.$chat.hasClass(key) === false) {
			this.$chat.addClass(key);
		} else if (value === 'true' && this.$chat.hasClass(key) === true) {
			this.$chat.removeClass(key);
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
