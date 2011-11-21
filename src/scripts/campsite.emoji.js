campsite.module(function () {
	'use strict';

	var EMOJIS = {
		'apple': '1f34e',
		'beer': '1f37a',
		'cake': '1f370',
		'tada': '1f389',
		'flags': '1f38f',
		'art': '1f3a8',
		'moneybag': '1f4b0',
		'tophat': '1f3a9',
		'mega': '1f4e4',
		'fire': '1f528',
		'bomb': '1f4a3',
		'gun': '1f52f',
		'hammer': '1f52c',
		'smoking': '1f6ac',
		'syringe': '1f488',
		'feet': '1f463',
		'airplane': '2708',
		'bike': '1f6b2',
		'bus': '1f68d',
		'train': '1f686',
		'taxi': '1f695',
		'ski': '1f3bf',
		'runner': '1f3c3',
		'couple': '1f46b',
		'cop': '1f46c',
		'princess': '1f477',
		'skull': '1f47f',
		'bear': '1f40b',
		'cat': '1f401',
		'dog': '1f436',
		'hamster': '1f414',
		'koala': '1f417',
		'horse': '1f408',
		'fish': '1f413',
		'dolphin': '1f411',
		'computer': '1f4bb',
		'iphone': '1f4f0',
		'calling': '1f4f1',
		'email': '1f4e8',
		'memo': '1f4dd',
		'book': '1f4d6',
		'bulb': '1f4a1',
		'scissors': '2702',
		'mag': '1f520',
		'gift': '1f4e7',
		'heart': '2764',
		'broken_heart': '1f493',
		'key': '1f524',
		'lock': '1f54b',
		'unlock': '1f54c',
		'kiss': '1f48a',
		'lips': '1f444',
		'lipstick': '1f483',
		'nail_care': '1f484',
		'shit': '1f4a9',
		'toilet': '1f6bf',
		'ok': '1f502',
		'cool': '1f507',
		'new': '1f505',
		'vs': '1f504',
		'wheelchair': '267f',
		'tm': '2122',
		'zzz': '1f4a4',
		'warning': '26a0',
		'zap': '26a1',
		'sparkles': '2728',
		'star': '2b50',
		'sunny': '2600',
		'rainbow': '1f308',
		'rose': '1f339',
		'sunflower': '1f33b',
		'leaves': '1f343',
		'clap': '1f44d',
		'fist': '270a',
		'punch': '1f446',
		'v': '270c',
		'thumbsup': '1f447',
		'thumbsdown': '1f44f'
	};

	function insertAtCaret(input, value) {
		if (input.selectionStart || input.selectionStart === 0) {
			input.value = input.value.substring(0, input.selectionStart) + value + input.value.substring(input.selectionEnd, input.value.length);
			input.selectionStart = input.selectionEnd = input.selectionStart + value.length;
		} else {
			input.value += value;
		}
	}

	return {
		init: function () {
			$('#chat_controls').append('<div id="emojiButton-wrapper" class="tooltip"><img id="emojiButton" title="' + chrome.i18n.getMessage('emojiMenuTooltip') + '" src="' + chrome.extension.getURL("img/emoji.gif") + '" width="16" height="16"/><span id="emojiContainer" class="tooltip-inner"></span></div>');

			var $emojiButton = $('#emojiButton');
			var $emojiContainer = $('#emojiContainer');
			var emoji;
			for (emoji in EMOJIS) {
				$emojiContainer.append('<span class="emoji emoji' + EMOJIS[emoji] + '" title="' + emoji + '"></span>');
			}

			$(document).click(function (e) {
				if (e.target.id !== 'emojiButton' && $emojiButton.find(e.target).length === 0) {
					$emojiContainer.hide();
				} else {
					$emojiContainer.toggle();
				}
			});

			var $input = $('#input');
			$emojiContainer.children('.emoji').click(function () {
				insertAtCaret($input[0], ':' + this.getAttribute('title') + ':');
				$input.focus();
			});
		}
	};
}());
