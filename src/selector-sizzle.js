define( [
	"./core",
	"./var/arr",
	"./var/push",
	"./var/slice",
	"./var/rinputs",
	"./var/strlower",
	"./var/createElem",
	"./var/getElem",
	"./var/getById",
	"./var/getByTag",
	"./var/getOwnDoc",
	"./var/getDocElem",
	"./var/getAttr",
	"./var/setAttr",
	"./var/domNode",
	"./var/domType",
	"./var/domParent",
	"./var/domNext",
	"./var/domPrev",
	"./var/evtListenerAdd",

	"../external/sizzle/dist/sizzle"
], function(
	jQuery, arr, push, slice, rinputs,
	strlower, createElem, getElem, getById, getByTag, getOwnDoc, getDocElem,
	getAttr, setAttr, domNode, domType, domParent, domNext, domPrev,
	evtListenerAdd, Sizzle
) {

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;

} );
