kindling.module(function () {
	'use strict';

	var originalTheme = null;

	function getThemeLink() {
		return $('link[title=Theme]');
	}

	function onLoaded () {
		originalTheme = getThemeLink().attr('href');
	}

	function onOptionsChanged(e, options) {
		if (options.useDifferentTheme === 'true' && options.themeColor) {
			getThemeLink().attr('href', '/stylesheets/' + options.themeColor + '.css');
		} else {
			getThemeLink().attr('href', originalTheme);
		}
	}

	return {
		init: function () {
			$.subscribe('loaded', onLoaded);
			$.subscribe('optionsChanged', onOptionsChanged);
		}
	};
}());
