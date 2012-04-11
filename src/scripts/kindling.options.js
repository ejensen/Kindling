kindling.module(function () {
	'use strict';

	var OPTIONS = [
		'enterRoom',
		'leaveRoom',
		'timeStamps',
		'notifications',
		'highlightName',
		'showAvatarsInNotifications',
		'disableNotificationsWhenInFocus',
		'autoDismiss',
		'filterNotifications',
		'soundAndEmojiMenus',
		'showAvatarsInChat',
		'useLargeAvatars',
		'useDifferentTheme'
	];

	function getMessages() {
		document.title = chrome.i18n.getMessage('options');
		var html = $(document.body).html();
		$(html.match(new RegExp('\{([^}]*)\}', 'g'))).each(function(i, e) {
			html = html.replace(e, chrome.i18n.getMessage(e.substring(1, e.length - 1)));
		});
		$(document.body).html(html);
	}

	function onOptionChanged() {
		chrome.extension.sendRequest({ type: 'optionsChanged' });
	}

	function onCheckChange($parent, value) {
		if (value) {
			$parent.find('.cb-disable').removeClass('selected');
			$parent.find('.cb-enable').addClass('selected');
		} else {
			$parent.find('.cb-enable').removeClass('selected');
			$parent.find('.cb-disable').addClass('selected');
		}

		if (value !== (localStorage[$parent[0].id] === 'true')) {
			$($parent.data('dependents')).slideToggle(300);
		}
	}

	function saveOption(id, value) {
		localStorage[id] = value;
		onOptionChanged();
	}

	function onCheckClick(sender, value) {
		var $parent = $(sender).parents('.switch:first');
		onCheckChange($parent, value);
		saveOption($parent[0].id, value);
	}

	function onNotificationTimeoutChanged() {
		var slider = document.getElementById('notificationTimeout');
		var $tooltip = $('#rangeTooltip');
		$tooltip.html((slider.value / 1000) + ' ' + chrome.i18n.getMessage('seconds'));
		$tooltip.css('left', ((slider.value / (slider.max - slider.min)) * $(slider).width()) - ($tooltip.width() / 1.75));

		localStorage[slider.id] = slider.value;
		onOptionChanged();
	}

	function onThemeColorChanged() {
		localStorage.themeColor = $('#themeColor input:checked').attr('title');
		onOptionChanged();
	}

	function onToggle(e) {
		var option = $(e.currentTarget).attr('for');
		var value = localStorage[option];
		onCheckClick(e.currentTarget, value === 'true' ? false : true);
	}

	function initOptions() {
		var i;
		for (i = 0; i < OPTIONS.length; i += 1) {
			var savedValue = localStorage[OPTIONS[i]];
			var checked = savedValue === undefined || (savedValue === 'true');
			var $element = $(document.getElementById(OPTIONS[i]));
			onCheckChange($element, checked);

			if (!checked)
				$($element.data('dependents')).hide();
		}

		$('#themeColor input[title=' + localStorage.themeColor + ']').attr('checked', true);

		var notificationTimeoutSlider = document.getElementById('notificationTimeout');
		notificationTimeoutSlider.value = localStorage.notificationTimeout;
		onNotificationTimeoutChanged();
	}

	return {
		init: function () {			
			getMessages();

			$('#coda-slider').codaSlider();

			$('.cb-enable').click(function () {
				onCheckClick(this, true);
			});
			$('.cb-disable').click(function () {
				onCheckClick(this, false);
			});
			$('.description').click(onToggle);

			$('#notificationTimeout').change(onNotificationTimeoutChanged);

			$('#themeColor').change(onThemeColorChanged);

			initOptions();
		}
	};
}());
