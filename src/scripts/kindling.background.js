(function () {
	'use strict';

	function initOption(option, defaultValue) {
		localStorage[option] = localStorage[option] || defaultValue;
	}

	function getOptionsObject() {
		var i, key, optionsObject = {}, count = localStorage.length;
		for (i = 0; i < count; i++) {
			key = localStorage.key(i);
			optionsObject[key] = localStorage.getItem(key);
		}
		return optionsObject;
	}

	function sendOptionsChangedNotification() {
		chrome.tabs.query({ url: '*://*.campfirenow.com/room/*' }, function (tabs) {
			var i, count = tabs.length, message = { type: 'optionsChanged', value: getOptionsObject() };
			for (i = 0; i < count; i++) {
				chrome.tabs.sendMessage(tabs[i].id, message);
			}
		});
	}

	function tryToCreateNotification(payload, sender, successCallback) {
		if (localStorage.disableNotificationsWhenInFocus === 'true') {
			chrome.tabs.query({ lastFocusedWindow: true, active: true }, function (tabs) {
				var i, count = tabs.length;
				for (i = 0; i < count; i++) {
					if (tabs[i].id === sender.tab.id) {
						return;
					}
				}
				successCallback(payload, sender);
			});
		} else {
			successCallback(payload, sender);
		}
	}

	function showNotification(payload, sender) {
		var showAvatars = localStorage.showAvatarsInNotifications === 'true';
		var opt = {
			type: 'basic',
			title: payload.author,
			contextMessage: payload.room,
			message: payload.message,
			iconUrl: showAvatars ? '' : chrome.extension.getURL('/img/campfire46.png')
		};

		chrome.notifications.create(payload.id, opt, function () {
			if (showAvatars && payload.avatar) {
				var xhr = new XMLHttpRequest();
				xhr.open('GET', 'http://www.corsproxy.com/' + payload.avatar.replace(/^https?:\/\//,''), true);
				xhr.responseType = 'blob';
				xhr.onload = function() {
					opt.iconUrl = window.webkitURL.createObjectURL(this.response);
					chrome.notifications.update(payload.id, opt, function () {});
				};
				xhr.send();
			}
		});

		if (localStorage.autoDismiss === 'true') {
			setTimeout(function () {
				chrome.notifications.clear(payload.id, function () {});
			}, localStorage.notificationTimeout);
		}

		chrome.notifications.onClicked.addListener(function (id) {
			if (payload.id === id) {
				chrome.tabs.update(sender.tab.id, { active: true, highlighted: true });
				chrome.windows.update(sender.tab.windowId, { focused: true });
			}
		});
	}

	return function () {
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

		chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
			if (message.type === 'notification') {
				tryToCreateNotification(message.value, sender, showNotification);
			} else if (message.type === 'init') {
				chrome.pageAction.show(sender.tab.id);
				sendOptionsChangedNotification();
			} else if (message.type === 'optionsChanged') {
				sendOptionsChangedNotification();
			}

			if (sendResponse) {
				sendResponse();
			}
		});
	};
}())();
