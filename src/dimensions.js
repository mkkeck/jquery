define( [
	"./core",
	"./core/access",
	"./var/getDocElem",
	"./var/domType",
	"./var/typeOf",
	"./var/undef",

	"./css"
], function( jQuery, access, getDocElem, domType, typeOf, undef ) {

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

return jQuery;
} );
