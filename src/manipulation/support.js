define( [
	"../var/document",
	"../var/createElem",
	"../var/setAttr",
	"../var/support"
], function( document, createElem, setAttr, support ) {

( function() {
	var
		child = "Child",
		addChild = "append" + child,
		lastChild = "last" + child,
		checked = "checked",
		cloneNode = "cloneNode",
		textarea = "textarea>",
		fragment = document.createDocumentFragment(),
		div = fragment[ addChild ]( createElem( "div", document ) ),
		input = createElem( "input", document );

	// Support: Android 4.0-4.3, Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input[ setAttr ]( "type", "radio" );
	input[ setAttr ]( checked, checked );
	input[ setAttr ]( "name", "t" );

	div[ addChild ]( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div[ cloneNode ]( true )[ cloneNode ]( true )[ lastChild ][ checked ];

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<" + textarea + "x</" + textarea;
	support.noCloneChecked = !!div[ cloneNode ]( true )[ lastChild ].defaultValue;
} )();

return support;

} );
