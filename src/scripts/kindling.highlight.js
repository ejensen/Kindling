kindling.module(function () {
  'use strict';

  function highlightKeywords(e, options, username) {
    if (!options || username === '') {
      return;
    }

    var $messages = $('#chat-wrapper').find('div.body');

    kindling.unbindNewMessages();
    try {
      var highlightOptions = { className: 'keywordHighlight', tagType: 'mark' };
      $messages.highlightRegex(undefined, highlightOptions);

      if (options.highlightKeywords === 'true') {
        $messages.highlightRegex(kindling.getKeywordsRegex(options.highlightKeywordList, username), highlightOptions);
      }
    } catch (err) {
    } finally {
      kindling.bindNewMessages();
    }
  }

  return {
    init: function () {
      $.subscribe('loaded optionsChanged newMessage', highlightKeywords);
    }
  };
}());
