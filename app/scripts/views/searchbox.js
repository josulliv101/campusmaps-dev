define([

    'jquery',

    '_mixins',

    'backbone',

    'templates',

    'animation', // Control appropriate animation to use in config via browser feature detection

    'datastore',

    'eventdispatcher'

], function($, _, Backbone, JST, Animation, Datastore, EventDispatcher) {

    'use strict';

    var SearchboxView = Backbone.View.extend({

        events: {

            'click .btn.search': 'handleBtnClick',

            'submit form': 'handleBtnClick',

            //'click .btn.full': 'handleBtnExpandClick',

            'click #searchbox' : 'handleFocus',

            'focus #searchbox' : 'handleFocus',

            'blur #searchbox' : 'handleUnFocus',

            'keyup #searchbox': 'handleKeyPress',

            'keypress #searchbox': function(ev) {

                var loc = this.model.get('singleresult');
                
                if ( ev.which === 13 ) { 

                    ev.preventDefault();
debugger;
                    if (loc) EventDispatcher.trigger('truthupdate', { cmd: 'Location', details: _.getAttr(loc, 'locationid') });

                }

            }

        },

        className: 'searchbox',

        template: JST['app/scripts/templates/searchbox.ejs'],

        initialize: function() {

            var model = this.model;

            _.bindAll(this, 'getPanel', 'getCachedPanel', 'createPanel', 'closePanels', 'refresh', 'handleBtnClick', 'getSearchboxLabel', 'handleKeyPress');

            _.bindAll(Animation.prototype, 'open', 'isOpen_');

            this.cache = {};

            // Define dispatch fns for getPanel
            this.getPanel = _.dispatch(this.getCachedPanel, this.createPanel);

            this.listenTo(EventDispatcher, 'change:details', function(locationid) {

/*                var campus = Datastore.campus(),

                    map = Datastore.map(campus),

                    location = map.details;

                model.set({ name: !location ? '' : location.name }, { silent: true });

                this.refresh();
*/
            });

            this.listenTo(EventDispatcher, 'change:searchboxlabel', function(label) {

/*                var campus = Datastore.campus(),

                    map = Datastore.map(campus),
debugger;
                    location = map.details;
*/
                model.set({ name: !label ? '' : label }, { silent: true });

                this.refresh();

            });

            this.listenTo(EventDispatcher, 'change:detailsview', function(viewid) {

                var campus = Datastore.campus(),

                    map = Datastore.map(campus),

                    location = map.details;

                model.set({ view: !viewid ? '' : viewid }, { silent: true });

                this.refresh();

            });

            this.listenTo(EventDispatcher, 'change:singleresult', function(arg) {

                model.set({ singleresult: arg }, { silent: true });
debugger;
                if (arg) EventDispatcher.trigger('truthupdate', { latlng: _.getAttr(arg, 'latlng'), details: _.getAttr(arg, 'locationid') });

                //else EventDispatcher.trigger('truthupdate', { details: '' });

            });

        },

        getSearchboxLabel: function(view) {

            var title = view.title;

            if (title && _.isFunction(title)) return title();

            if (title && _.isString(title)) return title;

            return view.id || '';
        },

        refresh: function() {

            var $input = this.$el.find('#searchbox'),

                label = this.model.get('name'),

                campus = Datastore.campus(),

                campusname = _.getAttr(campus, 'name'),

                placeholder = 'Search the ' + campusname + ' Campus';

            if (!this.model.get('name') || this.model.get('name') === '') label = '';

            $input.val(label);

            // Use div so that any html entities get converted to real text
            $input.attr('placeholder', $('<div />').html(placeholder).text() || 'Search this campus');

            return this;

        },

        render: function() {

            

            this.$el.append(this.template({

                placeholder: ''

            }));

            this.$search = this.$('#ui-search');
            
            this.$panels = $('<div/>').attr({ id: 'panels', role: 'complementary' }).appendTo(this.$('#ui-search'));

            console.log('SearchboxView::init', this.$el, this.$panels);

            return this;

        },

        handleKeyPress: function(ev) {

            var $input = $(ev.currentTarget),

                val = $input.val(), model = this.model,

                singleresult = model.get('singleresult');



            console.log('handleKeyPress', val);

            EventDispatcher.trigger('truthupdate', { query: val });

            

        },

        handleFocus: function(ev) {

            console.log('handleFocus');

            EventDispatcher.trigger('truthupdate', { cmd: 'Results' });

        },

        handleUnFocus: function(ev) {

            console.log('handleUnFocus');

            //EventDispatcher.trigger('truthupdate', { cmd: '' });

        },

        handleBtnExpandClick: function(ev) {

            console.log('search btn clicked.');

            ev.preventDefault();

            EventDispatcher.trigger('truthupdate', { fullscreen: true });

        },

        handleBtnClick: function(ev) {

            console.log('search btn clicked.');

            ev.preventDefault();

            //alert('y');

            this.$el.focus();

            EventDispatcher.trigger('truthupdate', { cmd: '', details: '' });
            
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
