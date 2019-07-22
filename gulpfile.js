'use strict';

/**
 * Global vars
 */

var source = '__posts/';


/**
 * Invoke all libraries required to run GULP correctly
 */
var del = require('del');
var gulp = require('gulp');
var rename = require("gulp-rename");
var foreach = require('gulp-foreach');
var readFiles = require('read-vinyl-file-stream');
var vinyl = require('vinyl');
// var mkdirp = require('mkdirp');
var extname = require('gulp-extname');
var insert = require('gulp-insert');
var minify = require('gulp-minify');
var clean = require('gulp-clean');

/**
 * Add tasks to the Watch event
 */
gulp.task('default', function() {
    return gulp.src(source + '*.md')
    .pipe(readFiles(function (content, file, stream, cb) {
        var fl = new vinyl({
            cwd: '/',
            base: source,
            path: file.path
        });
        // console.log (fl.base);
        // console.log (fl.path);
        // console.log (fl.relative);
        console.log (fl.stem);
        // console.log (fl.extname);

        gulp.src(source+fl.relative, { base: source })
        // .pipe(extname({ext: 'html'}))
        // .pipe(insert.append('{% endmarkdown %}'))
        // .pipe (insert.transform(function(contents, file) {
        //     return contents = contents.replace("\r\n---\r\n", '\r\n---\r\n{% markdown %}\r\n');
        // }))
        .pipe(rename('index.md'))
        .pipe(gulp.dest(source+fl.stem));

        cb();
    }))
});

gulp.task('compress-js', ['clean-scripts'], function() {
    gulp.src(['assets/js/vendors/_concat/*.js', 'assets/js/core.js'])
        .pipe(minify({
            noSource: true,
            ext:{
                min:'.js'
            },
            exclude: ['tasks'],
            ignoreFiles: ['bodymovin.min.js']
        }))
        .pipe(gulp.dest('assets/js/vendors/dist'))
});

gulp.task('clean-scripts', function () {
    return gulp.src('assets/js/vendors/dist', {read: false})
        .pipe(clean());
});



// -----------------------------------------------------------------------------
// UnCSS Task
//
// Checks the site's usage of Bootstrap and strips unused styles out. Outputs
// the resulting files in the css/ directory where they will be combined and
// minified by a separate task.
//
// Note: this task requires a local server to be running because it references
// the actual compiled site to calculate the unused styles.
// -----------------------------------------------------------------------------
gulp.task('uncss', 'Removes unused CSS from frameworks', function() {
  return gulp.src([
      'node_modules/bootstrap/dist/css/bootstrap.css',
      'node_modules/bootstrap/dist/css/bootstrap-theme.css'
    ])
    .pipe(uncss({
      html: [
        'http://localhost:3000/'
      ]
    }))
    .pipe(gulp.dest('css/'));
});