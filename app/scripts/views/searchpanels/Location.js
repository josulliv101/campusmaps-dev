define([

    'datastore'

    , 'searchpanels/base'

    , 'scripts/domManager'

    , 'eventdispatcher'

], function(Datastore, Base, DomManager, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'Location',

        title: function() { 

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = Datastore.location(map, this.model.get('details'));

            return _.getAttr(location, 'name') || '..'; 

        },

        events: {

            'click .occupant' : 'handleOccupantClick'

        },

        initialize: function() {

            var departmentsoffices = 'Departments &amp; Offices',

                model = this.model;

            Base.prototype.initialize.call(this);

            _.bindAll(this, 'title');

            this.photowide = '';

            this.nav = _.sortBy([

                            { navid: 'details', order: 1, navlabel: 'Details' },

                            { navid: 'photo', order: 2, navlabel: 'Imagery' },

                            { navid: 'offices', order: 3, navlabel: departmentsoffices }

                       ], 'order');


            model.set('departmentsoffices', departmentsoffices, { silent: true });

            this.listenTo(EventDispatcher, 'change:detailsview', function(panelid) {

                model.set('detailsview', panelid, { silent: true });

                this.refresh(panelid);

            });

            this.listenTo(EventDispatcher, 'change:details', function(locationid) {

                var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details;

                model.set('label', locationid, { silent: true });

                //panelid === 'photo' ? this.showPanoramaMarkers() : this.hidePanoramaMarkers();

            });

        },

        handleOccupantClick: function(ev) {

            var $btn = $(ev.currentTarget),

                index = parseInt($btn.data('index')) || 0,

                occpuants = this.model.get('occupants');

            console.log('handleOccupantClick', occpuants[index]);

            if (_.isObject(occpuants[index])) {

                EventDispatcher.trigger('truthupdate', { occupant: occpuants[index] });

                EventDispatcher.trigger('truthupdate', { cmd: 'Location_Occupants', detailsview: 'offices' });

            }

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

                label = this.model.get('departmentsoffices'),

                location = map.details, //_.first(map.selectedLocations), //map.locationDetails,

                json = Datastore.JSON.location(location),

                officesItem = this.getNavItemById(this.nav, 'offices'),

                viewid = this.model.get('detailsview') || _.first(this.nav).navid;

            if (json.occupants) json.occupants = _.sortBy(json.occupants, 'name');

            location.detailsnav || (location.detailsnav = this.getNavModel(location, viewid));

            json.detailsview = this.model.get('detailsview') || 'details';

            json.nav = _.chain(location.detailsnav)

                        .each(function(item) { item.active = (item.navid === viewid ? 'active' : null); })

                        .each(function(item) { 

                            if (item.navid === 'offices') {

                                item.navlabel = label + ' (' + json.occupants.length + ')';

                            }

                        })

                        .value();

            

            //if (_.size(json.occupants) > 0) officesItem.navlabel = officesItem.navlabel + " (<span class='total-occupants'>" + _.size(occupants)+ "</span>)";

            
            this.model.set({ occupants: json.occupants }, { silent: true });

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

            
            return nav;

        },

        getNavItemById: function(nav, id) {

            return _.find(nav, function(item) { return item.navid === id; });

        },

        refreshPhotoWide: function (url) {

            var $el = this.$el;

            url || (url = this.photowide !== '' ? this.photowide : $el.find('#photowide').data('photowide'));

            $el.find('#photowide').attr('src', url);

        },

        refresh: function (panelid) {

            var $el = this.$el, $panel, $nav, removeClasses, activePreviousId = this.model.get('activeprevious');

            panelid || (panelid = this.model.get('detailsview'));

            removeClasses = _.map(this.nav, function(item) { return 'active-' + item.navid + ' card-' + item.navid; }).join(" ");

            $el.find('.content-container,.card').removeClass(removeClasses);

            $el.find('.content-container').addClass('active-' + panelid);

            $el.find('.card').addClass('card-' + panelid);

            $el.find('.panel-content, .nav-details .nav-item').removeClass('active active-previous');

            $panel = $el.find('#' + panelid);

            $el.find('.total-occupants').html('hello');

            $nav = $el.find('.nav-details .' + panelid);

            if (activePreviousId) {

                $el.find('#' + activePreviousId).addClass('active-previous');

            }

            if (panelid === 'offices') {

                $panel.scrollTop(0);

                console.log('$panel', $panel);
            }

            Base.prototype.refresh.call(this);

            $panel.addClass('active');

            $nav.addClass('active');


        },

       handleOpenPreState: function() {

            var state = this.model.get('state'), refresh = this.refresh, render = this.render, refreshPhotoWide = this.refreshPhotoWide,

                campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details,

                fnNext = this.getNextNavItem,

                model = this.model, photowide = this.photowide;

            // No listeners should be present, but just in case
            this.stopListening(EventDispatcher, 'change:details');

            this.stopListening(EventDispatcher, 'change:detailsview');

            this.stopListening(EventDispatcher, 'change:photowide');

            this.stopListening(EventDispatcher, 'detailsview:increment');


            this.listenTo(EventDispatcher, 'change:details', function() {

                if (state !== 'open') return;

                EventDispatcher.trigger('cmd', { value: 'Location', forceClose: true });
                
                //render.call(this);

            });

            this.listenTo(EventDispatcher, 'change:photowide', function(url) {

                var url;

                if (state !== 'open') return;

                url = decodeURIComponent(url);

                console.log('photowide', url); // decode at router

                refreshPhotoWide.call(this, url);

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

                if (nextItem) EventDispatcher.trigger('truthupdate', { detailsview: nextItem.navid, cmd: 'Location' });

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

            this.stopListening(EventDispatcher, 'change:photowide');

            this.stopListening(EventDispatcher, 'detailsview:increment');

            Base.prototype.handleClosePostState.call(this);

        }

    });

});
