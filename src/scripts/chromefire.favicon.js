chromefire.favicon = {
	iconElement: null,
	iconCanvas: null,
	badgedCanvas: [],
	iconSource: chromefire.common.getDomain(window.location.toString()) + '/favicon.ico',

	init: function () {
		$.subscribe('newMessage', this.onNewMessage);
		$.subscribe('optionsChanged', this.onOptionsChanged);
	},

	onNewMessage: function (e, options) {
		if (options.faviconCounter === 'true') {
			chromefire.favicon.updateIcon();
		}
	},

	getUnreadCount: function () {
		var unreadCount = 0;
		if (document.title.indexOf('(') === 0) {
			var end = document.title.indexOf(')', 1);
			if (end > 1) {
				unreadCount = parseInt(document.title.substring(1, end), 10);
			}
		}
		return unreadCount;
	},

	onOptionsChanged: function (e, options) {
		if (options.faviconCounter === 'true') {
			chromefire.favicon.updateIcon();
		} else {
			chromefire.favicon.resetIcon();
		}
	},

	resetIcon: function () {
		if (this.iconCanvas) {
			this.updateIconElement(this.iconCanvas);
		}
	},

	updateIcon: function () {
		if (!this.iconElement) {
			this.injectIcon();
		}
		var unreadCount = chromefire.favicon.getUnreadCount();
		if (unreadCount < 1) {
			this.resetIcon();
		} else {
			this.getBadgedIconCanvas(unreadCount, this.updateIconElement);
		}
	},

	updateIconElement: function (newIconCanvas) {
		chromefire.favicon.iconElement.href = newIconCanvas.toDataURL('image/png');
	},

	getBadgedIconCanvas: function (unreadCount, callback) {
		if (!this.badgedCanvas[unreadCount]) {
			this.getIconCanvas(function (iconCanvas) {
				var canvas = document.createElement('canvas');
				canvas.height = canvas.width = chromefire.favicon.iconCanvas.width;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(chromefire.favicon.iconCanvas, 0, -1);

				ctx.textBaseline = 'top';
				ctx.textAlign = 'left';
				ctx.font = '10px san-sarif';
				ctx.fillStyle = 'rgba(0, 0, 0, 0.85)';
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.75)';
				ctx.lineWidth = 2;

				var valueWidth = ctx.measureText(unreadCount);
				var left = 16 - valueWidth.width - ctx.lineWidth / 2;
				var top = 6 - ctx.lineWidth / 2;

				ctx.strokeText(unreadCount, left, top);
				ctx.fillText(unreadCount, left, top);
				
				chromefire.favicon.badgedCanvas[unreadCount] = canvas;
				callback(chromefire.favicon.badgedCanvas[unreadCount]);
			});
		} else {
			callback(this.badgedCanvas[unreadCount]);
		}
	},

	getIconCanvas: function (callback) {
		if (!this.iconCanvas) {
			this.iconCanvas = document.createElement('canvas');
			this.iconCanvas.height = this.iconCanvas.width = 16;
			var ctx = this.iconCanvas.getContext('2d');
			var image = new Image();
			image.onload = function () {
				ctx.drawImage(image, 0, 0);
				callback(this.iconCanvas);
			};
			image.src = this.iconSource;
		} else {
			callback(this.iconCanvas);
		}
	},

	injectIcon: function () {
		this.iconElement = document.createElement('link');
		this.iconElement.href = this.iconSource;
		this.iconElement.rel = 'icon';
		this.iconElement.type = 'image/x-icon';
		document.head.appendChild(this.iconElement);
		
		window.onbeforeunload = function () {
			chromefire.favicon.iconElement.href = chromefire.favicon.iconSource;
		};
	}
};

chromefire.favicon.init();
