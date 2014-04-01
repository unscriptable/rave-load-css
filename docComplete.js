/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

exports.create = create;
exports.isComplete = isComplete;

var doc = document;

/**
 * Creates a promise that resolves when the document is ready to apply style
 * sheet rules to DOM elements.
 * @returns {Promise}
 */
function create () {
	return new Promise(function (resolve) {
		check();
		function defer () {
			setTimeout(check, 10);
		}
		function check () {
			if (!isComplete()) defer();
			else resolve();
		}
	});
}

/**
 * Returns true if the document's readyState === 'complete' or the
 * document doesn't implement readyState.
 * Only needed by Chrome, it seems.
 * @return {boolean}
 */
function isComplete () {
	return !doc || !doc.readyState || doc.readyState === 'complete';
}
