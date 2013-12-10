define([

    'jquery',

    '_mixins',

    'backbone',

    'templates'

], function($, _, Backbone, JST) {

    'use strict';

    var SearchPanelPanelAView = Backbone.View.extend({

        template: JST['app/scripts/templates/searchpanels/panelA.ejs'],

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

    return SearchPanelPanelAView;

});
