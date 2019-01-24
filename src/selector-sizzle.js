define( [
	"./core",

	"./var/hasOwn",
	"./var/arr",
	"./var/push",
	"./var/slice",
	"./var/rinputs",
	"./var/strlower",
	"./var/strreplace",
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
	"./var/notdef",
	"./var/undef",

	"../external/sizzle/dist/sizzle"
], function(
	jQuery,

  hasOwn, arr, push, slice, rinputs,

	strlower, strreplace, createElem, getElem, getById, getByTag, getOwnDoc, getDocElem,
	getAttr, setAttr, domNode, domType, domParent, domNext, domPrev,
	evtListenerAdd, notdef, undef, Sizzle
) {

jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[ ":" ] = jQuery.expr.pseudos;
jQuery.uniqueSort = jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;

} );
