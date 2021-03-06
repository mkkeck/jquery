define( [
	"../core",
	"../var/support",
	"../var/setTimeout",
	"../var/typeOf",
	"./var/xmlHttpRequest",
	"./var/ajaxSettings",
	"../var/undef",
	"../ajax"
], function(
  jQuery, support, setTimeout, typeOf,
  xmlHttpRequest, ajaxSettings,
  undef
) {

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

} );
