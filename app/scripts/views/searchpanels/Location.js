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

                location = map.locationDetails,

                json = Datastore.JSON.location(location);

            return { data: json };

        },

        handleCloseState: function() {

            var state = this.model.get('state');
            
            if (state !== 'close') return;

            //EventDispatcher.trigger('truthupdate', { locationid: '' });

        }

    });

});
