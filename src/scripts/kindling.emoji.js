kindling.module(function () {
	'use strict';

	var EMOJIS = [
		'apple',
		'beer',
		'egg',
		'eggplant',
		'cake',
		'tada',
		'flags',
		'art',
		'moneybag',
		'tophat',
		'bowtie',
		'mega',
		'fire',
		'bomb',
		'gun',
		'hammer',
		'smoking',
		'syringe',
		'feet',
		'airplane',
		'bike',
		'bus',
		'train',
		'taxi',
		'ski',
		'runner',
		'couple',
		'cop',
		'princess',
		'skull',
		'bear',
		'cat',
		'dog',
		'hamster',
		'koala',
		'cow',
		'horse',
		'fish',
		'dolphin',
		'computer',
		'iphone',
		'calling',
		'email',
		'memo',
		'book',
		'bulb',
		'scissors',
		'mag',
		'gift',
		'heart',,
		'broken_heart',
		'key',
		'lock',
		'unlock',
		'kiss',
		'lips',
		'lipstick',
		'nail_care',
		'poop',
		'toilet',
		'ok',
		'cool',
		'new',
		'vs',
		'wheelchair',
		'tm',
		'zzz',
		'warning',
		'zap',
		'sparkles',
		'star',
		'sunny',
		'rainbow',
		'rose',
		'sunflower',
		'leaves',
		'clap',
		'fist',
		'punch',
		'v',
		'thumbsup',
		'thumbsdown'
	];

	var MENU_ID = 'emojiButton-wrapper';

	function insertAtCaret(input, value) {
		if (input.selectionStart || input.selectionStart === 0) {
			input.value = input.value.substring(0, input.selectionStart) + value + input.value.substring(input.selectionEnd, input.value.length);
			input.selectionStart = input.selectionEnd = input.selectionStart + value.length;
		} else {
			input.value += value;
		}
	}

	function displayMenu() {
		if (document.getElementById(MENU_ID)) {
			return;
		}
		$('#chat_controls').append('<div id="' + MENU_ID + '" class="tooltip">\
				<img id="emojiButton" title="' + chrome.i18n.getMessage('emojiMenuTooltip') + '" src="' + chrome.extension.getURL('img/emoji.gif') + '" width="16" height="16"/>\
				<span id="emojiContainer" class="tooltip-inner"></span>\
		</div>');

		var $emojiButton = $('#emojiButton');
		var $emojiContainer = $('#emojiContainer');
		var emoji;
		for (emoji in EMOJIS) {
			$emojiContainer.append('<span class="emoji emoji-' + EMOJIS[emoji] + '" title="' + EMOJIS[emoji] + '"></span>');
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

	var onOptionsChanged = function (e, options) {
		if (options.soundAndEmojiMenus === 'true') {
			displayMenu();
		} else {
			$('#' + MENU_ID).remove();
		}
	};

	return {
		init: function () {
			$.subscribe('optionsChanged', onOptionsChanged);
		}
	};
}());
