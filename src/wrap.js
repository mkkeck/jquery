define( [
	"./core",
	"./var/getOwnDoc",
	"./var/domNode",
	"./var/domParent",

	"./core/init",
	"./manipulation", // clone
	"./traversing" // parent, contents
], function( jQuery, getOwnDoc, domNode, domParent ) {

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

return jQuery;
} );
