// concept borrowed from http://chalbach.com/campfire-avatars
kindling.module(function () {
	'use strict';

	var isEnabled = false;

	function getAvatar(personEl) {
		var $author = $(personEl).find('.author');
		if (!$author.is(':visible')) {
			return null;
		}

		var el = document.createElement('img');
		$(el).attr('src', $author.attr('data-avatar'))
			.addClass('avatar');
		return el;
	}

	function moveAuthorToBody($message) {
		var $author = $message.find('.author');
		$author.hide();

		var $bodyAuthor = $(document.createElement('h4'));
		$bodyAuthor.html($author.html() + ' ')
			.addClass('inline-author');

		var $messageBody = $message.find('td.body');
		$messageBody.css('vertical-align', 'top');

		$messageBody.prepend($bodyAuthor);
	}

	function removeAuthorFromBody($message) {
		var $messageBody = $message.find('td.body');
		$messageBody.css('vertical-align', '');

		$message.find('.author').show();
		$message.find('.inline-author').remove();
	}

	function tryToAddAvatar(person) {
		var messageId = $(person).parent().attr('id');
		if (!messageId) {
			return false;
		}

		var avatar = getAvatar(person);
		if (!avatar) {
			return false;
		}
		
		var $message = $(person).parent();
		if (!$message.find('td.body').find('div').hasClass('body')) {
			return false;
		}
		
		$(person).append(avatar);
		moveAuthorToBody($message);
		return true;
	}

	function tryToRemoveAvatar(person) {
		var $avatar = $(person).find('.avatar');
		if (!$avatar) {
			return false;
		}
		$avatar.remove();

		removeAuthorFromBody($(person).parent())

		return true;
	}

	function scrollChatToBottom() {
		var pageHeight = Math.max(document.documentElement.offsetHeight, document.body.scrollHeight);
		var targetY = pageHeight + window.innerHeight + 100;
		window.scrollTo(0, targetY);
	}

	function visitPersonElements(visiter) {
		var modified = false;
		var $people = $('.person');
		var i;
		for (i = $people.size() - 1; i >= 0; i--) {
			modified = visiter($people[i]);
		}

		if (modified) {
			scrollChatToBottom();
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
			var $person = $(message).find('.person');
			if ($person[0] && tryToAddAvatar($person[0])) {
				scrollChatToBottom();
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
