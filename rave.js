/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var createFileExtFilter = require('rave/lib/createFileExtFilter');
var overrideIf = require('rave/lib/overrideIf');
var fetchAsText = require('rave/pipeline/fetchAsText');
var translateUrls = require('./translateUrls');
var path = require('rave/lib/path');
var stylesheet = require('./stylesheet');
var es5Transform = require('rave/lib/es5Transform');

var defaultExtensions = [ 'css' ];

// TODO: for relative @imports, inline css
// TODO: allow relative images and fonts to be inlined
// TODO: debug mode that shows original file names

module.exports = function (context) {
	var pipeline = {
		translate: translate,
		instantiate: instantiate
	};

	// override extensions if supplied by dev
	var extensions = 'loadCss' in context
		? context.loadCss
		: defaultExtensions;

	return {
		pipeline: function (loader) {
			return overrideIf(createFileExtFilter(extensions), loader, pipeline);
		}
	};

};

function translate (load) {
	return translateUrls(load.source, function (url) {
		// TODO: joinPaths should reduce leading dots
		return path.isAbsUrl(url)
			? url
			: path.joinPaths(load.address, url);
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
