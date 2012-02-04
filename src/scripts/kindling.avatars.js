// concept borrowed from http://chalbach.com/campfire-avatars
kindling.module(function () {
	'use strict';

	var isEnabled = false;

	function getAvatar($person) {
		var $author = $person.find('.author');
		if (!$author.is(':visible')) {
			return null;
		}

		var el = document.createElement('img');
		$(el).attr('src', $author.data('avatar'))
			.addClass('avatar');
		return el;
	}

	function moveAuthorToBody($message) {
		var $author = $message.find('.author');
		
		$author.data('short-name', $author.text());
		$author.html('');
		
		if ($author.css('display') === 'none') {
			return;
		}

		var $bodyAuthor = $(document.createElement('h4'));
		$bodyAuthor.html($author.data('name'))
			.addClass('inline-author');

		var $messageBody = $message.find('td.body');
		$messageBody.css('vertical-align', 'top');

		$messageBody.prepend($bodyAuthor);
	}

	function tryToAddAvatar($person) {
		var messageId = $person.parent().attr('id');
		if (!messageId) {
			return false;
		}

		var avatar = getAvatar($person);
		if (!avatar) {
			return false;
		}

		var $message = $person.parent();
		if (!$message.find('td.body').find('div').hasClass('body')) {
			return false;
		}

		$person.append(avatar);
		moveAuthorToBody($message);
		return true;
	}

	function removeAuthorFromBody($message) {
		var $messageBody = $message.find('td.body');
		$messageBody.css('vertical-align', '');
		
		$message.find('.inline-author').remove();

		var $author = $message.find('.author');
		$author.html($author.data('short-name'));
	}

	function tryToRemoveAvatar($person) {
		var $avatar = $person.find('.avatar');
		if (!$avatar) {
			return false;
		}
		$avatar.remove();

		removeAuthorFromBody($person.parent());
		return true;
	}

	function visitPersonElements(visiter) {
		var modified = false;
		$('.person').each(function(i, e) { modified |= visiter($(e)); });

		if (modified) {
			kindling.scrollToBottom();
		}
	}

	function onOptionsChanged(e, options) {
		var enabled = options.showAvatarsInChat === 'true';
		if (enabled !== isEnabled) {
			if (enabled) {
				visitPersonElements(tryToAddAvatar);
			} else {
				visitPersonElements(tryToRemoveAvatar);
			}
			isEnabled = enabled;
		}
	}

	function onNewMessage(e, options, username, message) {
		if (options.showAvatarsInChat === 'true') {
			var $person = $(message).find('.person').first();
			if ($person && tryToAddAvatar($person)) {
				kindling.scrollToBottom();
			}
		}
	}

	return {
		init: function () {
			$.subscribe('optionsChanged', onOptionsChanged);
			$.subscribe('newMessage', onNewMessage);
		}
	};
}());
