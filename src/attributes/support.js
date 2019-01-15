define( [
	"../var/document",
	"../var/support",
	"../var/createElem"
], function( document, support, createElem ) {

( function() {
	var tag = "input",
		input = createElem( tag, document ),
		select = createElem( "select", document ),
		opt = select.appendChild( createElem( "option", document ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = createElem( tag, document );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
} )();

return support;

} );
