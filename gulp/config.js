var dest = './build';
var src = './src';
var modRewrite = require('connect-modrewrite');

var settings_json;

try {
    settings_json = require('../settings');
} catch (e) {
    console.log('settings.json file not found, some tasks may not work without this.');
    console.log(e);
}

var settings = require('./util/settingsParser')(settings_json || {}, {dest: dest});

module.exports = {
    browserSync: {
        server: {
            // Serve up our build folder
            baseDir: dest,
            middleware: [
                modRewrite([
                    '^[^\\.]*$ /index.html [L]'
                ])
            ]
        }
    },
    sass: {
        src: src + '/sass/**/*.{sass,scss}',
        dest: dest,
        settings: {
            // Required if you want to use SASS syntax
            // See https://github.com/dlmanning/gulp-sass/issues/81
            sourceComments: 'map',
            imagePath: '/images' // Used by the image-url helper
        }
    },
    images: {
        src: src + '/images/**',
        dest: dest
    },
    staticAssets: {
        src: src + '/static-assets/**',
        dest: dest
    },
    markup: {
        src: src + '/html/**/*.html',
        dest: dest
    },
    browserify: {
        // A separate bundle will be generated for each
        // bundle config in the list below
        src: src,
        bundleConfigs: [{
            entries: src + '/javascript/index.js',
            dest: dest,
            outputName: 'index.js',
            // Additional file extentions to make optional
            extensions: ['.coffee', '.js', '.hbs'],
            // list of modules to make require-able externally
            //require: ['some-module', 'another-module']
        }]
    },
    production: {
        cssSrc: dest + '/styles.css',
        jsSrc: dest + '/index.js',
        dest: dest
    },
    settings: settings
};
