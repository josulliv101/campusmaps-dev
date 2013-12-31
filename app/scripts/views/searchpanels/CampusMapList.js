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

            _.bindAll(this, 'handleOpenPreState');

            this.handleStateChange = _.dispatch(this.handleOpenPreState);

            this.listenTo(this.model, 'change:state', this.handleStateChange);

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                json = Datastore.JSON.campus(campus);

            console.log('CampusMapList json', campus, json);

            return { data: json };

        },

        handleOpenPreState: function() {

            var state = this.model.get('state');

            if (state !== 'openPre') return;

            this.render();

        }

    });

});
