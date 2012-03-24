// concept from http://chalbach.com/campfire-avatars
kindling.module(function () {
	'use strict';

	var isEnabled = false;
	var largeAvatars = false;

	function moveAuthorToMessage($author, $message) {
		$author.data('short-name', $author.text());
		$author.html('');

		var $messageBody = $message.find('td.body');
		$messageBody.css('vertical-align', 'top');

		var $bodyAuthor = $('<h4 class="inline-author">' + $author.data('name') + '</h4>');
		$messageBody.prepend($bodyAuthor);
	}

	function removeAuthorFromMessage($author, $message) {
		var $messageBody = $message.find('td.body');
		$messageBody.css('vertical-align', '');

		$message.find('.inline-author').remove();

		$author.html($author.data('short-name'));
	}

	function getAvatar($person) {
		var $author = $person.find('.author');
		if ($author.css('display') === 'none') {
			return null;
		}
		return $('<img class="avatar" alt="' + $author.data('name') + '" src="' + $author.data('avatar') + '"/>');
	}

	function tryToAddAvatar($person) {
		var $message = $person.parent();
		if (!$message.find('td.body div.body').length || $message.find('.inline-author').length) {
			return false;
		}

		var $avatar = getAvatar($person);
		if (!$avatar) {
			return false;
		}

		var $author = $message.find('.author');
		if ($author.css('display') === 'none') {
			return false;
		}

		moveAuthorToMessage($author, $message);

		if (largeAvatars) {
			$avatar.addClass('large');
		}

		$person.append($avatar);

		return true;
	}

	function tryToRemoveAvatar($person) {
		var $avatar = $person.find('.avatar');
		if (!$avatar) {
			return false;
		}

		$avatar.remove();
		var $message = $person.parent();
		if ($message) {
			removeAuthorFromMessage($message.find('.author'), $message);
		}

		return true;
	}

	function visitPersonElements(visiter) {
		var modified = false;
		$('.person').each(function (i, e) { modified |= visiter($(e)); });

		if (modified) {
			kindling.scrollToBottom();
		}
	}

	function onOptionsChanged(e, options) {
		var newValue = options.showAvatarsInChat === 'true';
		if (newValue !== isEnabled) {
			isEnabled = newValue;
			if (isEnabled) {
				visitPersonElements(tryToAddAvatar);
			} else {
				visitPersonElements(tryToRemoveAvatar);
			}
		}

		newValue = options.useLargeAvatars === 'true';
		if (newValue !== largeAvatars) {
			largeAvatars = newValue;
			if (largeAvatars) {
				$('.avatar').addClass('large');
			} else {
				$('.avatar').removeClass('large');
			}
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
