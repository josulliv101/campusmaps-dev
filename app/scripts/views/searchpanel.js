define([

    'jquery',

    '_mixins',

    'backbone',

    'templates'

], function($, _, Backbone, JST) {

    'use strict';

    var SearchPanelView = Backbone.View.extend({

        events: {

        },

        className: 'searchpanel',

        template: JST['app/scripts/templates/searchpanel.ejs'],

        initialize: function() {

        },

        render: function() {

            this.$el.html(this.template({


            }));

            this.$el.attr({ role: 'presentation' }).addClass('in-queue');

            return this;
        },

        show: function() {

            this.$el.toggleClass('show');

        }

    });

    return SearchPanelView;

});
