kindling.module(function () {
   'use strict';

   var $input = $('#input'),
   caller = /@all/ig,
   _participants = [];

   function listenMessage(e, options) {
      if (!options || options.expandAbbreviations === 'false') {
         return;
      }

      $input.bind('keyup keydown', function () {
         if (event.which == 9) {
            listAllUsers();
            return false
         }
      });
   }

   function listAllUsers() {
      $input.val($input.val().replace(caller, participants));
   }

   function participants() {
      if (_participants.length !== $('.participant-list li').length) {
         getParticipantList();
      }
      return [_participants.join(', '), ': '].join('');
   }

   function getParticipantList() {
      _participants = [];
      $('.participant-list li').each(function() {
         _participants.push($(this).find('span.name').text());
      });
      return _participants;
   }

   return {
      init: function () {
         $.subscribe('loaded optionsChanged', listenMessage);
      }
   };
}());
