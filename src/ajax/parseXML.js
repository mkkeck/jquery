define( [
	"../core",
  "../var/getByTag",
  "../var/typeOf",
  "../var/undef"
], function( jQuery, getByTag, typeOf, undef ) {

// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml;
	if ( !data || !typeOf( data, "str" ) ) {
		return null;
	}

	// Support: IE9
	try {
		xml = ( new window.DOMParser() ).parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undef;
	}

	if ( !xml || xml[ getByTag ]( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};

return jQuery.parseXML;

} );
