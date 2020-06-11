// ---
// ---

// import ES6Samle from './es6-sample';
// new ES6Samle(1,2).test();

import cssVars from 'css-vars-ponyfill';

cssVars({
  // onlyLegacy: false
});

require('./vendors/_concat/jquery-3.1.1.min.js');
require('./vendors/_concat/jquery.cookiebar.js');
require('./vendors/_concat/bootstrap.min.js');
require('./vendors/_concat/bootstrap-select.min.js');
require('./vendors/_concat/grayscale.functions.js');
require('./vendors/_concat/bodymovin.min.js');
require('./vendors/_concat/grayscale.js');
require('./vendors/_concat/slick.min.js');
require('./vendors/_concat/masonry.pkgd.min.js');
require('./vendors/_concat/jssocials.min.js');
require('./core.js');
require('./newsletter.js');

// {% include_relative vendors/_concat/jquery-3.1.1.min.js %}
// {% include_relative vendors/_concat/jquery.cookiebar.js %}
// {% include_relative vendors/_concat/bootstrap.min.js %}
// {% include_relative vendors/_concat/bootstrap-select.min.js %}
// {% include_relative vendors/_concat/grayscale.functions.js %}
// {% include_relative vendors/_concat/bodymovin.min.js %}
// {% include_relative vendors/_concat/grayscale.js %}
// {% include_relative vendors/_concat/slick.min.js %}
// {% include_relative vendors/_concat/masonry.pkgd.min.js %}
// {% include_relative vendors/_concat/jssocials.min.js %}
// {% include_relative core.js %}
