define([

    'datastore'

    , 'searchpanels/base'

    , 'scripts/domManager'

    , 'eventdispatcher'

], function(Datastore, Base, DomManager, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'Location',

        initialize: function() {

            //var model = this.model;

            Base.prototype.initialize.call(this);

            this.nav = _.sortBy([

                            { navid: 'details', order: 1, navlabel: 'Details' },

                            { navid: 'photo', order: 2, navlabel: 'Imagery' },

                            { navid: 'offices', order: 3, navlabel: 'Departments &amp; Offices' },

                            { navid: 'directions', order: 4, navlabel: 'Directions' }

                       ], 'order');

            this.listenTo(EventDispatcher, 'change:detailsview', function(panelid) {

                model.set('detailsview', panelid, { silent: true });

                this.refresh(panelid);

                //panelid === 'photo' ? this.showPanoramaMarkers() : this.hidePanoramaMarkers();

            });

        },

        showPanoramaMarkers: function(panoramas) {

            //console.log('showPanoramaMarkers', panoramas);

        },

        hidePanoramaMarkers: function() {

            console.log('hidePanoramaMarkers');

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details, //_.first(map.selectedLocations), //map.locationDetails,

                json = Datastore.JSON.location(location),

                viewid = this.model.get('detailsview') || _.first(this.nav).navid;

            location.detailsnav || (location.detailsnav = this.getNavModel(location, viewid));

            json.detailsview = this.model.get('detailsview') || 'details';

            json.nav = _.chain(location.detailsnav)

                        .each(function(item) { item.active = (item.navid === viewid ? 'active' : null); })

                        .value();
       
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

            var $el = this.$el, $panel, $nav, removeClasses, activePreviousId = this.model.get('activeprevious');

            panelid || (panelid = this.model.get('detailsview'));

            removeClasses = _.map(this.nav, function(item) { return 'active-' + item.navid; }).join(" ");

            $el.find('.content-container').removeClass(removeClasses);

            $el.find('.content-container').addClass('active-' + panelid);

            $el.find('.panel-content, .nav-details .nav-item').removeClass('active active-previous');

            $panel = $el.find('#' + panelid);

            $nav = $el.find('.nav-details .' + panelid);

            if (activePreviousId) {

                $el.find('#' + activePreviousId).addClass('active-previous');

            }

            Base.prototype.refresh.call(this);

            $panel.addClass('active');

            $nav.addClass('active');

        },

       handleOpenPreState: function() {

            var state = this.model.get('state'), refresh = this.refresh, render = this.render, 

                campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details,

                fnNext = this.getNextNavItem,

                model = this.model;

            // No listeners should be present, but just in case
            this.stopListening(EventDispatcher, 'change:details');

            this.stopListening(EventDispatcher, 'change:detailsview');

            this.stopListening(EventDispatcher, 'detailsview:increment');


            this.listenTo(EventDispatcher, 'change:details', function() {

                if (state !== 'open') return;

                EventDispatcher.trigger('cmd', { value: 'Location', forceClose: true });
                
                //render.call(this);

            });

            this.listenTo(EventDispatcher, 'change:detailsview', function(panelid) {

                var nav, active,

                    panoramas = panelid === 'photo' &&  !_.isEmpty(location.panoramas) ? location.panoramas : [];

                if (state !== 'open') return;

                nav = location.detailsnav;

                // Current active
                active = _.find(nav, function(item) { return item.active === 'active'; });

                nav.activePrevious = active;

                model.set('activeprevious', nav.activePrevious.navid);

                //EventDispatcher.trigger('truthupdate', { panoramas: panoramas });

                _.each(location.detailsnav, function(item) { item.active = (item.navid === panelid ? 'active' : null); })

                refresh.call(this, panelid);

                if (panelid === 'photo') {

                    _.delay(function() { EventDispatcher.trigger('truthupdate', { cmd: 'Location_Streetview' }); }, 200, {});

                } else {

                    EventDispatcher.trigger('truthupdate', { cmd: 'Location' });

                }

            });

            this.listenTo(EventDispatcher, 'detailsview:increment', function() {

                var nav, nextItem;

                if (state !== 'open') return;

                nav = location.detailsnav;

                nextItem = fnNext(nav);

                if (nextItem) EventDispatcher.trigger('truthupdate', { detailsview: nextItem.navid });

                console.log('detailsview:increment', location, nextItem);

            });

            Base.prototype.handleOpenPreState.call(this);

        },

        getNextNavItem: function(nav) {

            var active, indexActive;

            if (_.isEmpty(nav)) return;

            active = _.find(nav, function(item) { return item.active === 'active'; }) || _.first(nav);

            indexActive = _.indexOf(nav, active);

            return indexActive < nav.length-1 ? nav[++indexActive] : _.first(nav); 

        },

       handleClosePostState: function() {

            this.stopListening(EventDispatcher, 'change:details');

            this.stopListening(EventDispatcher, 'change:detailsview');

            this.stopListening(EventDispatcher, 'detailsview:increment');

            Base.prototype.handleClosePostState.call(this);

        }

    });

});
