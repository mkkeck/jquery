define( [
	"../data/var/dataPriv"
], function( dataPriv ) {

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length,
		g = "globalEval";

	for ( ; i < l; i++ ) {
		dataPriv.set(
			elems[ i ],
			g,
			!refElements || dataPriv.get( refElements[ i ], g )
		);
	}
}

return setGlobalEval;
} );
