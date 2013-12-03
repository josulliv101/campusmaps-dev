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

            return this;
        }

    });

    return SearchPanelView;

});
