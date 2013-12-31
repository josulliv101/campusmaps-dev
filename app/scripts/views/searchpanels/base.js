define([

    'jquery',

    '_mixins',

    'backbone',

    'templates',

    'datastore'

], function($, _, Backbone, JST, Datastore) {

    'use strict';

    var path, SearchPanelBaseView;


    path = 'app/scripts/templates/searchpanels/';

    SearchPanelBaseView = Backbone.View.extend({

        id: 'base',

        initialize: function() {

            _.bindAll(this, 'render');

            if (!this.id) throw new Error('A search panel view requires an id.');

            this.template = JST[SearchPanelBaseView.path(this.id)];

            console.log('Datastore::campuses', Datastore.campuses);

            this.$el.attr({ tabindex: 0, role: 'presentation' }).addClass('panel-container');

        },

        render: function() {

            var json = this.getJSON();

            console.log('searchpanel model', this.model.get);

            if (!this.template) return this;

            console.log('datastore json', json);

            this.$el.html(this.template(json));

            return this;
        },

        refresh: function() {},

        handleStateChange: function () {},

        getJSON: function() {

            // Having data wrapper makes tesing for undefined easier in template
            return { data: {}};

        }

    });

    SearchPanelBaseView.path = function(template) { return path + template + '.ejs'}

    return SearchPanelBaseView;

});

