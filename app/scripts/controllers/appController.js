define([

    'jquery'

    , 'underscore'

    , 'backbone'

    , 'scripts/router'

    , 'datastore'

    , 'scripts/viewManager'

    , 'eventdispatcher'

], function($, _, Backbone, Router, Datastore, ViewManager, EventDispatcher) {

    'use strict';

    var appWidth = 0,

        enabledEventAttrs = ['vizpath', 'streetview', 'fullscreen'],

        viewManager;

    function AppController(el, viewManager) {

        _.bindAll(this, 'confirmResizeEvent_', 'loadViz', 'handleTruthChange', 'attrChangeDispatch', 'handleVizPathChange', 'handleAttrStreetview', 'handleAttrFullscreen');

        this.$root = $(el);

        this.viewManager = viewManager;

        this.router = null;

    }

    AppController.prototype.init = function() {

        this.router = Router.init();

        $(window).on('resize', this.confirmResizeEvent_);

        // Define in init to keep this keyword intact
        this.attrChangeDispatch  = _.dispatch(

            // Only handle whitelisted truth attributes
            function(model, val, key) {

                return _.contains(enabledEventAttrs, key) ? undefined : true;

            },

            this.handleVizPathChange,

            this.handleAttrStreetview,

            this.handleAttrFullscreen,

            this.handleAttrChange3

        );

    }

    AppController.prototype.confirmResizeEvent_ = _.debounce(function(ev, options) {

console.log('opts resize', options);

        // Only care about width changes
        var currentWidth;

        if (!this.$root) return;

        options || (options = {});

        currentWidth = this.$root.outerWidth();

        // Guard against 'non-real' resize events by checking width (old IE triggers them on scrolling)
        if (currentWidth !== appWidth) {

            appWidth = currentWidth;

            // An application-level resize event. Give views an opportunity to listen and react if needed.
            if (options.silent !== true) EventDispatcher.trigger('appresize');

        }

    }, 500)

    AppController.prototype.getData = function() {

        return Datastore.fetch();

    }
    

    AppController.prototype.handleAttrFullscreen = function(model, val, key) {

        var prefix = 'map-',

            $root = this.viewManager.$root;

        if (key !== 'fullscreen') return;

        console.log('handleAttrFullscreen');


        $root.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {

            var $div = $('<div/>')

                        .addClass('overlay')

                        .appendTo($('body'));

            _.delay(function() { 

                $root.css({ opacity: 1 })

                $div.addClass('slideRight'); 

            }, 600);

        }); 

        this.viewManager.addCssFlagToHtmlTag(prefix + key);

        return true;

    }

    AppController.prototype.handleVizPathChange = function(model, val, key) {

        var prefix = 'viz-',

            forced = model.attributes['vizpath!'];

        if (key !== 'vizpath') return;

        // vizpath can be forced
        if (forced) val = forced;


        console.log('...handleAttrChange1', model.cid, val, key);

        AppController.prototype.loadViz.call(null, val);
        
        this.viewManager.addCssFlag(prefix + val);

        return true;

    }

    AppController.prototype.handleAttrStreetview = function(model, val, key) {

        var fn, vm = this.viewManager;

        console.log('...handleAttrStreetview', model.cid, val, key);

        if (key !== 'streetview') return;

        fn = val === true ? vm.addCssFlag : vm.removeCssFlag;

        fn.call(vm, key);

        return true;

    }

    AppController.prototype.handleAttrChange3 = function(model, val, key) {

        console.log('...handleAttrChange3', model.cid, val, key);

        return true;

    }

    // Wrap dispatch in fn so this keyword behaves
    AppController.prototype.attrChangeDispatch = function () {}


    // Handling this way to make wildcard event listening possible
    // Always use 'set' to update the model's truth. This ensures that the changedAttributes method
    // is accurate.
    AppController.prototype.handleTruthChange = function(model, options) {

        console.log('AppController.prototype.handleTruthChange', model.changedAttributes(), options);

        _.each(model.changedAttributes(), function(val, key) {

            this.attrChangeDispatch.call(this, model, val, key);

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