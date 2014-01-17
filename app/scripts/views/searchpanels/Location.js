define([

    'datastore'

    , 'searchpanels/base'

    , 'eventdispatcher'

], function(Datastore, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'Location',

        initialize: function() {

            Base.prototype.initialize.call(this);

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = _.first(map.selectedLocations), //map.locationDetails,

                json = Datastore.JSON.location(location);

            return { data: json };

        }

    });

});
