kindling.module(function () {
	'use strict';

	var tabMap = {};

	function initOption(option, defaultValue) {
		localStorage[option] = localStorage[option] || defaultValue;
	}

	function getOptionsObject() {
		var i, optionsObject = {};
		var count = localStorage.length;
		for (i = 0; i < count; i += 1) {
			var key = localStorage.key(i);
			optionsObject[key] = localStorage.getItem(key);
		}
		return optionsObject;
	}

	function sendOptionsChangedNotification() {
		var optionsObject = getOptionsObject();
		var tab;
		for (tab in tabMap) {
			chrome.tabs.sendRequest(parseInt(tab, 10), { type: 'optionsChanged', value: optionsObject });
		}
	}

	function tryToCreateNotification(payload, sender, successCallback) {
		if (localStorage.disableNotificationsWhenInFocus === 'true') {
			chrome.windows.getLastFocused(function (wnd) {
				if (wnd.id === sender.tab.windowId) {
					chrome.tabs.getSelected(wnd.id, function (tab) {
						if (tab.id !== sender.tab.id) {
							successCallback(payload, sender);
						}
					});
				} else {
					successCallback(payload, sender);
				}
			});
		} else {
			successCallback(payload, sender);
		}
	}

	function showNotification(payload, sender) {
		var notification;

		if (localStorage.htmlNotifications === 'true') {
			notification = webkitNotifications.createHTMLNotification('notification.html'
			+ '?room=' + encodeURIComponent(payload.room)
			+ '&author=' + encodeURIComponent(payload.author)
			+ '&avatar=' + encodeURIComponent(payload.avatar)
			+ '&user=' + encodeURIComponent(payload.username)
			+ '&emojiUrl=' + encodeURIComponent(payload.emojiUrl)
			+ '&baseUrl=' + encodeURIComponent(kindling.getDomain(sender.tab.url))
			+ '#' + payload.message);
		} else {
			notification = webkitNotifications.createNotification(payload.avatar, payload.author + ' in ' + payload.room, payload.message);
			if (localStorage.autoDismiss === 'true') {
				setTimeout(function () {
					notification.cancel();
				}, localStorage.notificationTimeout);
			}
		}

		notification.onclick = function (e) {
			chrome.windows.update(tabMap[sender.tab.id], { focused: true });
			chrome.tabs.update(sender.tab.id, { selected: true });
			if (e.target.cancel) {
				e.target.cancel();
			}
		};

		notification.show();
	}

	return {
		init: function () {
			initOption('enterRoom', 'false');
			initOption('leaveRoom', 'false');
			initOption('timeStamps', 'true');
			initOption('filterNotifications', 'false');
			initOption('autoDismiss', 'true');
			initOption('notifications', 'true');
			initOption('notificationTimeout', '5000');
			initOption('highlightName', 'true');
			initOption('useDifferentTheme', 'false');
			initOption('soundAndEmojiMenus', 'true');
			initOption('showAvatarsInChat', 'true');
			initOption('useLargeAvatars', 'false');
			initOption('minimalInterface', 'false');
			initOption('expandAbbreviations', 'true');
			initOption('htmlNotifications', 'true');
			initOption('showAvatarsInNotifications', localStorage.showAvatars === 'false' ? 'false' : 'true');
			initOption('disableNotificationsWhenInFocus', localStorage.focusNotifications === 'false');

			chrome.tabs.onAttached.addListener(function (tabId, attachInfo) {
				if (tabMap.hasOwnProperty(tabId)) {
					tabMap[tabId] = attachInfo.newWindowId;
				}
			});

			chrome.extension.onRequest.addListener(function (request, sender, callback) {
				if (request.type === 'notification') {
					tryToCreateNotification(request.value, sender, showNotification);
				} else if (request.type === 'init') {
					chrome.pageAction.show(sender.tab.id);
					tabMap[sender.tab.id] = sender.tab.windowId;
					sendOptionsChangedNotification();
				} else if (request.type === 'unload') {
					delete tabMap[sender.tab.id];
				} else if (request.type === 'optionsChanged') {
					sendOptionsChangedNotification();
				}

				if (callback) {
					callback();
				}
			});
		}
	};
}());
