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

        },

       handleOpenPreState: function() {

            var state = this.model.get('state');

            this.stopListening(EventDispatcher, 'change:locationid');

            this.listenTo(EventDispatcher, 'change:locationid', function() {

                if (state !== 'open') return;

                //alert('heard change locids');

                EventDispatcher.trigger('cmd', { value: 'Location', forceClose: true });

            });

            Base.prototype.handleOpenPreState.call(this);

        },

       handleClosePostState: function() {

            this.stopListening(EventDispatcher, 'change:locationid');

            Base.prototype.handleClosePostState.call(this);

        }

    });

});
