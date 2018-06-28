define( [
	"../core",
  "../var/getByTag",
  "../var/getByQSA",
  "../var/domNode",
  "../var/undef"
], function( jQuery, getByTag, getByQSA, domNode, undef ) {

function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var
		query = tag || "*",
		ret = typeof context[ getByTag ] !== "undefined" ?
			context[ getByTag ]( query ) :
			typeof context[ getByQSA ] !== "undefined" ?
				context[ getByQSA ]( query ) :
			[];

	return tag === undef || tag && jQuery[ domNode ]( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

return getAll;
} );
