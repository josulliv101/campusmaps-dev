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

  /*          _.bindAll(this, 'handleOpenPreState');

            this.handleStateChange = _.dispatch(this.handleOpenPreState);

            this.listenTo(this.model, 'change:state', this.handleStateChange);
*/
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

        }/*,

        handleOpenPreState: function() {

            var state = this.model.get('state');

            if (state !== 'openPre') return;

            this.render();

        }*/

    });

});
