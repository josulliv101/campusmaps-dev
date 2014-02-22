define([

    'datastore'

    , 'scripts/services/filter'

    , 'searchpanels/base'

    , 'eventdispatcher'

], function(Datastore, Filter, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'LocationList',

        events: {

            'mouseover .list li' : function(ev) {

                var target = ev.currentTarget;

                if (!(target && target.id)) return;

                EventDispatcher.trigger('truthupdate', { highlight: target.id });

            },

            'focusin .list li' : function(ev) {

                var target = ev.currentTarget;

                if (!(target && target.id)) return;

                EventDispatcher.trigger('truthupdate', { highlight: target.id });

            },

            'mouseout .list li' : function(ev) {

                //EventDispatcher.trigger('truthupdate', { highlight: '' });

            },

            'click .location' : function(ev) {

                var locationid = $(ev.currentTarget).parent().attr('id');

                ev.preventDefault();

                EventDispatcher.trigger('truthupdate', { details: locationid });

                this.refresh(locationid);

            }

        },

        initialize: function() {

            var model = this.model, self = this;

            Base.prototype.initialize.call(this);

            this.listenTo(EventDispatcher, 'change:locationid', this.refresh);

            this.listenTo(EventDispatcher, 'change:locationlistfilter', function(letter) {

                model.set({ filter: letter }, { silent: true });

                self.render();

            });

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                json = Datastore.JSON.campus(campus),

                filter = this.model.get('filter') || '',

                fnFirstLetterMatch= function(loc) { var name = _.getAttr(loc, 'name'); return name && name.toLowerCase().indexOf(Filter.getQuery().term) === 0; };
debugger;
            _.extend(json, { map: _.find(json.maps, function(map) { return map.selected === true; })});

            if (!json.map || !json.map.locations) return { data: {}};

            if (filter && filter.length === 1) json.map.locations = Filter.filter(filter, json.map.locations, [ fnFirstLetterMatch ]);

            else if (filter && filter.indexOf('#') === 0) json.map.locations = Filter.filter(filter.substring(1), json.map.locations, 'tags');

            // Sort the locations
            json.map.locations = _.sortBy(json.map.locations, function(loc){ return _.getAttr(loc, 'name'); });

            console.log('LocationList json', campus, json);

            console.log('LocationList maps', Datastore.mapList());

            return { data: json };

        },

        refresh: function (locationid) {

            if (!_.isString(locationid)) return;

            // Remove existing active flag
            this.$('.active').removeClass('active');

            // Add it
            this.$('#' + locationid).addClass('active');

        },

        handleOpenPreState: function() {

            //EventDispatcher.trigger('truthupdate', { mapcenteroffset: { x: 120, y: -150 }});

            Base.prototype.handleOpenPreState.call(this);

        },

        handleCloseState: function() {

            //EventDispatcher.trigger('truthupdate', { mapcenteroffset: { x: 0, y: 0 }});

            Base.prototype.handleCloseState.call(this);

        }

    });

});
