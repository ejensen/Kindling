chromefire.background = {
	tabs: [],

	init: function () {
		this.initSetting('enterRoom', false);
		this.initSetting('leaveRoom', false);
		this.initSetting('timeStamps', true);
		this.initSetting('showAvatars', true);
		this.initSetting('focusNotifications', true);
		this.initSetting("filterNotifications", false);
		this.initSetting('autoDismiss', true);
		this.initSetting('notifications', true);
		this.initSetting('notificationTimeout', 5000);
		this.initSetting('highlightName', true);
		this.initSetting('faviconCounter', true);

		chrome.extension.onRequest.addListener(function (request, sender, callback) {
			if (request.type === 'notification') {
				chromefire.background.tryToCreateNotification(request.value, sender, chromefire.background.showNotification);
			} else if (request.type === 'init') {
				chrome.pageAction.show(sender.tab.id);
				chromefire.background.tabs[chromefire.background.tabs.length] = sender.tab.id;
				chromefire.background.sendOptionsChangedNotification();
			} else if (request.type === 'unload') {
				var index = chromefire.background.tabs.indexOf(sender.tab.id);
				if (index !== -1) {
					chromefire.background.tabs.splice(index, 1);
				}
			} else if (request.type === 'optionsChanged') {
				chromefire.background.sendOptionsChangedNotification();
			}

			if (callback) {
				callback();
			}
		});
	},

	initSetting: function (setting, defaultValue) {
		if (!localStorage[setting]) {
			localStorage[setting] = defaultValue;
		}
	},

	getSettingsObject: function () {
		var i, settingsObject = {};
		var count = localStorage.length;
		for (i = 0; i < count; i++) {
			var key = localStorage.key(i);
			settingsObject[key] = localStorage.getItem(key);
		}
		return settingsObject;
	},

	sendOptionsChangedNotification: function () {
		var i, count = this.tabs.length;
		for (i = 0; i < count; i++) {
			chrome.tabs.sendRequest(this.tabs[i], { type: 'optionsChanged', value: this.getSettingsObject() });
		}
	},

	tryToCreateNotification: function (payload, sender, successCallback) {
		if (localStorage.focusNotifications === 'false') {
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
	},
	
	showNotification: function (payload, sender) {
			var notification = webkitNotifications.createHTMLNotification('notification.html'
			+ '?room=' + payload.room
			+ '&author=' + payload.author
			+ '&avatar=' + payload.avatar
			+ '&user=' + payload.username
			+ '&baseUrl=' + chromefire.common.getDomain(sender.tab.url)
			+ '#' + payload.message);

		notification.onclick = function () {
			chrome.windows.update(sender.tab.windowId, { focused: true });
			chrome.tabs.update(sender.tab.id, { selected: true });
		};

		notification.show();
	}
};

chromefire.background.init();
