(function () {
	'use strict';

	if (window.chat && window.chat.username) {
		var usernameElem = document.createElement('span');
		usernameElem.id = 'campsite_username';
		usernameElem.style.display = 'none';
		usernameElem.innerText = window.chat.username;
		document.getElementById('chat-wrapper').appendChild(usernameElem);
	}
}());
