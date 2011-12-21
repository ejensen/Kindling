kindling.module(function () {
	'use strict';

	var iconElement = null;
	var iconCanvas = null;
	var badgedCanvas = [];
	var enabled = false;
	var iconSource = kindling.getDomain(window.location.toString()) + '/favicon.ico';

	function getUnreadCount() {
		var unreadCount = 0;
		if (document.title.indexOf('(') === 0) {
			var end = document.title.indexOf(')', 1);
			if (end > 1) {
				unreadCount = parseInt(document.title.substring(1, end), 10);
			}
		}
		return unreadCount;
	}

	function updateIconElement(newIconCanvas) {
		iconElement.href = newIconCanvas.toDataURL('image/png');
	}

	function getIconCanvas(callback) {
		if (!iconCanvas) {
			iconCanvas = document.createElement('canvas');
			iconCanvas.height = iconCanvas.width = 16;
			var ctx = iconCanvas.getContext('2d');
			var image = new Image();
			image.onload = function () {
				ctx.drawImage(image, 0, 0);
				callback(iconCanvas);
			};
			image.src = iconSource;
		} else {
			callback(iconCanvas);
		}
	}

	function injectIcon() {
		iconElement = document.createElement('link');
		iconElement.href = iconSource;
		iconElement.rel = 'icon';
		iconElement.type = 'image/x-icon';
		document.head.appendChild(iconElement);

		window.onbeforeunload = function () {
			iconElement.href = iconSource;
		};
	}

	function getBadgedIconCanvas(unreadCount, callback) {
		if (!badgedCanvas[unreadCount]) {
			getIconCanvas(function (iconCanvas) {
				var canvas = document.createElement('canvas');
				canvas.height = canvas.width = iconCanvas.width;
				var ctx = canvas.getContext('2d');
				ctx.drawImage(iconCanvas, 0, -1);

				ctx.textBaseline = 'top';
				ctx.textAlign = 'left';
				ctx.font = '10px san-sarif';
				ctx.fillStyle = 'rgba(0, 0, 0, 1.0)';
				ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
				ctx.lineWidth = 3;

				var valueWidth = ctx.measureText(unreadCount);
				var left = 16 - valueWidth.width - ctx.lineWidth / 2;
				var top = 6 - ctx.lineWidth / 2;

				ctx.strokeText(unreadCount, left, top);
				ctx.fillText(unreadCount, left, top);

				badgedCanvas[unreadCount] = canvas;
				callback(badgedCanvas[unreadCount]);
			});
		} else {
			callback(badgedCanvas[unreadCount]);
		}
	}

	function resetIcon() {
		if (iconCanvas) {
			updateIconElement(iconCanvas);
		}
	}

	function updateIcon() {
		if (!iconElement) {
			injectIcon();
		}
		var unreadCount = getUnreadCount();
		if (unreadCount < 1) {
			resetIcon();
		} else {
			getBadgedIconCanvas(unreadCount, updateIconElement);
		}
	}

	function onTitleChanged() {
		if (enabled) {
			updateIcon();
		}
	}

	function onOptionsChanged(e, options) {
		enabled = (options.faviconCounter === 'true');
		if (enabled) {
			updateIcon();
		} else {
			resetIcon();
		}
	}

	return {
		init: function () {
			var titleElem = document.getElementsByTagName('title')[0];
			document.documentElement.addEventListener('DOMSubtreeModified', function (e) {
				if (e.target === titleElem || (e.target.parentNode && e.target.parentNode === titleElem)) {
					onTitleChanged();
				}
			});

			$.subscribe('optionsChanged', onOptionsChanged);
		}
	};
})();
