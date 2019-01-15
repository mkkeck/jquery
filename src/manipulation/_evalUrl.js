define( [
  "../ajax/var/mimescript",
	"../ajax"
], function( mimescript, jQuery ) {

jQuery._evalUrl = function( url ) {
	return jQuery.ajax( {
		url: url,

		// Make this explicit, since user can override this through ajaxSetup (#11264)
		type: "GET",
		dataType: mimescript,
		async: false,
		global: false,
		"throws": true
	} );
};

return jQuery._evalUrl;

} );
