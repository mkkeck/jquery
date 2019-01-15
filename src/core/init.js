// Initialize a jQuery object
define( [
	"../core",
	"../var/document",
	"./var/rsingleTag",
	"../var/getById",
	"../var/getOwnDoc",
	"../var/domType",
	"../var/domParent",
	"../var/undef",
	"../traversing/findFilter"
], function(
	jQuery, document, rsingleTag,
	getById, getOwnDoc, domType, domParent, undef
) {

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
		if ( typeof selector === "string" ) {
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

return init;

} );
