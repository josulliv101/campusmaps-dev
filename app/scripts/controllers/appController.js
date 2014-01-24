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

        console.log('AppController');

        _.bindAll(this, 'handleTruthChange', 'setTheTruth', 'dispatchVizTruth', 'dispatchTruth');

        _.extend(this, options);

        // An empty model -- no attributes yet
        theTruth = Datastore.Factory.model();

        this.router = Router.init();

        console.log('Datastore this', Datastore);

    }

    AppController.prototype.init = function() {

        var handlers = new AppControllerEventHandlers(AppController, this);

        this.attrChangeDispatch  = _.dispatch.apply(this, handlers.getHandlers());

        this.handleTruthChange = _.dispatch(this.dispatchVizTruth, this.dispatchTruth);


        //// Add App-level Event Listeners ////

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

    AppController.prototype.setTheTruth = function(obj, options) {

        //console.log('setTheTruth', obj, options);

        options || (options = {});

        // Gets cleared when router handles route -- for Back Button integration.
        if (options.clear === true) theTruth.clear({ silent: true });

        this.validateTheTruth(obj);

        theTruth.set(obj, options);

    }

    AppController.prototype.validateTheTruth = function(attrs) {

        var zoom = theTruth.get('zoom');

        if (!theTruth) return;

        //console.log('validateTheTruth', attrs);

        // Zoom is always an integer
        if (_.has(attrs, 'zoom')) {

            if (attrs.zoom === '+' && _.isNumber(zoom)) attrs.zoom = ++zoom;

            else if (attrs.zoom === '-' && _.isNumber(zoom)) attrs.zoom = --zoom;

            else if (_.isString(attrs.zoom)) attrs.zoom = parseInt(attrs.zoom);

        }

        // Details View
        if (_.has(attrs, 'detailsview')) {

            if (attrs.detailsview === '+') attrs.detailsview = 'directions';


        }

        // Used when map is clicked on empty area
        if (_.has(attrs, 'locationid') && !_.isString(attrs.locationid)) {

            //attrs.locationid = '-1';

            //debugger;

        }

        if (_.has(attrs, 'locationid') && attrs.locationid !== '-1' && theTruth.get('cmd') === 'Location') {

            //attrs.cmd = '';

        }

    }

    AppController.prototype.revertTheTruth = function(attributes) {

        console.log('revertTheTruth', attributes);

    }

    // A vizpath change is the only truth change that can require async loading. Once the vizpath is loaded,
    // then the other truth attributes, if any, get prcoessed.
    AppController.prototype.dispatchVizTruth = function(model, options) {

        var changed = model.changedAttributes();

        console.log('...dispatchVizTruth', changed);

        // If only the vizpath changes, let the regular handler catch it so the router.navigate gets called
        if (!_.has(changed, 'vizpath') || _.size(changed) === 1) return;

        this.attrChangeDispatch(model, changed.vizpath, 'vizpath');

        return true;

    }

    AppController.prototype.dispatchTruth = function(model, options) { 

        var changed, previous, querystring;

        changed = model.changedAttributes();
        
        previous = model.previousAttributes();

        if (_.isEmpty(changed)) return;

        if (_.has(changed, 'vizpath') && _.size(changed) > 1) delete changed.vizpath;

        console.log('...dispatchTruth', changed);

        querystring = this.router.toQueryString(theTruth.attributes);

        // Handle each changed attribute in the most appropriate manner, determined by dispatch function
        _.each(changed, function(val, key) { this.attrChangeDispatch(model, val, key); }, this);

        console.log('querystring', querystring, theTruth.attributes);

        this.router.navigate(querystring, { trigger: false });

        // The Truth changes get sent to Component-level controllers for further handling
        EventDispatcher.trigger('delegateTruth', changed, previous);

        return true;

    }

    // Always use 'set' to update the model's truth. This ensures that the changedAttributes method is always accurate.
    AppController.prototype.handleTruthChange = function(model, options) {}
        

    AppController.prototype.startRouter = function(settings) {

        // Ensure there's a campus & campusmap selected
        Datastore.campus();

        Datastore.map();

        this.router.settings = settings;

        Router.start();

        return this.router;

    }

    return AppController;

});