define( [
	"../data/var/dataPriv"
], function( dataPriv ) {

function showHide( elements, show ) {
	var display, elem,
		values = [],
		index = 0,
		style = "style",
		none = "none",
		attr = "display",
		length = elements.length;

	// Determine new display value for elements that need to change
	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem[ style ] ) {
			continue;
		}

		display = elem[ style ][ attr ];
		if ( show ) {
			if ( display === none ) {

				// Restore a pre-hide() value if we have one
				values[ index ] = dataPriv.get( elem, attr ) || "";
			}
		} else {
			if ( display !== none ) {
				values[ index ] = none;

				// Remember the value we're replacing
				dataPriv.set( elem, attr, display );
			}
		}
	}

	// Set the display of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		if ( values[ index ] != null ) {
			elements[ index ][ style ][ attr ] = values[ index ];
		}
	}

	return elements;
}

return showHide;

} );
