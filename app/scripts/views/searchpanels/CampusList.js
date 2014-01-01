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

        },

        getJSON: function() {

            var json = { campuses: Datastore.JSON.campuses() };

            return { data: json };

        },

        refresh: function () {

            var campusid, campus = Datastore.campus();

            if (!_.isObject(campus)) return;

            campusid = '#' + campus.get('campusid');

            // Remove existing active flag
            this.$('.active').removeClass('active');

            // Add it
            this.$(campusid).addClass('active');

        },

       handleOpenPreState: function() {

            var state = this.model.get('state');

            if (state !== 'openPre') return;

            // Skips refresh the first time -- all should be in order from render
            if (this.init === true) this.refresh();

        }/* ,

        handleOpenState: function() {

            var state = this.model.get('state');

            if (state !== 'open') return;

            this.listenTo(EventDispatcher, 'change:campus', this.refresh);

        },

        handleCloseState: function() {

            var state = this.model.get('state');
            
            if (state !== 'close') return;

            this.stopListening(EventDispatcher, 'change:campus');

        },

        handleStateChange: null
*/
    });

});
