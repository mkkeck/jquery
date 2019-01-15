define( [
	"../core",
	"../var/document",

  "./var/mimeappjs",
  "./var/mimeappecma",
  "./var/mimeappxecma",
  "./var/mimetextjs",
  "./var/mimescript",

	"../var/undef",
	"../ajax"
], function(
  jQuery, document,
  mimeappjs, mimeappecma, mimeappxecma, mimetextjs, mimescript,
  undef
) {

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

} );
