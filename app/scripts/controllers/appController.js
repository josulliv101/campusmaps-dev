define([

    'underscore'

    , 'scripts/config'

    , 'scripts/domManager'

    , 'scripts/router'

    , 'datastore'

    , 'scripts/controllers/appControllerEventHandlers'

    , 'eventdispatcher'

], function(_, Config, DomManager, Router, Datastore, AppControllerEventHandlers, EventDispatcher) {

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

        var q, domManager = DomManager.getInstance(), cmd = theTruth.get('cmd'), accessibility = theTruth.get('accessibility'), parking = theTruth.get('parking'), zoom = theTruth.get('zoom'), maptype = theTruth.get('maptype'), panoramas = theTruth.get('panoramas') || [], details = theTruth.get('details'), pos, detailsview = theTruth.get('detailsview'), detailsNav = Config.search.details.nav;

        if (!theTruth) return;

        //console.log('validateTheTruth', attrs);

        // Zoom is always an integer
        if (_.has(attrs, 'zoom')) {

            if (attrs.zoom === '+' && _.isNumber(zoom)) attrs.zoom = ++zoom;

            else if (attrs.zoom === '-' && _.isNumber(zoom)) attrs.zoom = --zoom;

            else if (_.isString(attrs.zoom)) attrs.zoom = parseInt(attrs.zoom);

        }

        if (_.has(attrs, 'latlng')) {

            if (attrs.latlng && attrs.latlng.indexOf('|') > -1) attrs.latlng = attrs.latlng.replace('|', ',');

        }

        // Always show first panel when details location changes
        if (_.has(attrs, 'details')) {

            // Reset details view and panoramas since there's anew location selected
            if (attrs.details !== details) {

                attrs.detailsview = '';

                attrs.panoramas = [];

            }

        }

        if (_.has(attrs, 'cmd')) {

            if (_.isEmpty(attrs.cmd)) {

                attrs.searchboxlabel = '';

            }
/*
            if (attrs.cmd === 'Accessibility') {

                attrs.labelstrategy = 'big';

                attrs.accessibility = true;

            } 

            else {

                attrs.labelstrategy = '';

                attrs.accessibility = false;

            }
            */

        }
/*
        if (_.has(attrs, 'accessibility')) {

            if (attrs.accessibility === true || attrs.accessibility === 'true') {

                attrs.labelstrategy = 'big';

                attrs.parking = false;

            }
            
        }
*/


        if (_.has(attrs, 'parking') && attrs.parking === 'toggle') {

            //if (attrs.parking === true || attrs.parking === 'true') {

                //attrs.labelstrategy = 'parking';

                attrs.parking = !parking;

                if (attrs.parking === true) attrs.accessibility = false;

                if (attrs.parking !== true && cmd === 'Parking') attrs.searchboxlabel = '';

                attrs.cmd = !attrs.parking ? '' : 'Parking'; 

                attrs.labelstrategy = !attrs.parking ? '' : 'parking'; 

            //} else if ((attrs.parking === false || attrs.parking === 'false') && !attrs.accessibility) {

                //attrs.labelstrategy = '';

            //}
            
        }

        if (_.has(attrs, 'accessibility') && attrs.accessibility === 'toggle') {


            attrs.accessibility = !accessibility;

            if (attrs.accessibility === true) attrs.parking = false;

            if (attrs.accessibility !== true && cmd === 'Accessibility') attrs.searchboxlabel = '';

            attrs.cmd = !attrs.accessibility ? '' : 'Accessibility'; 

            attrs.labelstrategy = !attrs.accessibility ? '' : 'big'; 
            
        }

        if (_.has(attrs, 'query')) {

            // Reset
            attrs.querytype = '';

            attrs.searchboxlabel = attrs.query;

            //attrs.querytype = encodeURIComponent(attrs.querytype);

            if (attrs.query.indexOf('#') === 0) {
                
                //attrs.query = attrs.query.substring(5);

                attrs.querytype = 'tag';

            }
/*
            if (attrs.query.indexOf('accessible-') > -1) {

                attrs.labelstrategy = 'big';

                attrs.accessibility = true;

            }

            else {

                attrs.labelstrategy = '';

                attrs.accessibility = false;

            }
            */

        }




        if (_.has(attrs, 'panoramas')) {

            if (!_.isEmpty(panoramas)) {

                attrs.panoramas = [];

            }

        }

        if (_.has(attrs, 'maptype')) {

            if (attrs.maptype === 'toggle') {

                attrs.maptype = maptype !== 'satellite' ? 'satellite' : 'plain';

            }

        }

        // Details View
        if (_.has(attrs, 'detailsview')) {

/*            if (attrs.detailsview === '+') {

                pos = _.find(detailsNav, function(item) { return detailsview === item.id; });

                // Assume the first one is active
                if (!pos) {

                    attrs.detailsview = detailsNav[1].id;

                }

                // The last item is selected so return the first
                else if (_.size(detailsNav) === pos.order) {

                    attrs.detailsview = detailsNav[0].id;

                } else {

                    attrs.detailsview = detailsNav[pos.order].id;

                } 


            }*/

//debugger;

        }

        // Used when map is clicked on empty area
        if (_.has(attrs, 'mapcenteroffset') && !_.isObject(attrs.mapcenteroffset)) {

            attrs.mapcenteroffset = domManager.getCenterOffset();

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

        var changed, previous, querystring, locationLink;

        changed = model.changedAttributes();
        
        previous = model.previousAttributes();

        if (_.isEmpty(changed)) return;

        if (_.has(changed, 'vizpath') && _.size(changed) > 1) delete changed.vizpath;

        console.log('...dispatchTruth', changed);

        querystring = this.router.toQueryString(theTruth.attributes);

        locationLink = this.router.getLocationShareLink(theTruth.attributes);

        // Handle each changed attribute in the most appropriate manner, determined by dispatch function
        _.each(changed, function(val, key) { this.attrChangeDispatch(model, val, key); }, this);

        console.log('querystring', querystring, theTruth.attributes);

        //if (_.has(changed, 'cmd') || _.has(changed, 'details')) 
        this.router.navigate(querystring, { trigger: false });

        // The Truth changes get sent to Component-level controllers for further handling
        EventDispatcher.trigger('delegateTruth', changed, previous);
/*

ie7/8 choking on this
 
        if (locationLink) this.setTheTruth({ locationlink: locationLink });
 */
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