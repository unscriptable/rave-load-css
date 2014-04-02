# rave-load-css

Adds css style sheet loading to rave.js based on file extensions.

By default, rave-load-css loads and injects a style sheet when it detects
the following file extension:

`css`

You can change this list by adding a `loadCss` property to the context.
In HTML, this can be done by placing a `data-load-css` attribute on the
`<html>` element.  The value of this element should be a comma-separated
list of extensions.

```html
<html data-load-css="css,less">
```

When running `rave()` as a module, the `loadCss` property may also be
an array of extensions or an object whose keys are file extensions.

```js
context.loadCss = ['less', 'css'];
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
