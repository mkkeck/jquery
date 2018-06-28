/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2018-06-28
 */
( function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ( {} ).hasOwnProperty,

	//arr = [],             // remove in jQuery
	//push = arr.push,      // remove in jQuery
	//slice = arr.slice,    // remove in jQuery

	pop = arr.pop,
	pushNative = arr.push,

	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[ i ] === elem ) {
				return i;
			}
		}
		return -1;
	},

	// remove in jQuery
	//strlower = function( s ) {
	//	return ( s + "" ).toLowerCase();
	//},

	// remove in jQuery
	//createElem = function( elem, context ) {
	//	context = context || document;
	//	return context.createElement( elem );
	//},

	regexp = function( e, o ) {
		if ( typeof o !== "undefined" && o ) {
			return new RegExp( e, o );
		}
		return new RegExp( e );
	},

	domComparePos = "compareDocumentPosition",

	//domNext = "nextSibling",                  // remove in jQuery
	//domNode = "nodeName",                     // remove in jQuery
	//domParent = "parentNode",                 // remove in jQuery
	//domPrev = "previousSibling",              // remove in jQuery
	//domType = "nodeType",                     // remove in jQuery
	//evtListenerAdd = "addEventListener",      // remove in jQuery
	//getAttr = "getAttribute",                 // remove in jQuery
	//getByQSA = "querySelectorAll",            // remove in jQuery
	getElem = "getElement",

	//getById = getElem + "ById",               // remove in jQuery
	getByClass = getElem + "sByClassName",
	getByName = getElem + "sByName",

	//getByTag = getElem + "sByTagName",        // remove in jQuery
	//getDocElem = "documentElement",           // remove in jQuery
	//getOwnDoc = "ownerDocument",              // remove in jQuery
	//setAttr = "setAttribute",                 // remove in jQuery

	matchesSel = "matchesSelector",
	preferedChilds,

	booleans = "async|autofocus|autoplay|checked|controls|defer|disabled|" +
		"hidden|ismap|loop|multiple||open|readonly|required|scoped|selected",

	// Regular expressions

	// http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",

	// http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +

		// "Attribute values must be CSS identifiers [capture 5] or strings
		// [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
		whitespace + "*\\]",

	pseudos = ":(" + identifier + ")(?:\\((" +

		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

		// 3. anything else (capture 2)
		".*" + ")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace
	// characters preceding the latter
	rwhitespace = regexp(
		whitespace + "+", "g"
	),
	rtrim = regexp(
		"^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g"
	),

	rcomma = regexp(
		"^" + whitespace + "*," + whitespace + "*"
	),
	rcombinators = regexp(
		"^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"
	),

	rattributeQuotes = regexp(
		"=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"
	),

	rpseudo = regexp( pseudos ),
	ridentifier = regexp( "^" + identifier + "$" ),

	matchExpr = {
		ID: regexp(
			"^#(" + identifier + ")"
		),
		CLASS: regexp(
			"^\\.(" + identifier + ")"
		),
		TAG: regexp(
			"^(" + identifier + "|[*])"
		),
		ATTR: regexp(
			"^" + attributes
		),
		PSEUDO: regexp(
			"^" + pseudos
		),
		CHILD: regexp(
			"^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)",
			"i"
		),
		bool: regexp(
			"^(?:" + booleans + ")$", "i"
		),

		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		needsContext: regexp(
			"^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)",
			"i"
		)
	},

	// remove in jQuery
	//rinputs = /^(?:input|select|textarea|button)$/i,

	rheader = /^h\d$/i,
	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = regexp(
		"\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig"
	),

	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000,
			fChrCode = String.fromCharCode;

		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?

				// BMP codepoint
				fChrCode( high + 0x10000 ) :

				// Supplemental Plane codepoint (surrogate pair)
				fChrCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	preferedChilds = preferredDoc.childNodes;
	push.apply(
		( arr = slice.call( preferedChilds ) ),
		preferedChilds
	);

	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferedChilds.length ][ domType ];
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			pushNative.apply( target, slice.call( els ) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;

			// Can't trust NodeList.length
			while ( target[ j++ ] = els[ i++ ] ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var m, i, elem, nid, nidselect, match, groups, newSelector,
		newContext = context && context[ getOwnDoc ],

		// nodeType defaults to 9, since context defaults to document
		nodeType = context ? context[ domType ] : 9;

	results = results || [];

	// Return early from calls with invalid selector or context
	if (
		typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11
	) {

		return results;
	}

	// Try to shortcut find operations (as opposed to filters) in HTML documents
	if ( !seed ) {

		if ( ( context ? context[ getOwnDoc ] || context : preferredDoc ) !== document ) {
			setDocument( context );
		}
		context = context || document;

		if ( documentIsHTML ) {

			// If the selector is sufficiently simple, try using a "get*By*" DOM method
			// (excepting DocumentFragment context, where the methods don't exist)
			if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

				// ID selector
				if ( m = match[ 1 ] ) {

					// Document context
					if ( nodeType === 9 ) {
						if ( elem = context[ getById ]( m ) ) {

							// Support: IE, Opera, Webkit
							// TODO: identify versions
							// getElementById can match elements by name instead of ID
							if ( elem.id === m ) {
								results.push( elem );
								return results;
							}
						} else {
							return results;
						}

					// Element context
					} else {

						// Support: IE, Opera, Webkit
						// TODO: identify versions
						// getElementById can match elements by name instead of ID
						if (
							newContext && ( elem = newContext[ getById ]( m ) ) &&
							contains( context, elem ) && elem.id === m
						) {

							results.push( elem );
							return results;
						}
					}

				// Type selector
				} else if ( match[ 2 ] ) {
					push.apply( results, context[ getByTag ]( selector ) );
					return results;

				// Class selector
				} else if (
					( m = match[ 3 ] ) && support[ getByClass ] &&
					context[ getByClass ]
				) {

					push.apply( results, context[ getByClass ]( m ) );
					return results;
				}
			}

			// Take advantage of querySelectorAll
			if (
				support.qsa &&
				!compilerCache[ selector + " " ] &&
				( !rbuggyQSA || !rbuggyQSA.test( selector ) )
			) {

				if ( nodeType !== 1 ) {
					newContext = context;
					newSelector = selector;

				// qSA looks outside Element context, which is not what we want
				// Thanks to Andrew Dupont for this workaround technique
				// Support: IE <=8
				// Exclude object elements
				} else if ( strlower( context[ domNode ] ) !== "object" ) {

					// Capture the context ID, setting it first if necessary
					if ( nid = context[ getAttr ]( "id" ) ) {
						nid = nid.replace( rescape, "\\$&" );
					} else {
						context[ setAttr ]( "id", ( nid = expando ) );
					}

					// Prefix every selector in the list
					groups = tokenize( selector );
					i = groups.length;
					nidselect = ridentifier.test( nid ) ? "#" + nid : "[id='" + nid + "']";
					while ( i-- ) {
						groups[ i ] = nidselect + " " + toSelector( groups[ i ] );
					}
					newSelector = groups.join( "," );

					// Expand context for sibling selectors
					newContext = rsibling.test( selector ) &&
						testContext( context[ domParent ] ) ||
						context;
				}

				if ( newSelector ) {
					try {
						push.apply( results,
							newContext[ getByQSA ]( newSelector )
						);
						return results;
					} catch ( qsaError ) {
					} finally {
						if ( nid === expando ) {
							context.removeAttribute( "id" );
						}
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {function(string, object)}
 *
 * Returns the Object data after storing it on itself with property name
 * the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 * deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {

		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {

			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return ( cache[ key + " " ] = value );
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var elem = createElem( "div", document );

	try {
		return !!fn( elem );
	} catch ( e ) {
		return false;
	} finally {

		// Remove from its parent by default
		if ( elem[ domParent ] ) {
			elem[ domParent ].removeChild( elem );
		}

		// release memory in IE
		elem = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split( "|" ),
		i = arr.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[ i ] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a, si = "sourceIndex",
		diff = cur && a[ domType ] === 1 && b[ domType ] === 1 &&
			( ~b[ si ] || MAX_NEGATIVE ) -
			( ~a[ si ] || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( cur = cur[ domNext ] ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		return /^input/i.test( elem [ domNode ] ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		return ( /^input|button/i.test( elem [ domNode ] ) ) && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction( function( argument ) {
		argument = +argument;
		return markFunction( function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ ( j = matchIndexes[ i ] ) ] ) {
					seed[ j ] = !( matches[ j ] = seed[ j ] );
				}
			}
		} );
	} );
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context[ getByTag ] !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {

	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && ( elem[ getOwnDoc ] || elem )[ getDocElem ];
	return documentElement ? documentElement[ domNode ] !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [node] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node[ getOwnDoc ] || node : preferredDoc,
		matchSelector = "MatchesSelector";

	// Return early if doc is invalid or already selected
	if ( doc === document || doc[ domType ] !== 9 || !doc[ getDocElem ] ) {
		return document;
	}

	// Update global variables
	document = doc;
	docElem = document[ getDocElem ];
	documentIsHTML = !isXML( document );

	// Support: IE 9-11, Edge
	// Accessing iframe documents after unload throws "permission denied" errors (jQuery #13936)
	if ( ( parent = document.defaultView ) && parent.top !== parent ) {

		// Support: IE 11
		if ( parent[ evtListenerAdd ] ) {
			parent[ evtListenerAdd ]( "unload", unloadHandler, false );

		// Support: IE 9 - 10 only
		//} else if ( parent.attachEvent ) {
		//	parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert( function( elem ) {
		var c = "className";
		elem[ c ] = "i";
		return !elem[ getAttr ]( c );
	} );

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support[ getByTag ] = assert( function( elem ) {
		elem.appendChild( document.createComment( "" ) );
		return !elem[ getByTag ]( "*" ).length;
	} );

	// Support: IE<9
	support[ getByClass ] = rnative.test( document[ getByClass ] );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert( function( elem ) {
		docElem.appendChild( elem ).id = expando;
		return !document[ getByName ] || !document[ getByName ]( expando ).length;
	} );

	// ID find and filter
	if ( support.getById ) {
		Expr.find.ID = function( id, context ) {
			if ( typeof context[ getById ] !== "undefined" && documentIsHTML ) {
				var m = context[ getById ]( id );
				return m ? [ m ] : [];
			}
		};
		Expr.filter.ID = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem[ getAttr ]( "id" ) === attrId;
			};
		};
	} else {

		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find.ID;

		Expr.filter.ID = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem[ getAttr + "Node" ] !== "undefined" &&
					elem[ getAttr + "Node" ]( "id" );
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find.TAG = support[ getByTag ] ?
		function( tag, context ) {
			if ( typeof context[ getByTag ] !== "undefined" ) {
				return context[ getByTag ]( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context[ getByQSA ]( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,

				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context[ getByTag ]( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( elem = results[ i++ ] ) {
					if ( elem[ domType ] === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find.CLASS = support[ getByClass ] && function( className, context ) {
		if ( typeof context[ getByClass ] !== "undefined" && documentIsHTML ) {
			return context[ getByClass ] ( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( support.qsa = rnative.test( document[ getByQSA ] ) ) {

		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert( function( elem ) {
			var

				// m = "msallowcapture",
				s = "select", o = "option";

			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( elem ).innerHTML = "<a id='" + expando + "'></a>" +
				"<" + s + " id='" + expando + "-\r\\'>" + // m + "=''>" +
				"<" + o + " " + s + "ed=''></" + o + "></" + s + ">";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			//if ( elem[ getByQSA ]("[" + m + "^='']").length ) {
			//	rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			//}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			//if ( !elem[ getByQSA ]( "[" + s + "ed]" ).length ) {
			//	rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			//}

			// Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
			if ( !elem[ getByQSA ]( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push( "~=" );
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			s = ":checked";
			if ( !elem[ getByQSA ]( s ).length ) {
				rbuggyQSA.push( s );
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !elem[ getByQSA ]( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push( ".#.+[+~]" );
			}
		} );

		assert( function( elem ) {

			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var
				input = createElem( "input", document ),
				n = "name";

			input[ setAttr ]( "type", "hidden" );
			elem.appendChild( input )[ setAttr ]( n, "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			//if ( elem[ getByQSA ]("[" + n + "=d]").length ) {
			//	rbuggyQSA.push( n + whitespace + "*[*^$|!~]?=" );
			//}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			n = ":enabled";
			if ( !elem[ getByQSA ]( n ).length ) {
				rbuggyQSA.push( n, ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			//elem[ getByQSA ]( "*,:x" );
			//rbuggyQSA.push( ",.*:" );
		} ) ;
	}

	if (
		support[ matchesSel ] = rnative.test(
			matches = docElem.matches ||
				docElem[ "webkit" + matchSelector ] ||
				docElem[ "moz" + matchSelector ] ||
				docElem[ "o" + matchSelector ] ||
				docElem[ "ms" + matchSelector ]
		)
	) {

		assert( function( elem ) {

			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( elem, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( elem, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		} );
	}

	rbuggyQSA = rbuggyQSA.length && regexp( rbuggyQSA.join( "|" ) );
	rbuggyMatches = rbuggyMatches.length && regexp( rbuggyMatches.join( "|" ) );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem[ domComparePos ] );

	// Element contains another
	// Purposefully self-exclusive
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a[ domType ] === 9 ? a[ getDocElem ] : a,
				bup = b && b[ domParent ];
			return a === bup || !!( bup && bup[ domType ] === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a[ domComparePos ] && a[ domComparePos ]( bup ) & 16
			) );
		} :
		function( a, b ) {
			if ( b ) {
				while ( b = b[ domParent ] ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a[ domComparePos ] - !b[ domComparePos ];
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a[ getOwnDoc ] || a ) === ( b[ getOwnDoc ] || b ) ?
			a[ domComparePos ]( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if (
			compare & 1 ||
			( !support.sortDetached && b[ domComparePos ]( a ) === compare )
		) {

			// Choose the first element that is related to our preferred document
			if (
				a === document ||
				a[ getOwnDoc ] === preferredDoc &&
				contains( preferredDoc, a )
			) {
				return -1;
			}
			if (
				b === document ||
				b[ getOwnDoc ] === preferredDoc &&
				contains( preferredDoc, b )
			) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {

		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a[ domParent ],
			bup = b[ domParent ],
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === document ? -1 :
				b === document ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( cur = cur[ domParent ] ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( cur = cur[ domParent ] ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[ i ] === bp[ i ] ) {
			i++;
		}

		return i ?

			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[ i ], bp[ i ] ) :

			// Otherwise nodes in our document sort first
			ap[ i ] === preferredDoc ? -1 :
			bp[ i ] === preferredDoc ? 1 :
			0;
	};

	return document;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle[ matchesSel ] = function( elem, expr ) {

	// Set document vars if needed
	if ( ( elem[ getOwnDoc ] || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if (
		support[ matchesSel ] && documentIsHTML &&
		!compilerCache[ expr + " " ] &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) )
	) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if (
				ret || support.disconnectedMatch ||

				// As well, disconnected nodes are said to be in a document
				// fragment in IE 9
				elem.document && elem.document[ domType ] !== 11
			) {
				return ret;
			}
		} catch ( e ) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {

	// Set document vars if needed
	if ( ( context[ getOwnDoc ] || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {

	// Set document vars if needed
	if ( ( elem[ getOwnDoc ] || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ strlower( name ) ],

		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, strlower( name ) ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem[ getAttr ]( name ) :
			( val = elem[ getAttr + "Node" ]( name ) ) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( elem = results[ i++ ] ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem[ domType ];

	if ( !nodeType ) {

		// If no nodeType, this is expected to be an array
		while ( node = elem[ i++ ] ) {

			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {

			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem[ domNext ] ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}

	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: domParent, first: true },
		" ": { dir: domParent },
		"+": { dir: domPrev, first: true },
		"~": { dir: domPrev }
	},

	preFilter: {
		ATTR: function( match ) {
			match[ 1 ] = match[ 1 ].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[ 3 ] = (
				match[ 3 ] || match[ 4 ] || match[ 5 ] || ""
			).replace( runescape, funescape );

			if ( match[ 2 ] === "~=" ) {
				match[ 3 ] = " " + match[ 3 ] + " ";
			}

			return match.slice( 0, 4 );
		},

		CHILD: function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[ 1 ] = strlower( match[ 1 ] );

			if ( match[ 1 ].slice( 0, 3 ) === "nth" ) {

				// nth-* requires argument
				if ( !match[ 3 ] ) {
					Sizzle.error( match[ 0 ] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[ 4 ] = +( match[ 4 ] ?
					match[ 5 ] + ( match[ 6 ] || 1 ) :
					2 * ( match[ 3 ] === "even" || match[ 3 ] === "odd" )
				);
				match[ 5 ] = +( ( match[ 7 ] + match[ 8 ] ) || match[ 3 ] === "odd" );

			// other types prohibit arguments
			} else if ( match[ 3 ] ) {
				Sizzle.error( match[ 0 ] );
			}

			return match;
		},

		PSEUDO: function( match ) {
			var excess,
				unquoted = !match[ 6 ] && match[ 2 ];

			if ( matchExpr.CHILD.test( match[ 0 ] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[ 3 ] ) {
				match[ 2 ] = match[ 4 ] || match[ 5 ] || "";

			// Strip excess characters from unquoted arguments
			} else if (
				unquoted && rpseudo.test( unquoted ) &&

				// Get excess from tokenize (recursively)
				( excess = tokenize( unquoted, true ) ) &&

				// advance to the next closing parenthesis
				( excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length )
			) {

				// excess is a negative index
				match[ 0 ] = match[ 0 ].slice( 0, excess );
				match[ 2 ] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		TAG: function( nodeNameSelector ) {
			var nodeName = strlower( nodeNameSelector.replace( runescape, funescape ) );
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem[ domNode ] && strlower( elem[ domNode ] ) === nodeName;
				};
		},

		CLASS: function( className ) {
			var pattern = classCache[ className + " " ], cn = "className";

			return pattern ||
				( pattern = regexp(
					"(^|" + whitespace + ")" + className + "(" + whitespace + "|$)"
				) ) &&
				classCache( className, function( elem ) {
					return pattern.test(
						typeof elem[ cn ] === "string" && elem[ cn ] ||
						typeof elem[ getAttr ] !== "undefined" && elem[ getAttr ]( "class" ) || ""
					);
				} );
		},

		ATTR: function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? (
						" " + result.replace( rwhitespace, " " ) + " "
					).indexOf( check ) > -1 :
					operator === "|=" ? result === check ||
						result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		CHILD: function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type",
				uID = "uniqueID";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem[ domParent ];
				} :

				function( elem, context, xml ) {
					var cache, uniqueCache, outerCache, node, nodeIndex, start,
						dir = simple !== forward ? domNext : domPrev,
						parent = elem[ domParent ],
						name = ofType && strlower( elem[ domNode ] ),
						useCache = !xml && !ofType,
						diff = false;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( node = node[ dir ] ) {
									if ( ofType ?
										strlower( node[ domNode ] ) === name :
										node[ domType ] === 1 ) {

										return false;
									}
								}

								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && domNext;
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {

							// Seek `elem` from a previously-cached index

							// ...in a gzip-friendly way
							node = parent;
							outerCache = node[ expando ] || ( node[ expando ] = {} );

							// Support: IE <9 only
							// Defend against cloned attroperties (jQuery gh-1709)
							uniqueCache = outerCache[ node[ uID ] ] ||
								( outerCache[ node[ uID ] ] = {} );

							cache = uniqueCache[ type ] || [];
							nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
							diff = nodeIndex && cache[ 2 ];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while (
								node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								( diff = nodeIndex = 0 ) ||
								start.pop()
							) {

								// When found, cache indexes on `parent` and break
								if ( node[ domType ] === 1 && ++diff && node === elem ) {
									uniqueCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						} else {

							// Use previously-cached element index if available
							if ( useCache ) {

								// ...in a gzip-friendly way
								node = elem;
								outerCache = node[ expando ] || ( node[ expando ] = {} );

								// Support: IE <9 only
								// Defend against cloned attroperties (jQuery gh-1709)
								uniqueCache = outerCache[ node[ uID ] ] ||
									( outerCache[ node[ uID ] ] = {} );

								cache = uniqueCache[ type ] || [];
								nodeIndex = cache[ 0 ] === dirruns && cache[ 1 ];
								diff = nodeIndex;
							}

							// xml :nth-child(...)
							// or :nth-last-child(...) or :nth(-last)?-of-type(...)
							if ( diff === false ) {

								// Use the same loop as above to seek `elem` from the start
								while (
									node = ++nodeIndex && node && node[ dir ] ||
									( diff = nodeIndex = 0 ) ||
									start.pop()
								) {

									if (
										( ofType ?
												strlower( node[ domNode ] ) === name :
											node[ domType ] === 1
										) &&  ++diff
									) {

										// Cache the index of each encountered element
										if ( useCache ) {
											outerCache = node[ expando ] ||
												( node[ expando ] = {} );

											// Support: IE <9 only
											// Defend against cloned attroperties (jQuery gh-1709)
											uniqueCache = outerCache[ node[ uID ] ] ||
												( outerCache[ node[ uID ] ] = {} );

											uniqueCache[ type ] = [ dirruns, diff ];
										}

										if ( node === elem ) {
											break;
										}
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		PSEUDO: function( pseudo, argument ) {

			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase
			// letters.  Remember that setFilters inherits from pseudos
			var args,
				expFilters = Expr.setFilters,
				fn = Expr.pseudos[ pseudo ] || expFilters[ strlower( pseudo ) ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return expFilters.hasOwnProperty( strlower( pseudo ) ) ?
					markFunction( function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[ i ] );
							seed[ idx ] = !( matches[ idx ] = matched[ i ] );
						}
					} ) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {

		// Potentially complex pseudos
		not: markFunction( function( selector ) {

			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction( function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( elem = unmatched[ i ] ) {
							seed[ i ] = !( matches[ i ] = elem );
						}
					}
				} ) :
				function( elem, context, xml ) {
					input[ 0 ] = elem;
					matcher( input, null, xml, results );

					// Don't keep the element (issue #299)
					input[ 0 ] = null;
					return !results.pop();
				};
		} ),

		has: markFunction( function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		} ),

		contains: markFunction( function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return (
					elem.textContent || elem.innerText || getText( elem )
				).indexOf( text ) > -1;
			};
		} ),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		lang: markFunction( function( lang ) {

			// lang value must be a valid identifier
			if ( !ridentifier.test( lang || "" ) ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = strlower( lang.replace( runescape, funescape ) );
			return function( elem ) {
				var elemLang, attr = "lang";
				do {
					if (
						elemLang = documentIsHTML ?
							elem[ attr ] :
							elem[ getAttr ]( "xml:" + attr ) || elem[ getAttr ]( attr )
					) {
						elemLang = strlower( elemLang );
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( ( elem = elem[ domParent ] ) && elem[ domType ] === 1 );
				return false;
			};
		} ),

		// Miscellaneous
		target: function( elem ) {
			var hash = window.location;
			hash = hash && hash.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		root: function( elem ) {
			return elem === docElem;
		},

		focus: function( elem ) {
			return elem === document.activeElement &&
				( !document.hasFocus || document.hasFocus() ) &&
				!!( elem.type || elem.href || ~elem.tabIndex );
		},

		// Boolean properties
		enabled: function( elem ) {
			return elem.disabled === false;
		},

		disabled: function( elem ) {
			return elem.disabled === true;
		},

		checked: function( elem ) {

			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = strlower( elem[ domNode ] );
			return ( nodeName === "input" && !!elem.checked ) ||
				( nodeName === "option" && !!elem.selected );
		},

		selected: function( elem ) {

			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem[ domParent ] ) {
				elem[ domParent ].selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		empty: function( elem ) {

			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem[ domNext ] ) {
				if ( elem[ domType ] < 6 ) {
					return false;
				}
			}
			return true;
		},

		parent: function( elem ) {
			return !Expr.pseudos.empty( elem );
		},

		// Element/input types
		header: function( elem ) {
			return rheader.test( elem[ domNode ] );
		},

		input: function( elem ) {
			return rinputs.test( elem[ domNode ] );
		},

		button: function( elem ) {
			var name = strlower( elem[ domNode ] ), btn = "button";
			return name === "input" && elem.type === btn || name === btn;
		},

		text: function( elem ) {
			var attr, t = "text";
			return strlower( elem[ domNode ] ) === "input" &&
				elem.type === t &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( ( attr = elem[ getAttr ]( "type" ) ) == null || strlower( attr ) === t );
		},

		// Position-in-collection
		first: createPositionalPseudo( function() {
			return [ 0 ];
		} ),

		last: createPositionalPseudo( function( matchIndexes, length ) {
			return [ length - 1 ];
		} ),

		eq: createPositionalPseudo( function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		} ),

		even: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		odd: createPositionalPseudo( function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		lt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} ),

		gt: createPositionalPseudo( function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		} )
	}
};

Expr.pseudos.nth = Expr.pseudos.eq;

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

/** Easy API for creating new setFilters
 * @constructor
 */
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || ( match = rcomma.exec( soFar ) ) ) {
			if ( match ) {

				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[ 0 ].length ) || soFar;
			}
			groups.push( ( tokens = [] ) );
		}

		matched = false;

		// Combinators
		if ( match = rcombinators.exec( soFar ) ) {
			matched = match.shift();
			tokens.push( {
				value: matched,

				// Cast descendant combinators to space
				type: match[ 0 ].replace( rtrim, " " )
			} );
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if (
				( match = matchExpr[ type ].exec( soFar ) ) &&
				( !preFilters[ type ] || ( match = preFilters[ type ]( match ) ) )
			) {
				matched = match.shift();
				tokens.push( {
					value: matched,
					type: type,
					matches: match
				} );
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :

			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[ i ].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === domParent,
		doneName = done++;

	return combinator.first ?

		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( elem = elem[ dir ] ) {
				if ( elem[ domType ] === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, uniqueCache, outerCache,
				newCache = [ dirruns, doneName ],
				uID = "uniqueID";

			// We can't set arbitrary data on XML nodes, so they don't benefit
			// from combinator caching
			if ( xml ) {
				while ( elem = elem[ dir ] ) {
					if ( elem[ domType ] === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( elem = elem[ dir ] ) {
					if ( elem[ domType ] === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || ( elem[ expando ] = {} );

						// Support: IE <9 only
						// Defend against cloned attroperties (jQuery gh-1709)
						uniqueCache = outerCache[ elem[ uID ] ] ||
							( outerCache[ elem[ uID ] ] = {} );

						if (
							( oldCache = uniqueCache[ dir ] ) &&
							oldCache[ 0 ] === dirruns &&
							oldCache[ 1 ] === doneName
						) {

							// Assign to newCache so results back-propagate to previous elements
							return ( newCache[ 2 ] = oldCache[ 2 ] );
						} else {

							// Reuse newcache so results back-propagate to previous elements
							uniqueCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( newCache[ 2 ] = matcher( elem, context, xml ) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[ i ]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[ 0 ];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[ i ], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( elem = unmatched[ i ] ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction( function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts(
				selector || "*",
				context[ domType ] ? [ context ] : context,
				[]
			),

			// Prefilter to get matcher input, preserving a map for
			// seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?

				// If we have a postFinder, or filtered seed, or non-seed
				// postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( elem = temp[ i ] ) {
					matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {

					// Get the final matcherOut by condensing this intermediate into
					// postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( elem = matcherOut[ i ] ) {

							// Restore matcherIn since elem is not yet a final match
							temp.push( matcherIn[ i ] = elem );
						}
					}
					postFinder( null, ( matcherOut = [] ), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if (
						( elem = matcherOut[ i ] ) &&
						( temp = postFinder ? indexOf( seed, elem ) : preMap[ i ] ) > -1
					) {

						seed[ temp ] = !( results[ temp ] = elem );
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	} );
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		expRelative = Expr.relative,
		leadingRelative = expRelative[ tokens[ 0 ].type ],
		implicitRelative = leadingRelative || expRelative[ " " ],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
					( checkContext = context )[ domType ] ?
						matchContext( elem, context, xml ) :
						matchAnyContext( elem, context, xml )
				);

			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( matcher = expRelative[ tokens[ i ].type ] ) {
			matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
		} else {
			matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {

				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( expRelative[ tokens[ j ].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(

						// If the preceding token was a descendant combinator,
						// insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat( {
							value: tokens[ i - 2 ].type === " " ? "*" : ""
						} )
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( ( tokens = tokens.slice( j ) ) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,

				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find.TAG( "*", outermost ),

				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = ( dirruns += contextBackup == null ? 1 : Math.random() || 0.1 ),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context === document || context || outermost;
			}

			// Add elements passing elementMatchers directly to results
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					if ( !context && elem[ getOwnDoc ] !== document ) {
						setDocument( elem );
						xml = !documentIsHTML;
					}
					while ( matcher = elementMatchers[ j++ ] ) {
						if ( matcher( elem, context || document, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {

					// They will have gone through all possible matchers
					if ( elem = !matcher && elem ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// `i` is now the count of elements visited above, and adding it to `matchedCount`
			// makes the latter nonnegative.
			matchedCount += i;

			// Apply set filters to unmatched elements
			// NOTE: This can be skipped if there are no unmatched elements (i.e., `matchedCount`
			// equals `i`), unless we didn't visit _any_ elements in the above loop because we have
			// no element matchers and no seed.
			// Incrementing an initially-string "0" `i` allows `i` to remain a string only in that
			// case, which will result in a "00" `matchedCount` that differs from `i` but is also
			// numerically zero.
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( matcher = setMatchers[ j++ ] ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {

					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !( unmatched[ i ] || setMatched[ i ] ) ) {
								setMatched[ i ] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if (
					outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1
				) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {

		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[ i ] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache(
			selector,
			matcherFromGroupMatchers( elementMatchers, setMatchers )
		);

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *                          selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed]    A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( ( selector = compiled.selector || selector ) ),
		expRelative = Expr.relative,
		expFind = Expr.find;

	results = results || [];

	// Try to minimize operations if there is only one selector in the list and no seed
	// (the latter of which guarantees us context)
	if ( match.length === 1 ) {

		// Reduce context if the leading compound selector is an ID
		tokens = match[ 0 ] = match[ 0 ].slice( 0 );
		if (
			tokens.length > 2 &&
			( token = tokens[ 0 ] ).type === "ID" &&
			support.getById && context[ domType ] === 9 && documentIsHTML &&
			expRelative[ tokens[ 1 ].type ]
		) {

			context = (
				expFind.ID( token.matches[ 0 ].replace( runescape, funescape ), context ) ||
				[]
			)[ 0 ];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context[ domParent ];
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr.needsContext.test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[ i ];

			// Abort if we hit a combinator
			if ( expRelative[ ( type = token.type ) ] ) {
				break;
			}
			if ( find = expFind[ type ] ) {

				// Search, expanding context for leading sibling combinators
				if (
					seed = find(
						token.matches[ 0 ].replace( runescape, funescape ),
						rsibling.test( tokens[ 0 ].type ) &&
						testContext( context[ domParent ] ) || context
					)
				) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		!context || rsibling.test( selector ) && testContext( context[ domParent ] ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split( "" ).sort( sortOrder ).join( "" ) === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert( function( elem ) {

	// Should return 1, but returns 4 (following)
	return elem[ domComparePos ]( createElem( "div", document ) ) & 1;
} );

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
//if ( !assert( function( div ) {
//	div.innerHTML = "<a href='#'></a>";
//	return div.firstChild[ getAttr ]( "href" ) === "#" ;
//} ) ) {
//	addHandle( "type|href|height|width", function( elem, name, isXML ) {
//		if ( !isXML ) {
//			return elem[ getAttr ]( name, strlower( name ) === "type" ? 1 : 2 );
//		}
//	} );
//}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
//if ( !support.attributes || !assert( function( div ) {
//	div.innerHTML = "<input/>";
//	div.firstChild[ setAttr ]( "value", "" );
//	return div.firstChild[ getAttr ]( "value" ) === "";
//} ) ) {
//	addHandle( "value", function( elem, name, isXML ) {
//		if ( !isXML && strlower( elem[ domNode ] ) === "input" ) {
//			return elem.defaultValue;
//		}
//	} );
//}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert( function( div ) {
	return div[ getAttr ]( "disabled" ) == null;
} ) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? strlower( name ) :
					( val = elem[ getAttr + "Node" ]( name ) ) && val.specified ?
					val.value :
				null;
		}
	} );
}

// EXPOSE
if ( typeof define === "function" && define.amd ) {
	define( function() { return Sizzle; } );

// Sizzle requires that there be a global window in Common-JS like environments
} else if ( typeof module !== "undefined" && module.exports ) {
	module.exports = Sizzle;
} else {
	window.Sizzle = Sizzle;
}

// EXPOSE

} )( window );
