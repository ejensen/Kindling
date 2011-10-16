chromefire.sounds = {
	SOUNDS: {
		'Crickets chirping': 'crickets',
		'Do it live!': 'live',
		'Great job': 'greatjob',
		'Rimshot': 'rimshot',
		'Sad trombone': 'trombone',
		'The More You Know': 'tmyk',
		'Vuvuzela': 'vuvuzela'
	},

	init: function () {
		$('#chat_controls').append('<div id="soundButton" title="' + chrome.i18n.getMessage('soundMenuTooltip') + '" class="tooltip" style="background-image:url(\'' + chrome.extension.getURL("img/sound.gif") + '\')"><span id="soundContainer" class="tooltip-inner"></span></div>');
		
		var $soundContainer = $('#soundContainer');
		var sound;
		for (sound in this.SOUNDS) {
			$soundContainer.append('<a class="sound" data-value="' + this.SOUNDS[sound] + '">' + sound + '</a>');
		}

		$('#soundButton').click(function () {
			$soundContainer.toggle();
		});

		$(document).click(function (e) {
			if (e.target.id !== 'soundButton') {
				$soundContainer.hide();
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
