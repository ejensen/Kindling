kindling.module(function () {
   'use strict';

   function publishNotification(e, options, username, message) {
      if (!options || !username || !message || options.notifications !== 'true') {
         return;
      }

      var $message = $(message);
      if (message.id.indexOf('message_') !== -1 && message.id.indexOf('message_pending') === -1 && !($message.is('.enter_message,.leave_message,.kick_message,.timestamp_message,.you'))) {
         var $body, $author = $message.find('.author:first');
         if ($message.is('.topic_change_message')) {
            $body = $message.find('.body:first');
         } else {
            $body = $message.find('code:first');
            if ($body.length === 0) {
               $body = $message.find('div:.body:first');
            }
         }

         var regex;
         if (options.filterNotifications === 'true') {
            regex = kindling.getUsernameRegex(username);
            if (!regex.test($body.html())) {
               return;
            }
         }

         if (options.filterNotificationsByCustom === 'true') {
            regex = new RegExp(options.customFilter);
            if (!regex.test($body.html())) {
               return;
            }
         }

         chrome.extension.sendRequest({
            type: 'notification',
            value: {
               username: username,
               room: $('#room_name').html(),
               author: $author.text(),
               avatar: $author.attr('data-avatar'),
               message: $body.html()
            }
         });
      }
   }

   return {
      init: function () {
         $.subscribe('newMessage', publishNotification);
      }
   };
} ());
