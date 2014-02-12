define([

    'datastore'

    , 'searchpanels/base'

    , 'eventdispatcher'

], function(Datastore, Base, EventDispatcher) {

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

            Base.prototype.initialize.call(this);

            this.listenTo(EventDispatcher, 'change:locationid', this.refresh);

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                json = Datastore.JSON.campus(campus);

            _.extend(json, { map: _.find(json.maps, function(map) { return map.selected === true; })});

            if (!json.map || !json.map.locations) return { data: {}};

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
