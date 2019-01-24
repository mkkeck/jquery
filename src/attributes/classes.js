define( [
	"../core",
	"../var/rnotwhite",
	"../data/var/dataPriv",
  "../var/strreplace",
	"../var/getAttr",
	"../var/setAttr",
	"../var/domType",
	"../var/typeOf",
	"../var/undef",

	"../core/init"
], function(
  jQuery, rnotwhite, dataPriv,
  strreplace, getAttr, setAttr, domType, typeOf, undef
) {

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

} );
