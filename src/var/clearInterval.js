define( [
  "./setInterval",
  "./strreplace"
],
function( setInterval, strreplace ) {
  return strreplace( setInterval, /^set/, "clear" );
} );
