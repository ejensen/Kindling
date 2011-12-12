kindling.module(function () {
	'use strict';

	var tabs = [];

	function initSetting(setting, defaultValue) {
		localStorage[setting] = localStorage[setting] || defaultValue;
	}

	function getSettingsObject() {
		var i, settingsObject = {};
		var count = localStorage.length;
		for (i = 0; i < count; i += 1) {
			var key = localStorage.key(i);
			settingsObject[key] = localStorage.getItem(key);
		}
		return settingsObject;
	}

	function sendOptionsChangedNotification() {
		var i, count = tabs.length;
		for (i = 0; i < count; i += 1) {
			chrome.tabs.sendRequest(tabs[i], { type: 'optionsChanged', value: getSettingsObject() });
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

	var showNotification = function (payload, sender) {
		var notification = webkitNotifications.createHTMLNotification('notification.html'
			+ '?room=' + payload.room
			+ '&author=' + payload.author
			+ '&avatar=' + payload.avatar
			+ '&user=' + payload.username
			+ '&baseUrl=' + kindling.getDomain(sender.tab.url)
			+ '#' + payload.message);

		notification.onclick = function () {
			chrome.windows.update(sender.tab.windowId, { focused: true });
			chrome.tabs.update(sender.tab.id, { selected: true });
		};

		notification.show();
	};

	return {
		init: function () {
			initSetting('enterRoom', 'false');
			initSetting('leaveRoom', 'false');
			initSetting('timeStamps', 'true');
			initSetting('showAvatars', 'true');
			initSetting('filterNotifications', 'false');
			initSetting('autoDismiss', 'true');
			initSetting('notifications', 'true');
			initSetting('notificationTimeout', '5000');
			initSetting('highlightName', 'true');
			initSetting('soundAndEmojiMenus', 'true');
			initSetting('disableNotificationsWhenInFocus', localStorage.focusNotifications === 'false');
			localStorage.removeItem('focusNotifications'); //obsolete option

			chrome.extension.onRequest.addListener(function (request, sender, callback) {
				if (request.type === 'notification') {
					tryToCreateNotification(request.value, sender, showNotification);
				} else if (request.type === 'init') {
					chrome.pageAction.show(sender.tab.id);
					tabs[tabs.length] = sender.tab.id;
					sendOptionsChangedNotification();
				} else if (request.type === 'unload') {
					var index = tabs.indexOf(sender.tab.id);
					if (index !== -1) {
						tabs.splice(index, 1);
					}
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
