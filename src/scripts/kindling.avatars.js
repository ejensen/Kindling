// mostly borrowed from http://chalbach.com/campfire-avatars
kindling.module(function () {
	'use strict';

	function getAvatar(personEl) {
		var $author = $(personEl).find('.author');
		if (!$author.is(':visible')) {
			return null;
		}
		
		var el = document.createElement('img');
		$(el).attr('src', $author.attr('data-avatar')).addClass('avatar');
		return el;
	}

	function shiftAuthorToBody(messageEl) {
		var $author = $(messageEl).find('.author');
		$author.remove();

		var $bodyAuthor = $(document.createElement('h4'));
		$bodyAuthor.html($author.html());
		$bodyAuthor.css('margin-bottom', '.5em');

		var $messageBody = $(messageEl).find('td.body');
		$messageBody.css('vertical-align', 'top');

		var $messageDiv = $messageBody.find('div');
		if (!$messageDiv.hasClass('body')) {
			$bodyAuthor.css('display', 'inline');

			var messageSpan = document.createElement('span');
			$(messageSpan).html(' ' + $messageDiv.html());
			$messageBody.html(messageSpan);
		}

		$messageBody.prepend($bodyAuthor);
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

		$(person).css('text-align', 'center').append(avatar);
		shiftAuthorToBody($(person).parent());
		return true;
	}
	
	function scrollChatToBottom() {
		var pageHeight = Math.max(document.documentElement.offsetHeight, document.body.scrollHeight);
		var targetY = pageHeight + window.innerHeight + 100;
		window.scrollTo(0, targetY);
	}

	function addAvatars() {
		var modified = false;
		var $people = $('.person');
		var i;
		for (i = $people.size() - 1; i >= 0; i--) {
			modified = tryToAddAvatar($people[i]);
		}

		if (modified) {
			scrollChatToBottom();
		}
	}

	var onNewMessage = function (e, options, username, message) {
		var $person = $(message).find('.person');
		if ($person[0] && tryToAddAvatar($person[0])) {
			scrollChatToBottom();
		}
	};

	return {
		init: function () {
			$.subscribe('optionsChanged', addAvatars);
			$.subscribe('newMessage', onNewMessage);
		}
	};
}());
