/*
	jQuery Coda-Slider v2.0 - http://www.ndoherty.biz/coda-slider
	Copyright (c) 2009 Niall Doherty
	This plugin available for use in all personal or commercial projects under both MIT and GPL licenses.
*/
var sliderCount = 1;

$.fn.codaSlider = function (settings) {
	settings = $.extend({
		autoHeight: true,
		autoHeightEaseDuration: 450,
		autoHeightEaseFunction: "easeInOutExpo",
		firstPanelToLoad: 1,
		slideEaseDuration: 450,
		slideEaseFunction: "easeInOutExpo"
	}, settings);

	return this.each(function () {
		var slider = $(this);
		var panelWidth = slider.find(".panel").width();
		var panelCount = slider.find(".panel").size();
		var panelContainerWidth = panelWidth * panelCount;

		// Surround the collection of panel divs with a container div (wide enough for all panels to be lined up end-to-end)
		$('.panel', slider).wrapAll('<div class="panel-container"></div>');
		// Specify the width of the container div (wide enough for all panels to be lined up end-to-end)
		$(".panel-container", slider).css({ width: panelContainerWidth });

		var currentPanel = 1;

		// If we need a tabbed nav
		$('#coda-nav-' + sliderCount + ' a').each(function (z) {
			// What happens when a nav link is clicked
			$(this).bind("click", function () {
				$(this).addClass('current').parents('ul').find('a').not($(this)).removeClass('current');
				var offset = -(panelWidth * z);
				alterPanelHeight(z);
				currentPanel = z + 1;
				$('.panel-container', slider).animate({ marginLeft: offset }, settings.slideEaseDuration, settings.slideEaseFunction);
			});
		});

		$("#coda-nav-" + sliderCount + " a:eq(0)").addClass("current");

		alterPanelHeight(currentPanel - 1);

		function alterPanelHeight(x) {
			if (settings.autoHeight) {
				slider.css({ height: $('.panel:eq(' + (currentPanel - 1) + ')', slider).height() });
				$('.panel', slider).css({'height': 'auto'});
				var panelHeight = $('.panel:eq(' + x + ')', slider).height();
				slider.animate({ height: panelHeight }, settings.autoHeightEaseDuration, settings.autoHeightEaseFunction,
					function () {
						$('.panel', slider).not('.panel:eq(' + (currentPanel - 1) + ')').css({'height': '1px'});
						slider.css({ height: 'inherit' });
					});
			}
		}

		sliderCount++;
	});
};