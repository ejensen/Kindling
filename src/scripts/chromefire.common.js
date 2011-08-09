var chromefire = chromefire || {};

chromefire.common = {
	regExpEscape: function (text) {
		var regex = new RegExp('[.*+?|()\\[\\]{}\\\\]', 'g');
		return text.replace(regex, '\\$&');
	},
	getDomain: function (url) {
		var regex = new RegExp('(chrome-extension|https?):\/\/(.[^/]+)');
		var match = url.match(regex);
		return match ? match[0] : '';
	}
};
