define( [
  "./strreplace",
	"./evtListenerAdd"
],  function( strreplace, evtListenerAdd ) {
	return strreplace( evtListenerAdd, /^add/, "remove" );
} );
