describe('kindling.images', function() {
  'use strict';

  var chatWrapper

  jQuery.fn.slideToggle = function() {
    this.toggle();
  }

  beforeEach(function() {
    chatWrapper = sandbox({id: 'chat-wrapper'});
    setFixtures(chatWrapper);
  });

  it('should add the toggle after a new image is added', function() {
    var imageMessage = addNewImage();
    expect(imageMessage.find('.image').next('.collapsable')).toExist();
  });

  it('should not add the toggle if it has already been added', function() {
    var firstImageMessage = addNewImage();
    var secondImageMessage = addNewImage();
    expect(firstImageMessage.find('.image ~ .collapsable').length).toEqual(1);
    expect(secondImageMessage.find('.image ~ .collapsable').length).toEqual(1);
  });

  it('should toggle the image when the toggle is clicked', function() {
    var imageMessage = addNewImage();

    imageMessage.find('.collapsable').trigger('click');
    expect(imageMessage.find('.image')).toBeHidden();

    imageMessage.find('.collapsable').trigger('click');
    expect(imageMessage.find('.image')).toBeVisible();
  });

  var addNewImage = function(type, options) {
    var message = $('<div class="body">' +
                    '  <a class="image"><img></a>' +
                    '</div>');

    chatWrapper.append(message);
    $.publish('newMessage', {}, 'username');
    return message;
  }
});
