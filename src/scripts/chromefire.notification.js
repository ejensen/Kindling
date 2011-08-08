chromefire.notification = {
	variables: null,

	init: function () {
		$('#author').html(this.getQueryVariable('author'));
		$('#room').html(this.getQueryVariable('room'));

		this.injectCss(this.getQueryVariable('baseUrl') + '/stylesheets/emoji.css');

		this.loadAvatar();

		var $content = $('#content');
		$content.html(location.hash.substring(1));
		$content.find('img').each(function () {
			if (chromefire.notification.isRelative(this.src)) {
				this.src = chromefire.notification.getQueryVariable('baseUrl') + this.src.substring(chromefire.common.getDomain(this.src).length);
			}
		});

		$content.find('a').each(function () {
			if (chromefire.notification.isRelative(this.href)) {
				this.href = chromefire.notification.getQueryVariable('baseUrl') + this.pathname + this.search;
			}
		});
		$content.find('img').css('max-width', 226).css('max-height', 118).css('background-size', 'contain');

		if (localStorage.highlightName === 'true') {
			var username = chromefire.common.regExpEscape(this.getQueryVariable('user'));
			var regex = new RegExp('\\b(' + username + '|' + username.split(' ').join('|') + ')\\b', 'i');
			$content.highlightRegex(regex, { className: 'nameHighlight', tagType: 'mark' });
		}

		if (localStorage.autoDismiss === 'true') {
			setTimeout(function () { window.close(); }, localStorage.notificationTimeout);
		}
	},

	parseQueryVariables: function () {
		this.variables = {};
		var query = window.location.search.substring(1);
		var vars = query.split('&');
		var i;
		for (i = 0; i < vars.length; i++) {
			var pair = vars[i].split('=');
			this.variables[pair[0]] = unescape(pair[1]);
		}
	},

	getQueryVariable: function (variable) {
		if (!this.variables) {
			this.parseQueryVariables();
		}
		return this.variables[variable];
	},

	loadAvatar: function () {
		var avatar = this.getQueryVariable('avatar');
		if (avatar && avatar !== 'undefined' && (localStorage.showAvatars === 'true')) {
			document.getElementById('avatar').src = avatar;
		}
	},

	isRelative: function (url) {
		return url && (url.indexOf('/') === 0 || url.indexOf('chrome-extension://') === 0);
	},

	injectCss: function (link) {
		var lnk = document.createElement('link');
		lnk.rel = 'stylesheet';
		lnk.href = link;
		(document.head || document.body).appendChild(lnk);
	}
};

$(document).ready(function () {
	chromefire.notification.init();
});
