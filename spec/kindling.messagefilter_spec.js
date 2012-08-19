describe("kindling.messagefilter", function() {
  "use strict";

  var chatWrapper,
      defaultOptions = {},
      hideTimeStampsOptions = {timeStamps: "false"},
      hideLeaveOptions = {leaveRoom: "false"},
      hideEnterOptions = {enterRoom: "false"};

  beforeEach(function() {
    chatWrapper = sandbox({id: "chat-wrapper"});
    setFixtures(chatWrapper);
  });

  it("should show new kick messages by default", function() {
    var message = addNewMessage("kick");
    expectMessageNotToBeHidden(message);
  });

  it("should hide new kick messages when wanted", function() {
    var message = addNewMessage("kick", hideLeaveOptions);
    expectMessageToBeHidden(message);
  });

  it("should show new leave messages by default", function() {
    var message = addNewMessage("leave");
    expectMessageNotToBeHidden(message);
  });

  it("should hide new leave messages when wanted", function() {
    var message = addNewMessage("leave", hideLeaveOptions);
    expectMessageToBeHidden(message);
  });

  it("should show new enter messages by default", function() {
    var message = addNewMessage("enter");
    expectMessageNotToBeHidden(message);
  });

  it("should hide new enter messages when wanted", function() {
    var message = addNewMessage("enter", hideEnterOptions);
    expectMessageToBeHidden(message);
  });

  it("should show new timestamp messages by default", function() {
    var message = addNewMessage("timestamp");
    expectMessageNotToBeHidden(message);
  });

  it("should hide new timestamp messages when wanted", function() {
    var message = addNewMessage("timestamp", hideTimeStampsOptions);
    expectMessageToBeHidden(message);
  });

  it("should hide repeating timestamp messages", function() {
    var timestampMessage = addNewMessage("timestamp", hideLeaveOptions);
    var leaveMessage = addNewMessage("leave", hideLeaveOptions);
    expectMessageToBeHidden(leaveMessage);

    // currently the timestamp message from the hidden message is not hidden
    // until the next timestamp message comes in which results in a dangling
    // timestamp message. Not ideal, but it's a start.
    expectMessageNotToBeHidden(timestampMessage);
    addNewMessage("timestamp", hideLeaveOptions);
    expectMessageToBeHidden(timestampMessage);
  });

  it("should hide existing timestamp messages on options change", function() {
    var message = addNewMessage("timestamp");
    expectMessageNotToBeHidden(message);
    changeOptions(hideTimeStampsOptions);
    expectMessageToBeHidden(message);
  });

  it("should hide existing leave messages on options change", function() {
    var message = addNewMessage("leave");
    expectMessageNotToBeHidden(message);
    changeOptions(hideLeaveOptions);
    expectMessageToBeHidden(message);
  });

  it("should hide existing enter messages on options change", function() {
    var message = addNewMessage("enter");
    expectMessageNotToBeHidden(message);
    changeOptions(hideEnterOptions);
    expectMessageToBeHidden(message);
  });

  var changeOptions = function(options) {
    $.publish("optionsChanged", [options]);
  }

  var expectMessageToBeHidden = function(message) {
    expect(message).toHaveClass("hidden_message");
  }

  var expectMessageNotToBeHidden = function(message) {
    expect(message).not.toHaveClass("hidden_message");
  }

  var addNewMessage = function(type, options) {
    var message = $("<div>").addClass("message").addClass(type + "_message");
    chatWrapper.append(message);
    $.publish("newMessage", [options || defaultOptions, "username", message]);
    return message;
  }
});
