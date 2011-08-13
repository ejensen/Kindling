chromefire.highlight = {
	init: function () {
		$.subscribe('optionsChanged', this.highlightName);
		$.subscribe('newMessage', this.highlightName);
	},

	highlightName: function (e, options, username) {
		if (!options || username === '') {
			return;
		}

		chromefire.contentscript.unbindNewMessage();
		try {
			this.$chat = this.$chat || $('#chat-wrapper');
			var $messages = this.$chat.find('div:.body');
			var highlightOptions = { className: 'nameHighlight', tagType: 'mark' };
			$messages.highlightRegex(undefined, highlightOptions);

			if (options.highlightName === 'true') {
				$messages.highlightRegex(chromefire.common.getUsernameRegex(username), highlightOptions);
			}
		} catch (err) {
		}

		chromefire.contentscript.bindNewMessage();
	}
};

chromefire.highlight.init();
