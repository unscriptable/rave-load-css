# rave-load-css

Adds css style sheet loading to rave.js based on file extensions.

By default, rave-load-css loads and injects a style sheet when it detects
the following file extension:

`css`

You can change this list by adding a `loadCss` rave env property.
For example, to detect ".less" and ".css-theme"
extensions, add the following to your app's bower.json or package.json:

```js
{
	"rave": {
		"env": {
			"loadJson": {
				"extensions": [ "less", "css-theme" ]
			}
		}
	}
}
```

## Usage

Importing a css stylsheet is easy.  Just import it as if it were a module.

For CommonJS/node-formatted modules (or AMD-wrapped CommonJS):

```js
var overrides = require('./override-theme.css');
overrides.insertRule('p { text-weight: 200; }', overrides.rules.length);
```

For classic AMD modules:

```js
define(['./override-theme.css'], function (overrides) {
	overrides.insertRule('p { text-weight: 200; }', overrides.rules.length);
});
```


For ES6-formatted modules:

```js
import overrides from './override-theme.css';
// ...
overrides.insertRule('p { text-weight: 200; }', overrides.rules.length);
```
