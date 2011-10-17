chromefire.emoji = {
	EMOJIS: {
		'bulb': '1f4a1',
		'calling': '1f4f1',
		'cop': '1f46c',
		'email': '1f4e8',
		'feet': '1f463',
		'fish': '1f413',
		'gift': '1f4e7',
		'hammer': '1f52c',
		'heart': '2764',
		'leaves': '1f343',
		'lipstick': '1f483',
		'lock': '1f54b',
		'mag': '1f520',
		'mega': '1f4e4',
		'memo': '1f4dd',
		'moneybag': '1f4b0',
		'new': '1f505',
		'ok': '1f502',
		'runner': '1f6b6',
		'scissors': '2702',
		'smoking': '1f6ac',
		'sparkles': '2728',
		'star': '2b50',
		'sunny': '2600',
		'tm': '2122',
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

		$emojiContainer.children('.emoji').click(function () {
			$('#input').insertAtCaret(':' + this.getAttribute('title') + ':').focus();
		});
	}
};

$(function () {
	chromefire.emoji.init();
});
