define( [
	"../core",
  "../var/getByTag",
  "../var/getByQSA",
  "../var/domNode",
  "../var/notdef",
  "../var/undef"
], function( jQuery, getByTag, getByQSA, domNode, notdef, undef ) {

function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var
		query = tag || "*",
		ret = typeof context[ getByTag ] !== notdef ?
			context[ getByTag ]( query ) :
			typeof context[ getByQSA ] !== notdef ?
				context[ getByQSA ]( query ) :
			[];

	return tag === undef || tag && jQuery[ domNode ]( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

return getAll;
} );
