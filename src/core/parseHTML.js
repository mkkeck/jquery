define( [
	"../core",
	"../var/document",
	"../var/createElem",
	"../var/typeOf",
	"./var/rsingleTag",
	"../manipulation/buildFragment"
], function( jQuery, document, createElem, typeOf, rsingleTag, buildFragment ) {

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

return jQuery.parseHTML;

} );
