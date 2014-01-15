define([

    'datastore'

    , 'searchpanels/base'

    , 'eventdispatcher'

], function(Datastore, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'LocationList',

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
debugger;
            if (!_.isString(locationid)) return;

            // Remove existing active flag
            this.$('.active').removeClass('active');

            // Add it
            this.$('#' + locationid).addClass('active');

        }

    });

});
