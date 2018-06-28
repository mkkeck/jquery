define( [
	"../../var/domType"
], function( domType ) {

/**
 * Determines whether an object can have data
 */
return function( owner ) {
	var nType = owner[ domType ];

	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return nType === 1 || nType === 9 || !( +nType );
};

} );
