define([

    'datastore'

    , 'searchpanels/base'

    , 'eventdispatcher'

], function(Datastore, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'Location',

        initialize: function() {

            //var model = this.model;

            Base.prototype.initialize.call(this);

            this.listenTo(EventDispatcher, 'change:detailsview', function(panelid) {

                model.set('detailsview', panelid, { silent: true });

            });

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details, //_.first(map.selectedLocations), //map.locationDetails,

                json = Datastore.JSON.location(location);

            json.detailsview = this.model.get('detailsview') || 'details';

            return { data: json };

        },

        refresh: function (panelid) {

            var $el = this.$el, $panel = $el.find('#' + panelid);

            panelid || (panelid = this.model.get('detailsview'));

            $el.find('.panel-content').removeClass('active');

            Base.prototype.refresh.call(this);

            $panel.addClass('active');

        },

       handleOpenPreState: function() {

            var state = this.model.get('state'), refresh = this.refresh, render = this.render;

            this.stopListening(EventDispatcher, 'change:details');

            this.stopListening(EventDispatcher, 'change:detailsview');

            this.listenTo(EventDispatcher, 'change:details', function() {

                if (state !== 'open') return;

                EventDispatcher.trigger('cmd', { value: 'Location', forceClose: true });
                
                //render.call(this);

            });

            this.listenTo(EventDispatcher, 'change:detailsview', function(panelid) {

                if (state !== 'open') return;

                refresh.call(this, panelid);

            });

            Base.prototype.handleOpenPreState.call(this);

        },

       handleClosePostState: function() {

            this.stopListening(EventDispatcher, 'change:details');

            this.stopListening(EventDispatcher, 'change:detailsview');

            Base.prototype.handleClosePostState.call(this);

        }

    });

});
