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

        refresh: function (mapid) {

            if (!_.isString(mapid)) return;

            // Remove existing active flag
            this.$('.active').removeClass('active');

            // Add it
            this.$('#' + mapid).addClass('active');

        }

    });

});
