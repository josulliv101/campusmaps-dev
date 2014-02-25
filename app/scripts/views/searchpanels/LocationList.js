define([

    'datastore'

    , 'scripts/services/filter'

    , 'searchpanels/base'

    , 'eventdispatcher'

], function(Datastore, Filter, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'LocationList',

        title: 'All Buildings',

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

/*                var locationid = $(ev.currentTarget).parent().attr('id');

                ev.preventDefault();

                if (this.id !== 'LocationList') return;

                EventDispatcher.trigger('truthupdate', { focus: locationid });

                this.refresh(locationid);*/

            }

        },

        initialize: function() {

            var model = this.model, self = this;

            Base.prototype.initialize.call(this);

            this.listenTo(EventDispatcher, 'change:locationid', this.refresh);

            this.listenTo(EventDispatcher, 'change:focus', this.refresh);

            this.listenTo(EventDispatcher, 'change:locationlistfilter', function(filter) {

                model.set({ filter: filter }, { silent: true });

                self.render();

            });

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                json = Datastore.JSON.campus(campus),

                filter = this.model.get('filter') || '',

                fnFirstLetterMatch= function(loc) { var name = _.getAttr(loc, 'name'); return name && name.toLowerCase().indexOf(Filter.getQuery().term) === 0; };

            _.extend(json, { map: _.find(json.maps, function(map) { return map.selected === true; })});

            if (!json.map || !json.map.locations) return { data: {}};

            if (filter && filter.length === 1) json.map.locations = Filter.filter(filter, json.map.locations, [ fnFirstLetterMatch ]);

            else if (filter && filter.indexOf('#') === 0) json.map.locations = Filter.filter(filter.substring(1), json.map.locations, 'tags');

            // Sort the locations
            json.map.locations = _.sortBy(json.map.locations, function(loc){ return _.getAttr(loc, 'name'); });

            _.each(json.map.locations, function(loc) { loc.latlng = loc.latlng.replace(',', '|'); });

            if (filter.length === 1) json.classname =  'abc';

            else if (filter && filter.indexOf('#') === 0)  json.classname = filter.substring(1);

            else json.classname = filter;

            console.log('LocationList json', campus, json);

            console.log('LocationList maps', Datastore.mapList());

            return { data: json };

        },

/*        render: function() {

            Base.prototype.render.call(this);

            if (this.$el.find('.abc').length > 0) this.$el.find('#nav-abc').fadeIn(300);

            return this;

        },*/

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
