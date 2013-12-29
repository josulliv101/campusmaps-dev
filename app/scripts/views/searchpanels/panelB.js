define([

    'jquery'

    , '_mixins'

    , 'backbone'

    , 'templates'

    , 'scripts/views/searchpanels/base'

], function($, _, Backbone, JST, Base) {

    'use strict';

    var SearchPanelPanelBView = Base.extend({

        template: JST['app/scripts/templates/searchpanels/panelB.ejs'],

/*        initialize: function() {

        },

        render: function() {

            console.log('searchpanel model', this.model.get);

            this.$el.html(this.template({


            }));

            this.$el.attr({ tabindex: 0, role: 'presentation' }).addClass('in-queue');

            return this;
        }*/

    });

    return SearchPanelPanelBView;

});
