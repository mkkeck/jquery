( function( $, window ) {

// Touch-Support
// mainly based on jquery.touch v1.1.0, github.com/ajlkn/jquery.touch
var
  addEvent = "addEventlistner",
	clearTimeout = window.clearTimeout,
	setTimeout = window.setTimeout,
	document = window.document,
	dragTarget = null,
	dropTargetElement = null,
	TFN;

/**
 * Touch class. Keeps track of all touch event states.
 *
 * @param {jQuery} $element Target element.
 * @param {jQuery} $sourceElement Source element.
 * @param {object} settings Settings.
 */
function Touch( $element, $sourceElement, settings ) {
	var t = this;
	t.settings = settings;

	// Properties.
	t.$element = $element;
	t.$sourceElement = $sourceElement;
	t.inTap = false;
	t.inTapAndHold = false;
	t.inDrag = false;
	t.tapStart = null;
	t.dragStart = null;
	t.timerTap = null;
	t.timerTapAndHold = null;
	t.mouseDown = false;
	t.x = null;
	t.y = null;
	t.ex = null;
	t.ey = null;
	t.xStart = null;
	t.yStart = null;
	t.exStart = null;
	t.eyStart = null;
	t.taps = 0;
	t.started = false;
	t.ended = false;
}

TFN = Touch.prototype;

/**
 * Determines if the target element uses a particular class of gesture.
 *
 * @param  {string}   x Gesture class.
 * @return {boolean}  If true, target element has at least one bound
 *                    event for the specified gesture class. If false,
 *                    it doesn't.
 */
TFN.uses = function( x ) {
	var events = $._data( this.$sourceElement[ 0 ], "events" ),
		hasProp = function( object, prop ) {
			return object.hasOwnProperty( prop );
		};
	switch ( x ) {
		case "swipe":
			return (
				hasProp( events, x ) ||
				hasProp( events, x + "Up" ) ||
				hasProp( events, x + "Down" ) ||
				hasProp( events, x + "Left" ) ||
				hasProp( events, x + "Right" )
			);
		case "drag":
			return (
				hasProp( events, x ) ||
				hasProp( events, x + "Start" ) ||
				hasProp( events, x + "End" )
			);
		case "tapAndHold":
		case "doubleTap":
			return hasProp( events, x );
		case "tap":
			return (
				hasProp( events, x ) ||
				hasProp( events, "doubleTap" ) ||
				hasProp( events, "tapAndHold" )
			);
		default:
			return false;
	}
};

/**
 * Cancels all touch events.
 *
 * @param {boolean} [mouseDown]  If true, also cancel events relying on mouseDown.
 */
TFN.cancel = function( mouseDown ) {
	var t = this;
	t.taps = 0;
	t.inTap = false;
	t.inTapAndHold = false;
	t.inDrag = false;
	t.tapStart = null;
	t.dragStart = null;
	t.xStart = null;
	t.yStart = null;
	t.exStart = null;
	t.eyStart = null;
	if ( mouseDown ) {
		t.mouseDown = false;
	}
};

/**
 * Touch start handler.
 *
 * @param {object} event  Original event.
 * @param {number} x X    position.
 * @param {number} y Y    position.
 */
TFN.doStart = function( event, x, y ) {

	var t = this,
		$elem = t.$element,
		offset = $elem.offset(),
		cfg = t.settings,
		spd = cfg.preventDefault,
		wk = "-webkit-",
		taphold = "tapAndHold";

	// Prevent original event from bubbling.
	event.stopPropagation();

	// Prevent default if the element has a swipe or drag event (and the user
	// has "preventDefault" turned on).
	if (
		( t.uses( "drag" ) && ( spd.drag )( t ) ) ||
		( t.uses( "swipe" ) && ( spd.swipe )( t ) ) ||
		( t.uses( "tap" ) && ( spd.tap )( t ) )
	) {
		event.preventDefault();
	}

	// Hack: Clear touch callout/user select stuff on Webkit if the element
	//       has a tapAndHold event.
	if ( t.uses( taphold ) ) {
		$elem
			.css( wk + "tap-highlight-color", "rgba(0,0,0,0)" )
			.css( wk + "touch-callout", "none" )
			.css( wk + "user-select", "none" );
	}

	// Set x, y, ex, ey.
	t.x = x;
	t.y = y;
	t.ex = x - offset.left;
	t.ey = y - offset.top;

	// Set timestamp.
	t.tapStart = Date.now();

	// Stop tap timer.
	clearTimeout( t.timerTap );

	// Set new tap timer.
	t.timerTap = setTimeout( function() {

		// In a valid tap? Trigger "tap".
		if ( t.inTap && t.taps > 0 ) {
			$elem.trigger( ( t.taps === 2 ? "doubleTap" : "tap" ), {
				taps: t.taps,
				x: t.x, y: t.y,
				ex: t.ex, ey: t.ey,
				duration: Date.now() - t.tapStart,
				event: event
			} );
			t.cancel();
		}

		// Clear tap timer.
		t.timerTap = null;
	}, cfg.tapDelay );

	// tapAndHold.
	if ( t.uses( taphold ) ) {

		// Stop tapAndHold timer.
		clearTimeout( t.timerTapAndHold );

		// Set new tapAndHold timer.
		t.timerTapAndHold = setTimeout( function() {

			// Use tapAndHold and in a valid tap? Trigger "tapAndHold".
			if ( t.inTap ) {
				$elem.trigger( taphold, {
					x: t.x, y: t.y,
					ex: t.ex, ey: t.ey,
					duration: Date.now() - t.tapStart,
					event: event
				} );
				t.cancel();
			}

			// Clear tapAndHold timer.
			t.timerTapAndHold = null;

			// We're now in a tap and hold.
			t.inTapAndHold = true;
		}, cfg.tapAndHoldDelay );
	}

	// We're now in a tap.
	t.inTap = true;
};

/**
 * Touch move handler.
 *
 * @param {object} event  Original event.
 * @param {number} x X    position.
 * @param {number} y Y    position.
 */
TFN.doMove = function( event, x, y ) {
	var e, s,
		t = this,
		$doc = $( document ),
		$elem = t.$element,
		cfg = t.settings,
		spd = cfg.preventDefault,
		offset = $elem.offset(),
		ds = "scroll",
		pe = "pointer-events",
		diff = ( Math.abs( t.x - x ) + Math.abs( t.y - y ) ) / 2;

	// Prevent original event from bubbling.
	event.stopPropagation();

	// Prevent default if the element has a swipe or drag event (and the user
	// has "preventDefault" turned on).
	if (
		( t.uses( "swipe" ) && ( spd.swipe )( t ) ) ||
		( t.uses( "drag" ) && ( spd.drag )( t ) )
	) {
		event.preventDefault();
	}

	// Stop tapAndHold timer.
	// Note: Only if cursor moves too much. Needed to compensate for
	//       hypersensitive touchscreens.
	if ( diff > 2 ) {
		clearTimeout( t.timerTapAndHold );
	}

	// In a drag? Trigger "drag".
	if ( t.inDrag && dragTarget === t ) {
		$elem.trigger( "drag", {
			x: x, y: y,
			ex: x - offset.left,
			ey: y - offset.top,
			start: {
				x: t.xStart,   y: t.yStart,
				ex: t.exStart, ey: t.eyStart
			},
			event: event,

			// Deprecated.
			exStart: t.exStart,
			eyStart: t.eyStart
		} );

		// Handle drop target events.
		// Get element below the cursor.
		// Temporarily turn off this element's pointer events.
		$elem.css( pe, "none" );

		// Get element below this one.
		// Note: Offset by document scroll if this element is position: fixed.
		if ( $elem.css( "position" ) === "fixed" ) {
			e = document.elementFromPoint(
				x - $doc[ ds + "Left" ](),
				y - $doc[ ds + "Top" ]()
			);
		} else {
			e = document.elementFromPoint( x, y );
		}

		// Turn this element's pointer events back on.
		$elem.css( pe, "" );

		// Found a drop target?
		if ( e ) {

			// Drop filter set? Apply it.
			if ( cfg.dropFilter !== false ) {
				s = typeof cfg.dropFilter;
				switch ( s ) {

					// Selector.
					case "string":

						// Drop filter traversal enabled? Go through parents until we
						// find a match (or don't).
						if ( cfg.dropFilterTraversal ) {
							while ( e ) {

								// Found a match? Stop traversing.
								if ( $( e ).is( cfg.dropFilter ) ) {
									break;
								}

								// Traverse up to parent.
								e = e.parentElement;
							}
						}

						// Otherwise, perform single match.
						else if ( !$( e ).is( cfg.dropFilter ) ) {
							e = null;
						}
						break;

					// Callback.
					case "function":

						// Drop filter traversal enabled? Go through parents until we
						// find a match (or don't).
						if ( cfg.dropFilterTraversal ) {
							while ( e ) {

								// Found a match? Stop traversing.
								if ( ( cfg.dropFilter )( $elem[ 0 ], e ) === true ) {
									break;
								}

								// Traverse up to parent.
								e = e.parentElement;
							}
						}

						// Otherwise, perform single match.
						else if ( ( cfg.dropFilter )( $elem[ 0 ], e ) === false ) {
							e = null;
						}
						break;

					// Siblings only.
					default:

						// case "boolean":
						if ( cfg.dropFilter === true ) {
							while ( e.parentElement !== $elem[ 0 ].parentElement ) {
								e = e.parentElement;
								if ( !e ) {
									e = null;
									break;
								}
							}
						}
						break;
				}
			}

			// Make sure drop target isn't the element being dragged
			// (because that would be weird).
			if ( e === $elem[ 0 ] ) {
				e = null;
			}
		}

		// Handle "leave".
		// Triggered when we already have a drop target, but the cursor's no longer above it.
		if ( dropTargetElement && dropTargetElement !== e ) {

			// Trigger "dragLeave".
			$elem.trigger( "dragLeave", {
				element: dropTargetElement,
				event: event
			} );

			// Clear drop target.
			dropTargetElement = null;
		}

		// Handle "enter".
		// Triggered when we don't have a drop target yet but we're above one.
		if ( !dropTargetElement && e ) {

			// Set drop target.
			dropTargetElement = e;

			// Trigger "dragEnter".
			$elem.trigger( "dragEnter", {
				element: dropTargetElement,
				event: event
			} );
		}

		// Handle "over".
		// Triggered when we have a drop target.
		if ( dropTargetElement ) {

			// Get offset.
			offset = $( dropTargetElement ).offset();

			// Trigger "dragOver".
			$elem.trigger( "dragOver", {
				element: dropTargetElement,
				event: event,
				x: x, y: y,
				ex: x - offset.left,
				ey: y - offset.top
			} );
		}

	}

	// If we've moved past the drag threshold ...
	else if ( diff > cfg.dragThreshold ) {

		// Enough time to start?
		if ( Date.now() - t.tapStart < cfg.dragDelay ) {
			t.cancel();
			return;
		}

		// Cancel everything.
		t.cancel();

		// We're now in a drag.
		t.inDrag = true;

		// Set timestamp.
		t.dragStart = Date.now();

		// Set starting element coordinates.
		t.xStart = x;
		t.yStart = y;
		t.exStart = x - offset.left;
		t.eyStart = y - offset.top;

		// Prevent default if the element has a drag event.
		if ( t.uses( "drag" ) && ( spd.drag )( t ) ) {
			event.preventDefault();
		}

		// Trigger "dragStart".
		$elem.trigger( "dragStart", {
			x: t.xStart,   y: t.yStart,
			ex: t.exStart, ey: t.eyStart,
			event: event
		} );

		// Set drag target.
		dragTarget = t;
	}
};

/**
 * Touch end handler.
 *
 * @param {object} event  Original event.
 * @param {number} x X    position.
 * @param {number} y Y    position.
 */
TFN.doEnd = function( event, x, y ) {
	var distance, velocity, duration,
		t = this,
		$elem = t.$element,
		cfg = t.settings,
		offset = $elem.offset(),
		dx = Math.abs( t.x - x ),
		dy = Math.abs( t.y - y ),
		doubletap = "doubleTap";

	// Prevent original event from bubbling.
	event.stopPropagation();

	// If we're in a tap ...
	if ( t.inTap ) {

		// Stop tapAndHold timer.
		clearTimeout( t.timerTapAndHold );

		// Increase the tap count.
		t.taps++;

		// Did we hit an end tap condition?
		if (

			// Timer ran out?
		!t.timerTap ||

		// Got one tap (and the element doesn't have a doubleTap event)?
		( t.taps === 1 && !t.uses( doubletap ) ) ||

		// Got two taps (and the element does have a doubleTap event)?
		( t.taps === 2 && t.uses( doubletap ) )
		) {
			$elem.trigger( ( t.taps === 2 ? doubletap : "tap" ), {
				taps: t.taps,
				x: t.x, y: t.y,
				ex: t.ex, ey: t.ey,
				duration: Date.now() - t.tapStart,
				event: event
			} );
			t.cancel();
		}
	}

	// If we're in a drag ...
	else if ( t.inDrag ) {

		// Handle drop target events.
		// Handle "drop".
		// Triggered when we have a drop target.
		if ( dropTargetElement ) {

			// Get offset.
			offset = $( dropTargetElement ).offset();

			// Trigger "drop".
			$elem.trigger( "drop", {
				element: dropTargetElement,
				event: event,
				x: x, y: y,
				ex: x - offset.left,
				ey: y - offset.top
			} );

			// Clear drop target.
			dropTargetElement = null;
		}

		// Calculate some stuff.
		duration = Date.now() - t.dragStart;
		distance = Math.sqrt(
			Math.pow( Math.abs( t.x - x ), 2 ) +
			Math.pow( Math.abs( t.y - y ), 2 )
		);
		velocity = distance / duration;

		// Trigger "dragEnd".
		$elem.trigger( "dragEnd", {
			start: {
				x: t.x,   y: t.y,
				ex: t.ex, ey: t.ey
			},
			end: {
				x: x,  y: y,
				ex: x - offset.left,
				ey: y - offset.top
			},
			distance: distance,
			duration: duration,
			velocity: velocity,
			event: event
		} );

		// Clear drag target.
		dragTarget = null;

		// Swipe?
		if ( dx > cfg.swipeThreshold || dy > cfg.swipeThreshold ) {

			// Trigger "swipe".
			$elem.trigger( "swipe", {
				distance: distance,
				duration: duration,
				velocity: velocity,
				event: event
			} );

			// Left/Right?
			if ( dx > dy ) {

				// Calculate velocity.
				velocity = dx / duration;
				$elem.trigger( "swipe" + ( ( x < t.x ) ? "Left" : "Right" ), {
					distance: dx,
					duration: duration,
					velocity: velocity,
					event: event
				} );
			}

			// Up/Down?.
			else if ( dy > dx ) {

				// Calculate velocity.
				velocity = dy / duration;
				$elem.trigger( "swipe" + ( ( y < t.y ) ? "Up" : "Down" ), {
					distance: dy,
					duration: duration,
					velocity: velocity,
					event: event
				} );
			}

		}

		// Cancel drag.
		t.inDrag = false;
	}

	// If we're in a tap and hold ...
	else if ( t.inTapAndHold ) {

		// Stop tapAndHold timer.
		clearTimeout( t.timerTapAndHold );

		// Trigger "tapAndHoldEnd".
		$elem.trigger( "tapAndHoldEnd",  {
			x: t.x, y: t.y,
			event: event
		} );

		// Cancel tap and hold.
		t.inTapAndHold = false;
	}
};

/**
 * Enables touch events on a selector.
 *
 * @param {object} userSettings User settings.
 */
$.fn.touch = function( userSettings ) {
	var i = 0, t = this, l = t.length, $this = $( t );

	// Multiple elements?
	if ( l > 1 ) {
		for ( ; i < l; i++ ) {
			$.touch( $( t[ i ] ), userSettings );
		}
	}

	// Single element?
	else if ( l === 1 ) {
		$.touch( $this, userSettings );
	}
	return $this;
};

/**
 * Alias for touch() function.
 *
 * @param {object} userSettings User settings.
 */
$.fn.enableTouch = function( userSettings ) {
	return $( this ).touch( userSettings );
};

/**
 * Enables touch events on a jQuery element.
 *
 * @param {jQuery} $this Element.
 * @param {object} userSettings User settings.
 */
$.touch = function( $this, userSettings ) {

	var settings = {

		// If true, touch inputs will trigger touch events.
		useTouch: true,

		// If true, mouse inputs will trigger touch events.
		useMouse: true,

		// If true, certain events (like drag) can continue to track even if
		// the mouse cursor leaves the originating element.
		trackDocument: false,

		// If true, when "trackDocument" is enabled, coordinates will be
		// normalized to the confines of the originating element.
		trackDocumentNormalize: false,

		// Disables "click" event (prevents both "tap" and "click" firing
		// on certain elements like <label>).
		noClick: false,

		// Distance from tap to register a drag (lower = more sensitive,
		// higher = less sensitive).
		dragThreshold: 10,

		// Time to wait before registering a drag (needs to be high enough
		// to not interfere with scrolling).
		dragDelay: 200,

		// Distance from tap to register a swipe (lower = more sensitive, higher = less sensitive).
		swipeThreshold: 30,

		// Delay between taps.
		tapDelay: 250,

		// Time to wait before triggering "tapAndHold".
		tapAndHoldDelay: 500,

		// If defined, delegates touch events to descendants matching this selector.
		delegateSelector: null,

		// Filters drop target elements. Can be any of the following:
		// - "selector"                      Target element must match this selector.
		// - function(element, target) {..}  Use boolean return value of a custom callback.
		// - true                            Target element must be a sibling of dragged element.
		// - false                           No filtering.
		dropFilter: false,

		// If true, traverses through parents for a match when dropFilter is a selector or function.
		dropFilterTraversal: true,

		// Coordinate point of reference (page, screen, client).
		coordinates: "page",

		// Prevent or allow default actions for certain event classes. Can be any of the following:
		// - true                  Prevent default actions for this event class.
		// - false                 Allow default actions for this event class.
		// - function(state) {..}  Use boolean return value of a custom callback
		//                         (state = touch state object)
		preventDefault: {
			drag: false,
			swipe: false,
			tap: false
		}

	};

	// Build settings.
	settings = $.extend( settings, userSettings );

	// Expand non-function preventDefault properties to functions.
	var sPrev = settings.preventDefault ;
	$.each( [ "drag", "swipe", "tap" ], function( i, e ) {
		if ( typeof sPrev[ e ] !== "function" ) {
			settings.preventDefault[ e ] = (
				sPrev[ e ] === true ?
				function() { return true; } :
				function() { return false; }
			);
		}
	} );

	// Disable click event?
	// Needed for some elements, otherwise "click" triggers in addition to "tap".
	if ( settings.noClick ) {
		$this.on( "click", function( event ) { event.preventDefault(); } );
	}

	var delegate = settings.delegateSelector,
		coords = settings.coordinates,
    orgEvent = "originalEvent",
    trackDoc = "trackDocument",
		et, em, st = "touch", sm = "mouse";
	et = { e: st + "end", m: st + "move", s: st + "start" };
	em = { d: sm + "down", m: sm + "move", u: sm + "up" };

	// Bind touch events.
	if ( settings.useTouch ) {

		// Start (touchstart).
		var onTouchStart = function( event ) {
			var $element = $( this ),
				touch = getTouch( $element, $this, settings ),
				touches = event[ orgEvent ].touches;

			// Mark as started.
			touch.started = true;

			// Start.
			touch.doStart(
				event,
				touches[ 0 ][ coords + "X" ],
				touches[ 0 ][ coords + "Y" ]
			);

			// Clear started after delay.
			setTimeout( function() {
				touch.started = false;
			}, 1000 );
		};

		// Bind event.
		$this.on( et.s, onTouchStart );

		// Delegate?
		if ( delegate ) {
			$this.on( et.s, delegate, onTouchStart );
		}

		// Move (touchmove).
		var onTouchMove = function( event ) {
			var $element = $( this ),
				touch = getTouch( $element, $this, settings ),
				touchsettings = touch.settings,
				touches = event[ orgEvent ].touches,

				// Get coordinates.
				x = touches[ 0 ][ coords + "X" ],
				y = touches[ 0 ][ coords + "Y" ];

			// Normalize coordinates?
			if ( touchsettings[ trackDoc ] && touchsettings[ trackDoc + "Normalize" ] ) {
				var pos = fixPos( touch, x, y );
				x = pos.x;
				y = pos.y;
			}

			// Move.
			touch.doMove( event, x, y );
		};

		// Bind event.
		$this.on( et.m, onTouchMove );

		// Delegate?
		if ( delegate ) {
			$this.on( et.m, delegate, onTouchMove );
		}

		// End (touchend).
		var onTouchEnd = function( event ) {
			var $element = $( this ),
				touch = getTouch( $element, $this, settings ),
				touches = event[ orgEvent ].changedTouches;

			// Mark as ended.
			touch.ended = true;

			// Get position.
			var pos = fixPos(
				touch, touches[ 0 ][ coords + "X" ],
				touches[ 0 ][ coords + "Y" ]
			);

			// End.
			touch.doEnd( event,  pos.x,  pos.y );

			// Clear ended after delay.
			setTimeout( function() {
				touch.ended = false;
			}, 1000 );
		};

		// Bind event.
		$this.on( et.e, onTouchEnd );

		// Delegate?
		if ( delegate ) {
			$this.on( et.e, delegate, onTouchEnd );
		}

	}

	// Bind mouse events.
	if ( settings.useMouse ) {

		// Start (mousedown).
		var onMouseDown = function( event ) {
			var $element = $( this ),
				touch = getTouch( $element, $this, settings );

			// If we've already been started (which would *only* happen if
			// touchstart were just triggered), bail immediately so we don't
			// attempt to double start.
			if ( touch.started ) {
				return false;
			}

			// Mark mouse down.
			touch.mouseDown = true;

			// Start.
			touch.doStart( event, event[ coords + "X" ], event[ coords + "Y" ] );
		};

		// Bind event.
		$this.on( em.d, onMouseDown );

		// Delegate?
		if ( delegate ) {
			$this.on( em.d, delegate, onMouseDown );
		}

		// Move (mousemove).
		var onMouseMove = function( event ) {
			var $element = $( this ),
				touch = getTouch( $element, $this, settings );

			// If mouse down, move.
			if ( touch.mouseDown ) {
				touch.doMove( event, event[ coords + "X" ], event[ coords + "Y" ] );
			}
		};

		// Bind event.
		$this.on( em.m, onMouseMove );

		// Delegate?
		if ( delegate ) {
			$this.on( em.m, delegate, onMouseMove );
		}

		// End (mouseup).
		var onMouseUp = function( event ) {
			var $element = $( this ),
				touch = getTouch( $element, $this, settings );

			// If we've already ended (which would *only* happen
			// if touchend were just triggered), bail immediately
			// so we don't attempt to double end.
			if ( touch.ended ) {
				return false;
			}

			// Trigger document's mouseup handler (in case this event was fired
			// on this element while dragging another).
			$( document ).triggerHandler( em.u, event );

			// End.
			touch.doEnd( event, event[ coords + "X" ], event[ coords + "Y" ] );

			// Clear mouse down.
			touch.mouseDown = false;
		};

		// Bind event.
		$this.on( em.u, onMouseUp );

		// Delegate?
		if ( delegate ) {
			$this.on( em.u, delegate, onMouseUp );
		}
	}

	// No document tracking? Watch for "mouseleave".
	if ( !settings[ trackDoc ] ) {
		$this.on( "mouseleave", function( event ) {
			var $element = $( this ),
				touch = getTouch( $element, $this, settings );
			touch.doEnd( event, event[ coords + "X" ], event[ coords + "Y" ] );
			touch.mouseDown = false;
		} );
	}
};

/**
 * Gets an element's touch property.
 *
 * @param {jQuery} $element         Target element.
 * @param {jQuery} $sourceElement   Source element.
 * @param {object} userSettings     User settings.
 */
function getTouch( $element, $sourceElement, userSettings ) {

	var element = $element[ 0 ];

	// No touch property? Initialize it.
	if ( typeof  element._touch === "undefined" ) {
		element._touch = new Touch( $element, $sourceElement, userSettings );
	}
	return element._touch;
}

/**
 * Adjusts a pair of coordinates to ensure they're within the boundaries
 * of a given touch object's element.
 *
 * @param t {object} Touch object.
 * @param x {number} X value.
 * @param y {number} y value.
 * @return {object} New coordinates.
 */
function fixPos( t, x, y ) {
	var nx, ny,
		$elem = t.$element,

		// Get element's offset and dimenions.
		offset = $elem.offset(),
		width = $elem.width(),
		height = $elem.height();

	// Normalize x and y.
	nx = Math.min( Math.max( x, offset.left ), offset.left + width );
	ny = Math.min( Math.max( y, offset.top ), offset.top + height );

	// Return new coordinates.
	return { x: nx, y: ny };

}

// Documnet-level events (mouse only).
// These are used to trigger drag events on an element even if the mouse cursor is
// beyond its boundaries.
document[ addEvent ]( "mousemove", function( event ) {
	var t = dragTarget, s, c, x, y;
	if ( t ) {
		s = t.settings;
		if ( t.mouseDown && s.useMouse &&  s.trackDocument ) {

			// Get coordinates.
			c = s.coordinates;
			x = event[ c + "X" ];
			y = event[ c + "Y" ];

			// Normalize coordinates?
			if ( s.trackDocumentNormalize ) {
				var pos = fixPos( t, x, y );
				x = pos.x;
				y = pos.y;
			}

			// Trigger "move".
			t.doMove( event, x, y );
		}
	}
} );
document[ addEvent ]( "mouseup", function( event, previousEvent ) {
	var t = dragTarget, s, c;
	if ( t ) {
		s = t.settings;
		if ( s.useMouse && s.trackDocument ) {

			// Previous event provided? Use that instead.
			if ( typeof previousEvent !== "undefined" ) {
				event = previousEvent;
			}
			c = s.coordinates;

			// No X coordinate in event? "mouseup" likely already handled by
			// originating element, so bail.
			if ( !( ( c + "X" ) in event ) ) {
				return;
			}

			// Get coordinates.
			var x = event[ c + "X" ],
			    y = event[ c + "Y" ];

			// Normalize coordinates?
			if ( s.trackDocumentNormalize ) {
				var pos = fixPos( t, x, y );
				x = pos.x;
				y = pos.y;
			}

			// Trigger "end".
			t.doEnd( event, x, y );

			// Clear mouseDown state.
			t.mouseDown = false;
		}
	}
} );
}( jQuery, window ) );
