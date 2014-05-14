/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var docComplete = require('./docComplete');
var styleProxy = require('./styleProxy');

exports.create = createStylesheet;

var styleSheetProxy;
var docCompleteEvent;

/**
 * Creates a promise for a StyleSheet object that will contain the rules
 * described by the provided css text.  The StyleSheet object will likely be
 * shared by other blocks of css text.  This improves performance while also
 * combating the 31-sheet limitation of IE8.
 * @param {string} cssText
 * @param {boolean=true} disabled
 * @returns {Promise} promise for a StyleSheet object
 */
function createStylesheet (cssText, disabled) {

	if (typeof disabled === 'undefined') disabled = true;

	if (!docCompleteEvent) {
		docCompleteEvent = docComplete.create();
	}

	if (!styleSheetProxy) {
		// create promise for a new stylesheet and leave it disabled
		styleSheetProxy = styleProxy.create(disabled)
		styleSheetProxy.promise.then(function (sheet) {
			// kill this proxy so a new one will be created next time
			styleSheetProxy = null;
			return sheet;
		});
	}

	styleSheetProxy.append(cssText);

	return docCompleteEvent.then(function () {
		return styleSheetProxy.promise;
	});
}
