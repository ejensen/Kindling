var kindling = kindling || (function (domReady) {
	'use strict';

	function regExpEscape(text) {
		var regex = new RegExp('[.*+?|()\\[\\]{}\\\\]', 'g');
		return text.replace(regex, '\\$&');
	}

	return {
		getUsernameRegex: function (username) {
			var escapedUsername = regExpEscape(username);
			return new RegExp('\\b(' + escapedUsername + '|' + escapedUsername.split(' ').join('|') + ')\\b', 'i');
		},

		getDomain: function (url) {
			var regex = new RegExp('(chrome-extension|https?):\/\/(.[^/]+)');
			var match = url.match(regex);
			return match ? match[0] : '';
		},

		scrollToBottom : function (force) {
			var pageHeight = Math.max(document.documentElement.offsetHeight, document.body.scrollHeight);
			var targetY = pageHeight + window.innerHeight + 100;

			// only scroll to bottom if we are already close to the bottom
			var chatHeight = document.documentElement.clientHeight;
			var offset = window.scrollY + chatHeight;
			var max = document.documentElement.scrollHeight;

			if (force === true || offset + (chatHeight * 0.1) >= max) {
			window.scrollTo(0, targetY);
			}
		},

		module: function (m) {
			if (m.init) {
				domReady(function () {
					m.init();
				});
			}
			return m;
		}
	};
}(window.$ || function (f) { f(); }));
