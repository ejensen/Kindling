chromefire.contentscript = {
	options: null,
	$chat: null,
	username: '',

	init: function () {
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
			chromefire.contentscript.options = request.value;
			$.publish(request.type, [request.value, chromefire.contentscript.username]);
		}

		if (callback) {
			callback();
		}
	},

	onNewMessage: function (e) {
		if (e.target.id === 'chromefire_username') {
			chromefire.contentscript.username = e.target.innerText;		
			$.publish('newMessage', [chromefire.contentscript.options, chromefire.contentscript.username]);
			return;
		}

		$.publish('newMessage', [chromefire.contentscript.options, chromefire.contentscript.username, e.target]);
	}
};

$(function () {
	chromefire.contentscript.init();
});
