define([

    'datastore'

    , 'searchpanels/base'

    , 'eventdispatcher'

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

            }

        },

        template: JST['app/scripts/templates/searchpanels/Streetview.ejs'],

    });

    return StreetviewView;

});
