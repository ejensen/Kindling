var chromefire = chromefire || {};

chromefire.inject = {
	oldGetChatAuthorColumnWidthFunc: null,

	init: function () {
		this.getUsername();
		this.oldGetChatAuthorColumnWidthFunc = Campfire.LayoutManager.prototype.getChatAuthorColumnWidth;
		Campfire.LayoutManager.prototype.getChatAuthorColumnWidth = this.getChatAuthorColumnWidthOverride;
	},

	getChatAuthorColumnWidthOverride: function () {
		try {
			var i, tmp, authorWidth;
			var messages = window.chat.transcript.element.getElementsByTagName('tr');
			for (i = 0; i < messages.length; i++) {
				if (messages[i].cells.length < 2) {
					continue;
				}

				tmp = Position.cumulativeOffset(messages[i].cells[1])[0];
				if (tmp !== undefined && tmp !== 0) {
					authorWidth = tmp;
					break;
				}
			}

			if (authorWidth === undefined) {
				return 0;
			}

			return authorWidth - Position.cumulativeOffset(window.chat.transcript.element)[0];
		} catch (err) {
			return this.oldGetChatAuthorColumnWidthFunc();
		}
	},

	getUsername: function () {
		if (window.chat && window.chat.username) {
			var usernameElem = document.createElement('span');
			usernameElem.id = 'chromefire_username';
			usernameElem.style.display = 'none';
			usernameElem.innerText = window.chat.username;
			document.getElementById('chat-wrapper').appendChild(usernameElem);
		}
	}
};

chromefire.inject.init();
