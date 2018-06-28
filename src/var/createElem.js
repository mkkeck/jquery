define( [
	"./document"
], function( document ) {
	return function createElem( elem, context ) {
		return ( context || document ).createElement( elem );
	};
} );
