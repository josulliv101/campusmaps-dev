define([

    'jquery',

    '_mixins',

    'backbone',

    'templates'

], function($, _, Backbone, JST) {

    'use strict';

    var SearchboxView = Backbone.View.extend({

        events: {

            'click .btn': 'handleBtnClick' 

        },

        className: 'searchbox',

        template: JST['app/scripts/templates/searchbox.ejs'],

        initialize: function(options) {

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
            
        }

    });

    return SearchboxView;

});
