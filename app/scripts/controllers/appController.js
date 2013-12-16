define([

    'jquery'

    , 'underscore'

    , 'backbone'

    , 'scripts/router'

    , 'datastore'

    , 'eventdispatcher'

], function($, _, Backbone, Router, Datastore, EventDispatcher) {

    'use strict';

    function AppController(el) {

        _.bindAll(this, 'handleResize_');

        this.$root = $(el);

        // Width of root element. This may or may not fill entire device viewport.
        this.appWidth = 0;

        console.log('root width', this.$root.width(), this.$root.outerWidth());

        this.router;

        this.init_();

    }

    AppController.prototype.init_ = function() {

        this.router = Router.init();

        $(window).on('resize', _.debounce(this.handleResize_, 500));

        // keep?
        EventDispatcher.on('appresize', function() {

            alert('handleResize_');

        });

        // Manually trigger a resize to kick things off
        $(window).trigger('resize');
        
    }

    AppController.prototype.handleResize_ = function() {

        // Only care about width changes
        var currentWidth = this.$root.outerWidth();

        // Guard against 'non-real' resize events by checking width (old IE triggers them on scrolling)
        if (currentWidth !== this.appWidth) {

            console.log('comparea', currentWidth, this.appWidth);

            this.appWidth = currentWidth;

            console.log('compareb', currentWidth, this.appWidth);

            // An application-level resize event. Give views an opportunity to listen and react if needed.
            EventDispatcher.trigger('appresize');

        }

    }

    AppController.prototype.getData = function() {

        return Datastore.fetch();

    }

    AppController.prototype.processRoute = function() {

        console.log('processing route');

        Backbone.history.start();

    }

    return AppController;

});