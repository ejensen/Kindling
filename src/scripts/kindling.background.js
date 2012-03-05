kindling.module(function () {
	'use strict';

	var tabMap = {};

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
		var settingsObject = getSettingsObject();
		var tab;
		for (tab in tabMap) {
			chrome.tabs.sendRequest(parseInt(tab, 10), { type: 'optionsChanged', value: settingsObject });
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
		var notification = webkitNotifications.createHTMLNotification('notification.html'
			+ '?room=' + encodeURIComponent(payload.room)
			+ '&author=' + encodeURIComponent(payload.author)
			+ '&avatar=' + encodeURIComponent(payload.avatar)
			+ '&user=' + encodeURIComponent(payload.username)
			+ '&baseUrl=' + encodeURIComponent(kindling.getDomain(sender.tab.url))
			+ '#' + payload.message);

		notification.onclick = function () {
			chrome.windows.update(tabMap[sender.tab.id], { focused: true });
			chrome.tabs.update(sender.tab.id, { selected: true });
		};

		notification.show();
	}

	return {
		init: function () {
			initSetting('enterRoom', 'false');
			initSetting('leaveRoom', 'false');
			initSetting('timeStamps', 'true');
			initSetting('filterNotifications', 'false');
			initSetting('autoDismiss', 'true');
			initSetting('notifications', 'true');
			initSetting('notificationTimeout', '5000');
			initSetting('highlightName', 'true');
			initSetting('useDifferentTheme', 'false');
			initSetting('soundAndEmojiMenus', 'true');
			initSetting('showAvatarsInChat', 'false');
			initSetting('useLargeAvatars', 'false');
			initSetting('showAvatarsInNotifications', localStorage.showAvatars === 'false' ? 'false' : 'true');
			initSetting('disableNotificationsWhenInFocus', localStorage.focusNotifications === 'false');
			localStorage.removeItem('focusNotifications'); //obsolete option

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
