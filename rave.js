/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var translateUrls = require('./translateUrls');
var path = require('rave/lib/path');
var stylesheet = require('./stylesheet');
var es5Transform = require('rave/lib/es5Transform');

var defaultExtensions = [ 'css' ];

// TODO: for relative @imports, inline css
// TODO: allow relative images and fonts to be inlined
// TODO: debug mode that shows original file names

exports.create = create;
exports.translate = translate;
exports.instantiate = instantiate;

function create (context) {
	// override extensions if supplied by dev
	var extensions = 'loadCss' in context
		? context.loadCss
		: defaultExtensions;

	return {
		load: [
			{
				extensions: extensions,
				hooks: {
					translate: translate,
					instantiate: instantiate
				}
			}
		]
	};

}

function translate (load) {
	return translateUrls(load.source, function (url) {
		if (path.isAbsUrl(url)) return url;
		var dir = path.splitDirAndFile(load.address)[0];
		// TODO: joinPaths should reduce leading dots
		return url.charAt(0) === '.'
			? path.reduceLeadingDots(url, load.address)
			: path.joinPaths(dir, url);
	});
}

function instantiate (load) {
	return stylesheet.create(load.source, true).then(function (sheet) {
		return {
			execute: function () {
				sheet.disabled = false;
				return new Module(es5Transform.toLoader(sheet));
			}
		}
	})
}
