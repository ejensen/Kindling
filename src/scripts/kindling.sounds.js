kindling.module(function () {
	'use strict';

	var SOUNDS = {
		'56k': '56k',
		'Bell': 'bell',
		'Bueller?': 'bueller',
		'Clown town': 'clowntown',
		'Crickets chirping': 'crickets',
		'Danger zone': 'dangerzone',
		'Deeper': 'deeper',
		'Do it live!': 'live',
		'Drama': 'drama',
		'Great job': 'greatjob',
		'Hey girl' : 'heygirl',
		'Horn': 'horn',
		'Inconceivable' : 'inconceivable',
		'Jeff Bezos': 'bezos',
		'Kenny Loggins': 'loggins',
		'Make it so': 'makeitso',
		'Noooo': 'noooo',
		'Nyan cat': 'nyan',
		'Oh my': 'ohmy',
		'Oh yeah': 'ohyeah',
		'Push it': 'pushit',
		'Rimshot': 'rimshot',
		'Sad trombone': 'trombone',
		'Saxaphone': 'sax',
		'Secret area': 'secret',
		'Sexy back': 'sexyback',
		'Ta-da!' : 'tada',
		'The horror': 'horror',
		'The More You Know': 'tmyk',
		'Trololo': 'trololo',
		'Vuvuzela': 'vuvuzela',
		'What up with that?': 'what',
		'Whoomp': 'whoomp',
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
				<div id="soundContainer" class="tooltip-outer"><div class="tooltip-inner"></div></div>\
		</div>');

		var $soundButton = $('#soundButton');
		var $soundContainer = $('#soundContainer');
		var $tooltipInner = $soundContainer.find('.tooltip-inner');
		var sound;
		for (sound in SOUNDS) {
			$tooltipInner.append('<a class="sound" data-value="' + SOUNDS[sound] + '">' + sound + '</a>');
		}

		$(document).click(function (e) {
			if (e.target.id !== 'soundButton' && $soundButton.find(e.target).length === 0) {
				$soundContainer.hide();
			} else {
				$soundContainer.toggle();
			}
		});

		$tooltipInner.children('.sound').click(function () {
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

	function onLoaded() {
		var soundMap = $.map(SOUNDS, function(value, i) { return { key: value, name: i }; });
		$('#input').atwho('/play ', {
			limit: 35,
			data: soundMap,
			callbacks: {
				matcher: function(flag, subtext) {
					var match, matched, regexp;
					regexp = new RegExp('^' + flag + '([A-Za-z0-9_\+\-]*)$', 'gi');
					match = regexp.exec(subtext);
					matched = null;
					if (match) {
						matched = match[2] ? match[2] : match[1];
					}
					return matched;
				},
				sorter: function (query, items, search_key) {
					if (!query) {
						return items;
					}
					return items.sort(function(a, b) {
						return a[search_key].localeCompare(b[search_key]);
					});
				},
				highlighter: function(li, query) {
					return li;
				}
			},
			tpl:'<li data-value="${key}"><img height="12" src="/images/sound.png?1359156757" width="12"> ${name}</li>'
		});
	}

	return {
		init: function () {
			$.subscribe('loaded', onLoaded);
			$.subscribe('optionsChanged', onOptionsChanged);
		}
	};
}());
