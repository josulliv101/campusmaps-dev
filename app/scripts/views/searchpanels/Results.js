define([

    'scripts/domManager'

    , 'datastore'

    , 'scripts/services/filter'

    , 'scripts/moduleManager'

    , 'searchpanels/base'

    , 'eventdispatcher'


], function(DomManager, Datastore, Filter, ModuleManager, Base, EventDispatcher) {

    'use strict';

    var ResultsView = Base.extend({

        id: 'results',

        title: function() { 

            return this.model.get('query');// || '< enter search term >'; 

        },

        events: {

            'click .location' : function(ev) {

                var locationid = $(ev.currentTarget).parent().attr('id');

                ev.preventDefault();

                //EventDispatcher.trigger('truthupdate', { details: locationid });

                this.refresh(locationid);

            }

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

            this.listenTo(EventDispatcher, 'change:querytype', function(qt) {

                console.log('change:query', qt);

                model.set({ querytype: qt }, { silent: true });

                self.render();

            });

        },


        template: JST['app/scripts/templates/searchpanels/Results.ejs'],

        refresh: function (locationid) {

            if (!_.isString(locationid)) return;

            // Remove existing active flag
            this.$('.active').removeClass('active');

            // Add it
            this.$('#' + locationid).addClass('active');

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                locations = Datastore.locations(map),

                showFirst = 10, q = this.model.get('query'),

                txt = q && !_.isEmpty(q) ? 'Searching the ' + _.getAttr(campus, 'name') + ' campus: <label>' + q + '</label>' : 'Enter a search term in the textbox above.',

                json = { query: txt },

                querytype = this.model.get('querytype') || '',

                results = [], tags = [], tagsAll = _.chain(Datastore.tags(map)).map(function(val, key) { return { key: key, val: val }; }).value();//, tagsKeys = _.chain(tagsAll).keys().sortBy().value();

            

            if (!q) q = '';

            if (q.indexOf('#') === 0) {
                
                q = q.substring(1);

            }

            if (q && q.length > 0) results = _.chain(querytype === 'tag' ? Filter.filter(q, locations, 'tags') : Filter.filter(q, locations, 'name'))

                                              .sortBy(function(loc) { return loc && _.getAttr(loc, 'emphasis'); })

                                              .map(function(loc) { return loc && loc.toJSON ? loc.toJSON() : loc; })

                                              .reverse()

                                              //.first(8)

                                              .value();

            if (q && q.length > 0) tags = _.first(Filter.filter(q.toLowerCase(), tagsAll, 'key'), 5);

            json.tags = tags;

            json.campusname = _.getAttr(campus, 'name');

            json.totalresults = results.length;

            _.each(results, function(loc) { if (_.isString(loc.latlng)) loc.latlng = loc.latlng.replace(',', '|'); });

            json.results = _.chain(results).first(showFirst).sortBy('name').value();

            json.resultsLabel = results.length === json.results.length ? 'Total results: ' + results.length : 'Showing: ' + json.results.length + ' of ' + results.length + ' results'

            if (json.results.length === 0) json.resultsLabel = '';

            this.model.set({ singleresult: null }, { silent: true });

            if (json.results.length === 1) {

                json.results[0].selected = true;

                json.helpTxt = 'Press [Enter] or select the item below to view details.';

                EventDispatcher.trigger('truthupdate', { singleresult: json.results[0] });
            } else {

                EventDispatcher.trigger('truthupdate', { singleresult: '' });

            }

            json.showingtotal = results.length;

            json.showtags = querytype !== 'tag';

            if (q && q.length > 0 && results.length === 0) json.hasQueryNoResults = true;

            if (_.isEmpty(q)) json.noQuery= true;

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

        }

    });

    return ResultsView;

});
