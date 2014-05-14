/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

module.exports = translateUrls;

// Note: this could fail if there are quotes inside the url
var findUrlRx = /url\s*\((['"]?)(.*?)\1\)/g;

/**
 * Finds css-style relative urls in a string and replaces them with the result
 * of a translator function.  Urls must be wrapped in `url()`, `url('')` or
 * `url("")`.  Urls as plain strings can not be reliably detected, so they are
 * not translated.
 * @param {string} cssText
 * @param {function(url:string):string} each - translate function
 * @returns {string} cssText with the urls replaced
 */
function translateUrls (cssText, each) {
	return cssText.replace(findUrlRx, function (all, quote, url) {
		if (!quote) quote = '"';
		return 'url(' + quote + each(url) + quote + ')';
	});
}
