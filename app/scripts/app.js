
define([

    'jquery'

    , 'scripts/controllers/appController'

    , 'datastore'

    , 'scripts/moduleManager'

    , 'eventdispatcher'

], function($, AppController, Datastore, ModuleManager, EventDispatcher) {

    'use strict';

    function App(settings) {

        if (!settings || !settings.el) throw new Error('A root DOM element is required.');

        // The application's definitive state of being. Everything is always built off the truth.
        this.truth = settings;

        this.controller = new AppController(settings.el);

    }
    
    // A manual init call makes for nice insertion point for spies when testing
    App.prototype.init = function() {

        var controller = this.controller, 

            truth = this.truth, 

            app = this;


        controller.init();

        // The controller is listening for a window resize event, then (if appropriate) triggers an app-level resize event 
        EventDispatcher.on('appresize', function() {

            var path = ModuleManager.getVizPath(truth);

            console.log('appresize::path', path, truth);

            controller.loadViz(path);

        });


        // Controller has reference to a Data Service module that defines how to fetch data.
        $.when( controller.getData() )

         .done(function(data) { 

            // Parses the current route into settings
            controller.startRouter();

            // Router settings override config passed-in on App creation
            $.extend(truth, controller.getRouterSettings());

            // Update the datastore with the truth
            Datastore.campus(truth.campusid, { id: 'campusid', select: true });

            // Helpful when testing
            app.init = true;

            // Trigger a resize event to kick things off. Doing it this way (instead of directly calling the controller's loadViz method) 
            // to make sure the app's initial  root DOM px width gets captured by resize handler (see AppController.prototype.confirmResizeEvent_)
            $(window).trigger('resize');

         })

         .fail(function() {

            throw new Error('Error fetching data.');
            
         });

    }
 
    return App;

});
