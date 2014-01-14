define([

    '_mixins'

    , 'templates'

    , 'datastore'

    , 'searchpanels/base'

    , 'eventdispatcher'

], function(_, JST, Datastore, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'CampusList',

        initialize: function() {

            Base.prototype.initialize.call(this);

            this.listenTo(EventDispatcher, 'change:campus', this.refresh);

        },

        getJSON: function() {

            var json = { campuses: Datastore.JSON.campuses() },

            campuses = Datastore.campusList();

            return { data: json };

        },

        refresh: function (campusid) {

            if (!_.isString(campusid)) return;

            // Remove existing active flag
            this.$('.active').removeClass('active');

            // Add it
            this.$('#' + campusid).addClass('active');

        },

       // Refresh before opening in case the campus changed since last display
       handleOpenPreState: function() {

            var state = this.model.get('state');

            if (state !== 'openPre') return;

            // Skips refresh the first time -- all should be in order from render
            if (this.init === true) this.refresh();

        }
    });

});
