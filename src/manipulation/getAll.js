define( [
	"../core"
], function( jQuery ) {

function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var
		query = tag || "*",
		undef = "undefined",
		ret = typeof context.getElementsByTagName !== undef ?
			context.getElementsByTagName( query ) :
			typeof context.querySelectorAll !== undef ?
				context.querySelectorAll( query ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

return getAll;
} );
