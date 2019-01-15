define( [
	"../core",
	"../var/document",
	"../var/documentElement",
	"../var/createElem",
	"../var/support"
], function( jQuery, document, documentElement, createElem, support ) {

( function() {
	var pixelPositionVal, boxSizingReliableVal, pixelMarginRightVal, reliableMarginLeftVal,
		tag = "div", child = "Child", addChild = "append" + child, remChild = "remove" + child,
		container = createElem( tag, document ),
		div = createElem( tag, document ),
		backgroundClip = "backgroundClip",
		contentbox = "content-box",
		borderbox = "border-box",
		boxsizing = "box-sizing",
		marginRight = "marginRight",
		cssText = "cssText",
		style = "style",
		width = "width";

	// Finish early in limited (non-browser) environments
	if ( !div[ style ] ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div[ style ][ backgroundClip ] = contentbox;
	div.cloneNode( true )[ style ][ backgroundClip ] = "";
	support.clearCloneStyle = div[ style ][ backgroundClip ] === contentbox;

	container[ style ][ cssText ] = "border:0;" + width + ":8px;height:0;top:0;left:-9999px;" +
		"padding:0;margin-top:1px;position:absolute";
	container[ addChild ]( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computeStyleTests() {
		var divStyle;

		div[ style ][ cssText ] =

			// Support: Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-" + boxsizing + ":" + borderbox + ";" +

			// Support: Firefox<29,
			// Vendor-prefix box-sizing
			//-moz-" + boxsizing + ":" + borderbox + ";" +

			boxsizing + ":" + borderbox + ";" +
			"position:relative;display:block;" +
			"margin:auto;border:1px;padding:1px;" +
			"top:1%;" + width + ":50%";
		div.innerHTML = "";
		documentElement[ addChild ]( container );

		divStyle = window.getComputedStyle( div );
		pixelPositionVal = divStyle.top !== "1%";
		reliableMarginLeftVal = divStyle.marginLeft === "2px";
		boxSizingReliableVal = divStyle[ width ] === "4px";

		// Support: Android 4.0 - 4.3 only
		// Some styles come back with percentage values, even though they shouldn't
		div[ style ][ marginRight ] = "50%";
		pixelMarginRightVal = divStyle[ marginRight ] === "4px";

		documentElement[ remChild ]( container );
	}

	jQuery.extend( support, {
		pixelPosition: function() {

			// This test is executed only once but we still do memoizing
			// since we can use the boxSizingReliable pre-computing.
			// No need to check if the test was already performed, though.
			computeStyleTests();
			return pixelPositionVal;
		},
		boxSizingReliable: function() {
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return boxSizingReliableVal;
		},
		pixelMarginRight: function() {

			// Support: Android 4.0-4.3
			// We're checking for boxSizingReliableVal here instead of pixelMarginRightVal
			// since that compresses better and they're computed together anyway.
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return pixelMarginRightVal;
		},
		reliableMarginLeft: function() {

			// Support: IE <=8 only, Android 4.0 - 4.3 only, Firefox <=3 - 37
			if ( boxSizingReliableVal == null ) {
				computeStyleTests();
			}
			return reliableMarginLeftVal;

/**
		},

		reliableMarginRight: function() {

			// Support: Android 2.3
			// Check if div with explicit width and no margin-right incorrectly
			// gets computed margin-right based on width of container. (#3333)
			// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
			// This support function is only executed once so no memoizing is needed.
			var ret,
				marginDiv = div[ addChild ]( createElem( tag, document ) );

			// Reset CSS: box-sizing; display; margin; border; padding
			marginDiv[ style ][ cssText ] = div[ style ][ cssText ] =

				// Support: Android 2.3
				// Vendor-prefix box-sizing
				"-webkit-" + boxsizing + ":" + contentbox + ";" +
				boxsizing + ":" + contentbox + ";" +
				"display:block;margin:0;border:0;padding:0";
			marginDiv[ style ][ marginRight ] = marginDiv[ style ][ width ] = "0";
			div[ style ][ width ] = "1px";
			documentElement[ addChild ]( container );

			ret = !parseFloat( window.getComputedStyle( marginDiv )[ marginRight ] );

			documentElement[ remChild ]( container );
			div[ remChild ]( marginDiv );

			return ret;
/**/
		}
	} );
} )();

return support;

} );
