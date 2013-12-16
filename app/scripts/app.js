
define([

    'jquery',

    'scripts/controllers/appController'

], function($, AppController) {

    'use strict';

    function App(settings) {

        if (!settings || !settings.el) throw new Error('A root DOM element is required.');

        // The application's state - everything is always built off the truth.
        this.truth = settings;

        this.controller = new AppController(settings.el);

    }
    
    // A manual init call makes for nice insertion point for spies when testing
    App.prototype.init = function() {

        var controller = this.controller, 

            truth = this.truth, 

            app = this;


        controller.init();

        $.when( controller.getData() )

         .done(function(data) { 

            // Parses the current route into settings
            controller.startRouter();

            // Router settings override config passed-in on App creation
            $.extend(truth, controller.getRouterSettings());

            // Helpful when testing
            app.init = true;

         })

         .fail(function() {

            throw new Error('Error fetching data.');
            
         });

    }
 
    return App;

});
