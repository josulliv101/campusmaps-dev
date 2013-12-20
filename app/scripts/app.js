
define([

    'jquery'

    , 'scripts/controllers/appController'

    , 'datastore'

    , 'scripts/viewManager'

    , 'eventdispatcher'

], function($, AppController, Datastore, ViewManager, EventDispatcher) {

    'use strict';

    var theSettings, attrs; // Shortcut to the Truth attributes

    function App(settings) {

        if (!settings || !settings.el) throw new Error('A root DOM element is required.');

        this.settings = settings;

        theSettings = settings;

        this.viewManager = new ViewManager(settings.el);

        this.controller = new AppController(settings.el, this.viewManager);

        // The application's definitive state of being. Everything is always built off the truth.
        this.truth = this.viewManager.modelFactory();

        // Set shortcut
        attrs = this.truth.attributes;

    }
    
    // A manual init call makes for nice insertion point for spies when testing
    App.prototype.init = function() {

        var controller = this.controller, 

            settings = this.settings, 

            truth = this.truth, 

            app = this;


        controller.init();

        this.viewManager.init();




        // Controller has reference to a Data Service module that defines how to fetch data.
        $.when( controller.getData() )

         .done(function(data) { 

            var model;

            // Parses the current route into settings
            controller.startRouter();

            theSettings = model = _.extend(settings, controller.getRouterSettings());

            // Update the datastore with the truth
            Datastore.campus(theSettings.campusid, { id: 'campusid', select: true });

            console.log('Datastore', Datastore.campus());



            // Trigger a resize event to kick things off. Doing it this way (instead of directly calling the controller's loadViz method) 
            // to make sure the app's initial  root DOM px width gets captured by resize handler (see AppController.prototype.confirmResizeEvent_)
            //$(window).trigger('resize');

            console.log('model', model, theSettings);

            //truth.set( model );

            EventDispatcher.trigger('truthupdate', theSettings);

            console.log('truth', truth);

            // Helpful when testing
            app.init = true;

         })

         .fail(function() {

            throw new Error('Error fetching data.');
            
         });

    }
 
    return App;

});
