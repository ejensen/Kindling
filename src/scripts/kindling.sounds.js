kindling.module(function () {
	'use strict';

	var SOUNDS = {
		'56k': '56k',
		'Bueller?': 'bueller',
		'Crickets chirping': 'crickets',
		'Danger zone': 'dangerzone',
		'Do it live!': 'live',
		'Drama': 'drama',
		'Great job': 'greatjob',
		'Hey girl' : 'heygirl',
		'Horn': 'horn',
		'Inconceivable' : 'inconceivable',
		'Kenny Loggins': 'loggins',
		'Noooo': 'noooo',
		'Nyan cat': 'nyan',
		'Oh my': 'ohmy',
		'Oh yeah': 'ohyeah',
		'Push it': 'pushit',
		'Rimshot': 'rimshot',
		'Sad trombone': 'trombone',
		'Saxaphone': 'sax',
		'Secret area': 'secret',
		'Ta-da!' : 'tada',
		'The horror': 'horror',
		'The More You Know': 'tmyk',
		'Vuvuzela': 'vuvuzela',
		'Yeeeaaah!': 'yeah',
		'Yodel': 'yodel'
	};

	var MENU_ID = 'soundButton-wrapper';

	function displayMenu() {
		if (document.getElementById(MENU_ID)) {
			return;
		}
		$('#chat_controls').append('<div id="' + MENU_ID + '" class="tooltip">\
				<img id="soundButton" title="' + chrome.i18n.getMessage('soundMenuTooltip') + '" src="' + chrome.extension.getURL('img/sound.gif') + '" width="18" height="15" />\
				<span id="soundContainer" class="tooltip-inner"></span>\
		</div>');

		var $soundButton = $('#soundButton');
		var $soundContainer = $('#soundContainer');
		var sound;
		for (sound in SOUNDS) {
			$soundContainer.append('<a class="sound" data-value="' + SOUNDS[sound] + '">' + sound + '</a>');
		}

		$(document).click(function (e) {
			if (e.target.id !== 'soundButton' && $soundButton.find(e.target).length === 0) {
				$soundContainer.hide();
			} else {
				$soundContainer.toggle();
			}
		});

		$soundContainer.children('.sound').click(function () {
			var input = document.getElementById('input');
			var oldValue = input.value;
			input.value = '/play ' + this.getAttribute('data-value');
			document.getElementById('send').click();
			input.value = oldValue;
		});
	}

	function onOptionsChanged(e, options) {
		if (options.soundAndEmojiMenus === 'true') {
			displayMenu();
		} else {
			$('#' + MENU_ID).remove();
		}
	}

	return {
		init: function () {
			$.subscribe('optionsChanged', onOptionsChanged);
		}
	};
}());
