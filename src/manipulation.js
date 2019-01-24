define( [
	"./core",
	"./var/concat",
	"./var/push",
	"./core/access",
	"./manipulation/var/rcheckableType",
	"./manipulation/var/rtagName",
	"./manipulation/var/rscriptType",
	"./manipulation/wrapMap",
	"./manipulation/getAll",
	"./manipulation/setGlobalEval",
	"./manipulation/buildFragment",
	"./manipulation/support",

	"./data/var/dataPriv",
	"./data/var/dataUser",
	"./data/var/acceptData",

	"./var/createElem",
	"./var/strlower",
	"./var/strreplace",
	"./var/getByTag",
	"./var/getOwnDoc",
	"./var/getAttr",
	"./var/domNode",
	"./var/domType",
	"./var/domParent",
	"./var/domNext",
	"./ajax/var/mimescript",
	"./var/typeOf",
	"./var/undef",

	"./core/init",
	"./traversing",
	"./selector",
	"./event"
], function(
	jQuery, concat, push, access, rcheckableType, rtagName, rscriptType,
	wrapMap, getAll, setGlobalEval, buildFragment, support, dataPriv, dataUser, acceptData,
	createElem, strlower, strreplace, getByTag, getOwnDoc, getAttr, domNode, domType,
	domParent, domNext, mimescript, typeOf, undef
) {

var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:-]+)[^>]*)\/>/gi,

	// Support: IE 10-11, Edge 10240+
	// In IE/Edge using regex groups here causes severe slowdowns.
	// See https://connect.microsoft.com/IE/feedback/details/1736512/
	rnoInnerhtml = /<script|<style|<link/i,

	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g;

// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery[ domNode ]( elem, "table" ) &&
		jQuery[ domNode ]( content[ domType ] !== 11 ? content : content.firstChild, "tr" ) ?

		elem[ getByTag ]( "tbody" )[ 0 ] ||
			elem.appendChild( createElem( "tbody", elem[ getOwnDoc ] ) ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = ( elem[ getAttr ]( "type" ) !== null ) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute( "type" );
	}

	return elem;
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest[ domType ] !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( dataPriv.hasData( src ) ) {
		pdataOld = dataPriv.access( src );
		pdataCur = dataPriv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( dataUser.hasData( src ) ) {
		udataOld = dataUser.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		dataUser.set( dest, udataCur );
	}
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = strlower( dest[ domNode ] ),
		inp = "input",
		chk = "checked",
		dfv = "defaultValue";

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === inp && rcheckableType.test( src.type ) ) {
		dest[ chk ] = src[ chk ];

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === inp || nodeName === "textarea" ) {
		dest[ dfv ] = src[ dfv ];
	}
}

function domManip( collection, args, callback, ignored ) {

	// Flatten any nested arrays
	args = concat.apply( [], args );

	var fragment, first, scripts, hasScripts, node, doc,
		i = 0,
		l = collection.length,
		iNoClone = l - 1,
		value = args[ 0 ],
		isFunction = jQuery.isFunction( value );

	// We can't cloneNode fragments that contain checked, in WebKit
	if ( isFunction ||
			( l > 1 && typeOf( value, "str" ) &&
				!support.checkClone && rchecked.test( value ) ) ) {
		return collection.each( function( index ) {
			var self = collection.eq( index );
			if ( isFunction ) {
				args[ 0 ] = value.call( this, index, self.html() );
			}
			domManip( self, args, callback, ignored );
		} );
	}

	if ( l ) {
		fragment = buildFragment( args, collection[ 0 ][ getOwnDoc ], false, collection, ignored );
		first = fragment.firstChild;

		if ( fragment.childNodes.length === 1 ) {
			fragment = first;
		}

		// Require either new content or an interest in ignored elements to invoke the callback
		if ( first || ignored ) {
			scripts = jQuery.map( getAll( fragment, mimescript ), disableScript );
			hasScripts = scripts.length;

			// Use the original fragment for the last item
			// instead of the first because it can end up
			// being emptied incorrectly in certain situations (#8070).
			for ( ; i < l; i++ ) {
				node = fragment;

				if ( i !== iNoClone ) {
					node = jQuery.clone( node, true, true );

					// Keep references to cloned scripts for later restoration
					if ( hasScripts ) {

						// Support: Android<4.1, PhantomJS<2
						// push.apply(_, arraylike) throws on ancient WebKit
						jQuery.merge( scripts, getAll( node, mimescript ) );
					}
				}

				callback.call( collection[ i ], node, i );
			}

			if ( hasScripts ) {
				doc = scripts[ scripts.length - 1 ][ getOwnDoc ];

				// Reenable scripts
				jQuery.map( scripts, restoreScript );

				// Evaluate executable scripts on first document insertion
				for ( i = 0; i < hasScripts; i++ ) {
					node = scripts[ i ];
					if ( rscriptType.test( node.type || "" ) &&
						!dataPriv.access( node, "globalEval" ) &&
						jQuery.contains( doc, node ) ) {

						if ( node.src ) {

							// Optional AJAX dependency, but won't run scripts if not present
							if ( jQuery._evalUrl ) {
								jQuery._evalUrl( node.src );
							}
						} else {
							jQuery.globalEval( strreplace( node.textContent, rcleanScript, "" ) );
						}
					}
				}
			}
		}
	}

	return collection;
}

