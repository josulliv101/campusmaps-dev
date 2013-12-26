define([

    'jquery',

    '_mixins',

    'backbone',

    'templates',

    'animationCSS', // Control appropriate animation to use in config via browser feature detection

    'eventdispatcher'

], function($, _, Backbone, JST, Animation, EventDispatcher) {

    'use strict';

    var SearchboxView = Backbone.View.extend({

        events: {

            'click .btn.search': 'handleBtnClick',

            'click .btn.full': 'handleBtnExpandClick' 

        },

        className: 'searchbox',

        template: JST['app/scripts/templates/searchbox.ejs'],

        initialize: function() {

            _.bindAll(this, 'getPanel', 'getCachedPanel', 'createPanel', 'closePanels');

            _.bindAll(Animation.prototype, 'open', 'isOpen_');

            this.cache = {};

            // Define dispatch fns for getPanel
            this.getPanel = _.dispatch(this.getCachedPanel, this.createPanel);

        },

        render: function() {

            this.$el.append(this.template({

                placeholder: 'Search this Campus'

            }));

            this.$panels = $('<div/>').attr({ id: 'panels', role: 'complementary' }).appendTo(this.$('#ui-search'));

            console.log('SearchboxView::init', this.$el, this.$panels);

            return this;

        },

        handleBtnExpandClick: function(ev) {

            console.log('search btn clicked.');

            ev.preventDefault();

            EventDispatcher.trigger('truthupdate', { fullscreen: true });

        },

        handleBtnClick: function(ev) {

            console.log('search btn clicked.');

            ev.preventDefault();

            //alert('btn');

            //EventDispatcher.trigger('truthupdate', { vizpath: 'directory' });

            if ($('#panelA').length === 0) {

                EventDispatcher.trigger('truthupdate', { cmd: 'panelA' });

                return;

            }

            if ($('#panelA').css('display') === 'none') 

                EventDispatcher.trigger('truthupdate', { cmd: 'panelA' });

            else 

                EventDispatcher.trigger('truthupdate', { cmd: 'panelB' });
            
        },

        open: Animation.prototype.open,

        close: Animation.prototype.close,

        closePanels: function() {

            var dfds = _.map(this.cache, function(val, key) { 

                console.log('closePanels', val, key);

                return Animation.prototype.close(val);

            }) || [];

            console.log('dfds', dfds);

            return dfds;
        },

        createPanel: function(panelid, ViewConstructor) {

            var model, view;

            console.log('createPanel panel...', panelid, ViewConstructor);

            if (!_.exists(panelid) || !_.exists(ViewConstructor) || !_.isFunction(ViewConstructor)) return;

            model = new Backbone.Model({ state: 'close' });

            view = new ViewConstructor({ id: panelid, model: model });

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
        getPanel: function() {},

        cachePanel: function(panel) {

            if (!_.exists(panel) || !_.exists(panel.id)) return;

            this.cache[panel.id] = panel;

            return panel;
        }

    });

    return SearchboxView;

});
