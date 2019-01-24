define( [
	"../core",
  "../var/getByTag",
  "../var/getByQSA",
  "../var/domNode",
  "../var/typeOf",
  "../var/notdef",
  "../var/undef"
], function( jQuery, getByTag, getByQSA, domNode, typeOf, notdef, undef ) {

function getAll( context, tag ) {

	// Support: IE9-11+
	// Use typeof to avoid zero-argument method invocation on host objects (#15151)
	var
		query = tag || "*",
		ret = !typeOf( context[ getByTag ], notdef ) ?
			context[ getByTag ]( query ) :
			!typeOf( context[ getByQSA ], notdef ) ?
				context[ getByQSA ]( query ) :
			[];

	return tag === undef || tag && jQuery[ domNode ]( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

return getAll;
} );
