chromefire.emoji = {
	init: function () {
		$.subscribe('optionsChanged', this.optionsChanged);
		this.addMenu();
	},

	optionsChanged: function (e, options) {
	},
	
	addMenu: function () {
		var $chatControls = $('#chat_controls');
		$chatControls.append('<img id="emojiButton" height="16" width="16"'
			+ ' alt="Click to select an emoji to insert..."' //TODO: localize
			+ ' title="Hi"'
			+ ' src="' + chrome.extension.getURL("img/emoji.png") + '"/>');
		$('#emojiButton').tooltip({ effect: 'slide'});
	}
};

//$(function(){
//	chromefire.emoji.init();
//});
