
define([

    'jquery'

    , 'scripts/controllers/appController'

    , 'scripts/domManager'

], function($, AppController, DomManager) {

    'use strict';


    var theSettings, 

        fnError = function() { throw new Error('Error initializing App.')};


    function App(el, settings) {

        // A root DOM element is required
        el && el.nodeType ?  this.setRootElement(el) : fnError();

        theSettings = settings;

        this.controller = new AppController();

    }
    
    // A manual init call makes for nice insertion point for spies when testing
    App.prototype.init = function() {

        var controller = this.controller;

        controller.init();

        // Controller has reference to a Data Service module that defines how to fetch data.
        $.when( controller.getData() )

         .done(function(data) { 

            // Parses the current route into settings
            var router = controller.startRouter();

            _.extend(theSettings, router.settings);

            controller.setTheTruth(theSettings);

         })

         .fail(fnError);

    }

    App.prototype.setRootElement = function(el) {

        DomManager.getInstance().setAppRoot(el);

    }
 
    return App;

});
