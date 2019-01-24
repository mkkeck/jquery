define( function() {
  return function( obj, type ) {
    if ( /^a/.test( type ) ) {
      return ( obj instanceof Array );
    }
    if ( /^fn/.test( type ) ) {
      type = "func";
    } else if ( /^s/.test( type ) && !/^sy/.test( type ) ) {
      type = "str";
    }
    type = new RegExp( "^" + type, "i" );
    return ( type.test( typeof obj ) );
  };
} );
