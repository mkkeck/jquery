define( function() {

/**
 * Determines whether an object can have data
 */
return function( owner ) {
	var nType = owner.nodeType;

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
