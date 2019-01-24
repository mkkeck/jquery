define( [
	"../core",
	"./var/nonce",
	"./var/rquery",
	"../var/strreplace",

	"./var/mimeappform",
	"./var/mimescript",
	"./var/mimejson",

	"../var/typeOf",
	"../var/undef",

	"../ajax"
], function(
  jQuery, nonce, rquery, strreplace,
  mimeappform, mimescript, mimejson,
  typeOf, undef
) {

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

} );
