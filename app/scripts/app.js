
define([

    'jquery'

    , 'scripts/config'

    , 'scripts/controllers/appController'

    , 'scripts/domManager'

], function($, Config, AppController, DomManager) {


    'use strict';


    function App(el, settings) {

console.log('App!');

        // A root DOM element is required
        el && el.nodeType 

            ? DomManager.getInstance().setAppRoot(el) 

            : Config.throwError.appInit();


        _.bindAll(this, 'start');

        // The settings eventually turn into the Truth (the definitive App state)
        this.theSettings = _.defaults(settings, Config.defaults.theTruth);

console.log('App controller.init 1');

        this.controller = new AppController();

console.log('App controller.init 2');

    }
    
    // A manual init call makes for nice insertion point for spies when testing
    App.prototype.init = function() {

        this.controller.init();



        // Controller has reference to a Data Service module that defines how to fetch data.
        $.when( this.controller.getData() )

         .done(this.start)

         .fail(Config.throwError.appInit);

    }

    App.prototype.start = function(data) {

        this.controller.startRouter( _.defaults(this.theSettings, data) );

    }

 
    return App;

});
