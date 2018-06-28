define( [
	"../core",
	"../event"
], function( jQuery ) {

// Attach a bunch of functions for handling common AJAX events
( "Start Stop Complete Error Success Send" ).split( " " ).forEach( function( type ) {
	jQuery.fn[ "ajax" + type ] = function( fn ) {
		return this.on( "ajax" + type, fn );
	};
} );

} );
