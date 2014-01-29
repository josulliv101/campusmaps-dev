define([

    'datastore'

    , 'searchpanels/base'

    , 'eventdispatcher'

    , 'async!http://maps.google.com/maps/api/js?sensor=false'

], function(Datastore, Base, EventDispatcher) {

    'use strict';

    var StreetviewView = Base.extend({

        id: 'Streetview',

        events: {

            'click .btn-streetview' : function(ev) {
    
                var campus = Datastore.campus(),

                    map = Datastore.map(campus),

                    location = map.details,

                    panoramas = !_.isEmpty(location.panoramas) ? location.panoramas : [];

                if (panoramas) EventDispatcher.trigger('truthupdate', { panoramas: panoramas });

            },


            'click .btn-satellite' : function(ev) {

                var campus = Datastore.campus(),

                    map = Datastore.map(campus),

                    location = map.details,

                    mapOptions = {

                        center: location.position,

                        zoom: 18,

                        mapTypeId: google.maps.MapTypeId.SATELLITE

                    };

                EventDispatcher.trigger('truthupdate', { satellite: true });

                map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);

                map.setTilt(45);

                google.maps.event.trigger(map, 'resize');

            }

        },

        template: JST['app/scripts/templates/searchpanels/Streetview.ejs'],

    });

    return StreetviewView;

});
