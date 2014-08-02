kindling.module(function () {
  'use strict';

  function getThemeLink() {
    return $('link[title=Theme]').first();
  }

  function onLoaded () {
    var themeLink = getThemeLink();
    themeLink.data('original-theme', themeLink.attr('href'));
  }

  function onOptionsChanged(e, options) {
    var themeLink = getThemeLink();
    if (options.useDifferentTheme === 'true' && options.themeColor) {
      themeLink.attr('href', '/stylesheets/' + options.themeColor + '.css');
    } else {
      themeLink.attr('href', themeLink.data('original-theme'));
    }
  }

  return {
    init: function () {
      $.subscribe('loaded', onLoaded);
      $.subscribe('optionsChanged', onOptionsChanged);
    }
  };
}());
