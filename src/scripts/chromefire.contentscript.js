$(function () {
	var options = null;
	var $chat = null;
	var username = '';

	function init() {
		$chat = $('#chat-wrapper');
		chromefire.bindNewMessages = bindNewMessages;
		chromefire.unbindNewMessages = unbindNewMessages;

		window.onunload = function () {
			chrome.extension.sendRequest({ type: 'unload' });
		};
		chrome.extension.onRequest.addListener(onRequest);
		chrome.extension.sendRequest({ type: 'init' });

		bindNewMessages();

		injectJs('scripts/chromefire.inject.js');
	}

	function injectJs(link) {
		var script = document.createElement('script');
		script.src = chrome.extension.getURL(link);
		document.body.appendChild(script);
	}

	var bindNewMessages = function () {
		$chat.bind('DOMNodeInserted', onNewMessage);
	}

	var unbindNewMessages = function () {
		$chat.unbind('DOMNodeInserted');
	}

	var onRequest = function (request, sender, callback) {
		if (request.type === 'optionsChanged') {
			options = request.value;
			$.publish(request.type, [request.value, username]);
		}

		if (callback) {
			callback();
		}
	};

	var onNewMessage = function (e) {
		if (e.target.id === 'chromefire_username') {
			username = e.target.innerText;		
			$.publish('loaded', [options, username]);
		} else {
			$.publish('newMessage', [options, username, e.target]);
		}
	};

	init();
});
