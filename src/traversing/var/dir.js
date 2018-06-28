define( [
	"../../core",
  "../../var/domType",
  "../../var/undef"
], function( jQuery, domType, undef ) {

return function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undef;

	while ( ( elem = elem[ dir ] ) && elem[ domType ] !== 9 ) {
		if ( elem[ domType ] === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};

} );
