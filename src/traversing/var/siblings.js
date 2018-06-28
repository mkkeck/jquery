define( [
	"../../var/domType",
	"../../var/domNext"
], function( domType, domNext ) {

return function( n, elem ) {
	var matched = [];

	for ( ; n; n = n[ domNext ] ) {
		if ( n[ domType ] === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};

} );
