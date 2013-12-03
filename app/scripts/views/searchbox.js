define([

    'jquery',

    '_mixins',

    'backbone',

    'templates',

    '../controllers/searchboxController'

], function($, _, Backbone, JST, SearchboxController) {

    'use strict';

    var controller = new SearchboxController();

    var SearchboxView = Backbone.View.extend({

        events: {

            'click .btn': 'handleBtnClick' 

        },

        className: 'searchbox',

        template: JST['app/scripts/templates/searchbox.ejs'],

        initialize: function() {

            this.viewCache = {};

        },

        render: function() {

            this.$el.html(this.template({

                placeholder: 'Search this Campus'

            }));

            return this;
        },

        handleBtnClick: function(ev) {

            console.log('search btn clicked.');

            ev.preventDefault();
            
        },

        getPanelAndRender: function() {},

        showPanels: function() {},

        closePanels: function() {}

    });

    return SearchboxView;

});
