chromefire.contentscript = {
	options: null,
	$chat: null,
	username: '',
	room: '',

	init: function () {
		this.room = $('#room_name').html();
		this.$chat = $('#chat-wrapper');
		window.onunload = function () {
			chrome.extension.sendRequest({ type: 'unload' });
		};
		chrome.extension.onRequest.addListener(this.onRequest);
		chrome.extension.sendRequest({ type: 'init' });

		this.bindNewMessage();

		this.injectJs('scripts/chromefire.inject.js');
	},

	injectJs: function (link) {
		var script = document.createElement('script');
		script.src = chrome.extension.getURL(link);
		document.body.appendChild(script);
	},

	bindNewMessage: function () {
		this.$chat.bind('DOMNodeInserted', this.onNewMessage);
	},

	unbindNewMessage: function () {
		this.$chat.unbind('DOMNodeInserted');
	},

	onRequest: function (request, sender, callback) {
		if (request.type === 'optionsChanged') {
			chromefire.contentscript.onOptionsChanged(request);
		}

		if (callback) {
			callback();
		}
	},

	onOptionsChanged: function (request) {
		this.options = request.value;
		this.filterMessages();
		this.highlightName();
	},

	filterMessages: function () {
		if (this.options) {
			this.showHideElements('noEnterRoom', this.options.enterRoom);
			this.showHideElements('noLeaveRoom', this.options.leaveRoom);
			this.showHideElements('noTimeStamp', this.options.timeStamps);
		}
	},

	showHideElements: function (key, value) {
		if (value === 'false' && this.$chat.hasClass(key) === false) {
			this.$chat.addClass(key);
		} else if (value === 'true' && this.$chat.hasClass(key) === true) {
			this.$chat.removeClass(key);
		}
	},

	getUsernameRegex: function () {
		var username = chromefire.common.regExpEscape(this.username);
		return new RegExp('\\b(' + username + '|' + username.split(' ').join('|') + ')\\b', 'i');
	},

	highlightName: function () {
		if (this.username === '' || !this.options) {
			return;
		}
		this.unbindNewMessage();
		try {
			var $messages = this.$chat.find('div:.body');
			var options = { className: 'nameHighlight', tagType: 'mark' };
			$messages.highlightRegex(undefined, options);

			if (this.options.highlightName === 'true') {
				$messages.highlightRegex(this.getUsernameRegex(), options);
			}
		} catch (err) {
		}

		this.bindNewMessage();
	},

	onNewMessage: function (e) {
		if (e.target.id === 'chromefire_username') {
			chromefire.contentscript.username = e.target.innerText;
			chromefire.contentscript.highlightName();
			return;
		}
		chromefire.contentscript.highlightName();

		if (!chromefire.contentscript.options || chromefire.contentscript.options.notifications !== 'true') {
			return;
		}

		var $target = $(e.target);
		if (e.target && e.target.id.indexOf('message_') !== -1 && e.target.id.indexOf('message_pending') === -1 && !($target.is('.enter_message,.leave_message,.kick_message,.timestamp_message,.you'))) {
			var $message, $author = $target.find('.author:first');
			if ($target.is('.topic_change_message')) {
				$message = $target.find('.body:first');
			} else {
				$message = $target.find('code:first');
				if ($message.length === 0) {
					$message = $target.find('div:.body:first');
				}
			}

			if (chromefire.contentscript.options.filterNotifications === 'true') {
				var regex = chromefire.contentscript.getUsernameRegex();
				if (!regex.test($message.html())) {
					return;
				}
			}

			chrome.extension.sendRequest({
				type: 'notification',
				value: {
					username: chromefire.contentscript.username,
					room: chromefire.contentscript.room,
					author: $author.text(),
					avatar: $author.attr('data-avatar'),
					message: $message.html()
				}
			});
		}
	}
};

$(document).ready(function () {
	chromefire.contentscript.init();
});
