define([

    'jquery'

    , '_mixins'

    , 'backbone'

    , 'templates'

    , 'scripts/views/searchpanels/base'

], function($, _, Backbone, JST, Base) {

    'use strict';

    var SearchPanelPanelAView = Base.extend({

        template: JST['app/scripts/templates/searchpanels/panelA.ejs'],

        id: 'PanelA',

        title: function() { return 'This is Panel A'; },

/*        initialize: function() {

        },

        render: function() {

            console.log('searchpanel model', this.model.get);

            this.$el.html(this.template({


            }));

            return this;
        }
*/
    });

    return SearchPanelPanelAView;

});
