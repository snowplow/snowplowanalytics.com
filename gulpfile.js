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
        .pipe(extname({ext: 'html'}))
        .pipe(insert.append('{% endmarkdown %}'))
        .pipe (insert.transform(function(contents, file) {
            return contents = contents.replace("\r\n---\r\n", '\r\n---\r\n{% markdown %}\r\n');
        }))
        .pipe(rename('index.html'))
        .pipe(gulp.dest(source+fl.stem));

        cb();
    }))
});
