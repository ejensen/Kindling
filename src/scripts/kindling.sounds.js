kindling.module(function () {
	'use strict';

	var SOUNDS = {
		'Crickets chirping': 'crickets',
		'Do it live!': 'live',
		'Drama': 'drama',
		'Great job': 'greatjob',
		'Nyan cat': 'nyan',
		'Push it': 'pushit',
		'Oh, my': 'ohmy',
		'Rimshot': 'rimshot',
		'Sad trombone': 'trombone',
		'Secret area': 'secret',
		'Ta-da!' : 'tada',
		'The More You Know': 'tmyk',
		'Yeeeaaah!': 'yeah',
		'Vuvuzela': 'vuvuzela'
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
