/*!
 * jQuery JavaScript Library v2.2.4
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2019-01-24T11:00Z
 */

(function( global, factory ) {
  var o = "object", e = "exports", d = "document";
	if ( typeof module === o && typeof module[ e ] === o ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module[ e ] = global[ d ] ?
			factory( global, true ) :
			function( w ) {
				if ( !w[ d ] ) {
					throw new Error( "jQuery requires a window with a " + d );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//"use strict";
var arr = [];

var document = window.document;

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};

var createElem = function createElem( elem, context ) {
		return ( context || document ).createElement( elem );
	};

var strlower = function strlower( str ) {
		return ( "" + str ).toLowerCase();
	};

var strreplace = function strreplace( str, expr, repl ) {
		return ( "" + str ).replace( expr, repl || "" );
	};

var domNode = "nodeName";

var domType = "nodeType";

var domParent = "parentNode";

var mimescript = "script";

var typeOf = function( obj, type ) {
    if ( /^a/.test( type ) ) {
      return ( obj instanceof Array );
    }
    if ( /^fn/.test( type ) ) {
      type = "func";
    } else if ( /^s/.test( type ) && !/^sy/.test( type ) ) {
      type = "str";
    }
    type = new RegExp( "^" + type, "i" );
    return ( type.test( typeof obj ) );
  };

/* jshint -W080 */
var undef = undefined;



var
	version = "2.2.4",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {

		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {

	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
	  var t = this;
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? t[ num + t.length ] : t[ num ] ) :

			// Return all the elements in a clean array
			slice.call( t );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var t = this,
			ret = jQuery.merge( t.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = t;
		ret.context = t.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	each: function( callback ) {
		return jQuery.each( this, callback );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map( this, function( elem, i ) {
			return callback.call( elem, i, elem );
		} ) );
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var t = this, len = t.length,
			j = +i + ( i < 0 ? len : 0 );
		return t.pushStack( j >= 0 && j < len ? [ t[ j ] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor();
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		args = arguments,
		target = args[ 0 ] || {},
		i = 1,
		length = args.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeOf( target, "bool" ) ) {
		deep = target;

		// Skip the boolean and the target
		target = args[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( !typeOf( target, "obj" ) && !jQuery.isFunction( target ) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {

		// Only deal with non-null/undefined values
		if ( ( options = args[ i ] ) != null ) {

			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject( copy ) ||
					( copyIsArray = jQuery.isArray( copy ) ) ) ) {

					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray( src ) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject( src ) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undef ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend( {

	// Unique for each copy of jQuery on the page
	expando: "jQuery" + strreplace( ( version + Math.random() ), /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type( obj ) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {

		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		var realStringObj = obj && obj.toString();
		return !jQuery.isArray( obj ) && ( realStringObj - parseFloat( realStringObj ) + 1 ) >= 0;
	},

	isPlainObject: function( obj ) {
		var key, con = "constructor";

		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj[ domType ] || jQuery.isWindow( obj ) ) {
			return false;
		}

		// Not own constructor property must be Object
		if ( obj[ con ] &&
				!hasOwn.call( obj, con ) &&
				!hasOwn.call( obj[ con ].prototype || {}, "isPrototypeOf" ) ) {
			return false;
		}

		// Own properties are enumerated firstly, so to speed up,
		// if last one is own, then all properties are own
		for ( key in obj ) {}

		return key === undef || hasOwn.call( obj, key );
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}

		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return /^obj|func/.test( typeof obj ) ?
			class2type[ toString.call( obj ) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {

			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf( "use strict" ) === 1 ) {
				script = createElem( mimescript, document );
				script.text = code;
				document.head.appendChild( script )[ domParent ].removeChild( script );
			} else {

				// Otherwise, avoid the DOM node creation, insertion
				// and removal by using an indirect global eval

				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return strreplace( strreplace( string, rmsPrefix, "ms-" ), rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		var n = elem[ domNode ] || null;
	  return n && strlower( n ) === strlower( name );
	},

	each: function( obj, callback ) {
		var length, i = 0;

		if ( isArrayLike( obj ) ) {
			length = obj.length;
			for ( ; i < length; i++ ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		} else {
			for ( i in obj ) {
				if ( callback.call( obj[ i ], i, obj[ i ] ) === false ) {
					break;
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			strreplace( text + "", rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArrayLike( Object( arr ) ) ) {
				jQuery.merge( ret,
					typeOf( arr, "str" ) ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var length, value,
			i = 0,
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArrayLike( elems ) ) {
			length = elems.length;
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeOf( context, "str" ) ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undef;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
} );

// JSHint would error on this code due to the Symbol not being defined in ES5.
// Defining this global in .jshintrc would create a danger of using the global
// unguarded in another place, it seems safer to just disable JSHint for these
// three lines.
/* jshint ignore: start */
if ( typeOf( Symbol, "fn" ) ) {
	jQuery.fn[ Symbol.iterator ] = arr[ Symbol.iterator ];
}
/* jshint ignore: end */

// Populate the class2type map
( "Boolean Number String Function Array Date RegExp Object Error Symbol" ).split( " " ).forEach(
function( name ) {
	class2type[ "[object " + name + "]" ] = strlower( name );
} );

function isArrayLike( obj ) {

	// Support: iOS 8.2 (not reproducible in simulator)
	// `in` check used to prevent JIT error (gh-2145)
	// hasOwn isn't used here due to false negatives
	// regarding Nodelist length in IE
	var length = !!obj && "length" in obj && obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	return type === "array" || length === 0 ||
		typeOf( length, "num" ) && length > 0 && ( length - 1 ) in obj;
}
var rinputs = /^(?:input|select|textarea|button)$/i;

var getElem = "getElement";

var getById = getElem + "ById";

var getByTag = getElem + "sByTagName";

var getOwnDoc = "ownerDocument";

var getDocElem = "documentElement";

var getAttr = "getAttribute";

var setAttr = "setAttribute";

var domNext = "nextSibling";

var domPrev = "previousSibling";

var evtListenerAdd = "addEventListener";

/* jshint -W080 */
var notdef = "undefined";

var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.1
 * http://sizzlejs.com/
 *
 * Copyright jQuery Foundation and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2019-01-15, modfied and un-official
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
    // hasOwn = ( {} ).hasOwnProperty,

    // arr = [],
    pop = arr.pop,
    pushNative = arr.push,

    // push = arr.push,
    // slice = arr.slice,

    matchSelector = "atchesSelector",
    MatchSelector = "M" + matchSelector,

    /**/
    /* jshint -W080 */

    /*
    undef = undefined,                                            // remove in jQuery
    notdef = "undefined",                                         // remove in jQuery
    rinputs = /^(?:input|select|textarea|button)$/i,              // remove in jQuery
    domNext = "nextSibling",                                      // remove in jQuery
    domNode = "nodeName",                                         // remove in jQuery
    domPrev = "previousSibling",                                  // remove in jQuery
    domParent = "parentNode",                                     // remove in jQuery
    domType = "nodeType",                                         // remove in jQuery
    evtListenerAdd = "addEventListener",                          // remove in jQuery
    getAttr  = "getAttribute",                                    // remove in jQuery
    getElem = "getElement",                                       // remove in jQuery
    getById = getElem + "ById",                                   // remove in jQuery
    getByQSA = "querySelectorAll",                                // remove in jQuery
    getByTag = getElem + "sByTagName",                            // remove in jQuery
    getDocElem = "documentElement",                               // remove in jQuery
    getOwnDoc = "ownerDocument",                                  // remove in jQuery
    setAttr = "setAttribute",                                     // remove in jQuery

    // remove in jQuery
    createElem = function( elem, context ) {
      return ( context || document ).createElement( elem );
    },

    // remove in jQuery
    strlower = function( str ) {
      return ( "" + str ).toLowerCase();
    },

    // remove in jQuery
    strreplace = function( str, expr, repl ) {
      return ( "" + str ).replace( expr, repl || "" );
    },

    // remove in jQuery
    typeOf = function( obj, type ) {
      if ( /^a/.test( type ) ) {
        return ( obj instanceof Array );
      }
      if ( /^fn/.test( type ) ) {
        type = "func";
      } else if ( /^s/.test( type ) && !/^sy/.test( type ) ) {
        type = "str";
      }
      type = new RegExp( "^" + type, "i" );
      return ( type.test( typeof obj ) );
    },

    /**/

    // Use a stripped-down indexOf as it's faster than native
    // http://jsperf.com/thor-indexof-vs-for/5
    indexOf = function( list, elem ) {
      for ( var i = 0, len = list.length; i < len; i++ ) {
        if ( list[ i ] === elem ) {
          return i;
        }
      }
      return -1;
    },

    regExp = function( expr, flag ) {
      return typeOf( flag, notdef ) ?
        new RegExp( expr ) :
        new RegExp( expr, flag );
    },

    booleans = "checked|selected|async|autofocus|autoplay|controls|defer|" +
      "disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

    // Regular expressions

    // http://www.w3.org/TR/css3-selectors/#whitespace
    whitespace = "[\\x20\\t\\r\\n\\f]",

    // http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
    identifier = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

    // Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
    attributes = "\\[" + whitespace + "*(" + identifier + ")(?:" + whitespace +

      // Operator (capture 2)
      "*([*^$|!~]?=)" + whitespace +

      // "Attribute values must be CSS identifiers [capture 5] or
      // strings [capture 3 or capture 4]"
      "*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" +
      whitespace +
      "*\\]",

    pseudos = ":(" + identifier + ")(?:\\((" +

      // To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
      // 1. quoted (capture 3; capture 4 or capture 5)
      "('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +

      // 2. simple (capture 6)
      "((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +

      // 3. anything else (capture 2)
      ".*" +
      ")\\)|)",

    // Leading and non-escaped trailing whitespace, capturing some non-whitespace characters
    // preceding the latter
    rwhitespace = regExp(
      whitespace + "+", "g"
    ),
    rtrim = regExp(
      "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$",
      "g"
    ),

    rcomma = regExp(
      "^" + whitespace + "*," + whitespace + "*"
    ),

    rcombinators = regExp(
      "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*"
    ),

    rattributeQuotes = regExp(
      "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g"
    ),

    rpseudo = regExp(
      pseudos
    ),
    ridentifier = regExp(
      "^" + identifier + "$"
    ),

    matchExpr = {
      ID: regExp(
        "^#(" + identifier + ")"
      ),
      CLASS: regExp(
        "^\\.(" + identifier + ")"
      ),
      TAG: regExp(
        "^(" + identifier + "|[*])"
      ),
      ATTR: regExp(
        "^" + attributes
      ),
      PSEUDO: regExp(
        "^" + pseudos
      ),
      CHILD: regExp(
        "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" +
        whitespace + "*(even|odd|(([+-]|)(\\d*)n|)" +
        whitespace + "*(?:([+-]|)" +
        whitespace + "*(\\d+)|))" +
        whitespace + "*\\)|)",
        "i"
      ),
      bool: regExp(
        "^(?:" + booleans + ")$",
        "i"
      ),

      // For use in libraries implementing .is()
      // We use this for POS matching in `select`
      needsContext: regExp(
        "^" +
        whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
        whitespace + "*((?:-\\d)?\\d*)" +
        whitespace + "*\\)|)(?=[^-]|$)",
        "i"
      )
    },

    rheader = /^h\d$/i,

    rnative = /^[^{]+{\s*\[native \w/,

    // Easily-parseable/retrievable ID or TAG or CLASS selectors
    rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

    rsibling = /[+~]/,
    rescape = /['\\]/g,

    // CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
    runescape = regExp(
      "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)",
      "ig"
    ),
    funescape = function( _, escaped, escapedWhitespace ) {
      var high = "0x" + escaped - 0x10000, sfc = "fromCharCode";

      // NaN means non-codepoint
      // Support: Firefox<24
      // Workaround erroneous numeric interpretation of +"0x"
      return high !== high || escapedWhitespace ?
        escaped :
        high < 0 ?

          // BMP codepoint
          String[ sfc ]( high + 0x10000 ) :

          // Supplemental Plane codepoint (surrogate pair)
          String[ sfc ]( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
    },

    // Used for iframes
    // See setDocument()
    // Removing the function wrapper causes a "Permission Denied" error in IE
    unloadHandler = function() {
      setDocument();
    },

    getByClass = getElem + "sByClassName",
    compareDocPos = "compareDocumentPosition",

    tagInput = "input"
  ;

  matchSelector = "m" + matchSelector;

  // Optimize for push.apply( _, NodeList )
  try {
    var pdcn = preferredDoc.childNodes;
    push.apply(
      ( arr = slice.call( pdcn ) ),
      pdcn
    );

    // Support: Android<4.0
    // Detect silently failing push.apply
    arr[ pdcn.length ][ domType ] = arr[ pdcn.length ][ domType ];
  } catch ( e ) {
    push = {
      apply: arr.length ?

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
          while ( ( target [ j++ ] = els[ i++ ] ) ) {}
          target.length = j - 1;
        }
    };
  }

  function Sizzle( selector, context, results, seed ) {
    var
      m,
      i,
      elem,
      nid,
      nidselect,
      match,
      groups,
      newSelector,
      newContext = context && context[ getOwnDoc ],

      // nodeType defaults to 9, since context defaults to document
      nodeType = context ? context[ domType ] : 9;

    results = results || [];

    // Return early from calls with invalid selector or context
    if (
      !typeOf( selector, "str" ) || !selector ||
      nodeType !== 1 && nodeType !== 9 && nodeType !== 11
    ) {
      return results;
    }

    // Try to shortcut find operations (as opposed to filters) in HTML documents
    if ( !seed ) {
      if (
        ( context ? context[ getOwnDoc ] || context : preferredDoc ) !== document
      ) {
        setDocument( context );
      }
      context = context || document;

      if ( documentIsHTML ) {

        // If the selector is sufficiently simple, try using a "get*By*" DOM method
        // (excepting DocumentFragment context, where the methods don't exist)
        if ( nodeType !== 11 && ( match = rquickExpr.exec( selector ) ) ) {

          // ID selector
          if ( ( m = match[ 1 ] ) ) {

            // Document context
            if ( nodeType === 9 ) {
              if ( ( elem = context[ getById ]( m ) ) ) {

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
                newContext &&
                ( elem = newContext[ getById ]( m ) ) &&
                contains( context, elem ) &&
                elem.id === m
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
            ( m = match[ 3 ] ) &&
            support[ getByClass ] &&
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
            if ( ( nid = context[ getAttr ]( "id" ) ) ) {
              nid = strreplace( nid, rescape, "\\$&" );
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
              push.apply(
                results,
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
    return select( strreplace( selector, rtrim, "$1" ), context, results, seed );
  }

  /**
   * Create key-value caches of limited size
   * @returns {function(string, object)} Returns the Object data after storing it on itself with
   *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
   *	deleting the oldest entry
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
    var el = createElem( "div", document );

    try {
      return !!fn( el );
    } catch ( e ) {
      return false;
    } finally {

      // Remove from its parent by default
      if ( el[ domParent ] ) {
        el[ domParent ].removeChild( el );
      }

      // release memory in IE
      el = null;
    }
  }

  /**
   * Adds the same handler for all of the specified attrs
   * @param {String} attrs Pipe-separated list of attributes
   * @param {Function} handler The method that will be applied
   *
   function addHandle( attrs, handler ) {
    var arr = attrs.split( "|" ),
      i = arr.length;

    while ( i-- ) {
      Expr.attrHandle[ arr[ i ] ] = handler;
    }
  }
   /**/

  /**
   * Checks document order of two siblings
   * @param {Element} a
   * @param {Element} b
   * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
   */
  function siblingCheck( a, b ) {
    var
      si = "sourceIndex",
      cur = b && a,
      diff = cur && a[ domType ] === 1 && b[ domType ] === 1 &&
        ( ~b[ si ] || MAX_NEGATIVE ) -
        ( ~a[ si ] || MAX_NEGATIVE );

    // Use IE sourceIndex if available on both nodes
    if ( diff ) {
      return diff;
    }

    // Check if b follows a
    if ( cur ) {
      while ( ( cur = cur[ domNext ] ) ) {
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
      var name = strlower( elem[ domNode ] );
      return name === tagInput && elem.type === type;
    };
  }

  /**
   * Returns a function to use in pseudos for buttons
   * @param {String} type
   */
  function createButtonPseudo( type ) {
    return function( elem ) {
      var name = strlower( elem[ domNode ] );
      return ( name === tagInput || name === "button" ) && elem.type === type;
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
    return context && !typeOf( context[ getByTag ], notdef ) && context;
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
    var
      hasCompare,
      parent,

      //attachEv = "attacheEvent",
      unloadEv = "unload",
      doc = node ? node[ getOwnDoc ] || node : preferredDoc;

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
    if (
      ( parent = document.defaultView ) &&
      parent.top !== parent
    ) {

      // Support: IE 11
      if ( parent[ evtListenerAdd ] ) {
        parent[ evtListenerAdd ]( unloadEv, unloadHandler, false );
      } //else if ( parent[ attachEv ] ) {
        // Support: IE 9 - 10 only
      //  parent[ attachEv ]( "on" + unloadEv, unloadHandler );
      //}
    }

    /* Attributes
    ---------------------------------------------------------------------- */

    // Support: IE<8
    // Verify that getAttribute really returns attributes and not properties
    // (excepting IE8 booleans)
    //support.attributes = assert( function( el ) {
    //  var name = "className";
    //  el[ name ] = "i";
    //  return !el[ getAttr ]( name );
    //} );

    /* getElement(s)By*
    ---------------------------------------------------------------------- */

    // Check if getElementsByTagName("*") returns only elements
    support[ getByTag ] = assert( function( el ) {
      el.appendChild( document.createComment( "" ) );
      return !el[ getByTag ]( "*" ).length;
    } );

    // Support: IE<9
    support[ getByClass ] = rnative.test( document[ getByClass ] );

    // Support: IE<10
    // Check if getElementById returns elements by name
    // The broken getElementById methods don't pick up programatically-set names,
    // so use a roundabout getElementsByName test
    support.getById = assert( function( el ) {
      docElem.appendChild( el ).id = expando;
      return !document[ getElem + "sByName" ] || !document[ getElem + "sByName" ]( expando ).length;
    } );

    // ID find and filter
    if ( support.getById ) {
      Expr.find.ID = function( id, context ) {
        if ( !typeOf( context[ getById ], notdef ) && documentIsHTML ) {
          var m = context[ getById ]( id );
          return m ? [ m ] : [];
        }
      };
      Expr.filter.ID = function( id ) {
        var attrId = strreplace( id, runescape, funescape );
        return function( elem ) {
          return elem[ getAttr ]( "id" ) === attrId;
        };
      };
    } else {

      // Support: IE6/7
      // getElementById is not reliable as a find shortcut
      delete Expr.find.ID;

      Expr.filter.ID =  function( id ) {
        var attrId = strreplace( id, runescape, funescape );
        return function( elem ) {
          var node = !typeOf( elem[ getAttr + "Node" ], notdef ) &&
            elem[ getAttr + "Node" ]( "id" );
          return node && node.value === attrId;
        };
      };
    }

    // Tag
    Expr.find.TAG = support[ getByTag ] ?
      function( tag, context ) {
        if ( !typeOf( context[ getByTag ], notdef ) ) {
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
          while ( ( elem = results[ i++ ] ) ) {
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
      if ( !typeOf( context[ getByClass ], notdef ) && documentIsHTML ) {
        return context[ getByClass ]( className );
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

    if ( ( support.qsa = rnative.test( document[ getByQSA ] ) ) ) {

      // Build QSA regex
      // Regex strategy adopted from Diego Perini
      assert( function( el ) {
        var m = "msallowcapture",
          s = "select",
          o = "option";

        // Select is set to empty string on purpose
        // This is to test IE's treatment of not explicitly
        // setting a boolean content attribute,
        // since its presence should be enough
        // http://bugs.jquery.com/ticket/12359
        docElem.appendChild( el ).innerHTML = "<a id='" + expando + "'></a>" +
          "<" + s + " id='" + expando + "-\r\\' " + m + "=''>" +
          "<" + o + " " + s + "ed=''></" + o + "></" + s + ">";

        // Support: IE8, Opera 11-12.16
        // Nothing should be selected when empty strings follow ^= or $= or *=
        // The test attribute must be unknown in Opera but "safe" for WinRT
        // http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
        if ( el[ getByQSA ]( "[" + m + "^='']" ).length ) {
          rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
        }

        // Support: IE8
        // Boolean attributes and "value" are not treated correctly
        if ( !el[ getByQSA ]( "[" + s + "ed]" ).length ) {
          rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
        }

        // Support: Chrome<29, Android<4.4, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.8+
        if ( !el[ getByQSA ]( "[id~=" + expando + "-]" ).length ) {
          rbuggyQSA.push( "~=" );
        }

        // Webkit/Opera - :checked should return selected option elements
        // http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
        // IE8 throws error here and will not see later tests
        o = ":checked";
        if ( !el[ getByQSA ]( o ).length ) {
          rbuggyQSA.push( o );
        }

        // Support: Safari 8+, iOS 8+
        // https://bugs.webkit.org/show_bug.cgi?id=136851
        // In-page `selector#id sibing-combinator selector` fails
        if ( !el[ getByQSA ]( "a#" + expando + "+*" ).length ) {
          rbuggyQSA.push( ".#.+[+~]" );
        }
      } );

      assert( function( el ) {
        var input = tagInput, name = "name";

        // Support: Windows 8 Native Apps
        // The type and name attributes are restricted during .innerHTML assignment
        input = createElem( input, document );
        input[ setAttr ]( "type", "hidden" );
        el.appendChild( input )[ setAttr ]( name, "D" );

        // Support: IE8
        // Enforce case-sensitivity of name attribute
        if ( el[ getByQSA ]( "[" + name + "=d]" ).length ) {
          rbuggyQSA.push( name + whitespace + "*[*^$|!~]?=" );
        }

        // FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
        // IE8 throws error here and will not see later tests
        name = ":enabled";
        if ( !el[ getByQSA ]( name ).length ) {
          rbuggyQSA.push( name, ":disabled" );
        }

        // Opera 10-11 does not throw on post-comma invalid pseudos
        el[ getByQSA ]( "*,:x" );
        rbuggyQSA.push( ",.*:" );
      } );
    }

    if ( (
      support[ matchSelector ] = rnative.test(
        (
          matches = docElem.matches ||
            docElem[ "webkit" + MatchSelector ] ||
            docElem[ "moz" + MatchSelector ] ||
            docElem[ "o" + MatchSelector ] ||
            docElem[ "ms" + MatchSelector ]
        )
      )
    ) ) {

      assert( function( el ) {

        // Check to see if it's possible to do matchesSelector
        // on a disconnected node (IE 9)
        support.disconnectedMatch = matches.call( el, "div" );

        // This should fail with an exception
        // Gecko does not error, returns false instead
        matches.call( el, "[s!='']:x" );
        rbuggyMatches.push( "!=", pseudos );
      } );
    }

    rbuggyQSA = rbuggyQSA.length && regExp( rbuggyQSA.join( "|" ) );
    rbuggyMatches = rbuggyMatches.length && regExp( rbuggyMatches.join( "|" ) );

    /* Contains
    ---------------------------------------------------------------------- */
    hasCompare = rnative.test( docElem[ compareDocPos ] );

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
            a[ compareDocPos ] && a[ compareDocPos ]( bup ) & 16
        ) );
      } :
      function( a, b ) {
        if ( b ) {
          while ( ( b = b[ domParent ] ) ) {
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
        var compare = !a[ compareDocPos ] - !b[ compareDocPos ];
        if ( compare ) {
          return compare;
        }

        // Calculate position if both inputs belong to the same document
        compare = ( a[ getOwnDoc ] || a ) === ( b[ getOwnDoc ] || b ) ?
          a[ compareDocPos ]( b ) :

          // Otherwise we know they are disconnected
          1;

        // Disconnected nodes
        if (
          compare & 1 ||
          ( !support.sortDetached && b[ compareDocPos ]( a ) === compare )
        ) {

          // Choose the first element that is related to our preferred document
          if (
            a === document ||
            a[ getOwnDoc ] === preferredDoc && contains( preferredDoc, a )
          ) {
            return -1;
          }
          if (
            b === document ||
            b[ getOwnDoc ] === preferredDoc && contains( preferredDoc, b )
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
        while ( ( cur = cur[ domParent ] ) ) {
          ap.unshift( cur );
        }
        cur = b;
        while ( ( cur = cur[ domParent ] ) ) {
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

  Sizzle[ matchSelector ] = function( elem, expr ) {

    // Set document vars if needed
    if ( ( elem[ getOwnDoc ] || elem ) !== document ) {
      setDocument( elem );
    }

    // Make sure that attribute selectors are quoted
    expr = strreplace( expr, rattributeQuotes, "='$1']" );

    if (
      support[ matchSelector ] && documentIsHTML &&
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

    var eh = Expr.attrHandle, fn = eh[ strlower( name ) ],

      // Don't get fooled by Object.prototype properties (jQuery #13807)
      val = fn && hasOwn.call( eh, strlower( name ) ) ?
        fn( elem, name, !documentIsHTML ) :
        undef;

    return val !== undef ?
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
      while ( ( elem = results[ i++ ] ) ) {
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
      text = "textContent",
      nodeType = elem[ domType ];

    if ( !nodeType ) {

      // If no nodeType, this is expected to be an array
      while ( ( node = elem[ i++ ] ) ) {

        // Do not traverse comment nodes
        ret += getText( node );
      }
    } else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {

      // Use textContent for elements
      // innerText usage removed for consistency of new lines (jQuery #11153)
      if ( typeOf( elem[ text ], "str" ) ) {
        return elem[ text ];
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
        match[ 1 ] = strreplace( match[ 1 ], runescape, funescape );

        // Move the given value to match[3] whether quoted or unquoted
        match[ 3 ] = strreplace(
          ( match[ 3 ] || match[ 4 ] || match[ 5 ] || "" ),
          runescape, funescape
        );

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
        var nodeName = strlower( strreplace( nodeNameSelector, runescape, funescape ) );
        return nodeNameSelector === "*" ?
          function() {
            return true;
          } :
          function( elem ) {
            return elem[ domNode ] && strlower( elem[ domNode ] ) === nodeName;
          };
      },

      CLASS: function( className ) {
        var pattern = classCache[ className + " " ];

        return pattern ||
          ( pattern = regExp(
            "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)"
          ) ) &&
          classCache( className, function( elem ) {
            var attr = "className";
            return pattern.test(
              typeOf( elem[ attr ], "str" ) && elem[ attr ] ||
              !typeOf( elem[ getAttr ], notdef ) && elem[ getAttr ]( "class" ) || ""
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
                      " " + strreplace( result, rwhitespace, " " ) + " "
                    ).indexOf( check ) > -1 :
                      operator === "|=" ? result === check ||
                        result.slice( 0, check.length + 1 ) === check + "-" :
                        false;
        };
      },

      CHILD: function( type, what, argument, first, last ) {
        var simple = type.slice( 0, 3 ) !== "nth",
          forward = type.slice( -4 ) !== "last",
          ofType = what === "of-type";

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
              diff = false,
              uID = "uniqueID";

            if ( parent ) {

              // :(first|last|only)-(child|of-type)
              if ( simple ) {
                while ( dir ) {
                  node = elem;
                  while ( ( node = node[ dir ] ) ) {
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

                while ( (
                  node = ++nodeIndex && node && node[ dir ] ||

                    // Fallback to seeking `elem` from the start
                    ( diff = nodeIndex = 0 ) || start.pop()
                ) ) {

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
                  while ( (
                    node = ++nodeIndex && node && node[ dir ] ||
                      ( diff = nodeIndex = 0 ) || start.pop()
                  ) ) {

                    if (
                      ( ofType ?
                          strlower( node[ domNode ] ) === name :
                          node[ domType ] === 1
                      ) &&
                      ++diff
                    ) {

                      // Cache the index of each encountered element
                      if ( useCache ) {
                        outerCache = node[ expando ] || ( node[ expando ] = {} );

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
        // Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
        // Remember that setFilters inherits from pseudos
        var args,
          fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ strlower( pseudo ) ] ||
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
          return Expr.setFilters.hasOwnProperty( strlower( pseudo ) ) ?
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
          matcher = compile( strreplace( selector, rtrim, "$1" ) );

        return matcher[ expando ] ?
          markFunction( function( seed, matches, context, xml ) {
            var elem,
              unmatched = matcher( seed, null, xml, [] ),
              i = seed.length;

            // Match elements unmatched by `matcher`
            while ( i-- ) {
              if ( ( elem = unmatched[ i ] ) ) {
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
        text = strreplace( text, runescape, funescape );
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
        lang = strlower( strreplace( lang, runescape, funescape ) );
        return function( elem ) {
          var elemLang, attr = "lang";
          do {
            if ( (
              elemLang = documentIsHTML ?
                elem[ attr ] :
                elem[ getAttr ]( "xml:" + attr ) || elem[ getAttr ]( attr )
            ) ) {

              elemLang = strlower( elemLang );
              return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
            }
          } while ( ( elem = elem[ domParent ] ) && elem[ domType ] === 1 );
          return false;
        };
      } ),

      // Miscellaneous
      target: function( elem ) {
        var l = window.location, hash = l && l.hash;
        return hash && hash.slice( 1 ) === elem.id;
      },

      root: function( elem ) {
        return elem === docElem;
      },

      focus: function( elem ) {
        return elem === document.activeElement && (
          !document.hasFocus || document.hasFocus()
        ) && !!( elem.type || elem.href || ~elem.tabIndex );
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
        return ( nodeName === tagInput && !!elem.checked ) ||
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
        var name = strlower( elem[ domNode ] ), type = "button";
        return name === tagInput && elem.type === type || name === type;
      },

      text: function( elem ) {
        var attr, text = "text", type = "type";
        return strlower( elem[ domNode ] ) === tagInput && elem[ type ] === text &&

          // Support: IE<8
          // New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
          ( ( attr = elem[ getAttr ]( type ) ) == null || strlower( attr ) === text );
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
  for ( i in {
    radio: true, checkbox: true,
    file: true, password: true, image: true
  } ) {
    Expr.pseudos[ i ] = createInputPseudo( i );
  }
  for ( i in {
    submit: true, reset: true
  } ) {
    Expr.pseudos[ i ] = createButtonPseudo( i );
  }

  // Easy API for creating new setFilters
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
      if ( ( match = rcombinators.exec( soFar ) ) ) {
        matched = match.shift();
        tokens.push( {
          value: matched,

          // Cast descendant combinators to space
          type: strreplace( match[ 0 ], rtrim, " " )
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
        while ( ( elem = elem[ dir ] ) ) {
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

        // We can't set arbitrary data on XML nodes, so they don't benefit from combinator caching
        if ( xml ) {
          while ( ( elem = elem[ dir ] ) ) {
            if ( elem[ domType ] === 1 || checkNonElements ) {
              if ( matcher( elem, context, xml ) ) {
                return true;
              }
            }
          }
        } else {
          while ( ( elem = elem[ dir ] ) ) {
            if ( elem[ domType ] === 1 || checkNonElements ) {
              outerCache = elem[ expando ] || ( elem[ expando ] = {} );

              // Support: IE <9 only
              // Defend against cloned attroperties (jQuery gh-1709)
              uniqueCache = outerCache[ elem[ uID ] ] || ( outerCache[ elem[ uID ] ] = {} );

              if (
                ( oldCache = uniqueCache[ dir ] ) &&
                oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName
              ) {

                // Assign to newCache so results back-propagate to previous elements
                return ( newCache[ 2 ] = oldCache[ 2 ] );
              } else {

                // Reuse newcache so results back-propagate to previous elements
                uniqueCache[ dir ] = newCache;

                // A match means we're done; a fail means we have to keep checking
                if ( ( newCache[ 2 ] = matcher( elem, context, xml ) ) ) {
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
    for ( var i = 0, len = contexts.length ; i < len; i++ ) {
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
      if ( ( elem = unmatched[ i ] ) ) {
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
          selector || "*", context[ domType ] ? [ context ] : context, []
        ),

        // Prefilter to get matcher input, preserving a map for seed-results synchronization
        matcherIn = preFilter && ( seed || !selector ) ?
          condense( elems, preMap, preFilter, context, xml ) :
          elems,

        matcherOut = matcher ?

          // If we have a postFinder, or filtered seed, or non-seed postFilter
          // or preexisting results,
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
          if ( ( elem = temp[ i ] ) ) {
            matcherOut[ postMap[ i ] ] = !( matcherIn[ postMap[ i ] ] = elem );
          }
        }
      }

      if ( seed ) {
        if ( postFinder || preFilter ) {
          if ( postFinder ) {

            // Get the final matcherOut by condensing this intermediate into postFinder contexts
            temp = [];
            i = matcherOut.length;
            while ( i-- ) {
              if ( ( elem = matcherOut[ i ] ) ) {

                // Restore matcherIn since elem is not yet a final match
                temp.push( ( matcherIn[ i ] = elem ) );
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
      exprRel = Expr.relative,
      leadingRelative = exprRel[ tokens[ 0 ].type ],
      implicitRelative = leadingRelative || exprRel[ " " ],
      i = leadingRelative ? 1 : 0,

      // The foundational matcher ensures that elements are reachable from top-level context(s)
      matchContext = addCombinator( function( elem ) {
        return elem === checkContext;
      }, implicitRelative, true ),
      matchAnyContext = addCombinator( function( elem ) {
        return indexOf( checkContext, elem ) > -1;
      }, implicitRelative, true ),
      matchers = [ function( elem, context, xml ) {
        var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) ||
          ( ( checkContext = context )[ domType ] ?
              matchContext( elem, context, xml ) : matchAnyContext( elem, context, xml )
          );

        // Avoid hanging onto element (issue #299)
        checkContext = null;
        return ret;
      } ];

    for ( ; i < len; i++ ) {
      if ( ( matcher = exprRel[ tokens[ i ].type ] ) ) {
        matchers = [ addCombinator( elementMatcher( matchers ), matcher ) ];
      } else {
        matcher = Expr.filter[ tokens[ i ].type ].apply( null, tokens[ i ].matches );

        // Return special upon seeing a positional matcher
        if ( matcher[ expando ] ) {

          // Find the next relative operator (if any) for proper handling
          j = ++i;
          for ( ; j < len; j++ ) {
            if ( exprRel[ tokens[ j ].type ] ) {
              break;
            }
          }
          return setMatcher(
            i > 1 && elementMatcher( matchers ),
            i > 1 && strreplace(
            toSelector(

              // If the preceding token was a descendant combinator, insert
              // an implicit any-element `*`
              tokens.slice( 0, i - 1 ).concat( {
                value: tokens[ i - 2 ].type === " " ? "*" : ""
              } )
            ),
            rtrim, "$1"
            ),
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
          dirrunsUnique = (
            dirruns += contextBackup == null ? 1 : Math.random() || 0.1
          ),
          len = elems.length;

        if ( outermost ) {
          outermostContext = context === document || context || outermost;
        }

        // Add elements passing elementMatchers directly to results
        // Support: IE<9, Safari
        // Tolerate NodeList properties (IE: "length"; Safari: <number>) matching
        // elements by id
        for ( ; i !== len && ( elem = elems[ i ] ) != null; i++ ) {
          if ( byElement && elem ) {
            j = 0;
            if ( !context && elem[ getOwnDoc ] !== document ) {
              setDocument( elem );
              xml = !documentIsHTML;
            }
            while ( ( matcher = elementMatchers[ j++ ] ) ) {
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
            if ( ( elem = !matcher && elem ) ) {
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
          while ( ( matcher = setMatchers [ j++ ] ) ) {
            matcher( unmatched, setMatched, context, xml );
          }

          if ( seed ) {

            // Reintegrate element matches to eliminate the need for sorting
            if ( matchedCount > 0 ) {
              while ( i-- ) {
                if ( !( unmatched[ i ] || setMatched [ i ] ) ) {
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
   * A low-level selection function that works with Sizzle's compiled
   * selector functions
   * @param {String|Function} selector A selector or a pre-compiled
   *                          selector function built with Sizzle.compile
   * @param {Element} context
   * @param {Array} [results]
   * @param {Array} [seed] A set of elements to match against
   */
  select = Sizzle.select = function( selector, context, results, seed ) {
    var i, tokens, token, type, find,
      compiled = typeOf( selector, "fn" ) && selector,
      match = !seed && tokenize( ( selector = compiled.selector || selector ) );

    results = results || [];

    // Try to minimize operations if there is only one selector in the list and no seed
    // (the latter of which guarantees us context)
    if ( match.length === 1 ) {

      // Reduce context if the leading compound selector is an ID
      tokens = match[ 0 ] = match[ 0 ].slice( 0 );
      if (
        tokens.length > 2 &&
        ( token = tokens[ 0 ] ).type === "ID" &&
        support.getById &&
        context[ domType ] === 9 &&
        documentIsHTML &&
        Expr.relative[ tokens[ 1 ].type ]
      ) {

        context = ( Expr.find.ID(
          strreplace( token.matches[ 0 ], runescape, funescape ), context
        ) || [] )[ 0 ];
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
        if ( Expr.relative[ ( type = token.type ) ] ) {
          break;
        }
        if ( ( find = Expr.find[ type ] ) ) {

          // Search, expanding context for leading sibling combinators
          if ( ( seed = find(
            strreplace( token.matches[ 0 ], runescape, funescape ),
            rsibling.test( tokens[ 0 ].type ) && testContext( context[ domParent ] ) || context
          ) ) ) {

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
  support.sortDetached = assert( function( el ) {

    // Should return 1, but returns 4 (following)
    return el[ compareDocPos ]( createElem( "div", document ) ) & 1;
  } );

  // Support: IE<8
  // Prevent attribute/property "interpolation"
  // http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
  /*
  if ( !assert(
    function( el ) {
      el.innerHTML = "<a href='#'></a>";
      return el.firstChild[ getAttr ]( "href" ) === "#" ;
    }
  ) ) {
    addHandle(
      "type|href|height|width",
      function( elem, name, isXML ) {
        if ( !isXML ) {
          return elem[ getAttr ]( name, strlower( name ) === "type" ? 1 : 2 );
        }
      }
    );
  }
  /**/

  // Support: IE<9
  // Use defaultValue in place of getAttribute("value")
  /*
  if ( !support.attributes || !assert(
    function( el ) {
      var attr = "value", fc = "firstChild";
      el.innerHTML = "<" + tagInput + "/>";
      el[ fc ][ setAttr ]( attr, "" );
      return el[ fc ][ getAttr ]( attr ) === "";
    }
  ) ) {
    addHandle(
      "value",
      function( elem, name, isXML ) {
        if ( !isXML && strlower( elem[ domNode ] ) === tagInput ) {
          return elem.defaultValue;
        }
      }
    );
  }
  /**/

  // Support: IE<9
  // Use getAttributeNode to fetch booleans when getAttribute lies
  /*
  if ( !assert(
    function( el ) {
      return el[ getAttr ]( "disabled" ) == null;
    }
  ) ) {
    addHandle(
      booleans,
      function( elem, name, isXML ) {
        var val;
        if ( !isXML ) {
          return elem[ name ] === true ?
            strlower( name ) :
            ( val = elem[ getAttr + "Node" ]( name ) ) && val.specified ? val.value : null;
        }
      }
    );
  }
  /**/

  return Sizzle;

} )( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var dir = function( elem, dir, until ) {
	var matched = [],
		truncate = until !== undef;

	while ( ( elem = elem[ dir ] ) && elem[ domType ] !== 9 ) {
		if ( elem[ domType ] === 1 ) {
			if ( truncate && jQuery( elem ).is( until ) ) {
				break;
			}
			matched.push( elem );
		}
	}
	return matched;
};


var siblings = function( n, elem ) {
	var matched = [];

	for ( ; n; n = n[ domNext ] ) {
		if ( n[ domType ] === 1 && n !== elem ) {
			matched.push( n );
		}
	}

	return matched;
};


var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = ( /^<([\w-]+)\s*\/?>(?:<\/\1>|)$/ );



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		} );

	}

	if ( qualifier[ domType ] ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		} );

	}

	if ( typeOf( qualifier, "str" ) ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) > -1 ) !== not;
	} );
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem[ domType ] === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem[ domType ] === 1;
		} ) );
};

jQuery.fn.extend( {
	find: function( selector ) {
		var i,
			ret = [],
			self = this,
			len = self.length;

		if ( !typeOf( selector, "str" ) ) {
			return self.pushStack( jQuery( selector ).filter( function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			} ) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = self.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = self.selector ? self.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow( this, selector || [], false ) );
	},
	not: function( selector ) {
		return this.pushStack( winnow( this, selector || [], true ) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
      typeOf( selector, "str" ) && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
} );


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context, root ) {
		var match, elem,
			that = this,
			sel = "selector",
			ctx = "context";

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return that;
		}

		// Method init() accepts an alternate rootjQuery
		// so migrate can support jQuery.sub (gh-2101)
		root = root || rootjQuery;

		// Handle HTML strings
		if ( typeOf( selector, "str" ) ) {
			if ( selector[ 0 ] === "<" &&
				selector[ selector.length - 1 ] === ">" &&
				selector.length >= 3 ) {

				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && ( match[ 1 ] || !context ) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[ 1 ] ) {
					context = context instanceof jQuery ? context[ 0 ] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( that, jQuery.parseHTML(
						match[ 1 ],
						context && context[ domType ] ? context[ getOwnDoc ] || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[ 1 ] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {

							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( that[ match ] ) ) {
                that[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
                that.attr( match, context[ match ] );
							}
						}
					}

					return that;

				// HANDLE: $(#id)
				} else {
					elem = document[ getById ]( match[ 2 ] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem[ domParent ] ) {

						// Inject the element directly into the jQuery object
						that.length = 1;
						that[ 0 ] = elem;
					}

					that[ ctx ] = document;
					that[ sel ] = selector;
					return that;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || root ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return that.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector[ domType ] ) {
			that[ ctx ] = that[ 0 ] = selector;
			that.length = 1;
			return that;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return root.ready !== undef ?
				root.ready( selector ) :

				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector[ sel ] !== undef ) {
			that[ sel ] = selector[ sel ];
			that[ ctx ] = selector[ ctx ];
		}

		return jQuery.makeArray( selector, that );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


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
		var that = this, targets = jQuery( target, that ),
			l = targets.length;

		return that.filter( function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[ i ] ) ) {
					return true;
				}
			}
		} );
	},

	closest: function( selectors, context ) {
		var cur, nt, that = this,
			i = 0,
			l = that.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || !typeOf( selectors, "str" ) ?
				jQuery( selectors, context || that.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = that[ i ]; cur && cur !== context; cur = cur[ domParent ] ) {
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

		return that.pushStack( matched.length > 1 ? jQuery.uniqueSort( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {
		var that = this;

		// No argument, return index in parent
		if ( !elem ) {
			return ( that[ 0 ] && that[ 0 ][ domParent ] ) ? that.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeOf( elem, "str" ) ) {
			return indexOf.call( jQuery( elem ), that[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( that,

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

		if ( selector && typeOf( selector, "str" ) ) {
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
var rnotwhite = ( /\S+/g );



// Convert String-formatted options into Object-formatted ones
function createOptions( options ) {
	var object = {};
	( options.match( rnotwhite ) || [] ).forEach( function( flag ) {
		object[ flag ] = true;
	} );
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeOf( options, "str" ) ?
		createOptions( options ) :
		jQuery.extend( {}, options );

	var // Flag to know if list is currently firing
		firing,

		// Last fire value for non-forgettable lists
		memory,

		// Flag to know if list was already fired
		fired,

		// Flag to prevent firing
		locked,

		// Actual callback list
		list = [],

		// Queue of execution data for repeatable lists
		queue = [],

		// Index of currently firing callback (modified by add/remove as needed)
		firingIndex = -1,

		// Fire callbacks
		fire = function() {

			// Enforce single-firing
			locked = options.once;

			// Execute callbacks for all pending executions,
			// respecting firingIndex overrides and runtime changes
			fired = firing = true;
			for ( ; queue.length; firingIndex = -1 ) {
				memory = queue.shift();
				while ( ++firingIndex < list.length ) {

					// Run callback and check for early termination
					if ( list[ firingIndex ].apply( memory[ 0 ], memory[ 1 ] ) === false &&
						options.stopOnFalse ) {

						// Jump to end and forget the data so .add doesn't re-fire
						firingIndex = list.length;
						memory = false;
					}
				}
			}

			// Forget the data if we're done with it
			if ( !options.memory ) {
				memory = false;
			}

			firing = false;

			// Clean up if we're done firing for good
			if ( locked ) {

				// Keep an empty list if we have data for future add calls
				if ( memory ) {
					list = [];

				// Otherwise, this object is spent
				} else {
					list = "";
				}
			}
		},

		// Actual Callbacks object
		self = {

			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {

					// If we have memory from a past run, we should fire after adding
					if ( memory && !firing ) {
						firingIndex = list.length - 1;
						queue.push( memory );
					}

					( function add( args ) {
						jQuery.each( args, function( _, arg ) {
							if ( jQuery.isFunction( arg ) ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && jQuery.type( arg ) !== "string" ) {

								// Inspect recursively
								add( arg );
							}
						} );
					} )( arguments );

					if ( memory && !firing ) {
						fire();
					}
				}
				return this;
			},

			// Remove a callback from the list
			remove: function() {
				jQuery.each( arguments, function( _, arg ) {
					var index;
					while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
						list.splice( index, 1 );

						// Handle firing indexes
						if ( index <= firingIndex ) {
							firingIndex--;
						}
					}
				} );
				return this;
			},

			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ?
					jQuery.inArray( fn, list ) > -1 :
					list.length > 0;
			},

			// Remove all callbacks from the list
			empty: function() {
				if ( list ) {
					list = [];
				}
				return this;
			},

			// Disable .fire and .add
			// Abort any current/pending executions
			// Clear all callbacks and values
			disable: function() {
				locked = queue = [];
				list = memory = "";
				return this;
			},
			disabled: function() {
				return !list;
			},

			// Disable .fire
			// Also disable .add unless we have memory (since it would have no effect)
			// Abort any pending executions
			lock: function() {
				locked = queue = [];
				if ( !memory ) {
					list = memory = "";
				}
				return this;
			},
			locked: function() {
				return !!locked;
			},

			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( !locked ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					queue.push( args );
					if ( !firing ) {
						fire();
					}
				}
				return this;
			},

			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},

			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend( {

	Deferred: function( func ) {
		var
			cb = "Callbacks", m = "memory", om = "once " + m,
			rj = "reject", rs = "resolve",
			tuples = [

				// action, add listener, listener list, final state
				[ rs, "done", jQuery[ cb ]( om ), rs + "d" ],
				[ rj, "fail", jQuery[ cb ]( om ), rj + "ed" ],
				[ "notify", "progress", jQuery[ cb ]( m ) ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					var args = arguments;
					deferred.done( args ).fail( args );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred( function( newDefer ) {
						tuples.forEach( function( tuple, i ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];

							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[ 1 ] ]( function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.progress( newDefer.notify )
										.done( newDefer[ rs ] )
										.fail( newDefer[ rj ] );
								} else {
									newDefer[ tuple[ 0 ] + "With" ](
										this === promise ? newDefer.promise() : this,
										fn ? [ returned ] : arguments
									);
								}
							} );
						} );
						fns = null;
					} ).promise();
				},

				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		tuples.forEach( function( tuple, i ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[ 1 ] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add( function() {

					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[ 0 ] ] = function() {
				deferred[ tuple[ 0 ] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[ 0 ] + "With" ] = list.fireWith;
		} );

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 ||
				( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred.
			// If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					var args = arguments;
					contexts[ i ] = this;
					values[ i ] = args.length > 1 ? slice.call( args ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.progress( updateFunc( i, progressContexts, progressValues ) )
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
} );
var evtListenerRemove = strreplace( evtListenerAdd, /^add/, "remove" );

var setTimeout = "setTimeout";



// The deferred used on DOM ready
var readyList, domLoaded = "DOMContentLoaded";

jQuery.fn.ready = function( fn ) {

	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend( {

	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
} );

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document[ evtListenerRemove ]( domLoaded, completed );
	window[ evtListenerRemove ]( "load", completed );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called
		// after the browser event has already occurred.
		// Support: IE9-10 only
		// Older IE sometimes signals "interactive" too soon
		var drs = document.readyState;
		if ( drs === "complete" ||
			( drs !== "loading" && !document[ getDocElem ].doScroll ) ) {

			// Handle it asynchronously to allow scripts the opportunity to delay ready
			window[ setTimeout ]( jQuery.ready );

		} else {

			// Use the handy event callback
			document[ evtListenerAdd ]( domLoaded, completed );

			// A fallback to window.onload, that will always work
			window[ evtListenerAdd ]( "load", completed );

		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			access( elems, fn, i, key[ i ], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undef ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {

			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn(
					elems[ i ], key, raw ?
					value :
					value.call( elems[ i ], i, fn( elems[ i ], key ) )
				);
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[ 0 ], key ) : emptyGet;
};
var acceptData = function( owner ) {
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




function Data() {
	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;

Data.prototype = {

	register: function( owner, initial ) {
		var expando = this.expando,
			value = initial || {};

		// If it is a node unlikely to be stringify-ed or looped over
		// use plain assignment
		if ( owner[ domType ] ) {
			owner[ expando ] = value;

		// Otherwise secure it in a non-enumerable, non-writable property
		// configurability must be true to allow the property to be
		// deleted with the delete operator
		} else {
			Object.defineProperty( owner, expando, {
				value: value,
				writable: true,
				configurable: true
			} );
		}
		return owner[ expando ];
	},
	cache: function( owner ) {

		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return an empty object.
		if ( !acceptData( owner ) ) {
			return {};
		}

		// Check if the owner object already has a cache
		var
			expando = this.expando,
			value = owner[ expando ];

		// If not, create one
		if ( !value ) {
			value = {};

			// We can accept data for non-element nodes in modern browsers,
			// but we should not, see #8335.
			// Always return an empty object.
			if ( acceptData( owner ) ) {

				// If it is a node unlikely to be stringify-ed or looped over
				// use plain assignment
				if ( owner[ domType ] ) {
					owner[ expando ] = value;

				// Otherwise secure it in a non-enumerable property
				// configurable must be true to allow the property to be
				// deleted when data is removed
				} else {
					Object.defineProperty( owner, expando, {
						value: value,
						configurable: true
					} );
				}
			}
		}

		return value;
	},
	set: function( owner, data, value ) {
		var prop,
			cache = this.cache( owner );

		// Handle: [ owner, key, value ] args
		if ( typeOf( data, "str" ) ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {

			// Copy the properties one-by-one to the cache object
			for ( prop in data ) {
				cache[ prop ] = data[ prop ];
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		var expando = this.expando;
		return key === undef ?
			this.cache( owner ) :
			owner[ expando ] && owner[ expando ][ key ];
	},
	access: function( owner, key, value ) {
		var stored;

		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undef ||
				( ( key && typeOf( key, "str" ) ) && value === undef ) ) {

			stored = this.get( owner, key );

			return stored !== undef ?
				stored : this.get( owner, jQuery.camelCase( key ) );
		}

		// When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undef ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			expando = this.expando,
			cache = owner[ expando ];

		if ( cache === undef ) {
			return;
		}

		if ( key === undef ) {
			this.register( owner );

		} else {

			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {

				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );

				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {

					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;

			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}

		// Remove the expando if there's no more data
		if ( key === undef || jQuery.isEmptyObject( cache ) ) {

			// Support: Chrome <= 35-45+
			// Webkit & Blink performance suffers when deleting properties
			// from DOM nodes, so set to undefined instead
			// https://code.google.com/p/chromium/issues/detail?id=378607
			if ( owner[ domType ] ) {
				owner[ expando ] = undef;
			} else {
				delete owner[ expando ];
			}
		}
	},
	hasData: function( owner ) {
		var cache = owner[ this.expando ];
		return cache !== undef && !jQuery.isEmptyObject( cache );
	}
};
var dataPriv = new Data();

var dataUser = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /[A-Z]/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undef && elem[ domType ] === 1 ) {
		name = "data-" + strlower( strreplace( key, rmultiDash, "-$&" ) );
		data = elem[ getAttr ]( name );

		if ( typeOf( data, "str" ) ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :

					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch ( e ) {}

			// Make sure we set the data so it isn't changed later
			dataUser.set( elem, key, data );
		} else {
			data = undef;
		}
	}
	return data;
}

jQuery.extend( {
	hasData: function( elem ) {
		return dataUser.hasData( elem ) || dataPriv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return dataUser.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		dataUser.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to dataPriv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return dataPriv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		dataPriv.remove( elem, name );
	}
} );

jQuery.fn.extend( {
	data: function( key, value ) {
		var i, name, data,
			that = this,
			elem = that[ 0 ],
			attrs = elem && elem.attributes,
			hasda = "hasDataAttrs";

		// Gets all values
		if ( key === undef ) {
			if ( that.length ) {
				data = dataUser.get( elem );

				if ( elem[ domType ] === 1 && !dataPriv.get( elem, hasda ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice( 5 ) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					dataPriv.set( elem, hasda, true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeOf( key, "obj" ) ) {
			return that.each( function() {
				dataUser.set( this, key );
			} );
		}

		return access( that, function( value ) {
			var data, camelKey;

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undef ) {

				// Attempt to get data from the cache
				// with the key as-is
				data = dataUser.get( elem, key ) ||

					// Try to find dashed key if it exists (gh-2779)
					// This is for 2.2.x only
					dataUser.get( elem, strlower( strreplace( key, rmultiDash, "-$&" ) ) );

				if ( data !== undef ) {
					return data;
				}

				camelKey = jQuery.camelCase( key );

				// Attempt to get data from the cache
				// with the key camelized
				data = dataUser.get( elem, camelKey );
				if ( data !== undef ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undef );
				if ( data !== undef ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			camelKey = jQuery.camelCase( key );
			this.each( function() {

				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = dataUser.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				dataUser.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf( "-" ) > -1 && data !== undef ) {
					dataUser.set( this, key, value );
				}
			} );
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each( function() {
			dataUser.remove( this, key );
		} );
	}
} );


jQuery.extend( {
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = dataPriv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = dataPriv.access( elem, type, jQuery.makeArray( data ) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			inp = "inprogress",
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === inp ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( inp );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return dataPriv.get( elem, key ) || dataPriv.access( elem, key, {
			empty: jQuery.Callbacks( "once memory" ).add( function() {
				dataPriv.remove( elem, [ type + "queue", key ] );
			} )
		} );
	}
} );

jQuery.fn.extend( {
	queue: function( type, data ) {
		var setter = 2;

		if ( !typeOf( type, "str" ) ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[ 0 ], type );
		}

		return data === undef ?
			this :
			this.each( function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[ 0 ] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			} );
	},
	dequeue: function( type ) {
		return this.each( function() {
			jQuery.dequeue( this, type );
		} );
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},

	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( !typeOf( type, "str" ) ) {
			obj = type;
			type = undef;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = dataPriv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
} );
var clearTimeout = strreplace( setTimeout, /^set/, "clear" );

var pnum = ( /[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/ ).source;

var rcssNum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" );


var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {

		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" ||
			!jQuery.contains( elem[ getOwnDoc ], elem );
	};



function adjustCSS( elem, prop, valueParts, tween ) {
	var adjusted,
		scale = 1,
		maxIterations = 20,
		currentValue = tween ?
			function() { return tween.cur(); } :
			function() { return jQuery.css( elem, prop, "" ); },
		initial = currentValue(),
		cssnum = jQuery.cssNumber,
		unit = valueParts && valueParts[ 3 ] || ( cssnum[ prop ] ? "" : "px" ),

		// Starting value computation is required for potential unit mismatches
		initialInUnit = ( cssnum[ prop ] || unit !== "px" && +initial ) &&
			rcssNum.exec( jQuery.css( elem, prop ) );

	if ( initialInUnit && initialInUnit[ 3 ] !== unit ) {

		// Trust units reported by jQuery.css
		unit = unit || initialInUnit[ 3 ];

		// Make sure we update the tween properties later on
		valueParts = valueParts || [];

		// Iteratively approximate from a nonzero starting point
		initialInUnit = +initial || 1;

		do {

			// If previous iteration zeroed out, double until we get *something*.
			// Use string for doubling so we don't accidentally see scale as unchanged below
			scale = scale || ".5";

			// Adjust and apply
			initialInUnit = initialInUnit / scale;
			jQuery.style( elem, prop, initialInUnit + unit );

		// Update scale, tolerating zero or NaN from tween.cur()
		// Break the loop if scale is unchanged or perfect, or if we've just had enough.
		} while (
			scale !== ( scale = currentValue() / initial ) && scale !== 1 && --maxIterations
		);
	}

	if ( valueParts ) {
		initialInUnit = +initialInUnit || +initial || 0;

		// Apply relative offset (+=/-=) if specified
		adjusted = valueParts[ 1 ] ?
			initialInUnit + ( valueParts[ 1 ] + 1 ) * valueParts[ 2 ] :
			+valueParts[ 2 ];
		if ( tween ) {
			tween.unit = unit;
			tween.start = initialInUnit;
			tween.end = adjusted;
		}
	}
	return adjusted;
}
var rcheckableType = ( /^(?:checkbox|radio)$/i );

var rtagName = ( /<([\w:-]+)/ );

var rscriptType = ( /^$|\/(?:java|ecma)script/i );



// We have to close these tags to support XHTML (#13200)
var wrapMap = {

	// Support: IE9
	option: [ 1, "<select multiple='multiple'>", "</select>" ],

	// XHTML parsers do not magically insert elements in the
	// same way that tag soup parsers do. So we cannot shorten
	// this by omitting <tbody> or other required elements.
	thead: [ 1, "<table>", "</table>" ],
	col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
	tr: [ 2, "<table><tbody>", "</tbody></table>" ],

	// td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

	_default: [ 0, "", "" ]
};
wrapMap.td = [ 3, wrapMap.tr[ 1 ] + "<tr>", "</tr>" + wrapMap.tr[ 2 ] ];

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;
var getByQSA = "querySelectorAll";



function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var
		query = tag || "*",
		ret = !typeOf( context[ getByTag ], notdef ) ?
			context[ getByTag ]( query ) :
			!typeOf( context[ getByQSA ], notdef ) ?
				context[ getByQSA ]( query ) :
			[];

	return tag === undef || tag && jQuery[ domNode ]( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}


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


( function() {
	var
		child = "Child",
		addChild = "append" + child,
		lastChild = "last" + child,
		checked = "checked",
		cloneNode = "cloneNode",
		textarea = "textarea>",
		fragment = document.createDocumentFragment(),
		div = fragment[ addChild ]( createElem( "div", document ) ),
		input = createElem( "input", document );

	// Support: Android 4.0-4.3, Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input[ setAttr ]( "type", "radio" );
	input[ setAttr ]( checked, checked );
	input[ setAttr ]( "name", "t" );

	div[ addChild ]( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div[ cloneNode ]( true )[ cloneNode ]( true )[ lastChild ][ checked ];

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<" + textarea + "x</" + textarea;
	support.noCloneChecked = !!div[ cloneNode ]( true )[ lastChild ].defaultValue;
} )();


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu|drag|drop)|click/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

// Support: IE9
// See #13393 for more info
function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

function on( elem, types, selector, data, fn, one ) {
	var origFn, type;

	// Types can be a map of types/handlers
	if ( typeOf( types, "obj" ) ) {

		// ( types-Object, selector, data )
		if ( !typeOf( selector, "str" ) ) {

			// ( types-Object, data )
			data = data || selector;
			selector = undef;
		}
		for ( type in types ) {
			on( elem, type, selector, data, types[ type ], one );
		}
		return elem;
	}

	if ( data == null && fn == null ) {

		// ( types, fn )
		fn = selector;
		data = selector = undef;
	} else if ( fn == null ) {
		if ( typeOf( selector, "str" ) ) {

			// ( types, selector, fn )
			fn = data;
			data = undef;
		} else {

			// ( types, data, fn )
			fn = data;
			data = selector;
			selector = undef;
		}
	}
	if ( fn === false ) {
		fn = returnFalse;
	} else if ( !fn ) {
		return elem;
	}

	if ( one === 1 ) {
		origFn = fn;
		fn = function( event ) {

			// Can use an empty set, since event contains the info
			jQuery().off( event );
			return origFn.apply( this, arguments );
		};

		// Use same guid so caller can remove using origFn
		fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
	}
	return elem.each( function() {
		jQuery.event.add( this, types, fn, data, selector );
	} );
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !( events = elemData.events ) ) {
			events = elemData.events = {};
		}
		if ( !( eventHandle = elemData.handle ) ) {
			eventHandle = elemData.handle = function( e ) {

				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return !typeOf( jQuery, notdef ) && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undef;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend( {
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join( "." )
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !( handlers = events[ type ] ) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup ||
					special.setup.call( elem, data, namespaces, eventHandle ) === false ) {

					if ( elem[ evtListenerAdd ] ) {
						elem[ evtListenerAdd ]( type, eventHandle );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = dataPriv.hasData( elem ) && dataPriv.get( elem );

		if ( !elemData || !( events = elemData.events ) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[ t ] ) || [];
			type = origType = tmp[ 1 ];
			namespaces = ( tmp[ 2 ] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[ 2 ] &&
				new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector ||
						selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown ||
					special.teardown.call( elem, namespaces, elemData.handle ) === false ) {

					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove data and the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			dataPriv.remove( elem, "handle events" );
		}
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue,
			args = slice.call( arguments ),
			handlers = ( dataPriv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[ 0 ] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( ( matched = handlerQueue[ i++ ] ) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( ( handleObj = matched.handlers[ j++ ] ) &&
				!event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.rnamespace || event.rnamespace.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( ( jQuery.event.special[ handleObj.origType ] || {} ).handle ||
						handleObj.handler ).apply( matched.elem, args );

					if ( ret !== undef ) {
						if ( ( event.result = ret ) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Support (at least): Chrome, IE9
		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		//
		// Support: Firefox<=42+
		// Avoid non-left-click in FF but don't block IE radio events (#3861, gh-2343)
		if ( delegateCount && cur[ domType ] &&
			( event.type !== "click" || isNaN( event.button ) || event.button < 1 ) ) {

			for ( ; cur !== this; cur = cur[ domParent ] || this ) {

				// Don't check non-elements (#13208)
				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur[ domType ] === 1 && ( cur.disabled !== true || event.type !== "click" ) ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undef ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) > -1 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push( { elem: cur, handlers: matches } );
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push( { elem: this, handlers: handlers.slice( delegateCount ) } );
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: ( "altKey bubbles cancelable ctrlKey currentTarget detail eventPhase " +
		"metaKey relatedTarget shiftKey target timeStamp view which" ).split( " " ),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split( " " ),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: ( "button buttons clientX clientY offsetX offsetY pageX pageY " +
			"screenX screenY toElement" ).split( " " ),
		filter: function( event, original ) {
			var eventDoc, doc,
				button = original.button,
				body = "body",
				p = "page",
				c = "client",
				s = "scroll",
				L = "Left",
				T = "Top";

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event[ p + "X" ] == null && original[ c + "X" ] != null ) {
				eventDoc = event.target[ getOwnDoc ] || document;
				doc = eventDoc[ getDocElem ];
				body = eventDoc[ body ];

				event[ p + "X" ] = original[ c + "X" ] +
					( doc && doc[ s + L ] || body && body[ s + L ] || 0 ) -
					( doc && doc[ c + L ] || body && body[ c + L ] || 0 );
				event[ p + "Y" ] = original[ c + "Y" ] +
					( doc && doc[ s + T ]  || body && body[ s + T ]  || 0 ) -
					( doc && doc[ c + T ]  || body && body[ c + T ]  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undef ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target[ domType ] === 3 ) {
			event.target = event.target[ domParent ];
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {

			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {

			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {

			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if (
					this.type === "checkbox" && this.click &&
					jQuery[ domNode ]( this, "input" )
				) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery[ domNode ]( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undef && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {

	// This "if" is needed for plain objects
	if ( elem[ evtListenerRemove ] ) {
		elem[ evtListenerRemove ]( type, handle );
	}
};

jQuery.Event = function( src, props ) {

	// Allow instantiation without the 'new' keyword
	if ( !( this instanceof jQuery.Event ) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undef &&

				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	constructor: jQuery.Event,
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,
	isSimulated: false,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && !this.isSimulated ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var t = this, e = t.originalEvent;

		t.isPropagationStopped = returnTrue;

		if ( e && !t.isSimulated ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var t = this, e = t.originalEvent;

		t.isImmediatePropagationStopped = returnTrue;

		if ( e && !t.isSimulated ) {
			e.stopImmediatePropagation();
		}

		t.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// so that event delegation works in jQuery.
// Do the same for pointerenter/pointerleave and pointerover/pointerout
//
// Support: Safari 7 only
// Safari sends mouseenter too often; see:
// https://code.google.com/p/chromium/issues/detail?id=470258
// for the description of the bug (it existed in older Chrome versions as well).
jQuery.each( {
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mouseenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || ( related !== target && !jQuery.contains( target, related ) ) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
} );

jQuery.fn.extend( {
	on: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn );
	},
	one: function( types, selector, data, fn ) {
		return on( this, types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type, t = this;
		if ( types && types.preventDefault && types.handleObj ) {

			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ?
					handleObj.origType + "." + handleObj.namespace :
					handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return t;
		}
		if ( typeOf( types, "obj" ) ) {

			// ( types-object [, selector] )
			for ( type in types ) {
				t.off( type, selector, types[ type ] );
			}
			return t;
		}
		if ( selector === false || typeOf( selector, "fn" ) ) {

			// ( types [, fn] )
			fn = selector;
			selector = undef;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return t.each( function() {
			jQuery.event.remove( this, types, fn, selector );
		} );
	}
} );


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


var iframe,
	elemdisplay = {

		// Support: Firefox
		// We have to pre-define these values for FF (#10227)
		HTML: "block",
		BODY: "block"
	};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */

// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var elem = jQuery( createElem( name, doc ) ).appendTo( doc.body ),

		display = jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = ( iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" ) )
				.appendTo( doc[ getDocElem ] );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var setInterval = "setInterval";

var clearInterval = strreplace( setInterval, /^set/, "clear" );

var rmargin = ( /^margin/ );

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {

		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		var view = elem[ getOwnDoc ].defaultView;

		if ( !view || !view.opener ) {
			view = window;
		}

		return view.getComputedStyle( elem );
	};

var swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {}, style = "style";

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem[ style ][ name ];
		elem[ style ][ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem[ style ][ name ] = old[ name ];
	}

	return ret;
};


var documentElement = document[ getDocElem ];



( function() {
	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		tag = "div", child = "Child", addChild = "append" + child, remChild = "remove" + child,
		container = createElem( tag, document ),
		div = createElem( tag, document ),
		backgroundClip = "backgroundClip",
		contentbox = "content-box",
		borderbox = "border-box",
		boxsizing = "box-sizing",
		marginRight = "marginRight",
		cssText = "cssText",
		style = "style",
		width = "width";

	// Finish early in limited (non-browser) environments
	if ( !div[ style ] ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div[ style ][ backgroundClip ] = contentbox;
	div.cloneNode( true )[ style ][ backgroundClip ] = "";
	support.clearCloneStyle = div[ style ][ backgroundClip ] === contentbox;

	container[ style ][ cssText ] = "border:0;" + width + ":8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container[ addChild ]( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {
		var divStyle;

		div[ style ][ cssText ] =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-" + boxsizing + ":" + borderbox + ";" +

			// Support: Firefox<29,
			// Vendor-prefix box-sizing
			//-moz-" + boxsizing + ":" + borderbox + ";" +

			boxsizing + ":" + borderbox + ";" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;" + width + ":50%";
		div.innerHTML = "";
		documentElement[ addChild ]( container );

		divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle[ width ] === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div[ style ][ marginRight ] = "50%";
		pixelMarginRightVal = divStyle[ marginRight ] === "4px";

		documentElement[ remChild ]( container );
	}

	jQuery.extend( support, {
		pixelPosition: function() {

			// This test is executed only once but we still do memoizing
			// since we can use the boxSizingReliable pre-computing.
			// No need to check if the test was already performed, though.
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
			// since that compresses better and they're computed together anyway.
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;

/**
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// This support function is only executed once so no memoizing is needed.
			var ret,
				marginDiv = div[ addChild ]( createElem( tag, document ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			marginDiv[ style ][ cssText ] = div[ style ][ cssText ] =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-" + boxsizing + ":" + contentbox + ";" +
				boxsizing + ":" + contentbox + ";" +
				"display:block;margin:0;border:0;padding:0";
			marginDiv[ style ][ marginRight ] = marginDiv[ style ][ width ] = "0";
			div[ style ][ width ] = "1px";
			documentElement[ addChild ]( container );

			ret = !parseFloat( window.getComputedStyle( marginDiv )[ marginRight ] );

			documentElement[ remChild ]( container );
			div[ remChild ]( marginDiv );

			return ret;
/**/
		}
	} );
} )();


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


function addGetHookIf( conditionFn, hookFn ) {

	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {

				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return ( this.get = hookFn ).apply( this, arguments );
		}
	};
}


var

	// Swappable if display is none or starts with table
	// except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ],
	emptyStyle = createElem( "div", document ).style;

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in emptyStyle ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[ 0 ].toUpperCase() + name.slice( 1 ),
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in emptyStyle ) {
			return name;
		}
	}
}

function setPositiveNumber( elem, value, subtract ) {

	// Any relative (+/-) values have already been
	// normalized at this point
	var matches = rcssNum.exec( value );
	return matches ?

		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 2 ] - ( subtract || 0 ) ) + ( matches[ 3 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var
		bord = "border", marg = "margin", padd = "padding", cont = "content",
		i = extra === ( isBorderBox ? bord : cont ) ?

		// If we already have the right measurement, avoid augmentation
		4 :

		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0,
		css = jQuery.css;

	for ( ; i < 4; i += 2 ) {

		// Both box models exclude margin, so add it if we want it
		if ( extra === marg ) {
			val += css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {

			// border-box includes padding, so remove it if we want content
			if ( extra === cont ) {
				val -= css( elem, padd + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== marg ) {
				val -= css( elem, bord + cssExpand[ i ] + "Width", true, styles );
			}
		} else {

			// At this point, extra isn't content, so add padding
			val += css( elem, padd + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== padd ) {
				val += css( elem, bord + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {

		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test( val ) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden, style,
		values = [],
		index = 0,
		attr = "display",
		oldd = "olddisplay", none = "none",
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( ( style = elem.style ) ) {
			values[ index ] = dataPriv.get( elem, oldd );
			display = style[ attr ];
			if ( show ) {

				// Reset the inline display of this element to learn if it is
				// being hidden by cascaded rules or not
				if ( !values[ index ] && display === none ) {
					style[ attr ] = "";
				}

				// Set elements which have been overridden with display: none
				// in a stylesheet to whatever the default browser style is
				// for such an element
				if ( style[ attr ] === "" && isHidden( elem ) ) {
					values[ index ] = dataPriv.access(
						elem,
						oldd,
						defaultDisplay( elem[ domNode ] )
					);
				}
			} else {
				hidden = isHidden( elem );

				if ( display !== none || !hidden ) {
					dataPriv.set(
						elem,
						oldd,
						hidden ? display : jQuery.css( elem, attr )
					);
				}
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( ( style = elem.style ) ) {
			if ( !show || style[ attr ] === none || style[ attr ] === "" ) {
				style[ attr ] = show ? values[ index ] || "" : none;
			}
		}

	}

	return elements;
}

jQuery.extend( {

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		animationIterationCount: true,
		columnCount: true,
		fillOpacity: true,
		flexGrow: true,
		flexShrink: true,
		fontWeight: true,
		lineHeight: true,
		opacity: true,
		order: true,
		orphans: true,
		widows: true,
		zIndex: true,
		zoom: true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem[ domType ] === 3 || elem[ domType ] === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			num = "number",
			origName = jQuery.camelCase( name ),
			cssProps = jQuery.cssProps,
			cssHooks = jQuery.cssHooks,
			style = elem.style;

		name = cssProps[ origName ] ||
			( cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = cssHooks[ name ] || cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undef ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && ( ret = rcssNum.exec( value ) ) && ret[ 1 ] ) {
				value = adjustCSS( elem, name, ret );

				// Fixes bug #9237
				type = num;
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number was passed in, add the unit (except for certain CSS properties)
			if ( type === num ) {
				value += ret && ret[ 3 ] || ( jQuery.cssNumber[ origName ] ? "" : "px" );
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !( "set" in hooks ) ||
				( value = hooks.set( elem, value, extra ) ) !== undef ) {

				style[ name ] = value;
			}

		} else {

			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks &&
				( ret = hooks.get( elem, false, extra ) ) !== undef ) {

				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name ),
			cssHooks = jQuery.cssHooks,
			cssProps = jQuery.cssProps;

		// Make sure that we're working with the right name
		name = cssProps[ origName ] ||
			( cssProps[ origName ] = vendorPropName( origName ) || origName );

		// Try prefixed name followed by the unprefixed name
		hooks = cssHooks[ name ] || cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undef ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || isFinite( num ) ? num || 0 : val;
		}
		return val;
	}
} );

[ "height", "width" ].forEach( function( name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) &&
					elem.offsetWidth === 0 ?
						swap( elem, cssShow, function() {
							return getWidthOrHeight( elem, name, extra );
						} ) :
						getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var matches,
				styles = extra && getStyles( elem ),
				subtract = extra && augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				);

			// Convert to pixels if value adjustment is needed
			if ( subtract && ( matches = rcssNum.exec( value ) ) &&
				( matches[ 3 ] || "px" ) !== "px" ) {

				elem.style[ name ] = value;
				value = jQuery.css( elem, name );
			}

			return setPositiveNumber( elem, value, subtract );
		}
	};
} );

jQuery.cssHooks.marginLeft = addGetHookIf( support.reliableMarginLeft,
	function( elem, computed ) {
		if ( computed ) {
			return ( parseFloat( curCSS( elem, "marginLeft" ) ) ||
				elem.getBoundingClientRect().left -
					swap( elem, { marginLeft: 0 }, function() {
						return elem.getBoundingClientRect().left;
					} )
				) + "px";
		}
	}
);

// Support: Android 2.3
/*
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);
*/

// These hooks are used by animate to expand properties
jQuery.each( {
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeOf( value, "str" ) ? value.split( " " ) : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
} );

jQuery.fn.extend( {
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undef ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeOf( state, "bool" ) ) {
			return state ? this.show() : this.hide();
		}

		return this.each( function() {
			jQuery( this )[ isHidden( this ) ? "show" : "hide" ]();
		} );
	}
} );


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
	  var that = this;
    that.elem = elem;
    that.prop = prop;
    that.easing = easing || jQuery.easing._default;
    that.options = options;
    that.start = that.now = that.cur();
    that.end = end;
    that.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var
			that = this, propHooks = Tween.propHooks,
			hooks = propHooks[ that.prop ];

		return hooks && hooks.get ?
			hooks.get( that ) :
			propHooks._default.get( that );
	},
	run: function( percent ) {
		var eased, dur,
      that  = this,
			propHooks = Tween.propHooks,
			options = that.options,
			hooks = propHooks[ that.prop ];

		if ( ( dur = options.duration ) ) {
      that.pos = eased = jQuery.easing[ that.easing ](
				percent, dur * percent, 0, 1, dur
			);
		} else {
      that.pos = eased = percent;
		}
    that.now = ( that.end - that.start ) * eased + that.start;

		if ( options.step ) {
			options.step.call( that.elem, that.now, that );
		}

		if ( hooks && hooks.set ) {
			hooks.set( that );
		} else {
			propHooks._default.set( that );
		}
		return that;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result,
			elem = tween.elem;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( elem[ domType ] !== 1 ||
				elem[ tween.prop ] != null && elem.style[ tween.prop ] == null ) {
				return elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			var fx = jQuery.fx,
				elem = tween.elem;

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( fx.step[ tween.prop ] ) {
				fx.step[ tween.prop ]( tween );
			} else if ( elem[ domType ] === 1 &&
				( elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( elem, tween.prop, tween.now + tween.unit );
			} else {
				elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		var elem = tween.elem;
		if ( elem[ domType ] && elem[ domParent ] ) {
			elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};



var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rrun = /queueHooks$/;

// Animations created synchronously will run synchronously
function createFxNow() {
	window[ setTimeout ]( function() {
		fxNow = undef;
	} );
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		tweeners = Animation.tweeners,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( ( tween = collection[ index ].call( animation, prop, value ) ) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay, tmp,
		anim = this,
		ovfl = "overflow", ovflX = ovfl + "X", ovflY = ovfl + "Y",
		orig = {},
    unqueued = "unqueued",
		style = elem.style,
		hidden = elem[ domType ] && isHidden( elem ),
		dataShow = dataPriv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks[ unqueued ] == null ) {
			hooks[ unqueued ] = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks[ unqueued ] ) {
					oldfire();
				}
			};
		}
		hooks[ unqueued ]++;

		anim.always( function() {

			// Ensure the complete handler is called before this completes
			anim.always( function() {
				hooks[ unqueued ]--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			} );
		} );
	}

	// Height/width overflow pass
	if ( elem[ domType ] === 1 && ( "height" in props || "width" in props ) ) {

		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts[ ovfl ] = [ style[ ovfl ], style[ ovflX ], style[ ovflY ] ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			dataPriv.get( elem, "olddisplay" ) || defaultDisplay( elem[ domNode ] ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( ( tmp = opts[ ovfl ] ) ) {
		style[ ovfl ] = "hidden";
		anim.always( function() {
			style[ ovfl ] = tmp[ 0 ];
			style[ ovflX ] = tmp[ 1 ];
			style[ ovflY ] = tmp[ 2 ];
		} );
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show
				// and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undef ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undef;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = dataPriv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done( function() {
				jQuery( elem ).hide();
			} );
		}
		anim.done( function() {
			var prop;

			dataPriv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		} );
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if (
		( display === "none" ? defaultDisplay( elem[ domNode ] ) : display ) === "inline"
	) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		prefilters = Animation.prefilters,
		length = prefilters.length,
		deferred = jQuery.Deferred().always( function() {

			// Don't match elem in the :animated selector
			delete tick.elem;
		} ),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),

				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ] );

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise( {
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, {
				specialEasing: {},
				easing: jQuery.easing._default
			}, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var opts = animation.opts,
					tween = jQuery.Tween( elem, opts, prop, end,
						opts.specialEasing[ prop ] || opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					tweens = animation.tweens,

					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.notifyWith( elem, [ animation, 1, 0 ] );
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		} ),
		props = animation.props,
		opts = animation.opts;
	propFilter( props, opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = prefilters[ index ].call( animation, elem, props, opts );
		if ( result ) {
			if ( jQuery.isFunction( result.stop ) ) {
				jQuery._queueHooks( animation.elem, opts.queue ).stop =
					jQuery.proxy( result.stop, result );
			}
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( opts.start ) ) {
		opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: opts.queue
		} )
	);

	// attach callbacks from options
	return animation.progress( opts.progress )
		.done( opts.done, opts.complete )
		.fail( opts.fail )
		.always( opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {
	tweeners: {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value );
			adjustCSS( tween.elem, prop, rcssNum.exec( value ), tween );
			return tween;
		} ]
	},

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.match( rnotwhite );
		}

		var prop,
			index = 0,
			length = props.length,
			tweeners = Animation.tweeners;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilters: [ defaultPrefilter ],

	prefilter: function( callback, prepend ) {
		var prefilters = Animation.prefilters;
		if ( prepend ) {
			prefilters.unshift( callback );
		} else {
			prefilters.push( callback );
		}
	}
} );

jQuery.speed = function( speed, easing, fn ) {
	var
		isFn = "isFunction",
		d = "duration", s = "speeds", q = "queue",
		fx = jQuery.fx,
		opt = speed && typeOf( speed, "obj" ) ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery[ isFn ]( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery[ isFn ]( easing ) && easing
	};

	opt[ d ] = fx.off ? 0 : typeOf( opt[ d ], "num" ) ?
		opt[ d ] : opt[ d ] in fx[ s ] ?
			fx[ s ] [ opt[ d ] ] : fx[ s ]._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt[ q ] == null || opt[ q ] === true ) {
		opt[ q ] = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery[ isFn ]( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt[ q ] ) {
			jQuery.dequeue( this, opt[ q ] );
		}
	};

	return opt;
};

jQuery.fn.extend( {
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate( { opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {

				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || dataPriv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( !typeOf( type, "str" ) ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undef;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each( function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = dataPriv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this &&
					( type == null || timers[ index ].queue === type ) ) {

					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		} );
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each( function() {
			var index,
				data = dataPriv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		} );
	}
} );

[ "toggle", "show", "hide" ].forEach( function( name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeOf( speed, "bool" ) ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
} );

// Generate shortcuts for custom animations
jQuery.each( {
	slideDown: genFx( "show" ),
	slideUp: genFx( "hide" ),
	slideToggle: genFx( "toggle" ),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
} );

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];

		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undef;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;
jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = window[ setInterval ]( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	window[ clearInterval ]( timerId );

	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,

	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://web.archive.org/web/20100324014747/http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = window[ setTimeout ]( next, time );
		hooks.stop = function() {
      window[ clearTimeout ]( timeout );
		};
	} );
};


( function() {
	var tag = "input",
		input = createElem( tag, document ),
		select = createElem( "select", document ),
		opt = select.appendChild( createElem( "option", document ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = createElem( tag, document );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();


var boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend( {
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each( function() {
			jQuery.removeAttr( this, name );
		} );
	}
} );

jQuery.extend( {
	attr: function( elem, name, value ) {
		var ret, hooks,
			nType = elem[ domType ];

		// Don't get/set attributes on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeOf( elem[ getAttr ], notdef ) ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = strlower( name );
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : undef );
		}

		if ( value !== undef ) {
			if ( value === null ) {
				jQuery.removeAttr( elem, name );
				return;
			}

			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undef ) {
				return ret;
			}

			elem[ setAttr ]( name, value + "" );
			return value;
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		ret = jQuery.find.attr( elem, name );

		// Non-existent attributes return null, we normalize to undefined
		return ret == null ? undef : ret;
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery[ domNode ]( elem, "input" ) ) {
					var val = elem.value;
					elem[ setAttr ]( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem[ domType ] === 1 ) {
			while ( ( name = attrNames[ i++ ] ) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {

					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	}
} );

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {

			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem[ setAttr ]( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {

			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				strlower( name ) :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
} );




var rclickable = /^(?:a|area)$/i;

jQuery.fn.extend( {
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each( function() {
			delete this[ jQuery.propFix[ name ] || name ];
		} );
	}
} );

jQuery.extend( {
	prop: function( elem, name, value ) {
		var ret, hooks,
			nType = elem[ domType ];

		// Don't get/set properties on text, comment and attribute nodes
		if ( nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {

			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undef ) {
			if ( hooks && "set" in hooks &&
				( ret = hooks.set( elem, value, name ) ) !== undef ) {
				return ret;
			}

			return ( elem[ name ] = value );
		}

		if ( hooks && "get" in hooks && ( ret = hooks.get( elem, name ) ) !== null ) {
			return ret;
		}

		return elem[ name ];
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {

				// elem.tabIndex doesn't always return the
				// correct value when it hasn't been explicitly set
				// http://fluidproject.org/blog/2008/01/09/getting-setting-and-removing-tabindex-values-with-javascript/
				// Use proper attribute retrieval(#12072)
				var tabindex = jQuery.find.attr( elem, "tabindex" );

				return tabindex ?
					parseInt( tabindex, 10 ) :
					rinputs.test( elem[ domNode ] ) ||
						rclickable.test( elem[ domNode ] ) && elem.href ?
							0 :
							-1;
			}
		}
	},

	propFix: {
		"for": "htmlFor",
		"class": "className"
	}
} );

// Support: IE <=11 only
// Accessing the selectedIndex property
// forces the browser to respect setting selected
// on the option
// The getter ensures a default option is selected
// when in an optgroup
if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem[ domParent ], grandpa;
			if ( parent && ( grandpa = parent[ domParent ] ) ) {
				grandpa.selectedIndex;
			}
			return null;
		},
		set: function( elem ) {
			var parent = elem[ domParent ], grandpa;
			if ( parent ) {
				parent.selectedIndex;

				if ( ( grandpa = parent[ domParent ] ) ) {
					grandpa.selectedIndex;
				}
			}
		}
	};
}

(
	"tabIndex readOnly maxLength cellSpacing cellPadding " +
	"rowSpan colSpan useMap frameBorder contentEditable"
).split( " " ).forEach( function( item ) {
	jQuery.propFix[ strlower( item ) ] = item;
} );




var rclass = /[\t\r\n\f]/g;

function getClass( elem ) {
	return elem[ getAttr ] && elem[ getAttr ]( "class" ) || "";
}

jQuery.fn.extend( {
	addClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0, that = this;

		if ( jQuery.isFunction( value ) ) {
			return that.each( function( j ) {
				jQuery( this ).addClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( typeOf( value, "str" ) && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = that[ i++ ] ) ) {
				curValue = getClass( elem );
				cur = elem[ domType ] === 1 &&
					strreplace( " " + curValue + " ", rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem[ setAttr ]( "class", finalValue );
					}
				}
			}
		}

		return that;
	},

	removeClass: function( value ) {
		var classes, elem, cur, curValue, clazz, j, finalValue,
			i = 0, that = this;

		if ( jQuery.isFunction( value ) ) {
			return that.each( function( j ) {
				jQuery( this ).removeClass( value.call( this, j, getClass( this ) ) );
			} );
		}

		if ( !arguments.length ) {
			return that.attr( "class", "" );
		}

		if ( typeOf( value, "str" ) && value ) {
			classes = value.match( rnotwhite ) || [];

			while ( ( elem = that[ i++ ] ) ) {
				curValue = getClass( elem );

				// This expression is here for better compressibility (see addClass)
				cur = elem[ domType ] === 1 &&
					strreplace( " " + curValue + " ", rclass, " " );

				if ( cur ) {
					j = 0;
					while ( ( clazz = classes[ j++ ] ) ) {

						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) > -1 ) {
							cur = strreplace( cur, " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( curValue !== finalValue ) {
						elem[ setAttr ]( "class", finalValue );
					}
				}
			}
		}

		return that;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value, that = this;

		if ( typeOf( stateVal, "bool" ) && type === "string" ) {
			return stateVal ? that.addClass( value ) : that.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return that.each( function( i ) {
				jQuery( this ).toggleClass(
					value.call( this, i, getClass( this ), stateVal ),
					stateVal
				);
			} );
		}

		return that.each( function() {
			var className, i, self, classNames,
				classPriv = "__className__",
				that = this;

			if ( type === "string" ) {

				// Toggle individual class names
				i = 0;
				self = jQuery( that );
				classNames = value.match( rnotwhite ) || [];

				while ( ( className = classNames[ i++ ] ) ) {

					// Check each className given, space separated list
					self[ (
						self.hasClass( className ) ? "remove" : "add"
					)  + "Class" ]( className );
				}

			// Toggle whole class name
			} else if ( value === undef || type === "boolean" ) {
				className = getClass( that );
				if ( className ) {

					// Store className if set
					dataPriv.set( that, classPriv, className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				if ( that[ setAttr ] ) {
          that[ setAttr ]( "class",
						className || value === false ?
						"" :
						dataPriv.get( that, classPriv ) || ""
					);
				}
			}
		} );
	},

	hasClass: function( selector ) {
		var className, elem,
			i = 0;

		className = " " + selector + " ";
		while ( ( elem = this[ i++ ] ) ) {
			if ( elem[ domType ] === 1 &&
				strreplace( " " + getClass( elem ) + " ", rclass, " " )
					.indexOf( className ) > -1
			) {
				return true;
			}
		}

		return false;
	}
} );




var rreturn = /\r/g,
	rspaces = /[\x20\t\r\n\f]+/g;

jQuery.fn.extend( {
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[ 0 ],
			valHooks = jQuery.valHooks;

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = valHooks[ elem.type ] ||
					valHooks[ strlower( elem[ domNode ] ) ];

				if ( hooks &&
					"get" in hooks &&
					( ret = hooks.get( elem, "value" ) ) !== undef
				) {
					return ret;
				}

				ret = elem.value;

				return typeOf( ret, "str" ) ?

					// Handle most common string cases
					strreplace( ret, rreturn, "" ) :

					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each( function( i ) {
			var val, valHooks = jQuery.valHooks, that = this;

			if ( that[ domType ] !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( that, i, jQuery( that ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeOf( val, "num" ) ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				} );
			}

			hooks = valHooks[ that.type ] || valHooks[ strlower( that[ domNode ] ) ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !( "set" in hooks ) || hooks.set( that, val, "value" ) === undef ) {
				that.value = val;
			}
		} );
	}
} );

jQuery.extend( {
	valHooks: {
		option: {
			get: function( elem ) {

				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :

					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					// Strip and collapse whitespace
					// https://html.spec.whatwg.org/#strip-and-collapse-whitespace
					strreplace( jQuery.trim( jQuery.text( elem ) ), rspaces, " " );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE8-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&

							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ?
								!option.disabled : option[ getAttr ]( "disabled" ) === null ) &&
							( !option[ domParent ].disabled ||
								!jQuery[ domNode ]( option[ domParent ], "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( ( option.selected =
						jQuery.inArray( jQuery.valHooks.option.get( option ), values ) > -1
					) ) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
} );

// Radios and checkboxes getter/setter
[ "radio", "checkbox" ].forEach( function( name ) {
	var valHooks = jQuery.valHooks[ name ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery( elem ).val(), value ) > -1 );
			}
		}
	};
	if ( !support.checkOn ) {
		valHooks.get = function( elem ) {
			return elem[ getAttr ]( "value" ) === null ? "on" : elem.value;
		};
	}
} );




// Return jQuery for attributes-only inclusion


var rfocusMorph = /^(?:focusinfocus|focusoutblur)$/;

jQuery.extend( jQuery.event, {

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			ns = "namespace",
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, ns ) ? event[ ns ].split( "." ) : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem[ domType ] === 3 || elem[ domType ] === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf( "." ) > -1 ) {

			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split( "." );
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf( ":" ) < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeOf( event, "obj" ) && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event[ ns ] = namespaces.join( "." );
		event[ "r" + ns ] = event[ ns ] ?
			new RegExp( "(^|\\.)" + namespaces.join( "\\.(?:.*\\.|)" ) + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undef;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur[ domParent ];
			}
			for ( ; cur; cur = cur[ domParent ] ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === ( elem[ getOwnDoc ] || document ) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( ( cur = eventPath[ i++ ] ) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( dataPriv.get( cur, "events" ) || {} )[ event.type ] &&
				dataPriv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( ( !special._default ||
				special._default.apply( eventPath.pop(), data ) === false ) &&
				acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undef;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	// Piggyback on a donor event to simulate a different one
	// Used only for `focus(in | out)` events
	simulate: function( type, elem, event ) {
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true
			}
		);

		jQuery.event.trigger( e, null, elem );
	}

} );

jQuery.fn.extend( {

	trigger: function( type, data ) {
		return this.each( function() {
			jQuery.event.trigger( type, data, this );
		} );
	},
	triggerHandler: function( type, data ) {
		var elem = this[ 0 ];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
} );


( "blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu"
).split( " " ).forEach( function( name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
} );

jQuery.fn.extend( {
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	}
} );




support.focusin = "onfocusin" in window;


// Support: Firefox
// Firefox doesn't have focus(in | out) events
// Related ticket - https://bugzilla.mozilla.org/show_bug.cgi?id=687787
//
// Support: Chrome, Safari
// focus(in | out) events fire after focus & blur events,
// which is spec violation - http://www.w3.org/TR/DOM-Level-3-Events/#events-focusevent-event-order
// Related ticket - https://code.google.com/p/chromium/issues/detail?id=449857
if ( !support.focusin ) {
	jQuery.each( { focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
			jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ) );
		};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this[ getOwnDoc ] || this,
					attaches = dataPriv.access( doc, fix );

				if ( !attaches ) {
					doc[ evtListenerAdd ]( orig, handler, true );
				}
				dataPriv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this[ getOwnDoc ] || this,
					attaches = dataPriv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc[ evtListenerRemove ]( orig, handler, true );
					dataPriv.remove( doc, fix );

				} else {
					dataPriv.access( doc, fix, attaches );
				}
			}
		};
	} );
}
var location = window.location;

var nonce = jQuery.now();

var rquery = ( /\?/ );

var mimeapp = "application/";

var mimeappform = mimeapp + "x-www-form-urlencoded";

var mimeappxml = mimeapp + "xml";

var mimeprexecma = "x-ecma";

var mimeappxecma = mimeapp + mimeprexecma + mimescript;

var mimepreecma = "ecma";

var mimeappecma = mimeapp + mimepreecma + mimescript;

var mimeprejava = "java";

var mimeappjs = mimeapp + mimeprejava + mimescript;

var mimejson = "json";

var mimeappjson = mimeapp + mimejson;

var mimetextjs = "text/" + mimeprejava + mimescript;

var xmlHttpRequest = "XMLHttpRequest";

var ajaxSettings = "ajaxSettings";



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || !typeOf( data, "str" ) ) {
		return null;
	}

	// Support: IE9
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undef;
	}

	if ( !xml || xml[ getByTag ]( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
  contentType = "Content-Type",
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,

	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Anchor tag for parsing the document origin
	originAnchor = createElem( "a", document );
	originAnchor.href = location.href;

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( !typeOf( dataTypeExpression, "str" ) ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = strlower( dataTypeExpression ).match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {

			// For each dataType in the dataTypeExpression
			while ( ( dataType = dataTypes[ i++ ] ) ) {

				// Prepend if requested
				if ( dataType[ 0 ] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					( structure[ dataType ] = structure[ dataType ] || [] ).unshift( func );

				// Otherwise append
				} else {
					( structure[ dataType ] = structure[ dataType ] || [] ).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		( structure[ dataType ] || [] ).forEach( function( prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeOf( dataTypeOrTransport, "str" ) &&
				!seekingTransport && !inspected[ dataTypeOrTransport ] ) {

				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		} );
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery[ ajaxSettings ].flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undef ) {
			( flatOptions[ key ] ? target : ( deep || ( deep = {} ) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undef ) {
			ct = s.mimeType || jqXHR.getResponseHeader( contentType );
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {

		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[ 0 ] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}

		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},

		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ strlower( conv ) ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( ( tmp = s.responseFields[ current ] ) ) {
			jqXHR[ tmp ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {

								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s.throws ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return {
								state: "parsererror",
								error: conv ? e : "No conversion from " + prev + " to " + current
							};
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend( {

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: location.href,
		type: "GET",
		isLocal: rlocalProtocol.test( location.protocol ),
		global: true,
		processData: true,
		async: true,
		contentType: mimeappform + "; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: mimeappxml + ", text/xml",
			json: mimeappjson + ", " + mimetextjs
		},

		contents: {
			xml: /\bxml\b/,
			html: /\bhtml/,
			json: /\bjson\b/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery[ ajaxSettings ] ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery[ ajaxSettings ], target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeOf( url, "obj" ) ) {
			options = url;
			url = undef;
		}

		// Force options to be an object
		options = options || {};

		var transport,

			// URL without anti-cache param
			cacheURL,

			// Response headers
			responseHeadersString,
			responseHeaders,

			// timeout handle
			timeoutTimer,

			// Url cleanup var
			urlAnchor,

			// To know if global events are to be dispatched
			fireGlobals,

			// Loop variable
			i,

			// Create the final options object
      pre = "ajax",
			s = jQuery.ajaxSetup( {}, options ),

			// Callbacks context
			callbackContext = s.context || s,

			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context &&
				( callbackContext[ domType ] || callbackContext.jquery ) ?
					jQuery( callbackContext ) :
					jQuery.event,

			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks( "once memory" ),

			// Status-dependent callbacks
			statusCode = s.statusCode || {},

			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},

			setReqHeader = "setRequestHeader",

			// The jqXHR state
			state = 0,

			// Default abort message
			strAbort = "canceled",

			// temp var
			temp,

			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( ( match = rheaders.exec( responseHeadersString ) ) ) {
								responseHeaders[ strlower( match[ 1 ] ) ] = match[ 2 ];
							}
						}
						match = responseHeaders[ strlower( key ) ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = strlower( name );
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {

								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {

							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = strreplace(
		  strreplace( ( url || s.url || location.href ) + "", rhash, "" ),
			rprotocol, location.protocol + "//"
		);

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = strlower( jQuery.trim( s.dataType || "*" ) ).match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when the origin doesn't match the current origin.
		if ( s.crossDomain == null ) {
			urlAnchor = createElem( "a", document );

			// Support: IE8-11+
			// IE throws exception if url is malformed, e.g. http://example.com:80x/
			try {
				urlAnchor.href = s.url;

				// Support: IE8-11+
				// Anchor's host property isn't correctly set when s.url is relative
				urlAnchor.href = urlAnchor.href;
				s.crossDomain = originAnchor.protocol + "//" + originAnchor.host !==
					urlAnchor.protocol + "//" + urlAnchor.host;
			} catch ( e ) {

				// If there is an error parsing the URL, assume it is crossDomain,
				// it can be rejected by the transport if it is invalid
				s.crossDomain = true;
			}
		}

		// Convert data if not already a string
		if ( s.data && s.processData && !typeOf( s.data, "str" ) ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger( pre + "Start" );
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );

				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					strreplace( cacheURL, rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( ( temp = jQuery.lastModified[ cacheURL ] ) ) {
				jqXHR[ setReqHeader ]( "If-Modified-Since", temp );
			}
			if ( ( temp = jQuery.etag[ cacheURL ] ) ) {
				jqXHR[ setReqHeader ]( "If-None-Match", temp );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR[ setReqHeader ]( contentType, s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR[ setReqHeader ](
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[ 0 ] ] ?
				s.accepts[ s.dataTypes[ 0 ] ] +
					( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR[ setReqHeader ]( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend &&
			( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {

			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( pre + "Send", [ jqXHR, s ] );
			}

			// If request was aborted inside ajaxSend, stop there
			if ( state === 2 ) {
				return jqXHR;
			}

			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = window[ setTimeout ]( function() {
					jqXHR.abort( "timeout" );
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {

				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );

				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				window[ clearTimeout ]( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undef;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					if ( ( modified = jqXHR.getResponseHeader( "Last-Modified" ) ) ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					if ( ( modified = jqXHR.getResponseHeader( "etag" ) ) ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {

				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undef;

			if ( fireGlobals ) {
				globalEventContext.trigger( pre + ( isSuccess ? "Success" : "Error" ),
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( pre + "Complete", [ jqXHR, s ] );

				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger( pre + "Stop" );
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, mimejson );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undef, callback, mimescript );
	}
} );

[ "get", "post" ].forEach( function( method ) {
	jQuery[ method ] = function( url, data, callback, type ) {

		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undef;
		}

		// The url can be an options object (which then must have .url)
		return jQuery.ajax( jQuery.extend( {
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		}, jQuery.isPlainObject( url ) && url ) );
	};
} );


jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: mimescript,
		async: false,
		global: false,
		"throws": true
	} );
};


jQuery.fn.extend( {
	wrapAll: function( html ) {
		var wrap, t = this;

		if ( jQuery.isFunction( html ) ) {
			return t.each( function( i ) {
				jQuery( this ).wrapAll( html.call( this, i ) );
			} );
		}

		if ( t[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, t[ 0 ][ getOwnDoc ] ).eq( 0 ).clone( true );

			if ( t[ 0 ][ domParent ] ) {
				wrap.insertBefore( t[ 0 ] );
			}

			wrap.map( function() {
				var elem = this, fec = "firstElementChild";

				while ( elem[ fec ] ) {
					elem = elem[ fec ];
				}

				return elem;
			} ).append( t );
		}

		return t;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each( function( i ) {
				jQuery( this ).wrapInner( html.call( this, i ) );
			} );
		}

		return this.each( function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		} );
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each( function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call( this, i ) : html );
		} );
	},

	unwrap: function() {
		return this.parent().each( function() {
			if ( !jQuery[ domNode ]( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		} ).end();
	}
} );


jQuery.expr.filters.hidden = function( elem ) {
	return !jQuery.expr.filters.visible( elem );
};
jQuery.expr.filters.visible = function( elem ) {

	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	// Use OR instead of AND as the element is not visible if either is true
	// See tickets #10406 and #13132
	return elem.offsetWidth > 0 || elem.offsetHeight > 0 || elem.getClientRects().length > 0;
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name, o = "object";

	if ( jQuery.isArray( obj ) ) {

		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {

				// Treat each array item as a scalar.
				add( prefix, v );

			} else {

				// Item is non-scalar (array or object), encode its numeric index.
				buildParams(
					prefix + "[" + ( typeOf( v, o ) && v != null ? i : "" ) + "]",
					v,
					traditional,
					add
				);
			}
		} );

	} else if ( !traditional && jQuery.type( obj ) === o ) {

		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {

		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		settings = jQuery.ajaxSettings,
		add = function( key, value ) {

			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undef ) {
		traditional = settings && settings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {

		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		} );

	} else {

		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return strreplace( s.join( "&" ), r20, "+" );
};

jQuery.fn.extend( {
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map( function() {

			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		} )
		.filter( function() {
			var t = this, type = t.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return t.name && !jQuery( t ).is( ":disabled" ) &&
				rsubmittable.test( t[ domNode ] ) && !rsubmitterTypes.test( type ) &&
				( t.checked || !rcheckableType.test( type ) );
		} )
		.map( function( i, elem ) {
			var val = jQuery( this ).val(), nl = "\r\n";

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: strreplace( val, rCRLF, nl ) };
					} ) :
					{ name: elem.name, value: strreplace( val, rCRLF, nl ) };
		} ).get();
	}
} );


var xhrSupported,
	xhrSuccessStatus = {

		// File protocol always yields status code 0, assume 200
		0: 200,

		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	};

jQuery[ ajaxSettings ].xhr = function() {
	try {
		return new window[ xmlHttpRequest ]();
	} catch ( e ) {}
};

xhrSupported = jQuery[ ajaxSettings ].xhr();

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport( function( options ) {
	var callback, errorCallback, crossDomain = "crossDomain";

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options[ crossDomain ] ) {
		return {
			send: function( headers, complete ) {
				var i, tmp = "Text",
					xrw = "X-Requested-With",
					xhr = options.xhr(),
					abort = "abort",
					error = "error",
          status = "status", statusText = status + tmp,
          response = "response", responseText = response + tmp,
					onabort = "on" + abort,
					onerror = "on" + error,
					onload = "onload",
					onreadystatechange = "onreadystatechange",
          overrideMimeType = "overrideMimeType";

				xhr.open(
					options.type,
					options.url,
					options.async,
					options.username,
					options.password
				);

				// Apply custom fields if provided
				if ( ( tmp = options.xhrFields ) ) {
					for ( i in tmp ) {
						xhr[ i ] = tmp[ i ];
					}
				}

				// Override mime type if needed
				if ( ( tmp = options.mimeType ) && xhr[ overrideMimeType ] ) {
					xhr[ overrideMimeType ]( tmp );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options[ crossDomain ] && !headers[ xrw ] ) {
					headers[ xrw ] = xmlHttpRequest;
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							callback = errorCallback = xhr[ onload ] =
								xhr[ onerror ] = xhr[ onabort ] = xhr[ onreadystatechange ] = null;

							if ( type === abort ) {
								xhr[ abort ]();
							} else if ( type === error ) {

								// Support: IE9
								// On a manual native abort, IE9 throws
								// errors on any property access that is not readyState
								if ( !typeOf( xhr[ status ], "num" ) ) {
									complete( 0, error );
								} else {
									complete(

										// File: protocol always yields status 0; see #8605, #14207
										xhr[ status ],
										xhr[ statusText ]
									);
								}
							} else {
								complete(
									xhrSuccessStatus[ xhr[ status ] ] || xhr[ status ],
									xhr[ statusText ],

									// Support: IE9 only
									// IE9 has no XHR2 but throws on binary (trac-11426)
									// For XHR2 non-text, let the caller handle it (gh-2498)
									( xhr[ response + "Type" ] || "text" ) !== "text"  ||
									!typeOf( xhr[ responseText ], "str" ) ?
										{ binary: xhr[ response ] } :
										{ text: xhr[ responseText ] },
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr[ onload ] = callback();
				errorCallback = xhr[ onerror ] = callback( error );

				// Support: IE9
				// Use onreadystatechange to replace onabort
				// to handle uncaught aborts
				if ( xhr[ onabort ] !== undef ) {
					xhr[ onabort ] = errorCallback;
				} else {
					xhr[ onreadystatechange ] = function() {

						// Check readyState before timeout as it changes
						if ( xhr.readyState === 4 ) {

							// Allow onerror to be called first,
							// but that will not handle a native abort
							// Also, save errorCallback to a variable
							// as xhr.onerror cannot be accessed
							window[ setTimeout ]( function() {
								if ( callback ) {
									errorCallback();
								}
							} );
						}
					};
				}

				// Create the abort callback
				callback = callback( abort );

				try {

					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {

					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




// Install script dataType
jQuery.ajaxSetup( {
	accepts: {
		script: [ mimetextjs, mimeappjs, mimeappecma, mimeappxecma ].join( ", " )
	},
	contents: {
		script: /\b(?:java|ecma)script\b/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
} );

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( mimescript, function( s ) {
	if ( s.cache === undef ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
} );

// Bind script tag hack transport
jQuery.ajaxTransport( mimescript, function( s ) {

	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback, err = "error";
		return {
			send: function( _, complete ) {
				script = jQuery( "<" + mimescript + ">" ).prop( {
					charset: s[ mimescript + "Charset" ],
					src: s.url
				} ).on(
					"load " + err,
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === err ? 404 : 200, evt.type );
						}
					}
				);

				// Use native DOM manipulation to avoid our domManip AJAX trickery
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
} );




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup( {
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
} );

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( mimejson + " " + mimejson + "p", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
    jsonp = mimejson + "p",
		jsonCB = jsonp + "Callback",
		jsonProp = s[ jsonp ] !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeOf( s.data, "str" ) &&
				( s.contentType || "" )
					.indexOf( mimeappform ) === 0 &&
				rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === jsonp ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s[ jsonCB ] = jQuery.isFunction( s[ jsonCB ] ) ?
			s[ jsonCB ]() :
			s[ jsonCB ];

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = strreplace( s[ jsonProp ], rjsonp, "$1" + callbackName );
		} else if ( s[ jsonp ] !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s[ jsonp ] + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters[ mimescript + " " + mimejson ] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// Force json dataType
		s.dataTypes[ 0 ] = mimejson;

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always( function() {

			// If previous value didn't exist - remove it
			if ( overwritten === undef ) {
				jQuery( window ).removeProp( callbackName );

			// Otherwise restore preexisting value
			} else {
				window[ callbackName ] = overwritten;
			}

			// Save back as free
			if ( s[ callbackName ] ) {

				// Make sure that re-using the options doesn't screw things around
				s[ jsonCB ] = originalSettings[ jsonCB ];

				// Save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undef;
		} );

		// Delegate to script
		return mimescript;
	}
} );




// Argument "data" should be string of html
// context (optional): If specified, the fragment will be created in this context,
// defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || !typeOf( data, "str" ) ) {
		return null;
	}
	if ( typeOf( context, "bool" ) ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ createElem( parsed[ 1 ], context ) ];
	}

	parsed = buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( !typeOf( url, "str" ) && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf( " " );

	if ( off > -1 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undef;

	// Otherwise, build a param string
	} else if ( params && typeOf( params, "obj" ) ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax( {
			url: url,

			// If "type" variable is undefined, then "GET" method will be used.
			// Make value of this field explicit since
			// user can override it through ajaxSetup method
			type: type || "GET",
			dataType: "html",
			data: params
		} ).done( function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery( "<div>" ).append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		// If the request succeeds, this function gets "data", "status", "jqXHR"
		// but they are ignored because response was set above.
		// If it fails, this function gets "jqXHR", "status", "error"
		} ).always( callback && function( jqXHR, status ) {
			self.each( function() {
				callback.apply( this, response || [ jqXHR.responseText, status, jqXHR ] );
			} );
		} );
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
( "Start Stop Complete Error Success Send" ).split( " " ).forEach( function( type ) {
	jQuery.fn[ "ajax" + type ] = function( fn ) {
		return this.on( "ajax" + type, fn );
	};
} );




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep( jQuery.timers, function( fn ) {
		return elem === fn.elem;
	} ).length;
};




/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem[ domType ] === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft,
			calculatePosition,
			pos = "position",
			position = jQuery.css( elem, pos ),
			curElem = jQuery( elem ),
			props = {},
			top = "top",
			left = "left";

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style[ pos ] = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, top );
		curCSSLeft = jQuery.css( elem, left );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf( "auto" ) > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem[ pos ]();
			curTop = curPosition[ top ];
			curLeft = curPosition [ left ];

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {

			// Use jQuery.extend here to allow modification of coordinates argument (gh-1848)
			options = options.call( elem, i, jQuery.extend( {}, curOffset ) );
		}

		if ( options[ top ] != null ) {
			props[ top ] = ( options[ top ] - curOffset[ top ] ) + curTop;
		}
		if ( options[ left ] != null ) {
			props[ left ] = ( options[ left ] - curOffset[ left ] ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend( {
	offset: function( options ) {
		var that = this;
		if ( arguments.length ) {
			return options === undef ?
				that :
				that.each( function( i ) {
					jQuery.offset.setOffset( this, options, i );
				} );
		}

		var docElem, win,
			elem = that[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem[ getOwnDoc ];

		if ( !doc ) {
			return;
		}

		docElem = doc[ getDocElem ];

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		box = elem.getBoundingClientRect();
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		var that = this;
		if ( !that[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = that[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0},
		// because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {

			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {

			// Get *real* offsetParent
			offsetParent = that.offsetParent();

			// Get correct offsets
			offset = that.offset();
			if ( !jQuery[ domNode ]( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	// This method will return documentElement in the following cases:
	// 1) For the element inside the iframe without offsetParent, this method will return
	//    documentElement of the parent window
	// 2) For the hidden or detached element
	// 3) For body or html element, i.e. in case of the html node - it will return itself
	//
	// but those exceptions were never presented as a real life use-cases
	// and might be considered as more preferable results.
	//
	// This logic, however, is not guaranteed and can change at any point in the future
	offsetParent: function() {
		return this.map( function() {
			var offsetParent = this.offsetParent;

			while ( offsetParent && jQuery.css( offsetParent, "position" ) === "static" ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || documentElement;
		} );
	}
} );

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undef ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : win.pageXOffset,
					top ? val : win.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length );
	};
} );

// Support: Safari<7-8+, Chrome<37-44+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );

				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
} );


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name },
		function( defaultExtra, funcName ) {

		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || !typeOf( margin, "bool" ) ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc,
					clientname = "client" + name,
					offsetname = "offset" + name,
					scrollname = "scroll" + name;

				if ( jQuery.isWindow( elem ) ) {

					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document[ getDocElem ][ clientname ];
				}

				// Get document width or height
				if ( elem[ domType ] === 9 ) {
					doc = elem[ getDocElem ];

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ scrollname ], doc[ scrollname ],
						elem.body[ offsetname ], doc[ offsetname ],
						doc[ clientname ]
					);
				}

				return value === undef ?

					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undef, chainable, null );
		};
	} );
} );

jQuery.fn.extend( {

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {

		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ?
			this.off( selector, "**" ) :
			this.off( types, selector || "**", fn );
	},
	size: function() {
		return this.length;
	}
} );

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	} );
}



var

	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( !noGlobal ) {
	window.jQuery = window.$ = jQuery;
}

return jQuery;
}));
