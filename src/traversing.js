define( [
	"./core",
	"./var/indexOf",
	"./traversing/var/dir",
	"./traversing/var/siblings",
	"./traversing/var/rneedsContext",
	"./var/domType",
	"./var/domParent",
	"./var/domNext",
	"./var/domPrev",

	"./core/init",
	"./traversing/findFilter",
	"./selector"
], function(
	jQuery, indexOf, dir, siblings, rneedsContext,
	domType, domParent, domNext, domPrev
) {

var rparentsprev = /^(?:parents|prev(?:Until|All))/,

	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.fn.extend( {
	has: function( target ) {
		var t = this, targets = jQuery( target, t ),
			l = targets.length;

		return t.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur, nt, t = this,
			i = 0,
			l = t.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || t.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = t[ i ]; cur && cur !== context; cur = cur[ domParent ] ) {
				nt = cur[ domType ];

				// Always skip document fragments
				if ( nt < 11 && ( pos ?
					pos.index( cur ) > -1 :

					// Don't pass non-elements to Sizzle
					nt === 1 &&
						jQuery.find.matchesSelector( cur, selectors ) ) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return t.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {
		var t = this;

		// No argument, return index in parent
		if ( !elem ) {
			return ( t[ 0 ] && t[ 0 ][ domParent ] ) ? t.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), t[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( t,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.uniqueSort(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		var prevObject = this.prevObject;
		return this.add( selector == null ?
			prevObject : prevObject.filter( selector )
		);
	}
} );

function sibling( cur, dir ) {
	while ( ( cur = cur[ dir ] ) && cur[ domType ] !== 1 ) {}
	return cur;
}

jQuery.each( {
	parent: function( elem ) {
		var parent = elem[ domParent ];
		return parent && parent[ domType ] !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return dir( elem, domParent );
	},
	parentsUntil: function( elem, i, until ) {
		return dir( elem, domParent, until );
	},
	next: function( elem ) {
		return sibling( elem, domNext );
	},
	prev: function( elem ) {
		return sibling( elem, domPrev );
	},
	nextAll: function( elem ) {
		return dir( elem, domNext );
	},
	prevAll: function( elem ) {
		return dir( elem, domPrev );
	},
	nextUntil: function( elem, i, until ) {
		return dir( elem, domNext, until );
	},
	prevUntil: function( elem, i, until ) {
		return dir( elem, domPrev, until );
	},
	siblings: function( elem ) {
		return siblings( ( elem[ domParent ] || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return siblings( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {

			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.uniqueSort( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
} );

return jQuery;
} );
