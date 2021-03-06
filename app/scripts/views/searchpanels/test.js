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

        className: '',

        template: JST['app/scripts/templates/searchpanels/test.ejs'],

        initialize: function() {

        },

        render: function() {

            console.log('searchpanel model', this.model.get);

            this.$el.html(this.template({


            }));

            this.$el.attr({ tabindex: 0, role: 'presentation' }).addClass('in-queue');

            return this;
        }

    });

    return SearchPanelView;

});
