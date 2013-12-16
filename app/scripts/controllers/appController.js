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

        _.bindAll(this, 'confirmResizeEvent_', 'loadViz');

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