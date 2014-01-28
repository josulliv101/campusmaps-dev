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

            this.nav = [

                            { navid: 'details', order: 1, navlabel: 'Details' },

                            { navid: 'photo', order: 2, navlabel: 'Photo' },

                            { navid: 'offices', order: 3, navlabel: 'Departments &amp; Offices' },

                            { navid: 'directions', order: 4, navlabel: 'Directions' }

                       ];

            this.listenTo(EventDispatcher, 'change:detailsview', function(panelid) {

                model.set('detailsview', panelid, { silent: true });

                this.refresh(panelid);

            });

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details, //_.first(map.selectedLocations), //map.locationDetails,

                json = Datastore.JSON.location(location),

                viewid = this.model.get('detailsview') || _.find(this.nav, function(item) { return item.order === 1; }).navid;

            location.detailsnav || (location.detailsnav = this.getNavModel(location, viewid));

            json.detailsview = this.model.get('detailsview') || 'details';

            json.nav = _.chain(location.detailsnav)

                        .each(function(item) { item.active = (item.navid === viewid ? 'active' : null); })

                        .value();
                 debugger;       
            return { data: json };

        },

        getNavModel: function (loc, viewid) {

            var nav = _.clone(this.nav),

                occupants = loc.occupants,

                urlphoto = loc.urlphoto,

                officesItem = this.getNavItemById(nav, 'offices');

            // Hide the offices item if none
            if (!occupants || _.size(occupants) === 0)  nav = _.without(nav, officesItem);

            if (!urlphoto || urlphoto === '')  nav = _.without(nav, this.getNavItemById(nav, 'photo'));

            if (_.size(occupants) > 0) officesItem.navlabel = officesItem.navlabel.replace(/\([0-9]+\)/, "") + " (" + _.size(occupants)+ ")";

            return nav;

        },

        getNavItemById: function(nav, id) {

            return _.find(nav, function(item) { return item.navid === id; });

        },

        refresh: function (panelid) {

            var $el = this.$el, $panel, $nav;

            panelid || (panelid = this.model.get('detailsview'));

            $el.find('.panel-content, .nav-details .nav-item').removeClass('active');

            $panel = $el.find('#' + panelid);

            $nav = $el.find('.nav-details .' + panelid);

            Base.prototype.refresh.call(this);

            $panel.addClass('active');

            $nav.addClass('active');

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
