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

	function moveAuthorToBody($messageEl) {
		var $author = $messageEl.find('.author');
		$author.hide();

		var $bodyAuthor = $(document.createElement('h4'));
		$bodyAuthor.html($author.html() + ' ')
			.addClass('inline-author');

		var $messageBody = $messageEl.find('td.body');
		$messageBody.css('vertical-align', 'top');

		var $messageDiv = $messageBody.find('div');
		if (!$messageDiv.hasClass('body')) {
			var messageSpan = document.createElement('span');
			$(messageSpan).html($messageDiv.html())
				.addClass('inline-message');

			$messageBody.html(messageSpan);

			$bodyAuthor.css('display', 'inline');
		}

		$messageBody.prepend($bodyAuthor);
	}

	function removeAuthorFromBody($messageEl) {
		var $messageBody = $messageEl.find('td.body');
		$messageBody.css('vertical-align', '');

		var $inlineMessage = $messageBody.find('.inline-message');
		if ($inlineMessage[0]) {
			var messageDiv = document.createElement('div');
			$(messageDiv).html($inlineMessage.html())
			$messageBody.html(messageDiv);
		}

		$messageEl.find('.author').show();
		$messageEl.find('.inline-author').remove();
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

		$(person).append(avatar);
		moveAuthorToBody($(person).parent());
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
