# Loading CSS as modules

## Why?

Some folks would argue that CSS and JavaScript are different languages with
very different semantics, and, therefore, should not be intermingled.  In
some regards, they are right.  However, there are some potential advantages
to handling your CSS stylesheets as integral parts to your JavaScript
applications:

1. **Components**: It's much easier to design, reuse, and reason about UI
components (a.k.a. "widgets") when they are organized into a single unit
of co-located JavaScript, CSS, and files.  Treating CSS stylesheets as
modules within a widget reduces overall cognitive load and maintenance burden.
2. **Bundles**: Web apps typically load much faster when the browser has
fewer files to download.  When treating stylesheets as modules, the same
algorithm that compiles JavaScript modules into a bundle may be used to
compile stylesheets into the bundle.  A bundle that combines JavaScript and
CSS (as well as HTML) can provide the fastest load-time experience for
many web apps.

## The mechanics

```
// ES6
import stylesheet from './styles.css';
stylesheet.insertRule('p.error { color: red }');
```

```
// ES5
var stylesheet = require('./styles.css');
stylesheet.insertRule('p.error { color: red }');
```

If a module name has a ".css" extension, rave-load-css overrides the loader's
translate and instantiate hooks. The translate hook converts urls that are
relative to the stylesheet to become relative to the document.  The instantiate
hook exports the stylesheet as the default export.  rave-load-css does not
override the loader's normalize, locate, or fetch hooks.  It lets the
loader normalize the module name, locate the module's url, and fetch the file
just as if it were a JavaScript module.

`@import`s found in the stylesheets are also processed as if they were
JavaScript modules.  This allows you to reference CSS in other packages
without knowing their absolute location.  For instance:

```css
@import "widgetlib/button";
/* button overrides */
.my-button.button { border-radius: 8px; }
```
