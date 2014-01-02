define([

    'underscore'

    , 'scripts/router'

    , 'datastore'

    , 'scripts/controllers/appControllerEventHandlers'

    , 'eventdispatcher'

], function(_, Router, Datastore, AppControllerEventHandlers, EventDispatcher) {

    'use strict';

    var theTruth;

    function AppController(options) {

        _.bindAll(this, 'handleTruthChange', 'setTheTruth');

        _.extend(this, options);

        // An empty model -- no attributes yet
        theTruth = Datastore.Factory.model();

        this.router = Router.init();

        console.log('Datastore this', Datastore);

    }

    AppController.prototype.init = function() {

        var handlers = new AppControllerEventHandlers(AppController, this);

        this.attrChangeDispatch  = _.dispatch.apply(this, handlers.getHandlers());


        //// App-level Event Listeners ////

        // Allow loosely-coupled objects to update the Truth
        EventDispatcher.on('truthupdate', this.setTheTruth);

        // Handle any Truth changes appropriately
        EventDispatcher.listenTo(theTruth, 'change', this.handleTruthChange);

        return this;

    }

    AppController.prototype.getData = function() {

        // debugging
        window.Datastore = Datastore;

        return Datastore.fetch();

    }

    AppController.prototype.setTheTruth = function(obj) {

        console.log('setTheTruth', obj);

        theTruth.set(obj);

    }

    AppController.prototype.revertTheTruth = function(attributes) {

        console.log('revertTheTruth', attributes);

        //theTruth.set(obj);

    }

    // Always use 'set' to update the model's truth. This ensures that the changedAttributes method is always accurate.
    AppController.prototype.handleTruthChange = function(model, options) { 

        var changed = model.changedAttributes(),

            querystring = this.router.toQueryString(theTruth.attributes);

        console.log('handleTruthChange', changed, options);

        if (_.isEmpty(changed)) return;

        // Handle each changed attribute in the most appropriate manner, determined by dispatch function
        _.each(model.changedAttributes(), function(val, key) { this.attrChangeDispatch(model, val, key); }, this);

        if (_.intersection(_.keys(changed), ['cmd', 'campusid', 'campusmap', 'vizpath']).length > 0) this.router.navigate(querystring, { trigger: false });

        /* * * * * * * * * * * * * * * * * * * * *

         --  You want answers?

         --- I think I'm entitled to.

         --  * You want answers? *

         --- * I want the truth! *

         --  * You can't handle the truth! *
        
        * * * * * * * * * * * * * * * * * * * * */


    }

    AppController.prototype.startRouter = function(settings) {

        this.router.settings = settings;

        Router.start();

        return this.router;

    }

    return AppController;

});