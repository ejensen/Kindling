var chromefire = chromefire || {};

chromefire.common = {
	regExpEscape: function (text) {
		var regex = new RegExp('[.*+?|()\\[\\]{}\\\\]', 'g');
		return text.replace(regex, '\\$&');
	},

	getUsernameRegex: function (username) {
		var escapedUsername = chromefire.common.regExpEscape(username);
		return new RegExp('\\b(' + escapedUsername + '|' + escapedUsername.split(' ').join('|') + ')\\b', 'i');
	},

	getDomain: function (url) {
		var regex = new RegExp('(chrome-extension|https?):\/\/(.[^/]+)');
		var match = url.match(regex);
		return match ? match[0] : '';
	}
};

jQuery.fn.extend({
	insertAtCaret: function (value) {
		return this.each(function () {
			if (this.selectionStart || this.selectionStart === 0) {
				this.value = this.value.substring(0, this.selectionStart) + value + this.value.substring(this.selectionEnd, this.value.length);
				this.selectionStart = this.selectionEnd = this.selectionStart + value.length;
			} else {
				this.value += value;
			}
		});
	}
});
