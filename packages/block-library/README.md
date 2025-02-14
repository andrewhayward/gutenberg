# Block library

Block library for the WordPress editor.

## Installation

Install the module

```bash
npm install @wordpress/block-library --save
```

_This package assumes that your code will run in an **ES2015+** environment. If you're using an environment that has limited or no support for such language features and APIs, you should include [the polyfill shipped in `@wordpress/babel-preset-default`](https://github.com/WordPress/gutenberg/tree/HEAD/packages/babel-preset-default#polyfill) in your code._

## API

<!-- START TOKEN(Autogenerated API docs) -->

### registerCoreBlocks

Function to register core blocks provided by the block editor.

_Usage_

```js
import { registerCoreBlocks } from '@wordpress/block-library';

registerCoreBlocks();
```

_Parameters_

-   _blocks_ `Array`: An optional array of the core blocks being registered.

<!-- END TOKEN(Autogenerated API docs) -->

## Registering individual blocks

1.  When you only care about registering the block when file gets imported:

    ```js
    import '@wordpress/block-library/build-module/verse/init';
    ```

2.  When you want to use the reference to the block after it gets automatically registered:

    ```js
    import verseBlock from '@wordpress/block-library/build-module/verse/init';
    ```

3.  When you need a full control over when the block gets registered:

    ```js
    import { init } from '@wordpress/block-library/build-module/verse';

    const verseBlock = init();
    ```

## Contributing to this package

This is an individual package that's part of the Gutenberg project. The project is organized as a monorepo. It's made up of multiple self-contained software packages, each with a specific purpose. The packages in this monorepo are published to [npm](https://www.npmjs.com/) and used by [WordPress](https://make.wordpress.org/core/) as well as other software projects.

To find out more about contributing to this package or Gutenberg as a whole, please read the project's main [contributor guide](https://github.com/WordPress/gutenberg/tree/HEAD/CONTRIBUTING.md).

### Adding new blocks

⚠️ Adding new blocks to this package **requires** additional steps!

1.  Do not forget to register a new core block in the [`index.js`](https://github.com/WordPress/gutenberg/blob/trunk/packages/block-library/index.js) file of this package. For example, if you were to add the new core block called `core/blinking-paragraph`, you would have to add something like:

    ```js
    // packages/block-library/src/index.js
    import * as blinkingParagraph from './blinking-paragraph';
    ```

    Then add `blinkingParagraph` to the list in the `getAllBlocks()` function.

    If it's experimental, add the following property to `block.json`:

    ```json
    {
    	"__experimental": "true"
    }
    ```

2.  Register the block in the `gutenberg_reregister_core_block_types()` function of the [`lib/blocks.php`](https://github.com/WordPress/gutenberg/blob/trunk/lib/blocks.php) file. Add it to the `block_folders` array if it's a [static block](https://developer.wordpress.org/block-editor/getting-started/glossary/#static-block) or to the `block_names` array if it's a [dynamic block](https://developer.wordpress.org/block-editor/getting-started/glossary/#dynamic-block).

3.  Add `init.js` file to the directory of the new block:

    ```js
    /**
     * Internal dependencies
     */
    import { init } from './';

    export default init();
    ```

    This file is used when using the option to register individual block from the `@wordpress/block-library` package.

4.  If a `view.js` file (or a file prefixed with `view`, e.g. `view-example.js`) is present in the block's directory, this file will be built along other assets, making it available to load from the browser. You only need to reference a `view.min.js` (notice the different file extension) file in the `block.json` file as follows:

    ```json
    {
    	"viewScript": "file:./view.min.js"
    }
    ```

    This file will get automatically loaded when the static block is present on the front end. For dynamic block, you need to manually enqueue the view script in `render_callback` of the block, example:

    ```php
    function render_block_core_blinking_paragraph( $attributes, $content ) {
        $should_load_view_script = ! empty( $attributes['isInteractive'] ) && ! wp_script_is( 'wp-block-blinking-paragraph-view' );
        if ( $should_load_view_script ) {
    	    wp_enqueue_script( 'wp-block-blinking-paragraph-view' );
        }

    	return $content;
    }
    ```

### Naming convention for PHP functions

All PHP function names declared within the subdirectories of the `packages/block-library/src/` directory should start with one of the following prefixes:

-   `block_core_<directory_name>`
-   `render_block_core_<directory_name>`
-   `register_block_core_<directory_name>`

In this context, `<directory_name>` represents the name of the directory where the corresponding `.php` file is located.
The directory name is converted to lowercase, and any characters except for letters and digits are replaced with underscores.

#### Example:

For the PHP functions declared in the `packages/block-library/src/my-block/index.php` file, the correct prefixes would be:

-   `block_core_my_block`
-   `render_block_core_my_block`
-   `register_block_core_my_block`

<br /><br /><p align="center"><img src="https://s.w.org/style/images/codeispoetry.png?1" alt="Code is Poetry." /></p>
