define([

    'datastore'

    , 'searchpanels/base'

    , 'eventdispatcher'

], function(Datastore, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'CampusMapList',

        initialize: function() {

            Base.prototype.initialize.call(this);

            this.listenTo(EventDispatcher, 'change:campusmap', this.refresh);

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                json = Datastore.JSON.campus(campus);

            console.log('CampusMapList json', campus, json);

            return { data: json };

        },

        refresh: function () {

            var mapid, map = Datastore.map();

            if (!_.isObject(map)) return;

            mapid = '#' + map.get('mapid');

            // Remove existing active flag
            this.$('.active').removeClass('active');

            // Add it
            this.$(mapid).addClass('active');

        }

    });

});
