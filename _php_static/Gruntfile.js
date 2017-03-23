"use strict";

module.exports = function(grunt)
{
    /*
     * Variables
     */

     var src = 'src/';
     var dst = 'assets/';
     var src_css = src + 'css/';
     var dst_css = dst + 'css/';


    /*
     * Grunt configuration
     */

    grunt.initConfig
    ({
        sass:
        { // Task 
            dist:
            { // Target 
                options:
                { // Target options 
                    outputStyle: "compressed",
                    sourcemap: true
                },
                files:
                {
                    // Dictionary of files { 'destination' : 'source' }
                    "assets/css/snowplow.css": "src/css/snowplow/snowplow.scss",
                    "assets/css/snowplow-home/home.css": "src/css/snowplow-home/home.scss",
                    "assets/css/snowplow-company/company.css": "src/css/snowplow-company/company.scss",
                    "assets/css/snowplow-company-contact-us/contact-us.css": "src/css/snowplow-company-contact-us/contact-us.scss",
                    "assets/css/snowplow-product-insights/insights.css": "src/css/snowplow-product-insights/insights.scss",
                    "assets/css/snowplow-products/products.css": "src/css/snowplow-products/products.scss",
                    "assets/css/snowplow-product-react/react.css": "src/css/snowplow-product-react/react.scss",
                    "assets/css/snowplow-product-open-source/open-source.css": "src/css/snowplow-product-open-source/open-source.scss",
                    "assets/css/snowplow-cases/cases.css": "src/css/snowplow-cases/cases.scss",
                    "assets/css/snowplow-company-partners/partners.css": "src/css/snowplow-company-partners/partners.scss",
                    "assets/css/snowplow-company-get-started/get-started.css": "src/css/snowplow-company-get-started/get-started.scss",
                    "assets/css/snowplow-services/services.css": "src/css/snowplow-services/services.scss",
                }
            }
        },
        script:
        { // Task 
            dist:
            { // Target 
                options:
                { // Target options 
                    outputStyle: "compressed",
                    sourcemap: true
                },
                files:
                {
                    // Dictionary of files { 'destination' : 'source' }
                    "assets/css/snowplow.css": "src/css/snowplow/snowplow.scss",
                    "assets/css/snowplow-home/home.css": "src/css/snowplow-home/home.scss",
                    "assets/css/snowplow-company/company.css": "src/css/snowplow-company/company.scss",
                    "assets/css/snowplow-company-contact-us/contact-us.css": "src/css/snowplow-company-contact-us/contact-us.scss",
                    "assets/css/snowplow-product-insights/insights.css": "src/css/snowplow-product-insights/insights.scss",
                    "assets/css/snowplow-products/products.css": "src/css/snowplow-products/products.scss",
                    "assets/css/snowplow-product-react/react.css": "src/css/snowplow-product-react/react.scss",
                    "assets/css/snowplow-product-open-source/open-source.css": "src/css/snowplow-product-open-source/open-source.scss",
                    "assets/css/snowplow-cases/cases.css": "src/css/snowplow-cases/cases.scss",
                    "assets/css/snowplow-company-partners/partners.css": "src/css/snowplow-company-partners/partners.scss",
                    "assets/css/snowplow-company-get-started/get-started.css": "src/css/snowplow-company-get-started/get-started.scss",
                    "assets/css/snowplow-services/services.css": "src/css/snowplow-services/services.scss",
                }
            }
        }
    });

    /*
     * Load Required Plugins
     */

    grunt.loadNpmTasks ("grunt-sass");

    /*
     * Register Tasks
     */

    grunt.registerTask ("default", ["sass"]);
    grunt.registerTask ("watch", ["sass"]);

    /*
     * Log on Watch
     */

    grunt.event.on ("watch", function(action, filepath) {
        grunt.log.writeln(filepath + " has " + action);
    });
};