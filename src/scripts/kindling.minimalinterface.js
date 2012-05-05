kindling.module(function () {
	'use strict';

	var isEnabled = false;
	var actions = [
		{
			selector : "#launchbar"
		},
		{
			selector : "#corner_logo"
		},
		{
			selector : "#Header"
		},
		{
			selector : "#Sidebar"
		},
		{
			selector : "div.Left",
			css : { "width" : "auto", "float" : "none", "margin-top" : "0" }
		},
		{
			selector : "#Wrapper",
			css : { "padding-left" : "10px", "padding-right" : "10px", "padding-top" : "10px" }
		},
		{
			selector : "div.speak",
			css : { "width" : "100%", "padding-top" : "25px", "padding-bottom" : "5px" }
		},
		{
			selector : "#chat_form > table",
			css : { "width" : "100%" }
		},
		{
			selector : "#chat_form > table td:first-child",
			css : { "width" : "75%" }
		},
		{
			selector : "#chat_form > table td:first-child textarea",
			css : { "width" : "100%" }
		},
		{
			selector : "#chat td.body div",
			css : { "width" : "94%" }
		}
	];

	function enableCleanMode() {
		actions.forEach(function(action) {
			var $element = $(action.selector);
			var css = action.css;

			if (css) {
				$element.css(css);
			} else {
				$element.hide();
			}
		});
	}

	function disableCleanMode() {
		actions.forEach(function(action) {
			$(action.selector).removeAttr('style');
		});
	}

	function onOptionsChanged(e, options) {
		var newValue = options.minimalInterface === 'true';
		if (newValue !== isEnabled) {
			isEnabled = newValue;
			if (isEnabled) {
				enableCleanMode();
			} else {
				disableCleanMode();
			}
		}
	}

	return {
		init: function () {
			$.subscribe('loaded optionsChanged', onOptionsChanged);
		}
	};
}());
