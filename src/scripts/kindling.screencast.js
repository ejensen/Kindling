kindling.module(function () {
	'use strict';

	function expandLink(e, options, username ) {
      $('#chat-wrapper').find('div:.body').each( function( index, value ) {
         var message = $(value).text();

         var screencast_regex = /http:\/\/(www\.)?screencast\.com\/t\/([A-z0-9]+)/i;
         var theMatch = message.match( screencast_regex );
         
         if( theMatch ) {
            var theLink = theMatch[0];
            $.get( theLink, function( data ) {
               var contentLink = $( data ).find( ".embeddedObject" ).attr('src');

               $(value).html( "<img src='"+ contentLink +"' style='max-height:250px' />" );
            } );
         }
      } );

      kindling.scrollToBottom();
   }

	return {
		init: function () {
			$.subscribe('newMessage loaded', expandLink);
		}
	};
}());