function remove( elem, selector, keepData ) {
	var node,
		nodes = selector ? jQuery.filter( selector, elem ) : elem,
		i = 0;

	for ( ; ( node = nodes[ i ] ) != null; i++ ) {
		if ( !keepData && node[ domType ] === 1 ) {
			jQuery.cleanData( getAll( node ) );
		}

		if ( node[ domParent ] ) {
			if ( keepData && jQuery.contains( node[ getOwnDoc ], node ) ) {
				setGlobalEval( getAll( node, mimescript ) );
			}
			node[ domParent ].removeChild( node );
		}
	}

	return elem;
}

jQuery.extend( {
	htmlPrefilter: function( html ) {
		return strreplace( html, rxhtmlTag, "<$1></$2>" );
	},

	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			nType = elem[ domType ],
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem[ getOwnDoc ], elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( nType === 1 || nType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, mimescript );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, mimescript ) );
		}

		// Return the cloned set
		return clone;
	},

	cleanData: function( elems ) {
		var data, elem, type,
			special = jQuery.event.special,
			x = "expando",
			i = 0;

		for ( ; ( elem = elems[ i ] ) !== undef; i++ ) {
			if ( acceptData( elem ) ) {
				if ( ( data = elem[ dataPriv[ x ] ] ) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataPriv[ x ] ] = undef;
				}
				if ( elem[ dataUser[ x ] ] ) {

					// Support: Chrome <= 35-45+
					// Assign undefined instead of using delete, see Data#remove
					elem[ dataUser[ x ] ] = undef;
				}
			}
		}
	}
} );

jQuery.fn.extend( {

	// Keep domManip exposed until 3.0 (gh-2225)
	domManip: domManip,

	detach: function( selector ) {
		return remove( this, selector, true );
	},

	remove: function( selector ) {
		return remove( this, selector );
	},

	text: function( value ) {
		return access( this, function( value ) {
			return value === undef ?
				jQuery.text( this ) :
				this.empty().each( function() {
					var nType = this[ domType ];
					if ( nType === 1 || nType === 11 || nType === 9 ) {
						this.textContent = value;
					}
				} );
		}, null, value, arguments.length );
	},

	append: function() {
		return domManip( this, arguments, function( elem ) {
			var nType = this[ domType ], target;
			if ( nType === 1 || nType === 11 || nType === 9 ) {
				target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		} );
	},

	prepend: function() {
		return domManip( this, arguments, function( elem ) {
			var nType = this[ domType ], target;
			if ( nType === 1 || nType === 11 || nType === 9 ) {
				target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		} );
	},

	before: function() {
		return domManip( this, arguments, function( elem ) {
			var parent;
			if ( ( parent = this[ domParent ] ) ) {
				parent.insertBefore( elem, this );
			}
		} );
	},

	after: function() {
		return domManip( this, arguments, function( elem ) {
			var parent;
			if ( ( parent = this[ domParent ] ) ) {
				parent.insertBefore( elem, this[ domNext ] );
			}
		} );
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; ( elem = this[ i ] ) != null; i++ ) {
			if ( elem[ domType ] === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map( function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		} );
	},

	html: function( value ) {
		return access( this, function( value ) {
			var t = this, elem = t[ 0 ] || {},
				i = 0,
				l = t.length,
				iH = "innerHTML";

			if ( value === undef && elem[ domType ] === 1 ) {
				return elem[ iH ];
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeOf( value, "str" ) && !rnoInnerhtml.test( value ) &&
				!wrapMap[ strlower( ( rtagName.exec( value ) || [ "", "" ] )[ 1 ] ) ] ) {

				value = jQuery.htmlPrefilter( value );

				try {
					for ( ; i < l; i++ ) {
						elem = t[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem[ domType ] === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem[ iH ] = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch ( e ) {}
			}

			if ( elem ) {
				t.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var ignored = [];

		// Make the changes, replacing each non-ignored context element with the new content
		return domManip( this, arguments, function( elem ) {
			var t = this, parent = t[ domParent ];

			if ( jQuery.inArray( t, ignored ) < 0 ) {
				jQuery.cleanData( getAll( t ) );
				if ( parent ) {
					parent.replaceChild( elem, t );
				}
			}

		// Force callback invocation
		}, ignored );
	}
} );

jQuery.each( {
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
} );

return jQuery;
} );
