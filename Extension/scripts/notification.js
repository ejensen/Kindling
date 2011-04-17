var variables;

function parseQueryVariables() {
	variables = {};
	var query = window.location.search.substring(1);
	var vars = query.split('&');
	var i;
	for (i = 0; i < vars.length; i++) {
		var pair = vars[i].split('=');
		variables[pair[0]] = unescape(pair[1]);
	}
}

function getQueryVariable(variable) {
	if (variables === undefined) {
		parseQueryVariables();
	}
	return variables[variable];
}

function loadAvatar() {
	var avatar = getQueryVariable("avatar");
	if (avatar && avatar !== "undefined" && (localStorage.showAvatars === 'true')) {
		document.getElementById("avatar").src = avatar;
	}
}

function regExpEscape(text) {
	var regex = new RegExp("[.*+?|()\\[\\]{}\\\\]", 'g');
	return text.replace(regex, "\\$&");
}

function isRelative(url) {
	return url && (url.indexOf('/') === 0 || url.indexOf("chrome-extension://") === 0);
}

function getDomain(url) { //TODO: remove duplication
	var regex = new RegExp("chrome-extension:\/\/(.[^/]+)");
	var match = url.match(regex);
	return match ? match[0] : "";
}

function injectCss(link) {
	var lnk = document.createElement("link");
	lnk.type = "text/css";
	lnk.rel = "stylesheet";
	lnk.href = link;
	(document.head || document.body || document.documentElement).appendChild(lnk);
}

$(document).ready(function () {
	$("#author").html(getQueryVariable("author"));
	$("#room").html(getQueryVariable("room"));

	injectCss(getQueryVariable("baseUrl") + "/stylesheets/emoji.css");

	loadAvatar();

	var $content = $("#content");
	$content.html(location.hash.substring(1));
	$content.find("img").each(function () {
		if (isRelative(this.src)) {
			this.src = getQueryVariable("baseUrl") + this.src.substring(getDomain(this.src).length);
		}
	});

	$content.find("a").each(function () {
		if (isRelative(this.href)) {
			this.href = getQueryVariable("baseUrl") + this.pathname + this.search;
		}
	});
	$content.find("img").aeImageResize({ width: 226, height: 118 });


	if (localStorage.highlightName === 'true') {         //TODO: remove duplication
		var username = regExpEscape(getQueryVariable("user"));
		var regex = new RegExp("\\b(" + username + '|' + username.split(' ').join('|') + ")\\b", 'i');
		$content.highlightRegex(regex, {className: "nameHighlight"});
	}
});