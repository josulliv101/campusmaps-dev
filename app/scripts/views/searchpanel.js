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

            this.$el.attr({ tabindex: 0, role: 'presentation' }).addClass('in-queue');

            return this;
        },

        show: function() {

            if (this.$el.hasClass('bounceInDown')) {
                this.$el.removeClass('animated bounceInDown');
                this.$el.addClass('animated slideOutUp');
            }
            else {
                this.$el.removeClass('animated slideOutUp');
                this.$el.addClass('animated bounceInDown');

            }

        }

    });

    return SearchPanelView;

});
