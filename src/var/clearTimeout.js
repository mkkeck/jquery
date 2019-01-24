define( [
  "./setTimeout",
  "./strreplace"
],
function( setTimeout, strreplace ) {
  return strreplace( setTimeout, /^set/, "clear" );
}
);
