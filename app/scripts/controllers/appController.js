define([

    'jquery'

    , 'underscore'

    , 'backbone'

    , 'scripts/router'

    , 'datastore'

    , 'scripts/moduleManager'

    , 'scripts/viewManager'

    , 'scripts/domManager'

    , 'scripts/controllers/appControllerEventHandlers'

    , 'eventdispatcher'

], function($, _, Backbone, Router, Datastore, ModuleManager, ViewManager, DomManager, AppControllerEventHandlers, EventDispatcher) {

    'use strict';

    var theTruth, viewManager;

    function AppController(el, viewManager) {

        _.bindAll(this, 'loadViz', 'handleTruthChange', 'setTheTruth');

        this.$root = $(el);

        this.viewManager = viewManager;

        theTruth = new Backbone.Model();

        // App-level DOM manipulation happens here. This includes attaching event listeners to DOM.
        this.domManager = new DomManager();

        this.domManager.init(el);

        this.router = Router.init();

    }

    AppController.prototype.init = function() {

        var handlers = new AppControllerEventHandlers(AppController, this);

        this.attrChangeDispatch  = _.dispatch.apply(this, handlers.getHandlers());


        //// App-level Event Listeners ////

        // Allow loosely-coupled objects to update the Truth
        EventDispatcher.on('truthupdate', this.setTheTruth);

        // Handle any Truth changes appropriately
        EventDispatcher.listenTo(theTruth, 'change', this.handleTruthChange);

    }

    AppController.prototype.getData = function() {

        return Datastore.fetch();

    }

    AppController.prototype.getTheTruth = function() {

        return theTruth;

    }

    AppController.prototype.setTheTruth = function(obj) {

        theTruth.set(obj);

    }

    // Always use 'set' to update the model's truth. This ensures that the changedAttributes method is always accurate.
    AppController.prototype.handleTruthChange = function(model, options) { 

        // Handle each changed attribute in the most appropriate manner, determined by dispatch function
        _.each(model.changedAttributes(), function(val, key) { this.attrChangeDispatch(model, val, key); }, this);


        /* * * * * * * * * * * * * * * * * * * * *

        // --  You want answers?

        // --- I think I'm entitled to.

        // --  * You want answers? *

        // --- * I want the truth! *

        // --  * You can't handle the truth! *
        
        * * * * * * * * * * * * * * * * * * * * */


    }

    AppController.prototype.startRouter = function() {

        Backbone.history.start();

    }

    AppController.prototype.getRouterSettings = function() {

        return (this.router && this.router.settings) || {};

    }

    // Load can happen when browser resized, user interaction, and initial page load
    AppController.prototype.loadViz = function(path) {

        require([ path ], function (Viz) { Viz.init(); });
        
    }

    return AppController;

});