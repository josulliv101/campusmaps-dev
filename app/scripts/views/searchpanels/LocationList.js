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
1
            this.listenTo(EventDispatcher, 'change:campus', this.render);

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                json = Datastore.JSON.campus(campus);

            _.extend(json, { map: _.find(json.maps, function(map) { return map.selected === true; })});
            
            console.log('LocationList json', campus, json);

            return { data: json };

        }

    });

});
