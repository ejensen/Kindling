var Inject = {
	oldGetChatAuthorColumnWidthFunc: undefined,

	init: function () {
		Inject.getUsername();
		Inject.oldGetChatAuthorColumnWidthFunc = Campfire.LayoutManager.prototype.getChatAuthorColumnWidth;
		Campfire.LayoutManager.prototype.getChatAuthorColumnWidth = Inject.getChatAuthorColumnWidthOverride;
	},

	getChatAuthorColumnWidthOverride: function () {
		try {
			var i, tmp, authorWidth;
			var messages = window.chat.transcript.element.getElementsByTagName("tr");
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
			return Inject.oldGetChatAuthorColumnWidthFunc();
		}
	},

	getUsername: function () {
		if (window.chat && window.chat.username) {
			var usernameElem = document.createElement("span");
			usernameElem.id = "username";
			usernameElem.style.display = "none";
			usernameElem.innerText = window.chat.username;
			document.getElementById("chat-wrapper").appendChild(usernameElem);
		}
	}
};

Inject.init();