define([

    'jquery',

    '_mixins',

    'backbone',

    'templates',

    'datastore'

], function($, _, Backbone, JST, Datastore) {

    'use strict';

    var SearchPanelPanelCView = Backbone.View.extend({

        template: JST['app/scripts/templates/searchpanels/panelC.ejs'],

        initialize: function() {

            console.log('Datastore::campuses', Datastore.campuses);

        },

        render: function() {

            console.log('searchpanel model', this.model.get);

            var json = this.getJSON();

console.log('datastore json', json);

            this.$el.html(this.template(json));

            this.$el.attr({ tabindex: 0, role: 'presentation' }).addClass('in-queue');

            return this;
        },

        getJSON: function() {

            return {

                campuses: Datastore.JSON.campuses(),

                test: 124

            };

        }

    });

    return SearchPanelPanelCView;

});
