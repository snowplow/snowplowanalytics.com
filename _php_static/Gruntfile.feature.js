"use strict";

module.exports = function(grunt)
{
    var configs =
    {
        js_combine_files: [
            "src/js/vendors/jquery-3.1.1.min.js",
            "src/js/vendors/bootstrap.min.js",
            "src/js/vendors/bootstrap-select.min.js",
            "src/js/vendors/slick.min.js",
            "src/js/snowploww.js"
        ],
        js_hint_files: [ "src/js/snowplow.js" ],
        watch_files:   [ "src/css/*", "src/js/*", "src/css/vendors*", "src/js/vendors/*" ]
    };
 
    grunt.initConfig
    ({
        sass: {
            production: {
                files: {
                    "src/css/snowplow.css": "src/css/snowplow.sass"
                }
            }
        },
        jshint: {
            beforeconcat: configs.js_hint_files
        },
        concat: {
            options: {
                separator: ";"
            },
            dist: {
                src: configs.js_combine_files,
                dest: "src/js/compiled.js"
            }
        },
        uglify: {
            my_target: {
                files: {
                    "assets/js/snowplow.js": "src/js/snowplow.js"
                }
            }
        },
        watch: {
            src: {
                files: configs.watch_files,
                tasks: [ "build" ]
            }
        }
    });

    // Add plugins
    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");

    // Register tasks
    grunt.registerTask("build", [ "sass", "cssmin", "concat", "uglify", "jshint" ]);
    grunt.registerTask("default", [ "sass", "cssmin", "concat", "uglify", "jshint" ]);
    grunt.event.on("watch", function(action, filepath) {
        grunt.log.writeln(filepath + " has " + action);
    });
};