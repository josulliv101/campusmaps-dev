define([

    'jquery'

    , 'underscore'

    , 'backbone'

    , 'scripts/router'

    , 'datastore'

    , 'scripts/moduleManager'

    , 'eventdispatcher'

], function($, _, Backbone, Router, Datastore, ModuleManager, EventDispatcher) {

    'use strict';

    var appWidth = 0;

    function AppController(el) {

        _.bindAll(this, 'confirmResizeEvent_', 'loadViz');

        this.$root = $(el);

        this.router = null;

    }

    AppController.prototype.init = function() {

        this.router = Router.init();

        $(window).on('resize', _.debounce(this.confirmResizeEvent_, 500));

        // keep?
        EventDispatcher.on('appresize', function() {

            this.loadViz();

        }, this);

        // Manually trigger a resize to kick things off
        $(window).trigger('resize');
        
    }

    AppController.prototype.confirmResizeEvent_ = function() {

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

    }

    AppController.prototype.getData = function() {

        return Datastore.fetch();

    }

    AppController.prototype.startRouter = function() {

        Backbone.history.start();

    }

    AppController.prototype.getRouterSettings = function() {

        return (this.router && this.router.settings) || {};

    }

    // Load can happen when browser resized, user interaction, and initial page load
    AppController.prototype.loadViz = function() {

        var path = ModuleManager.getVizPath();

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