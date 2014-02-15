define([

    'scripts/domManager'

    , 'datastore'

    , 'scripts/services/filter'

    , 'searchpanels/base'

    , 'eventdispatcher'


], function(DomManager, Datastore, Filter, Base, EventDispatcher) {

    'use strict';

    var ResultsView = Base.extend({

        id: 'results',

        title: function() {},

        events: {



        },

        initialize: function() {

            var model = this.model, self = this;

            Base.prototype.initialize.call(this);

            this.title = function() { return self.model.get('query'); };

            this.listenTo(EventDispatcher, 'change:query', function(q) {

                console.log('change:query', q);

                model.set({ query: q }, { silent: true });

                self.render();

            });

        },


        template: JST['app/scripts/templates/searchpanels/Results.ejs'],

        refresh: function() {

            var $q = this.$el.find('#q');

            $q.html(this.model.get('query') || '(start typing above)');

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                locations = Datastore.locations(map),

                q = this.model.get('query') || '<span class="label-light">(start typing above)</span>',

                json = { query: q },

                results = [];

            if (q.length > 1) results = Filter.filter(q, locations, 'tags')

            json.results = results;

            return { data: json };

        },

        handleOpenPreState: function() {
/*
            var model = this.model, self = this;

            this.stopListening(EventDispatcher, 'change:query');

            this.listenTo(EventDispatcher, 'change:query', function(q) {

                console.log('change:query', q);

                model.set({ query: q }, { silent: true });

                //self.render();

            });

            EventDispatcher.trigger('truthupdate', { query: '' });
*/
            Base.prototype.handleOpenPreState.call(this);

        },

        handleCloseState: function() {

            var state = this.model.get('state');
            
            if (state !== 'close') return;

            EventDispatcher.trigger('truthupdate', { query: '' });

        },

    });

    return ResultsView;

});
