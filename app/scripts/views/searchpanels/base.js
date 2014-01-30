define([

    'jquery',

    '_mixins',

    'backbone',

    'templates',

    'datastore',

    'eventdispatcher'

], function($, _, Backbone, JST, Datastore, EventDispatcher) {

    'use strict';

    var path, SearchPanelBaseView;


    path = 'app/scripts/templates/searchpanels/';

    SearchPanelBaseView = Backbone.View.extend({

        id: 'base',

        initialize: function() {

            var model = this.model, view = this;

            _.bindAll(this, 'getJSON', 'render', 'handleOpenState', 'handleCloseState', 'handleOpenPreState', 'doDeferredClick');

            if (!this.id) throw new Error('A search panel view requires an id.');

            this.template = JST[SearchPanelBaseView.path(this.id)];

            console.log('Datastore::campuses', Datastore.campuses);

            this.$el.attr({ tabindex: 0, role: 'presentation' }).addClass('panel-container');

            this.handleStateChange = _.dispatch(this.handleOpenState, this.handleCloseState, this.handleOpenPreState);

            this.listenTo(model, 'change:state', this.handleStateChange);

            this.$el.on('click', '[data-defer]', function(ev) {

                var data = $(this).data('defer');

                //Make data available for later, after panel close
                model.set({ deferredData: data });

                console.log('data-defer', data);

                // In case the element happens to be a link
                ev.preventDefault();

                view.listenTo(model, 'change:state', view.doDeferredClick);

            });

        },

        doDeferredClick: function(model, state) {
alert('doDeferredClick');
            var data = model.get('deferredData');

            if (_.isString(data) && state === 'close') {

                console.log('heard deferred state change', this.model, this.doDeferredClick);

                // Remove listener for the doDeferredClick handler only
                this.stopListening(this.model, 'change:state', this.doDeferredClick);

                // These will fisrt pass through the App Controller so the Truth can stay up-to-date
                EventDispatcher.trigger('truthupdate', _.stringToObject(data));

                // Clean up
                model.unset('deferredData', { silent: true })

            }

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

        handleOpenPreState: function() {

            var state = this.model.get('state');

            if (state !== 'openPre') return;

            this.render();

        },

        handleOpenState: function() {

            var state = this.model.get('state');

            if (state !== 'open') return;

            this.init = true;

            //this.listenTo(EventDispatcher, 'change:campus', this.refresh);

        },

        handleCloseState: function() {

            var state = this.model.get('state');
            
            if (state !== 'close') return;

            //this.stopListening(EventDispatcher, 'change:campus');

        },

        getJSON: function() {

            // Having data wrapper makes tesing for undefined easier in template
            return { data: {}};

        },

        state: function() {

            return this.model.get('state');

        }

    });

    SearchPanelBaseView.path = function(template) { return path + template + '.ejs'}

    return SearchPanelBaseView;

});

