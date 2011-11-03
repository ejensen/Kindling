chromefire.sounds = {
	SOUNDS: {
		'Crickets chirping': 'crickets',
		'Do it live!': 'live',
		'Drama': 'drama',
		'Great job': 'greatjob',
		'Push it': 'pushit',
		'Rimshot': 'rimshot',
		'Sad trombone': 'trombone',
		'Secret Area': 'secret',
		'Ta-da!' : 'tada',
		'The More You Know': 'tmyk',
		'Yeeeaah!': 'yeah',
		'Vuvuzela': 'vuvuzela'
	},

	init: function () {
		$('#chat_controls').append('<div id="soundButton-wrapper" class="tooltip"><img id="soundButton" title="' + chrome.i18n.getMessage('soundMenuTooltip') + '" src="' + chrome.extension.getURL("img/sound.gif") + '" width="18" height="15" /><span id="soundContainer" class="tooltip-inner"></span></div>');
		
		var $soundButton = $('#soundButton');
		var $soundContainer = $('#soundContainer');
		var sound;
		for (sound in this.SOUNDS) {
			$soundContainer.append('<a class="sound" data-value="' + this.SOUNDS[sound] + '">' + sound + '</a>');
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
};

$(function () {
	chromefire.sounds.init();
});
