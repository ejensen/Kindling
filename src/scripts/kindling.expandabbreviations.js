kindling.module(function () {
  'use strict';

  var $input = $('#input');
  var abbreviation_pattern = /(?!@all)(?:\/\/|@)([^\s.:;,-]+)(?=[\s.:;,-]+|$)/ig;
  var all_pattern = /@all/ig;
  var _participants = [];

  function listenMessage(e, options) {
    if (!options || options.expandAbbreviations === 'false') {
      return;
    }

    $input.bind('keyup keydown', function () {
      if (event.which === 9) {
        expandAllAbbreviations();
        return false;
      }
    });
  }

  function expandAllAbbreviations() {
    var abbreviations = getAbbreviationsFromMessage();
    var index = 0;
    for (index in abbreviations) {
      if (abbreviations.hasOwnProperty(index)) {
        var abbreviation = abbreviations[index];
        replaceAbbreviation(abbreviation, findAbbreviation(abbreviation.replace(/^@|\/\//, '')));
      }
    }

    replaceAllAbbreviation();
  }

  function getAbbreviationsFromMessage() {
    return $input.val().match(abbreviation_pattern);
  }

  function replaceAbbreviation(abbreviation, userName) {
    if (userName) {
      $input.val([$input.val().replace(abbreviation, userName), ' '].join(''));
    }
  }

  function findAbbreviation(abbreviation) {
    var initials    = new RegExp('^' + abbreviation.split('').join('.*\\W'), 'i');
    var succession  = new RegExp(abbreviation.split('').join('.*'), 'i');
    return findPattern(initials) || findPattern(succession);
  }

  function findPattern(pattern) {
    var match = $.grep(participants(), function (element) {
      return element.match(pattern);
    });
    return match[0] || false;
  }

  function replaceAllAbbreviation() {
    $input.val($input.val().replace(all_pattern, participants));
  }

  function participants() {
    if (_participants.length !== $('.participant-list li').length) {
      getParticipantList();
    }
    return _participants;
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
