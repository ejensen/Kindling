chromefire.notificationpublisher = {
	init: function () {
		$.subscribe('newMessage', this.publishNotification);
	},

	publishNotification: function (e, options, username, message) {
		if (!options || !username || !message || options.notifications !== 'true') {
			return;
		}

		var $message = $(message);
		if (message.id.indexOf('message_') !== -1 /*&& message.id.indexOf("message_pending") === -1 */ && !($message.is('.enter_message,.leave_message,.kick_message,.timestamp_message'))) {
			var $body, $author = $message.find('.author:first');
			if ($message.is('.topic_change_message')) {
				$body = $message.find('.body:first');
			} else {
				$body = $message.find('code:first');
				if ($body.length === 0) {
					$body = $message.find('div:.body:first');
				}
			}

			if (options.filterNotifications === 'true') {
				var regex = chromefire.common.getUsernameRegex(username);
				if (!regex.test($body.html())) {
					return;
				}
			}

			this.room = this.room || $('#room_name').html();
			chrome.extension.sendRequest({
				type: 'notification',
				value: {
					username: username,
					room: this.room,
					author: $author.text(),
					avatar: $author.attr('data-avatar'),
					message: $body.html()
				}
			});
		}
	}
};

chromefire.notificationpublisher.init();
