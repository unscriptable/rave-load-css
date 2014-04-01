/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

exports.create = create;
exports.createStyle = createStyle;
exports.finalizeStyle = finalizeStyle;
exports.insertStyle = insertStyle;

// new IE8-friendly algorithm:
//	1. disable sheet to prevent performance problems
//  2. keep appending rules until we get an Invalid Argument exception, then create a new sheet
//  3. finalize sheet by enabling it.

var delay = 10;
var doc = document;
var head = doc && (doc.head || doc.getElementsByTagName('head')[0]);

/**
 * Creates a promise for a style sheet with an additional method, append(),
 * to add css text to the eventual style sheet.
 * @param {boolean=true} disabled - leaves the style sheet disabled, if true
 * @returns {Promise}
 */
function create (disabled) {
	var style, promise, handle;

	style = createStyle();
	style.disabled = true;
	promise = new Promise(function (resolve, reject) {
		defer();
		function defer () {
			if (handle) clearTimeout(handle);
			handle = setTimeout(resolveStyle, delay);
		}
		function resolveStyle () {
			try {
				style = finalizeStyle(style);
				if (!disabled) style.disabled = false;
				resolve(style);
			}
			catch (ex) {
				reject(ex);
			}
		}
	});

	return {
		promise: promise,
		append: append
	};

	function append (cssText) {
		style = insertStyle(style, cssText);
	}
}

/**
 * Constructs and prepares a new stylesheet object.  The style sheet must be
 * finalized by finalizeStyle before being consumable by user-land code.
 * @returns {StyleSheet|HTMLStyleElement}
 */
function createStyle () {
	var style;
	// only use createStyleSheet() for IE8 or below
	style = 'createStyleSheet' in doc && (!doc.documentMode >= 9)
		? doc.createStyleSheet()
		: head.appendChild(doc.createElement('style'));
	style.disabled = true;
	return style;
}

/**
 * Normalizes a stylesheet for user-land code.
 * @param {StyleSheet|HTMLStyleElement} style
 * @returns {StyleSheet}
 */
function finalizeStyle (style) {
	return 'sheet' in style ? style.sheet : style;
}

/**
 * Adds a new set of style rules to a style sheet as text.  May return a new
 * style sheet object if the provided one is full.
 * @param {StyleSheet|HTMLStyleElement} style
 * @param {string} cssText
 * @param {boolean} [addNew] set this to false to not create a new style sheet
 * @returns {StyleSheet|HTMLStyleElement}
 */
function insertStyle (style, cssText, addNew) {
	try {
		if ('cssText' in style) {
			style.cssText = style.cssText + cssText;
		}
		else {
			style.appendChild(doc.createTextNode(cssText));
		}
	}
	catch (ex) {
		// style sheet ran out of room, create another, but only once.
		if (addNew === false) throw ex;
		style = insertStyle(createStyle(), cssText, false);
	}
	return style;
}

