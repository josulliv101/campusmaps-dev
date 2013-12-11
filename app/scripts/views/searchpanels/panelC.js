define([

    'jquery',

    '_mixins',

    'backbone',

    'templates'

], function($, _, Backbone, JST) {

    'use strict';

    var SearchPanelPanelCView = Backbone.View.extend({

        template: JST['app/scripts/templates/searchpanels/panelC.ejs'],

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

    return SearchPanelPanelCView;

});