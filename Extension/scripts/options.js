var options = ["enterRoom", "leaveRoom", "timeStamps", "notifications", "highlightName", "showAvatars", "focusNotifications", "autoDismiss"];

function onOptionChanged() {
    chrome.extension.sendRequest({ type: "optionsChanged" });
}

function onCheckChange($parent, value) {
    if (value) {
        $parent.find(".cb-disable").removeClass("selected");
        $parent.find(".cb-enable").addClass("selected");
    }
    else {
        $parent.find(".cb-enable").removeClass("selected");
        $parent.find(".cb-disable").addClass("selected");
    }

	if($parent[0].id === "notifications" && value !== (localStorage.notifications === 'true')){
		$("#showAvatars,#focusNotifications,#dismissDiv").slideToggle(200);
	}
    else if ($parent[0].id === "autoDismiss" && value !== (localStorage.autoDismiss === 'true')) {
        $("#timeoutDiv").slideToggle(200);
    }
}

function saveOption(id, value) {
    localStorage[id] = value;
    onOptionChanged();
}

function onCheckClick(sender, value) {
    var $parent = $(sender).parents(".switch:first");
    onCheckChange($parent, value);
    saveOption($parent[0].id, value);
}

function onNotificationTimeoutChanged() {
    var slider = document.getElementById("notificationTimeout");
    var $tooltip = $("#rangeTooltip");
    $tooltip.html((slider.value / 1000) + " " + chrome.i18n.getMessage("seconds"));
    $tooltip.css("left", ((slider.value / (slider.max - slider.min)) * $(slider).width()) - ($tooltip.width() / 1.75));

    localStorage[slider.id] = slider.value;
    onOptionChanged();
}

function init() {
	var i;
    for (i = 0; i < options.length; i += 1) {
        var savedValue = localStorage[options[i]];
        var checked = savedValue === undefined || (savedValue === 'true');
        onCheckChange($(document.getElementById(options[i])), checked);
    }

    var notificationTimeoutSlider = document.getElementById("notificationTimeout");
    notificationTimeoutSlider.value = localStorage.notificationTimeout;
    onNotificationTimeoutChanged();
	
	if(localStorage.notifications === 'false'){
		$("#showAvatars,#focusNotifications,#dismissDiv").hide();
	}
    if (localStorage.autoDismiss === 'false') {
        $("#timeoutDiv").hide();
    }
}

var onToggle = function (e) {
    var option = $(e.currentTarget).attr("for");
    var value = localStorage[option];
    onCheckClick(e.currentTarget, value === 'true' ? false : true);
};

function getMessages(){
	document.title = chrome.i18n.getMessage("chromefireOptions");
	$(".cb-enable > span").html(chrome.i18n.getMessage("on"));
	$(".cb-disable > span").html(chrome.i18n.getMessage("off"));
	
	$("#notificationsTitle").html(chrome.i18n.getMessage("notificationsTitle"));
	$("#messagesTitle").html(chrome.i18n.getMessage("messagesTitle"));
	$("#otherTitle").html(chrome.i18n.getMessage("otherTitle"));	
	$("label[for='notificationTimeout']").html(chrome.i18n.getMessage("notificationTimeout"))
	
	var i;
    for (i = 0; i < options.length; i += 1) {
		$(".description[for='" + options[i] + "']").html(chrome.i18n.getMessage(options[i]));
    }
}

$(document).ready(function () {
	getMessages();
	
    $(".cb-enable").click(function () {
        onCheckClick(this, true);
    });
    $(".cb-disable").click(function () {
        onCheckClick(this, false);
    });
    $(".description").click(onToggle);

    var $notificationTimeoutSlider = $("#notificationTimeout");
    $notificationTimeoutSlider.change(onNotificationTimeoutChanged);

    init();
});