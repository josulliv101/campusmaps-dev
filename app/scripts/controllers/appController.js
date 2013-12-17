define([

    'jquery'

    , 'underscore'

    , 'backbone'

    , 'scripts/router'

    , 'datastore'

    , 'eventdispatcher'

], function($, _, Backbone, Router, Datastore, EventDispatcher) {

    'use strict';

    var appWidth = 0;

    function AppController(el) {

        _.bindAll(this, 'confirmResizeEvent_', 'loadViz', 'handleTruthChange');

        this.$root = $(el);

        this.router = null;

    }

    AppController.prototype.init = function() {

        this.router = Router.init();

        $(window).on('resize', this.confirmResizeEvent_);

    }

    AppController.prototype.confirmResizeEvent_ = _.debounce(function() {

        // Only care about width changes
        var currentWidth;

        if (!this.$root) return;

        currentWidth = this.$root.outerWidth();

        // Guard against 'non-real' resize events by checking width (old IE triggers them on scrolling)
        if (currentWidth !== appWidth) {

            appWidth = currentWidth;

            // An application-level resize event. Give views an opportunity to listen and react if needed.
            EventDispatcher.trigger('appresize');

        }

    }, 500)

    AppController.prototype.getData = function() {

        return Datastore.fetch();

    }

    AppController.prototype.handleAttrChange1 = function(model, val, key) {

        console.log('...handleAttrChange1', model.cid, val, key);

        //return true;

    }

    AppController.prototype.handleAttrChange2 = function(model, val, key) {

        console.log('...handleAttrChange2', model.cid, val, key);

        //return true;

    }

    AppController.prototype.handleAttrChange3 = function(model, val, key) {

        console.log('...handleAttrChange3', model.cid, val, key);

        return true;

    }

    AppController.prototype.attrChangeDispatch = _.dispatch(

        AppController.prototype.handleAttrChange1,

        AppController.prototype.handleAttrChange2,

        AppController.prototype.handleAttrChange3

    )

    // Handling this way to make wildcard event listening possible
    AppController.prototype.handleTruthChange = function(model, options) {

        console.log('AppController.prototype.handleTruthChange', model.changedAttributes(), options);

        _.each(model.changedAttributes(), function(val, key) {

            this.attrChangeDispatch(model, val, key);

        }, this);

    }

    AppController.prototype.startRouter = function() {

        Backbone.history.start();

    }

    AppController.prototype.getRouterSettings = function() {

        return (this.router && this.router.settings) || {};

    }

    // Load can happen when browser resized, user interaction, and initial page load
    AppController.prototype.loadViz = function(path) {

        require([ path ], function (Viz) {

            //vizCache[path] = Viz;

            console.log('Module viz', Viz.init());

        });
        
    }

    /*

        if (vizCache[path]) return vizCache[path].refresh();

        require([ path ], function (Viz) {

            vizCache[path] = Viz;

            console.log('Module viz', Viz.init());

        });

    }*/

    return AppController;

});