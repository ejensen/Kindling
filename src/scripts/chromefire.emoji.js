chromefire.emoji = {
	EMOJIS: {
		'apple': '1f34e',
		'art': '1f3a8',
		'airplane': '2708',
		'bear': '1f40b',
		'beer': '1f37a',
		'bike': '1f6b2',
		'bomb': '1f4a3',
		'book': '1f4d6',
		'broken_heart': '1f493',
		'bulb': '1f4a1',
		'bus': '1f68d',
		'cake': '1f370',
		'calling': '1f4f1',
		'cat': '1f401',
		'computer': '1f4bb',
		'cool': '1f507',
		'cop': '1f46c',
		'couple': '1f46b',
		'dog': '1f436',
		'dolphin': '1f411',
		'email': '1f4e8',
		'feet': '1f463',
		'fish': '1f413',
		'gift': '1f4e7',
		'gun': '1f52f',
		'hammer': '1f52c',
		'heart': '2764',
		'kiss': '1f48a',
		'horse': '1f408',
		'iphone': '1f4f0',
		'koala': '1f417',
		'leaves': '1f343',
		'lips': '1f444',
		'lipstick': '1f483',
		'lock': '1f54b',
		'mag': '1f520',
		'mega': '1f4e4',
		'memo': '1f4dd',
		'moneybag': '1f4b0',
		'nail_care': '1f484',
		'new': '1f505',
		'ok': '1f502',
		'princess': '1f477',
		'rainbow': '1f308',
		'rose': '1f339',
		'runner': '1f6b6',
		'scissors': '2702',
		'shit': '1f4a9',
		'ski': '1f3bf',
		'skull': '1f47f',
		'smoking': '1f6ac',
		'sparkles': '2728',
		'star': '2b50',
		'sunflower': '1f33b',
		'sunny': '2600',
		'syringe': '1f488',
		'tm': '2122',
		'taxi': '1f695',
		'toilet': '1f6bf',
		'tophat': '1f3a9',
		'train': '1f686',
		'vs': '1f504',
		'warning': '26a0',
		'wheelchair': '267f',
		'zap': '26a1',
		'zzz': '1f4a4',
		'clap': '1f44d',
		'fist': '270a',
		'punch': '1f446',
		'v': '270c',
		'+1': '1f447',
		'-1': '1f44f'
	},

	insertAtCaret: function (input, value) {
		if (input.selectionStart || input.selectionStart === 0) {
			input.value = input.value.substring(0, input.selectionStart) + value + input.value.substring(input.selectionEnd, input.value.length);
			input.selectionStart = input.selectionEnd = input.selectionStart + value.length;
		} else {
			input.value += value;
		}
	},

	init: function () {
		$('#chat_controls').append('<div id="emojiButton-wrapper" class="tooltip"><img id="emojiButton" title="' + chrome.i18n.getMessage('emojiMenuTooltip') + '" src="' + chrome.extension.getURL("img/emoji.gif") + '" width="16" height="16"/><span id="emojiContainer" class="tooltip-inner"></span></div>');

		var $emojiButton = $('#emojiButton');
		var $emojiContainer = $('#emojiContainer');
		var emoji;
		for (emoji in this.EMOJIS) {
			$emojiContainer.append('<span class="emoji emoji' + this.EMOJIS[emoji] + '" title="' + emoji + '"></span>');
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
			chromefire.emoji.insertAtCaret($input[0], ':' + this.getAttribute('title') + ':');
			$input.focus();
		});
	}
};

$(function () {
	chromefire.emoji.init();
});
