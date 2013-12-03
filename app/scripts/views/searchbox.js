define([

    'jquery',

    '_mixins',

    'backbone',

    'templates',

    'eventdispatcher'

], function($, _, Backbone, JST, EventDispatcher) {

    'use strict';

    var SearchboxView = Backbone.View.extend({

        events: {

            'click .btn': 'handleBtnClick' 

        },

        className: 'searchbox',

        template: JST['app/scripts/templates/searchbox.ejs'],

        initialize: function() {

            _.bindAll(this, 'getPanel', 'getCachedPanel', 'createPanel');

            this.cache = {};

            // Define dispatch fns for getPanel
            this.getPanel = _.dispatch(this.getCachedPanel, this.createPanel);

        },

        render: function() {

            this.$el.html(this.template({

                placeholder: 'Search this Campus'

            }));

            this.$panels = $('<div/>').attr({ id: 'panels', role: 'complementary' }).appendTo(this.$el);

            console.log('SearchboxView::init', this.$el, this.$panels);

            return this;

        },

        handleBtnClick: function(ev) {

            console.log('search btn clicked.');

            ev.preventDefault();

            EventDispatcher.trigger('cmd', 'mycommand', { yo: 'hi' });
            
        },

        showPanels: function() {},

        closePanels: function() {},

        createPanel: function(panelid, viewConstructor) {

            var model, view;

            console.log('createPanel panel...', panelid, viewConstructor);

            if (!_.exists(panelid) || !_.exists(viewConstructor) || !_.isFunction(viewConstructor)) return;

            model = new Backbone.Model({ state: 'created' });

            view = new viewConstructor({ id: panelid, model: model });

            console.log('fresh panel', view);

            view.render().$el.appendTo(this.$panels);

            return this.cachePanel(view);
 
        },

        getCachedPanel: function(panelid, viewConstructor) {

            console.log('getting cached panel...a', panelid, viewConstructor);

            if (!_.exists(panelid) || !_.has(this.cache, panelid)) return;

            console.log('getting cached panel...b', panelid, viewConstructor);

            return this.cache[panelid];

        },

        // Defined in init -- uses _.dispatch
        getPanel: function(panelid, viewConstructor) {},

        cachePanel: function(panel) {

            if (!_.exists(panel) || !_.exists(panel.id)) return;

            this.cache[panel.id] = panel;

            return panel;
        }

    });

    return SearchboxView;

});
