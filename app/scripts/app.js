
define([

    'jquery'

    , 'scripts/controllers/appController'

    , 'datastore'

    , 'scripts/moduleManager'

    , 'scripts/viewManager'

    , 'eventdispatcher'

], function($, AppController, Datastore, ModuleManager, ViewManager, EventDispatcher) {

    'use strict';

    var attrs; // Shortcut to the Truth attributes

    function App(settings) {

        if (!settings || !settings.el) throw new Error('A root DOM element is required.');

        // The application's definitive state of being. Everything is always built off the truth.
        this.truth = ViewManager.modelFactory(settings);

        this.controller = new AppController(settings.el);

        // Set shortcut
        attrs = this.truth.attributes;

    }
    
    // A manual init call makes for nice insertion point for spies when testing
    App.prototype.init = function() {

        var controller = this.controller, 

            truth = this.truth, 

            app = this;


        controller.init();

        ViewManager.init(attrs.el);

        // The controller is listening for a window resize event, then (if appropriate) triggers an app-level resize event 
        EventDispatcher.on('appresize', function() {

            var path = ModuleManager.getVizPath(attrs);

truth.set(_.uniqueId('test_'), 123);

            console.log('appresize::path', path, attrs);

            controller.loadViz(path);

        });

        EventDispatcher.listenTo(this.truth, 'change', controller.handleTruthChange);


        // Controller has reference to a Data Service module that defines how to fetch data.
        $.when( controller.getData() )

         .done(function(data) { 

            // Parses the current route into settings
            controller.startRouter();

            // Router settings override config passed-in on App creation
            //$.extend(truth, controller.getRouterSettings());
            truth.set(controller.getRouterSettings(), { silent: true });

            console.log('truth', truth);

            // Update the datastore with the truth
            Datastore.campus(attrs.campusid, { id: 'campusid', select: true });

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
