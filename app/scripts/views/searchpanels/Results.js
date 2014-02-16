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

        title: function() { 

            return this.model.get('query');// || '< enter search term >'; 

        },

        events: {



        },

        initialize: function() {

            var model = this.model, self = this;

            Base.prototype.initialize.call(this);

            _.bindAll(this, 'title');

            this.listenTo(EventDispatcher, 'change:query', function(q) {

                console.log('change:query', q);

                model.set({ query: q }, { silent: true });

                self.render();

            });

        },


        template: JST['app/scripts/templates/searchpanels/Results.ejs'],

        refresh: function() {

            var $q = this.$el.find('#q'), q = this.model.get('query');

            $q.html( q && !_.isEmpty(q) || '(start typing above)');

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                locations = Datastore.locations(map),

                showFirst = 10, q = this.model.get('query'),

                txt = q && !_.isEmpty(q) ? 'Searching the ' + _.getAttr(campus, 'name') + ' campus: <label>' + q + '</label>' : 'Enter a search term in the textbox above.',

                json = { query: txt },

                results = [], tags = [], tagsAll = _.chain(Datastore.tags(map)).map(function(val, key) { return { key: key, val: val }; }).value();//, tagsKeys = _.chain(tagsAll).keys().sortBy().value();

            if (q && q.length > 0) results = _.chain(Filter.filter(q, locations, 'name'))

                                         .sortBy(function(loc) { return loc && loc.emphasis; })

                                         .reverse()

                                         //.first(8)

                                         .value();

                //_.first(, 8);

            if (q && q.length > 0) tags = _.first(Filter.filter(q.toLowerCase(), tagsAll, 'key'), 5);

            json.tags = tags;
debugger;
            json.campusname = _.getAttr(campus, 'name');

            json.totalresults = results.length;

            json.results = _.chain(results).first(showFirst).sortBy('name').value();

            json.resultsLabel = results.length === json.results.length ? 'Total results: ' + results.length : 'Showing: ' + json.results.length + ' of ' + results.length + ' results'

            if (json.results.length === 0) json.resultsLabel = '';

            json.showingtotal = results.length;

            

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
