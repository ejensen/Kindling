kindling.module(function () {
  'use strict';

  function handleImages(e, options, username) {
    $('#chat-wrapper div.body > .image').each(function () {
      var $image = $(this);
      if (!$image.next('.collapsable').length) {
        $('<a>').attr('href', '#').attr('title', 'hide').text($image.attr('href')).addClass('collapsable').insertAfter(this);
      }
    });
  }

  function toggleImage(event) {
    event.preventDefault();
    var $element = $(this);
    $element.prev('.image').toggle(100);
    $element.toggleClass('collapsed');
    $element.attr('title', $element.hasClass('collapsed') ? 'show' : 'hide');
  }

  return {
    init: function () {
      $.subscribe('loaded newMessage', handleImages);
      $(document).on('click', '.collapsable', toggleImage);
    }
  };
}());
