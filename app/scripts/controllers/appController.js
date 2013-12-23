define([

    'underscore'

    , 'scripts/router'

    , 'datastore'

    , 'scripts/controllers/appControllerEventHandlers'

    , 'eventdispatcher'

], function(_, Router, Datastore, AppControllerEventHandlers, EventDispatcher) {

    'use strict';

    var theTruth;

    function AppController() {

        _.bindAll(this, 'handleTruthChange', 'setTheTruth');

        // An empty model -- no attributes yet
        theTruth = Datastore.Factory.model();

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

    AppController.prototype.setTheTruth = function(obj) {

        console.log('setTheTruth', obj);

        theTruth.set(obj);

    }

    AppController.prototype.getTheTruth = function() {

        return theTruth;

    }

    // Always use 'set' to update the model's truth. This ensures that the changedAttributes method is always accurate.
    AppController.prototype.handleTruthChange = function(model, options) { 

        console.log('handleTruthChange', model.changedAttributes(), options);

        // Handle each changed attribute in the most appropriate manner, determined by dispatch function
        _.each(model.changedAttributes(), function(val, key) { this.attrChangeDispatch(model, val, key); }, this);


        /* * * * * * * * * * * * * * * * * * * * *

         --  You want answers?

         --- I think I'm entitled to.

         --  * You want answers? *

         --- * I want the truth! *

         --  * You can't handle the truth! *
        
        * * * * * * * * * * * * * * * * * * * * */


    }

    AppController.prototype.startRouter = function() {

        Router.start();

        return this.router;

    }

    return AppController;

});