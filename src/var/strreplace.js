define( function( ) {
	return function strreplace( str, expr, repl ) {
		return ( "" + str ).replace( expr, repl || "" );
	};
} );
