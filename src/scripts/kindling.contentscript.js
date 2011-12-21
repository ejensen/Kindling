kindling.module(function () {
	'use strict';

	var options = null;
	var $chat = null;
	var username = '';

	function onRequest(request, sender, callback) {
		if (request.type === 'optionsChanged') {
			options = request.value;
			$.publish(request.type, [request.value, username]);
		}

		if (callback) {
			callback();
		}
	}

	function onNewMessage(e) {
		if (e.target.id === 'kindling_username') {
			username = e.target.innerText;
			$.publish('loaded', [options, username]);
		} else {
			$.publish('newMessage', [options, username, e.target]);
		}
	}

	function bindNewMessages() {
		$chat.bind('DOMNodeInserted', onNewMessage);
	}

	function unbindNewMessages() {
		$chat.unbind('DOMNodeInserted');
	}

	function injectJs(link) {
		var script = document.createElement('script');
		script.src = chrome.extension.getURL(link);
		document.body.appendChild(script);
	}

	return {
		init: function () {
			$chat = $('#chat-wrapper');

			kindling.bindNewMessages = bindNewMessages;
			kindling.unbindNewMessages = unbindNewMessages;

			window.onunload = function () {
				chrome.extension.sendRequest({ type: 'unload' });
			};
			chrome.extension.onRequest.addListener(onRequest);
			chrome.extension.sendRequest({ type: 'init' });

			bindNewMessages();

			injectJs('scripts/kindling.inject.js');
		}
	};
}());
