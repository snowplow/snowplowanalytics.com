    <?php include_once('header.php'); ?>
    </head>
    <body class="home">

        <main>
            <?php include_once ('header.menu.php') ?>

            <!--
                MAIN AREA
            -->

            <section class="slick" data-slick-fade="1" data-slick-selector=".jumbotron" data-slick-controls=".controls">
                <div class="jumbotron theme-light" style="background-image:url(assets/img/common/hero-1.jpg)">
                    <div class="container">
                        <h1>Empower your team!</h1>
                        <h5>We work with Smart Analysts, Engineers, Scientists and <br/>Marketers to enable them to do more with their data.</h5>
                        <a href="#" class="btn btn-primary spacer-top-100">Explore our Case Studies</a>
                    </div>
                </div>
                <div class="jumbotron theme-light" style="background-image:url(assets/img/common/hero-2.jpg)">
                    <div class="container">
                        <h2>Track Everything</h2>
                        <h5>Track all your interactions with all your users across all <br/>channels, including mobile, web, call center, email, <br/>ad exchanges, in-store and more.</h5>
                        <a href="#" class="btn btn-primary spacer-top-100">Explore our Case Studies</a>
                    </div>
                </div>
                <div class="jumbotron theme-light" style="background-image:url(assets/img/common/hero-3.jpg)">
                    <div class="container">
                        <h2>Collect good data</h2>
                        <h5>Collect data that is rich, granular, easy-to-understand <br/>and easy-to-use so you can answer the questions that <br/>matter to stay competitive, grow and innovate.</h5>
                        <a href="#" class="btn btn-primary spacer-top-100">Explore our Case Studies</a>
                    </div>
                </div>
                <div class="container controls"></div>
            </section>

            <section class="hero" style="background-image: url(assets/img/common/hero-4.jpg)">
                <div class="container text-center well-sm no-border trusties">
                    <h5>Trusted by</h5>
                    <div class="clearfont spacer-70">
                        <a href="#" class="inline-block max-width-20"><img src="assets/img/common/trusted-treatwell.png" width="390" height="150"></a>
                        <a href="#" class="inline-block max-width-20"><img src="assets/img/common/trusted-peak.png" width="390" height="150"></a>
                        <a href="#" class="inline-block max-width-20"><img src="assets/img/common/trusted-99designs.png" width="390" height="150"></a>
                        <a href="#" class="inline-block max-width-20"><img src="assets/img/common/trusted-weebly.png" width="390" height="150"></a>
                        <a href="#" class="inline-block max-width-20"><img src="assets/img/common/trusted-number26.png" width="390" height="150"></a>
                    </div>
                    <a href="#">See all</a>
                </div>
                <div class="container text-center spacer-top-30 theme-light">
                    <h3>Enabling smart people <br/>to do more</h3>
                    <small class="text-uppercase">Clever use of data is what marks the winners from the rest</small>
                    <a href="#" class="btn btn-primary spacer-60">Explore our Case Studies</a>
                </div>
            </section>

            <section>
                <div class="container">
                    <div class="group">
                        <h5 class="text-center">Headings</h5>
                        <br/>
                        <h1>h1. Bootstrap heading</h1>
                        <h2>h2. Bootstrap heading</h2>
                        <h3>h3. Bootstrap heading</h3>
                        <h4>h4. Bootstrap heading</h4>
                        <h5>h5. Bootstrap heading</h5>
                        <h6>h6. Bootstrap heading</h6>
                        <br/>
                        <p>Nullam quis risus eget urna mollis ornare vel eu leo. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Nullam id dolor id nibh ultricies vehicula.</p> <p>Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Donec ullamcorper nulla non metus auctor fringilla. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit. Donec ullamcorper nulla non metus auctor fringilla.</p> <p>Maecenas sed diam eget risus varius blandit sit amet non magna. Donec id elit non mi porta gravida at eget metus. Duis mollis, est non commodo luctus, nisi erat porttitor ligula, eget lacinia odio sem nec elit.</p>
                    </div>
                </div>
            </section>


            <section>
                <div class="container">
                    <div class="group text-center">
                        <h5>Buttons</h5>
                        <br/>
                        <p><button type="button" class="btn btn-primary btn-lg">Button Large</button></p>
                        <p><button type="button" class="btn btn-primary">Button Normal</button></p>
                        <p><button type="button" class="btn btn-primary btn-sm">Button Small</button></p>
                        <p><button type="button" class="btn btn-primary btn-xs">Button X Small</button></p>
                    </div>

                    <div class="group text-center">
                        <h5>Button Group <br/><b>FontAwesome example</b></h5>
                        <br/>
                        <div class="btn-group" role="group" aria-label="...">
                          <button type="button" class="btn btn-default">Left</button>
                          <button type="button" class="btn btn-default"><i class="fa fa-taxi" aria-hidden="true"></i></button>
                          <button type="button" class="btn btn-default">Right</button>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div class="container">
                    <div class="group text-center">
                        <h5>Dropdowns</h5>
                        <br/>
                        <select class="selectpicker" title="Bootstrap Select">
                            <option>Action</option>
                            <option>Another action</option>
                            <option>Something else here</option>
                            <option data-divider="true"></option>
                            <option>Separated link</option>
                            <optgroup label="Group">
                                <option>Tent</option>
                                <option>Flashlight</option>
                                <option>Toilet Paper</option>
                            </optgroup>
                        </select>

                        <!-- Single button -->
                        <div class="btn-group">
                            <button type="button" class="btn btn-default dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                Bootstrap Dropdown Default <span class="caret"></span>
                            </button>
                            <ul class="dropdown-menu">
                                <li><a href="#">Action</a></li>
                                <li><a href="#">Another action</a></li>
                                <li><a href="#">Something else here</a></li>
                                <li role="separator" class="divider"></li>
                                <li><a href="#">Separated link</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>


            <section class="bg-primary-lighter">
                <div class="container">
                    <div class="row text-center">
                        <h5 class="text-uppercase">Our offer</h5>
                        <h3>Collect and own rich, granular, event-level data for<br/> maximum flexibility and control to develop<br/> intelligence and act efficiently.</h3>
                    </div>
                </div>
            </section>



            <section>
                <div class="container">
                    <div class="group text-center">
                        <h5 class="text-uppercase">Sections : <b>Side by side</b></h5>
                        <div class="row side-by-side text-left">
                            <div class="col-md-6 text-block">
                                <h5 class="text-uppercase">Products</h5>
                                <h3>Collect and Analyze.<br/>Own and Act.</h3>
                                <p>For decades, across a range of sectors, many companies have used data to drive sustained competitive advantage.</p>
                                <p>Digital platforms and technology create new opportunities to use data.</p>
                            </div>
                            <div class="col-md-6">
                                <img src="assets/img/common/snowplow-graphics-analyze-abc.png" width="1056" height="1056" class="adapt max-width-70" alt="sowplow-graphics-analyze-abc">
                            </div>
                        </div>

                        <div class="row side-by-side text-left">
                            <div class="col-md-6">
                                <img src="assets/img/common/snowplow-graphics-analyze-abc.png" width="1056" height="1056" class="adapt max-width-70" alt="sowplow-graphics-analyze-abc">
                            </div>
                            <div class="col-md-6 text-block">
                                <h5 class="text-uppercase">Products</h5>
                                <h3>Collect and Analyze.<br/>Own and Act.</h3>
                                <p>For decades, across a range of sectors, many companies have used data to drive sustained competitive advantage.</p>
                                <p>Digital platforms and technology create new opportunities to use data.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>


            <section>
                <div class="container container-equal-heights text-center well no-gutter no-border theme-light">
                    <div class="col-md-6 bg-success pad-100">
                        <img src="assets/img/common/snowplow-insights.png" width="807" height="526" alt="Snowplow Insights">
                        <h5 class="spacer-30">Data collection done right</h5>
                        <p>For decades, across a range of sectors, many companies have used data to drive sustained competitive advantage. Digital platforms and technology create new opportunities to use data.</p>
                        <a href="#" class="btn btn-primary spacer-30">Know More</a>
                    </div>
                    <div class="col-md-6 bg-info pad-100">
                        <img src="assets/img/common/snowplow-react.png" width="804" height="568" alt="Snowplow React">
                        <h5 class="spacer-30">Act on your data in real-time</h5>
                        <p>Tailor your service and messaging to each of your users, across all channels and platforms.</p>
                        <a href="#" class="btn btn-primary spacer-30">Know More</a>
                    </div>
                </div>
            </section>


            <section>
                <div class="container">
                    <div class="col-md-8 col-md-offset-2 user-quote">
                        <img src="assets/img/common/dummy-face.jpg" width="200" height="200">
                        <q>Snowplow has been a game-changer here at Viadeo, handling 10 million events per day. Today at Viadeo, every single engineer and product manager is able to setup a rich metrics dashboard in a few minutes.</q></p>
                        <cite><small>Eric Pantera, VP of Engineering</small></cite>
                        <h5>Viadeo</h5>
                    </div>
                </div>
            </section>


            <section class="bg-primary-lighter">
                <div class="container">
                    <div class="row side-by-side text-center">
                        <h5 class="text-uppercase">Services</h5>
                        <div class="col-md-6 text-block">
                            <div class="text-left max-width-80">
                                <h5 class="text-uppercase">Products</h5>
                                <h2>Data Analytics</h2>
                                <small class="text-uppercase">Drive insight and intelligence from your data</small>
                                <ul class="styled">
                                    <li>Kickstarter programs: accelerate setup and adoption of Snowplow technology.</li>
                                    <li>Data model and schema design and evolution.</li>
                                    <li>Report, dashboard and KPI design and delivery.</li>
                                    <li>Use data to solve specific problems: e.g. optimize marketing spend across channels, increase customer retention.</li>
                                </ul>
                                <a href="#" class="btn btn-primary">Know More</a>
                            </div>
                        </div>
                        <div class="col-md-6 text-block">
                            <div class="text-left max-width-80">
                                <h5 class="text-uppercase">Products</h5>
                                <h2>Data Engineering</h2>
                                <small class="text-uppercase">Operationalise your data</small>
                                <ul class="styled">
                                    <li>Design, build and run real-time data processing applications, including:
                                        <ul>
                                            <li>Reporting dashboards</li>
                                            <li>Personalization and recommendation engines</li>
                                            <li>Dynamic pricing algorithms</li>
                                        </ul>
                                    </li>
                                    <li>Integrate new data sources and sinks.</li>
                                </ul>
                                <a href="#" class="btn btn-primary">Know More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            <section>
                <div class="container">
                    <div class="text-center">
                        <h5 class="text-uppercase">Resources</h5>
                        <div class="row well-lg">
                            <div class="col-md-6">
                                <h3>Community</h3>
                                <small class="text-uppercase text-muted spacer-30">Operationalise your data</small>
                                <a href="#" class="btn btn-outline-primary">Know More</a>
                            </div>
                            <div class="col-md-6">
                                <h3>Documentation</h3>
                                <small class="text-uppercase text-muted spacer-30">Operationalise your data</small>
                                <a href="#" class="btn btn-outline-primary">Know More</a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section>
                <div class="container">
                    <div class="text-center">
                        <h5 class="text-uppercase">features</h5>
                        <h3>Snowplow Insights empowers you<br/>to do data collection right</h3>
                        <div>
                            <!-- Nav tabs -->
                            <ul class="nav nav-tabs text-center" role="tablist">
                                <li role="presentation" class="active"><a href="#track" aria-controls="track" role="tab" data-toggle="tab">Track</a></li>
                                <li role="presentation"><a href="#your-data" aria-controls="your-data" role="tab" data-toggle="tab">Your data</a></li>
                                <li role="presentation"><a href="#real-time" aria-controls="real-time" role="tab" data-toggle="tab">Real-time</a></li>
                                <li role="presentation"><a href="#scalable" aria-controls="scalable" role="tab" data-toggle="tab">Scalable</a></li>
                                <li role="presentation"><a href="#trust" aria-controls="trust" role="tab" data-toggle="tab">Trust</a></li>
                                <li role="presentation"><a href="#control" aria-controls="control" role="tab" data-toggle="tab">Control</a></li>
                                <li role="presentation"><a href="#evolve" aria-controls="evolve" role="tab" data-toggle="tab">Evolve</a></li>
                                <li role="presentation"><a href="#cost-effective" aria-controls="cost-effective" role="tab" data-toggle="tab">Cost effective</a></li>
                                <li role="presentation"><a href="#analytics-experts" aria-controls="analytics-experts" role="tab" data-toggle="tab">Analytics experts</a></li>
                                <li role="presentation"><a href="#active-community" aria-controls="active-community" role="tab" data-toggle="tab">Active community</a></li>
                            </ul>

                            <!-- Tab panes -->
                            <div class="tab-content text-left">
                                <div role="tabpanel" class="tab-pane active" id="track">
                                    <h5 class="text-uppercase">Track events from everywhere</h5>
                                    <ul class="styled">
                                        <li>Extensive range of trackers and third party integrations</li>
                                        <li>Extensive range of trackers and third party integrations</li>
                                        <li>Extensive range of trackers and third party integrations
                                            <ul>
                                                <li>Extensive range of trackers and third party integrations</li>
                                                <li>Extensive range of trackers and third party integrations</li>
                                                <li>Extensive range of trackers and third party integrations
                                                    <ul>
                                                        <li>Extensive range of trackers and third party integrations</li>
                                                        <li>Extensive range of trackers and third party integrations</li>
                                                        <li>Extensive range of trackers and third party integrations</li>
                                                    </ul>
                                                </li>
                                            </ul>
                                        </li>
                                    </ul>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="your-data">
                                    <h5 class="text-uppercase">Your data events from everywhere</h5>
                                    <ol class="styled">
                                        <li>Extensive range of trackers and third party integrations</li>
                                        <li>Extensive range of trackers and third party integrations</li>
                                        <li>Extensive range of trackers and third party integrations
                                            <ol>
                                                <li>Extensive range of trackers and third party integrations</li>
                                                <li>Extensive range of trackers and third party integrations</li>
                                                <li>Extensive range of trackers and third party integrations
                                                    <ol>
                                                        <li>Extensive range of trackers and third party integrations</li>
                                                        <li>Extensive range of trackers and third party integrations</li>
                                                        <li>Extensive range of trackers and third party integrations</li>
                                                    </ol>
                                                </li>
                                            </ol>
                                        </li>
                                    </ol>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="real-time">
                                    <h5 class="text-uppercase">Real time events from everywhere</h5>
                                    <ul><li>Extensive range of trackers and third party integrations</li></ul>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="scalable">
                                    <h5 class="text-uppercase">Scalable events from everywhere</h5>
                                    <ul><li>Extensive range of trackers and third party integrations</li></ul>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="trust">
                                    <h5 class="text-uppercase">Trust events from everywhere</h5>
                                    <ul><li>Extensive range of trackers and third party integrations</li></ul>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="control">
                                    <h5 class="text-uppercase">Control events from everywhere</h5>
                                    <ul><li>Extensive range of trackers and third party integrations</li></ul>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="evolve">
                                    <h5 class="text-uppercase">Evolve events from everywhere</h5>
                                    <ul><li>Extensive range of trackers and third party integrations</li></ul>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="cost-effective">
                                    <h5 class="text-uppercase">Cost effective events from everywhere</h5>
                                    <ul><li>Extensive range of trackers and third party integrations</li></ul>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="analytics-experts">
                                    <h5 class="text-uppercase">Analytics experts events from everywhere</h5>
                                    <ul><li>Extensive range of trackers and third party integrations</li></ul>
                                </div>
                                <div role="tabpanel" class="tab-pane" id="active-community">
                                    <h5 class="text-uppercase">Active community events from everywhere</h5>
                                    <ul><li>Extensive range of trackers and third party integrations</li></ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

        </main>



        <?php include_once('footer.php'); ?>
        <?php include_once('footer-scripts.php'); ?>

    </body>
</html>