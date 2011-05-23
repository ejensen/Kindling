var tabs = [];

function getSettingsObject() {
	var settingsObject = {};
	var i;
	var count = localStorage.length;
	for (i = 0; i < count; i++) {
		var key = localStorage.key(i);
		settingsObject[key] = localStorage.getItem(key);
	}
	return settingsObject;
}

function sendOptionsChangedNotification() {
	var count = tabs.length;
	var i;
	for (i = 0; i < count; i++) {
		chrome.tabs.sendRequest(tabs[i], { type: "optionsChanged", value: getSettingsObject() });
	}
}

function getDomain(url) {
	var regex = new RegExp("https?:\/\/(.[^/]+)");
	var match = url.match(regex);
	return match ? match[0] : "";
}

function createNotification(payload, sender) {
	var focusedTab = false;
	if (localStorage.focusNotifications === 'false') {
		chrome.windows.getLastFocused(function (window) {
			if (window.id === sender.tab.windowId) {
				chrome.tabs.getSelected(window.id, function (tab) {
					if (tab.id === sender.tab.id) {
						focusedTab = true;
					}
				});
			}
		});
	}

	if (focusedTab === true) {
		return;
	}

	var notification = webkitNotifications.createHTMLNotification("notification.html"
		+ "?room=" + payload.room
		+ "&author=" + payload.author
		+ "&avatar=" + payload.avatar
		+ "&user=" + payload.username
		+ "&baseUrl=" + getDomain(sender.tab.url)
		+ '#' + payload.message);

	notification.onclick = function () {
		chrome.windows.update(sender.tab.windowId, { focused: true });
		chrome.tabs.update(sender.tab.id, { selected: true });
	};

	notification.show();
}

chrome.extension.onRequest.addListener(function (request, sender, callback) {
	if (request.type === "notification") {
		createNotification(request.value, sender);
	} else if (request.type === "init") {
		chrome.pageAction.show(sender.tab.id);
		tabs[tabs.length] = sender.tab.id;
		sendOptionsChangedNotification();
	} else if (request.type === "unload") {
		var index = tabs.indexOf(sender.tab.id);
		if (index !== -1) {
			tabs.splice(index, 1);
		}
	} else if (request.type === "optionsChanged") {
		sendOptionsChangedNotification();
	}

	if (callback) {
		callback();
	}
});

function initSetting(setting, defaultValue) {
	if (localStorage[setting] === undefined) {
		localStorage[setting] = defaultValue;
	}
}

function init() {
	initSetting("enterRoom", false);
	initSetting("leaveRoom", false);
	initSetting("timeStamps", true);
	initSetting("highlightName", true);
	initSetting("showAvatars", true);
	initSetting("filterNotifications", false);
	initSetting("focusNotifications", true);
	initSetting("autoDismiss", true);
	initSetting("notifications", true);
	initSetting("notificationTimeout", 5000);
}

init();         