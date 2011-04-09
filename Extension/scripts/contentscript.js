var Chromefire = {
	options: undefined,
	$chat: undefined,
	username: "",
	room: undefined,

	init: function () {
		Chromefire.room = $("#room_name").html();
		Chromefire.$chat = $("#chat-wrapper");
		window.onunload = function () {
			chrome.extension.sendRequest({ type: "unload" });
		};
		chrome.extension.onRequest.addListener(Chromefire.onRequest);
		chrome.extension.sendRequest({ type: "init" });

		Chromefire.bindNewMessage();

		Chromefire.injectJs("scripts/inject.js");
	},

	injectJs: function (link) {
		var scr = document.createElement("script");
		scr.type = "text/javascript";
		scr.src = chrome.extension.getURL(link);
		(document.head || document.body || document.documentElement).appendChild(scr);
	},

	bindNewMessage: function () {
		Chromefire.$chat.bind("DOMNodeInserted", Chromefire.onNewMessage);
	},

	unbindNewMessage: function () {
		Chromefire.$chat.unbind("DOMNodeInserted");
	},

	onRequest: function (request, sender, callback) {
		if (request.type === "optionsChanged") {
			Chromefire.onOptionsChanged(request);
		}

		if (callback) {
			callback();
		}
	},

	onOptionsChanged: function (request) {
		Chromefire.options = request.value;
		Chromefire.filterMessages();
		Chromefire.highlightName();
	},

	filterMessages: function () {
		if (Chromefire.options) {
			Chromefire.showHideElements("noEnterRoom", Chromefire.options.enterRoom);
			Chromefire.showHideElements("noLeaveRoom", Chromefire.options.leaveRoom);
			Chromefire.showHideElements("noTimeStamp", Chromefire.options.timeStamps);
		}
	},

	showHideElements: function (key, value) {
		if (value === 'false' && Chromefire.$chat.hasClass(key) === false) {
			Chromefire.$chat.addClass(key);
		}
		else if (value === 'true' && Chromefire.$chat.hasClass(key) === true) {
			Chromefire.$chat.removeClass(key);
		}
	},

	regExpEscape: function (text) { //TODO: Remove duplication
		var regex = new RegExp("[.*+?|()\\[\\]{}\\\\]", 'g');
		return text.replace(regex, "\\$&");
	},

	highlightName: function () {
		if (Chromefire.username === "" || Chromefire.options === undefined) {
			return;
		}
		Chromefire.unbindNewMessage();
		try {
			var $messages = Chromefire.$chat.find("div:.body");
			$messages.highlightRegex();

			if (Chromefire.options.highlightName === 'true') {
				var username = Chromefire.regExpEscape(Chromefire.username);
				var regex = new RegExp("\\b(" + username + '|' + username.split(' ').join('|') + ")\\b", 'i');
				$messages.highlightRegex(regex);
			}
		} catch (err) {
		}

		Chromefire.bindNewMessage();
	},

	onNewMessage: function (e) {
		Chromefire.highlightName();

		if (e.target.id === "username") {
			Chromefire.username = e.target.innerText;
			Chromefire.highlightName();
			return;
		}

		if (Chromefire.options == undefined || Chromefire.options.notifications !== 'true') {
			return;
		}

		var $target = $(e.target);
		if (e.target && e.target.id.indexOf("message_") !== -1 && e.target.id.indexOf("message_pending") === -1 && !($target.is(".enter_message,.leave_message,.kick_message,.timestamp_message,.you"))) {
			var $author = $target.find(".author:first");

			var $message = $target.find("code:first");
			if ($message.length === 0) {
				$message = $target.find("div:.body:first");
			}

			chrome.extension.sendRequest({
				type: "notification",
				value: {
					username: Chromefire.username,
					room: Chromefire.room,
					author: $author.text(),
					avatar: $author.attr("data-avatar"),
					message: $message.html()
				}
			});
		}
	}
};

$(document).ready(function () {
	Chromefire.init();
});