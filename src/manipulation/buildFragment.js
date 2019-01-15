define( [
	"../core",
	"../var/createElem",
	"../var/getOwnDoc",
	"../var/domType",
  "../var/strlower",
  "../ajax/var/mimescript",
	"./var/rtagName",
	"./var/rscriptType",
	"./wrapMap",
	"./getAll",
	"./setGlobalEval"
], function(
	jQuery, createElem, getOwnDoc, domType, strlower, mimescript,
	rtagName, rscriptType, wrapMap, getAll, setGlobalEval
) {

var rhtml = /<|&#?\w+;/;

function buildFragment( elems, context, scripts, selection, ignored ) {
	var elem, tmp, tag, wrap, contains, j,
		fragment = context.createDocumentFragment(),
		nodes = [],
    child = "Child",
    appendChild = "append" + child,
    textContent = "textContent",
		i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		elem = elems[ i ];

		if ( elem || elem === 0 ) {

			// Add nodes directly
			if ( jQuery.type( elem ) === "object" ) {

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, elem[ domType ] ? [ elem ] : elem );

			// Convert non-html into a text node
			} else if ( !rhtml.test( elem ) ) {
				nodes.push( context.createTextNode( elem ) );

			// Convert html into DOM nodes
			} else {
				tmp = tmp || fragment[ appendChild ]( createElem( "div", context ) );

				// Deserialize a standard representation
				tag = strlower( ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ] );
				wrap = wrapMap[ tag ] || wrapMap._default;
				tmp.innerHTML = wrap[ 1 ] + jQuery.htmlPrefilter( elem ) + wrap[ 2 ];

				// Descend through wrappers to the right content
				j = wrap[ 0 ];
				while ( j-- ) {
					tmp = tmp[ "last" + child ];
				}

				// Support: Android<4.1, PhantomJS<2
				// push.apply(_, arraylike) throws on ancient WebKit
				jQuery.merge( nodes, tmp.childNodes );

				// Remember the top-level container
				tmp = fragment[ "first" + child ];

				// Ensure the created nodes are orphaned (#12392)
				tmp[ textContent ] = "";
			}
		}
	}

	// Remove wrapper from fragment
	fragment[ textContent ] = "";

	i = 0;
	while ( ( elem = nodes[ i++ ] ) ) {

		// Skip elements already in the context collection (trac-4087)
		if ( selection && jQuery.inArray( elem, selection ) > -1 ) {
			if ( ignored ) {
				ignored.push( elem );
			}
			continue;
		}

		contains = jQuery.contains( elem[ getOwnDoc ], elem );

		// Append to fragment
		tmp = getAll( fragment[ appendChild ]( elem ), mimescript );

		// Preserve script evaluation history
		if ( contains ) {
			setGlobalEval( tmp );
		}

		// Capture executables
		if ( scripts ) {
			j = 0;
			while ( ( elem = tmp[ j++ ] ) ) {
				if ( rscriptType.test( elem.type || "" ) ) {
					scripts.push( elem );
				}
			}
		}
	}

	return fragment;
}

return buildFragment;
} );
