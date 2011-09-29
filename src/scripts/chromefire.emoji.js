chromefire.emoji = {
	emojis: {
		'sunny': '2600',
		'zap': '26a1',
		'leaves': '1f343',
		'lipstick': '1f483',
		'hammer': '1f52c',
		'cop': '1f46c',
		'wheelchair': '267f',
		'fish': '1f413',
		'moneybag': '1f4b0',
		'memo': '1f4dd',
		'mega': '1f4e4',
		'gift': '1f4e7',
		'scissors': '2702',
		'feet': '1f463',
		'runner': '1f6b6',
		'heart': '2764',
		'smoking': '1f6ac',
		'warning': '26a0',
		'tm': '2122',
		'ok': '1f502',
		'vs': '1f504',
		'new': '1f505',
		'bulb': '1f4a1',
		'zzz': '1f4a4',
		'sparkles': '2728',
		'star': '2b50',
		'mag': '1f520',
		'lock': '1f54b',
		'calling': '1f4f1',
		'email': '1f4e8',
		'v': '270c',
		'fist': '270a',
		'punch': '1f446',
		'clap': '1f44d',
		'+1': '1f447',
		'-1': '1f44f'
	},

	init: function () {
		$.subscribe('optionsChanged', this.optionsChanged);
		this.addMenu();
	},

	optionsChanged: function (e, options) {
	},

	addMenu: function () {
		$('#chat_controls').append('<div id="emojiButton" class="tooltip" style="background-image:url(\'' + chrome.extension.getURL("img/emoji.png") + '\')"><span id="emojiContainer" class="tooltip-inner"></span></div>');

		var $emojiContainer = $('#emojiContainer');
		var emoji;
		for (emoji in this.emojis) {
			$emojiContainer.append('<span class="emoji emoji' + this.emojis[emoji] + '" data-value="' + emoji + '"></span>');
		}

		$('#emojiButton').click(function () {
			$emojiContainer.toggle();
		});

		$(document).click(function (e) {
			if (e.target.id !== 'emojiButton') {
				$emojiContainer.hide();
			}
		});

		$emojiContainer.children('.emoji').click(function () {
			$('#input').insertAtCaret(':' + this.getAttribute('data-value') + ':');
		});
	}
};

$(function () {
	chromefire.emoji.init();
});
