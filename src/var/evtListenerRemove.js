define( [
	"./evtListenerAdd"
],  function( evtListenerAdd ) {
	return evtListenerAdd.replace( /^add/, "remove" );
} );
