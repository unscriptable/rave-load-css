/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

exports.find = findUrls;
exports.toUrl = toUrl;

// Note: this could fail if there are quotes inside the url
// TODO: capture media queries in @imports
var findUrlsRx = /@import\s+(?:(?:url\s*\()(['"]?)(.*?)\1\)|(['"]?)(.*?)\3)[^;]*?;|url\s*\((['"]?)(.*?)\5\)|("')|(\/\*)|(\*\/)/g;

/**
 * Finds css-style urls or @imports in a string and replaces them with the
 * result of a translator function.  Urls must be wrapped in `url()`, `url('')`
 * or `url("")`.  Urls as plain strings (non-standard) can not be reliably
 * detected, so they are not translated.
 * @param {string} cssText
 * @param {function(url:string, complete:string, q:string)} onUrl - event for
 *   urls. The url is provided in the url param.  The complete property,
 *   including the url() wrapper, is provided in the complete param.  The
 *   quote used in the url is provided by the q param.
 * @param {function(url:string, complete:string, q:string)} onImport - event
 *   for @imports. The import url is provided by the url param. The full text
 *   of the import is provided by the complete param. The quote used
 *   in the url is provided by the q param.
 * @param {function(text:string)} onOther - event for other css text;
 * @returns {string} original cssText, unchanged.
 */
function findUrls (cssText, onUrl, onImport, onOther) {
	var pos, m, comment, quote;

	if (!onUrl) onUrl = bitBucket;
	if (!onImport) onImport = bitBucket;
	if (!onOther) onOther = bitBucket;

	pos = 0;

	while (m = findUrlsRx.exec(cssText)) {
		processMatch(m[0], m.index, m[1], m[2], m[3], m[4], m[5], m[6], m[7], m[8], m[9]);
		// update our current position
		pos = m.index + m[0].length;
	}

	if (cssText.length > pos) onOther(cssText.slice(pos));

	return cssText;

	function processMatch (match, index, iq1, iUrl1, iq2, iUrl2, uq, url, q, sc, ec) {
		// check for quotes and comments first
		if (comment) {
			if (ec === comment) comment = false;
		}
		else if (quote) {
			if (q === quote) quote = false;
		}
		else if (q) {
			quote = q;
		}
		else if (sc) {
			// yes, line comments aren't valid css (yet!)
			comment = sc === '//' ? '\n' : '*/';
		}
		// check for import rules
		else if (iUrl1 || iUrl2) {
			if (index > pos) onOther(cssText.slice(pos, index));
			onImport(iUrl1 || iUrl2, match, iq1 || iq2 || '');
		}
		// check for url property values
		else if (url) {
			if (index > pos) onOther(cssText.slice(pos, index));
			onUrl(url, match, uq || '');
		}
	}
}

function toUrl (address) {
	return 'url("' + address + '")';
}

function bitBucket () {}
