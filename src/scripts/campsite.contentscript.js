(function () {
	"use strict";

	var options = null;
	var $chat = null;
	var username = '';

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
		if (e.target.id === 'campsite_username') {
			username = e.target.innerText;		
			$.publish('loaded', [options, username]);
		} else {
			$.publish('newMessage', [options, username, e.target]);
		}
	};

	var bindNewMessages = function () {
		$chat.bind('DOMNodeInserted', onNewMessage);
	};

	var unbindNewMessages = function () {
		$chat.unbind('DOMNodeInserted');
	};

	function injectJs(link) {
		var script = document.createElement('script');
		script.src = chrome.extension.getURL(link);
		document.body.appendChild(script);
	}

	$(function () {
		$chat = $('#chat-wrapper');

		campsite.bindNewMessages = bindNewMessages;
		campsite.unbindNewMessages = unbindNewMessages;

		window.onunload = function () {
			chrome.extension.sendRequest({ type: 'unload' });
		};
		chrome.extension.onRequest.addListener(onRequest);
		chrome.extension.sendRequest({ type: 'init' });

		bindNewMessages();

		injectJs('scripts/campsite.inject.js');
	});

}());
