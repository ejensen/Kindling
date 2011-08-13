chromefire.messagefilter = {
	init: function () {
		$.subscribe('optionsChanged', this.filterMessages);
	},

	filterMessages: function (e, options) {
		if (options) {
			chromefire.messagefilter.showHideElements('noEnterRoom', options.enterRoom);
			chromefire.messagefilter.showHideElements('noLeaveRoom', options.leaveRoom);
			chromefire.messagefilter.showHideElements('noTimeStamp', options.timeStamps);
		}
	},

	showHideElements: function (key, value) {
		this.$chat = this.$chat || $('#chat-wrapper');
		if (value === 'false' && this.$chat.hasClass(key) === false) {
			this.$chat.addClass(key);
		} else if (value === 'true' && this.$chat.hasClass(key) === true) {
			this.$chat.removeClass(key);
		}
	}
};

chromefire.messagefilter.init();
