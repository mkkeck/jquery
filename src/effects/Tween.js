define( [
	"../core",
	"../css"
], function( jQuery ) {

function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || jQuery.easing._default;
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var
			propHooks = Tween.propHooks,
			hooks = propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			propHooks = Tween.propHooks,
			options = this.options,
			hooks = propHooks[ this.prop ];

		if ( options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, options.duration * percent, 0, 1, options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( options.step ) {
			options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result,
			elem = tween.elem;

			// Use a property on the element directly when it is not a DOM element,
			// or when there is no matching style property that exists.
			if ( elem.nodeType !== 1 ||
				elem[ tween.prop ] != null && elem.style[ tween.prop ] == null ) {
				return elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( elem, tween.prop, "" );

			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			var fx = jQuery.fx,
				elem = tween.elem;

			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( fx.step[ tween.prop ] ) {
				fx.step[ tween.prop ]( tween );
			} else if ( elem.nodeType === 1 &&
				( elem.style[ jQuery.cssProps[ tween.prop ] ] != null ||
					jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( elem, tween.prop, tween.now + tween.unit );
			} else {
				elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		var elem = tween.elem;
		if ( elem.nodeType && elem.parentNode ) {
			elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	},
	_default: "swing"
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};

} );
