Gulp Recipe
===========

Simple Coffee browserify (Coffeify), SASS, Jade and auto refresh code gulp base environment.

Edit `dist-scripts.json` to specify files you need to browserify.

(Example different js files for different pages, just create coffee files in development folder and mention them in dist-scripts.)

I used Node-sass, so if you need [compass](https://github.com/Compass/compass/tree/stable/core/stylesheets) mixins you can copy compass to vendor folder.

You can also embed angular and use it in require, just move angular files into vendor/angular and make little changes in gulp 'Coffee' task (just uncomment existing shim) same method used for jQuery and other **non-CommonJS** codes.

Copy your assets to "app" folder, move your vendors to root.

Folder Structure (Development folder structure copied to App folder, so you can have your own structure):

 - App
	 - assets
 - Development
 - Vendor

TODO
----

 - Add release gulp tasks
 - Make npm package from browser-refresh.js and update gulpfile