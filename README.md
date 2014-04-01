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
