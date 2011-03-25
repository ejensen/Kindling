var Inject = {
    init: function () {
        Inject.getUsername();
    },

    getUsername: function () {
        var usernameElem = document.createElement("span");
        usernameElem.id = "username";
        usernameElem.style.display = "none";
        usernameElem.innerText = window.chat.username;
        document.getElementById("chat-wrapper").appendChild(usernameElem);
    }
};

Inject.init();