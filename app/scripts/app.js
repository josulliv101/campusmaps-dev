
define([

    'jquery'

    , 'scripts/controllers/appController'

    , 'scripts/domManager'

    , 'eventdispatcher'

], function($, AppController, DomManager, EventDispatcher) {

    'use strict';

    var theSettings;

    function App(el, settings) {

        if (!el || !el.nodeType) throw new Error('A root DOM element is required.');

        theSettings = settings;

        DomManager.setAppRoot(el);

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

            EventDispatcher.trigger('truthupdate', theSettings);

         })

         .fail(function() {

            throw new Error('Error fetching data.');
            
         });

    }
 
    return App;

});
