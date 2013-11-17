var kindling = kindling || (function (domReady) {
	'use strict';

	function escapeRegex(text) {
		var regex = new RegExp('[.*+?|()\\[\\]{}\\\\]', 'g');
		return text.replace(regex, '\\$&');
	}

	function getUsernameRegexString(username) {
		var escapedUsername = escapeRegex(username);
		return escapedUsername + '|' + escapedUsername.split(' ').join('|');
	}

	return {
		getKeywordsRegex: function (keywords, username) {
			var escaped = [];
			var list = (keywords || '').split(/\s*,\s*/);
			for (var i = 0; i < list.length; i++) {
				var escapedKeyword = escapeRegex(list[i].replace(/^\s+|\s+$/g, ''));
				if (escapedKeyword) {
					escaped.push(escapedKeyword);
				}
			}
			return new RegExp('\\b(' + (username ? getUsernameRegexString(username) + (escaped.length ? '|' : '') : '') + escaped.join('|') + ')\\b', 'i');
		},

		scrollToBottom: function (force) {
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
