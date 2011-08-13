chromefire.options = {
	OPTIONS: ['enterRoom', 'leaveRoom', 'timeStamps', 'notifications', 'highlightName', 'showAvatars', 'focusNotifications', 'autoDismiss', 'filterNotifications', 'faviconCounter'],

	init: function () {
		this.getMessages();

		$('.cb-enable').click(function () {
			chromefire.options.onCheckClick(this, true);
		});
		$('.cb-disable').click(function () {
			chromefire.options.onCheckClick(this, false);
		});
		$('.description').click(this.onToggle);

		$('#notificationTimeout').change(this.onNotificationTimeoutChanged);

		this.initOptions();
	},

	initOptions: function () {
		var i;
		for (i = 0; i < this.OPTIONS.length; i++) {
			var savedValue = localStorage[this.OPTIONS[i]];
			var checked = savedValue === undefined || (savedValue === 'true');
			this.onCheckChange($(document.getElementById(this.OPTIONS[i])), checked);
		}

		var notificationTimeoutSlider = document.getElementById('notificationTimeout');
		notificationTimeoutSlider.value = localStorage.notificationTimeout;
		this.onNotificationTimeoutChanged();

		if (localStorage.notifications === 'false') {
		    $('#focusNotifications,#filterNotifications,#showAvatars,#dismissDiv').hide();
		}
		if (localStorage.autoDismiss === 'false') {
			$('#timeoutDiv').hide();
		}
	},

	getMessages: function () {
		document.title = chrome.i18n.getMessage('chromefireOptions');
		$('.cb-enable > span').html(chrome.i18n.getMessage('on'));
		$('.cb-disable > span').html(chrome.i18n.getMessage('off'));

		$('#notificationsTitle').html(chrome.i18n.getMessage('notificationsTitle'));
		$('#messagesTitle').html(chrome.i18n.getMessage('messagesTitle'));
		$('#otherTitle').html(chrome.i18n.getMessage('otherTitle'));
		$('label[for="notificationTimeout"]').html(chrome.i18n.getMessage('notificationTimeout'));

		var i;
		for (i = 0; i < this.OPTIONS.length; i++) {
			$('.description[for="' + this.OPTIONS[i] + '"]').html(chrome.i18n.getMessage(this.OPTIONS[i]));
		}
	},

	onOptionChanged: function () {
		chrome.extension.sendRequest({ type: 'optionsChanged' });
	},

	onCheckChange: function ($parent, value) {
		if (value) {
			$parent.find('.cb-disable').removeClass('selected');
			$parent.find('.cb-enable').addClass('selected');
		} else {
			$parent.find('.cb-enable').removeClass('selected');
			$parent.find('.cb-disable').addClass('selected');
		}

		if ($parent[0].id === 'notifications' && value !== (localStorage.notifications === 'true')) {
			$('#focusNotifications,#filterNotifications,#showAvatars,#dismissDiv').slideToggle(200);
		} else if ($parent[0].id === 'autoDismiss' && value !== (localStorage.autoDismiss === 'true')) {
			$('#timeoutDiv').slideToggle(200);
		}
	},

	saveOption: function (id, value) {
		localStorage[id] = value;
		this.onOptionChanged();
	},

	onCheckClick: function (sender, value) {
		var $parent = $(sender).parents('.switch:first');
		this.onCheckChange($parent, value);
		this.saveOption($parent[0].id, value);
	},

	onNotificationTimeoutChanged: function () {
		var slider = document.getElementById('notificationTimeout');
		var $tooltip = $('#rangeTooltip');
		$tooltip.html((slider.value / 1000) + ' ' + chrome.i18n.getMessage('seconds'));
		$tooltip.css('left', ((slider.value / (slider.max - slider.min)) * $(slider).width()) - ($tooltip.width() / 1.75));

		localStorage[slider.id] = slider.value;
		this.onOptionChanged();
	},

	onToggle: function (e) {
		var option = $(e.currentTarget).attr('for');
		var value = localStorage[option];
		chromefire.options.onCheckClick(e.currentTarget, value === 'true' ? false : true);
	}
};

$(document).ready(function () {
	chromefire.options.init();
});
