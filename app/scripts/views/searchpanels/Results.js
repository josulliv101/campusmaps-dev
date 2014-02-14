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

        initiialize: function() {

            Base.prototype.initialize.call(this);

            this.title = function() { var t = this; debugger; return this.model.get('query'); };

        },


        template: JST['app/scripts/templates/searchpanels/Results.ejs'],

/*        toJSON: function() {

            var json = { query: 'ballou' };

            return { data: json };

        },*/

        getJSON: function() {

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                locations = Datastore.locations(map),

                q = this.model.get('query') || '',

                json = { query: q },

                results = [];

            if (q.length > 2) results = Filter.filter(q, locations, 'name')

            json.results = results;

            return { data: json };

        },

        handleOpenPreState: function() {

            var model = this.model, self = this;

            this.stopListening(EventDispatcher, 'change:query');

            this.listenTo(EventDispatcher, 'change:query', function(q) {

                console.log('change:query', q);

                model.set({ query: q }, { silent: true });

                self.render();

            });

            EventDispatcher.trigger('truthupdate', { query: '' });

            Base.prototype.handleOpenPreState.call(this);

        },

        handleClosePostState: function() {

            this.stopListening(EventDispatcher, 'change:query');

            Base.prototype.handleClosePostState.call(this);

        }

    });

    return ResultsView;

});
