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

            _.bindAll(this, 'handleOpenPreState');

            this.handleStateChange = _.dispatch(this.handleOpenPreState);

            this.listenTo(this.model, 'change:state', this.handleStateChange);

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                json = Datastore.JSON.campus(campus);

            _.extend(json, { map: _.find(json.maps, function(map) { return map.selected === true; })});

            console.log('LocationList json', campus, json);

            return { data: json };

        },

        handleOpenPreState: function() {

            var state = this.model.get('state');

            if (state !== 'openPre') return;

            this.render();

        },

        handleStateChange: null

    });

});
