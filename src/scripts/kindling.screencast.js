kindling.module(function () {
	'use strict';

   function tryRestoreLinks() {
      $('#chat-wrapper').find('div.body img').each( function( index, value ) {
         var storedLink = $(value).attr( "data-screencast" );
         if( storedLink ) {
            $( $(value).parent().get(0) ).html( "<a href='"+storedLink+"'>"+storedLink+"</a>" );
         }
      });
   }

   function optionsChanged( e, options ) {
      if( options.expandScreencastLinks === 'true' ) {
         expandLinks();
      }
      else {
         tryRestoreLinks();
      }
   }

	function expandLinks( e, options ) {
      $('#chat-wrapper').find('div:.body > a').each( function( index, value ) {
         var message = $(value).text();

         var screencast_regex = /http:\/\/(www\.)?screencast\.com\/t\/([A-z0-9]+)/i;
         var theMatch = message.match( screencast_regex );
        
         if( theMatch ) {
            var theLink = theMatch[0];
            $.get( theLink, function( data ) {
               var contentLink = $( data ).find( ".embeddedObject" ).attr('src');
               
               if( contentLink != undefined ) {
                  $(value).html( "<img src='"+ contentLink +"' data-screencast='"+theLink+"' style='max-height:250px' />" );
               }
            } );
         }
      } );

      kindling.scrollToBottom();
   }

	return {
		init: function () {
         $.subscribe('optionsChanged newMessage', optionsChanged);
		}
	};
}());
