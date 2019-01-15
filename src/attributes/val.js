define( [
	"../core",
	"./support",
	"../var/strlower",
  "../var/strreplace",
	"../var/getAttr",
	"../var/domNode",
	"../var/domType",
	"../var/domParent",
	"../var/undef",

	"../core/init"
], function( jQuery, support, strlower, strreplace, getAttr, domNode, domType, domParent, undef ) {

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

				return typeof ret === "string" ?

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

			} else if ( typeof val === "number" ) {
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

} );
