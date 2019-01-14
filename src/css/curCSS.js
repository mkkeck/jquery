define( [
	"../core",
	"./var/rnumnonpx",
	"./var/rmargin",
	"./var/getStyles",
	"./support",
	"../var/getOwnDoc",
	"../var/undef",
	"../selector" // Get jQuery.contains
], function( jQuery, rnumnonpx, rmargin, getStyles, support, getOwnDoc, undef ) {

function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style,
		maxW = "maxWidth",
		minW = "minWidth";

	computed = computed || getStyles( elem );
	ret = computed ? computed.getPropertyValue( name ) || computed[ name ] : undef;

	// Support: Opera 12.1x only
	// Fall back to style even without computed
	// computed is undefined for elems on document fragments
	if ( ( ret === "" || ret === undef ) && !jQuery.contains( elem[ getOwnDoc ], elem ) ) {
		ret = jQuery.style( elem, name );
	}

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {

		// A tribute to the "awesome hack by Dean Edwards"
		// Android Browser returns percentage for some values,
		// but width seems to be reliably pixels.
		// This is against the CSSOM draft spec:
		// http://dev.w3.org/csswg/cssom/#resolved-values
		if ( !support.pixelMarginRight() && rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style[ minW ];
			maxWidth = style[ maxW ];

			// Put in the new values to get a computed value out
			style[ minW ] = style[ maxW ] = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style[ minW ] = minWidth;
			style[ maxW ] = maxWidth;
		}
	}

	return ret !== undef ?

		// Support: IE9-11+
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}

return curCSS;
} );
