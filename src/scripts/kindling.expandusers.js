kindling.module(function () {
   'use strict';

   var input = $('#input');
   var form = $('#chat_form');
   var abbreviation_pattern = /(?:\/\/|@)([^\s.:;,-]+)(?=[\s.:;,-]+|$)/ig;
   var _participants;

   function onOptionsChanged(e, options) {
      if (!options) {
         return;
      }

      input.bind('keyup keydown', function(){
         expandUsersOfMessage();
      });
   }

   function expandUsersOfMessage(){
      var abbreviations = getAbbreviationsFromMessage();
      var index = 0;
      for(index in abbreviations) {
         var abbreviation = abbreviations[index];
         replaceAbbreviation(abbreviation, findAbbreviation(abbreviation.replace(/^@|\/\//, '')));
      }
   }

   function replaceAbbreviation(abbreviation, userName){
      input.val([input.val().replace(abbreviation, userName), " "].join(''));
   }

   function getAbbreviationsFromMessage(){
      return input.val().match(abbreviation_pattern);
   }

   function findAbbreviation(abbreviation) {
      var initials    = new RegExp("^" + abbreviation.split("").join(".*\\W"), "i");
      var succession  = new RegExp(abbreviation.split("").join(".*"), "i");
      var participant = findParticipantBy(initials) || findParticipantBy(succession);
      return participant;
   }

   function findParticipantBy(pattern) {
      var match =  $.grep(participants(), function(element) {
         return element.match(pattern); 
      });
      return match[0];
   }

   function participants(){
      return _participants || getParticipantList();

   }

   function getParticipantList(){
      _participants = [];
      $('.participant-list li').each(function(){
         _participants.push($(this).find('span.name').text());
      });
      return _participants;
   }

   return {
      init: function () {
         $.subscribe('loaded optionsChanged', onOptionsChanged);
      }
   };
}());
