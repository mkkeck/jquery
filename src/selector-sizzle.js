define( [
	"./core",
	"./var/arr",
	"./var/push",
	"./var/slice",
	"./var/rinputs",

	"../external/sizzle/dist/sizzle"
], function(
	jQuery, arr, push, slice, rinputs,
	Sizzle
) {

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;

} );
