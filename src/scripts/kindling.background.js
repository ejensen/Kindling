kindling.module(function () {
	'use strict';

	var tabMap = {};

	function initOption(option, defaultValue) {
		localStorage[option] = localStorage[option] || defaultValue;
	}

	function getOptionsObject() {
		var i, optionsObject = {};
		var count = localStorage.length;
		for (i = 0; i < count; i++) {
			var key = localStorage.key(i);
			optionsObject[key] = localStorage.getItem(key);
		}
		return optionsObject;
	}

	function sendOptionsChangedNotification() {
		var optionsObject = getOptionsObject();
		var tab;
		for (tab in tabMap) {
			if (tabMap.hasOwnProperty(tab)) {
				chrome.tabs.sendRequest(parseInt(tab, 10), { type: 'optionsChanged', value: optionsObject });
			}
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
		chrome.notifications.create(payload.id, {
			type: 'basic',
			title: payload.author,
			contextMessage: payload.room,
			message: payload.message,
			iconUrl: (localStorage.showAvatarsInNotifications === 'true') ? payload.avatar : chrome.extension.getURL('/img/campfire46.png')
		}, function () {});

		if (localStorage.autoDismiss === 'true') {
			setTimeout(function () {
				chrome.notifications.clear(payload.id, function () {});
			}, localStorage.notificationTimeout);
		}

		chrome.notifications.onClicked.addListener(function (id) {
			if (payload.id === id) {
				chrome.windows.update(tabMap[sender.tab.id], { focused: true });
				chrome.tabs.update(sender.tab.id, { selected: true });
				if (e.target.cancel) {
					e.target.cancel();
				}
			}
		});
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
			initOption('highlightKeywords', localStorage.highlightName === 'false' ? 'false' : 'true');
			initOption('useDifferentTheme', 'false');
			initOption('soundAndEmojiMenus', 'true');
			initOption('soundAndEmojiAutoComplete', 'true');
			initOption('showAvatarsInChat', 'true');
			initOption('useLargeAvatars', 'false');
			initOption('minimalInterface', 'false');
			initOption('expandAbbreviations', 'true');
			initOption('playMessageSounds', 'true');
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
