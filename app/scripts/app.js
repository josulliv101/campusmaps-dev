
define([

    'jquery'

    , 'scripts/controllers/appController'

    , 'scripts/domManager'

], function($, AppController, DomManager) {

    'use strict';


    var theSettings, 

        defaults = {

            cmd: ''

            , iconstrategy: 'default'

        },

        fnError = function() { throw new Error('Error initializing App.')};


    function App(el, settings) {

        // A root DOM element is required
        el && el.nodeType ?  this.setRootElement(el) : fnError();

        // The settings eventually turn into the Truth (definitive App state)
        theSettings = _.defaults(settings, defaults);

        this.controller = new AppController();

    }
    
    // A manual init call makes for nice insertion point for spies when testing
    App.prototype.init = function() {

        var controller = this.controller.init();

        // Controller has reference to a Data Service module that defines how to fetch data.
        $.when( controller.getData() )

         .done(function(data) { 

            // Parses the current route into settings
            var router = controller.startRouter( _.defaults(theSettings, data) );

         })

         .fail(fnError);

    }

    App.prototype.setRootElement = function(el) {

        console.log('App::setRootElement', el);

        DomManager.getInstance().setAppRoot(el);

    }
 
    return App;

});
