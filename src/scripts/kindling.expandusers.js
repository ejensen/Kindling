kindling.module(function () {
  'use strict';

  var input = $('#input');
  var form = $('#chat_form');
  var abbreviation_pattern = /(?:\/\/|@)([^\s.:;,-]+)(?=[\s.:;,-]+|$)/ig;
  var _participants = [];

  function onOptionsChanged(e, options) {
    if (!options) {
      return;
    }

    input.bind('keyup keydown', function(){
      if(event.which == 9) {
        expandAllAbbreviations();
        return false
      }
    });
  }

  function expandAllAbbreviations(){
    var abbreviations = getAbbreviationsFromMessage();
    var index = 0;
    for(index in abbreviations) {
      var abbreviation = abbreviations[index];
      replaceAbbreviation(abbreviation, findAbbreviation(abbreviation.replace(/^@|\/\//, '')));
    }
  }

  function getAbbreviationsFromMessage() {
    return input.val().match(abbreviation_pattern);
  }

  function replaceAbbreviation(abbreviation, userName) {
    if(userName){
      input.val([input.val().replace(abbreviation, userName), " "].join(''));
    }
  }

  function findAbbreviation(abbreviation) {
    var initials    = new RegExp("^" + abbreviation.split("").join(".*\\W"), "i");
    var succession  = new RegExp(abbreviation.split("").join(".*"), "i");
    return findPattern(initials) || findPattern(succession);
  }

  function findPattern(pattern) {
    var match =  $.grep(participants(), function(element) {
      return element.match(pattern);
    });
    return match[0] || false;
  }

  function participants(){
    if(_participants.lenght != $('.participant-list li').length) {
      getParticipantList();
    }
    return _participants;
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
