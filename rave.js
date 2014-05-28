/** @license MIT License (c) copyright 2014 original authors */
/** @author Brian Cavalier */
/** @author John Hann */

var parse = require('./parse');
var path = require('rave/lib/path');
var stylesheet = require('./stylesheet');
var es5Transform = require('rave/lib/es5Transform');

var defaultExtensions = [ 'css' ];

exports.create = create;
exports.translate = translate;
exports.instantiate = instantiate;

function create (context) {
	// override extensions if supplied by dev
	var extensions = 'loadCss' in context
		? context.loadCss
		: defaultExtensions;

	context.raveLoadCss = { seen: {} };

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
	var source, context, loader, imported, imports;

	source = '';
	context = load.metadata.rave;
	loader = context.loader;
	imported = context.raveLoadCss.imported;
	imports = load.metadata.raveLoadCssImports = [];

	parse.find(load.source, captureUrl, captureImport, captureText);

	return source;

	function captureUrl (url, text) {
		return captureText(parse.toUrl(translateUrl(url)));
	}

	function captureImport (url, text) {
		var name = loader.normalize(url, load.name);
		if (!name in imported) {
			imports.push(name);
			imported[name] = true;
		}
		return captureText('/* ' + text + ' */');
	}

	function captureText (text) {
		return source += text;
	}

	function translateUrl (url) {
		if (path.isAbsUrl(url)) return url;
		var dir = path.splitDirAndFile(load.address)[0];
		// TODO: joinPaths should reduce leading dots
		return url.charAt(0) === '.'
			? path.reduceLeadingDots(url, load.address)
			: path.joinPaths(dir, url);
	}
}

function instantiate (load) {
	var imports;

	imports = load.metadata.raveLoadCssImports.reduce(function (next, name) {
		return next.then(function () {
			return require.async(name);
		});
	}, Promise.resolve());

	return imports.then(function () {
		return stylesheet.create(load.source, true).then(function (sheet) {
			return {
				execute: function () {
					sheet.disabled = false;
					return new Module(es5Transform.toLoader(sheet));
				}
			}
		});
	});
}
