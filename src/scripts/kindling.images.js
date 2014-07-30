kindling.module(function () {
  'use strict';

  function handleImages(e, options, username) {
    $('#chat-wrapper div.body > .image').each(function () {
      if(!$(this).next('.collapsable').length) {
        $('<a>').attr('href', '#').attr('title', 'hide').addClass('collapsable').insertAfter(this);
      }
    });
  }

  function toggleImage(event) {
    event.preventDefault();
    $(this).prev('.image').slideToggle(200);
    $(this).toggleClass('collapsed');
    $(this).attr('title', $(this).hasClass('collapsed') ? 'show' : 'hide');
  }

  return {
    init: function () {
      $.subscribe('loaded newMessage', handleImages);
      $(document).on('click', '.collapsable', toggleImage);
    }
  };
}());
