define([

    'jquery',

    '_mixins',

    'backbone',

    'templates',

    'eventdispatcher'

], function($, _, Backbone, JST, EventDispatcher) {

    'use strict';

    var LocationDetailsView = Backbone.View.extend({

        events: {

        },

        className: 'locationdetails',

        template: JST['app/scripts/templates/locationdetails.ejs'],

        initialize: function() {

            //_.bindAll(this, 'getPanel', 'getCachedPanel', 'createPanel', 'closePanels');

        },

        render: function() {

            this.$el.append(this.template({}));

            return this;

        }

    });

    return LocationDetailsView;

});
