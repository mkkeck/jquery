define( [
	"../core",
	"../core/access",
	"../var/rinputs",
	"../var/strlower",
	"../var/domNode",
	"../var/domType",
	"../var/domParent",
	"../var/undef",
	"./support",

	"../selector"
], function(
	jQuery, access, rinputs, strlower, domNode, domType, domParent, undef, support
) {

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

				if ( grandpa = parent[ domParent ] ) {
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

} );
