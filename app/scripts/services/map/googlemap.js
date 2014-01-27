
define([

    'jquery',

    '_mixins',

    'mapstyles',

    'datastore',

    'scripts/services/map/LabelMapType',

    'scripts/services/map/MapUtils',

    'scripts/domManager',

    'eventdispatcher',

    'async!http://maps.google.com/maps/api/js?sensor=false'

], function($, _, MapStyles, Datastore, LabelMapType, MapUtils, DomManager, EventDispatcher) {

    'use strict';

    // google object is now available
    
    var gMap, getMarker;

    getMarker = _.memoize(getMarker_, function(model) { return _.getAttr(model, 'locationid'); });

    function init_(el, latlng, zoom) {    

        createMap_.apply(this, arguments);

    }

    function refresh_(latlng) {    

        gMap.panTo(getLatLng(latlng));

    }

    function setCenter_(latlng, offset, zoom) {    

        var ll = _.latLng(latlng), offsetLatLng;

        zoom || (zoom = gMap.getZoom());

        offset || (offset = { x: 0, y: 0 });

        if (!ll) return;

        ll = { lat: ll[0], lng: ll[1] };

        offsetLatLng = MapUtils.offsetLatLngByPixels(ll, zoom, offset);

        gMap.panTo(getLatLng(offsetLatLng));

    }

    function getLatLng(latlng) {

        var ll = _.isString(latlng) ? _.latLng(latlng) : latlng;

        return _.isArray(ll) ? new google.maps.LatLng(ll[0], ll[1]) : new google.maps.LatLng(ll.lat, ll.lng);

    }

    function refreshLabels_(models) {  

        console.log('refreshLabels_', models.length);

        var DM = DomManager.getInstance(), hasDetails;

        _.each(models, function(loc) {

            var offsetLatLng, $el, dimensions, southwestLatLng, northeastLatLng, bounds;

            if (!loc) return;

            $el = DM.refreshLabel(loc);

            if (loc.details !== true || !$el) return;

            offsetLatLng = MapUtils.offsetLatLngByPixels({ lat: _.latLng(loc.latlng)[0], lng: _.latLng(loc.latlng)[1] }, loc.zoom, { x: 16, y: 10 });

            dimensions = DM.getDimensions($el.find('.txt'));

            southwestLatLng = MapUtils.offsetLatLngByPixels(offsetLatLng, loc.zoom, { x: 0, y: -dimensions.height });

            northeastLatLng = MapUtils.offsetLatLngByPixels(offsetLatLng, loc.zoom, { x: -dimensions.width, y: 0 });

            hasDetails = true;

            bounds = new google.maps.LatLngBounds(getLatLng(southwestLatLng), getLatLng(northeastLatLng));

            gMap.clickRect.setBounds(bounds);

            //debugger;

/*            var dm = DomManager.getInstance(),

                $el = dm.refreshLabel(loc),

                offsetLatLng = MapUtils.offsetLatLngByPixels({ lat: _.latLng(loc.latlng)[0], lng: _.latLng(loc.latlng)[1] }, loc.zoom, { x: 16, y: 10 }),

                d, neLL, swLL, bounds;

            if (loc.details === true) {

                if (!$el) return;

                d = dm.getDimensions($el.find('.txt'));

                if (!d.width || !d.height) return;

                neLL = MapUtils.offsetLatLngByPixels(offsetLatLng, loc.zoom, { x: -d.width, y: 0 });

                swLL = MapUtils.offsetLatLngByPixels(offsetLatLng, loc.zoom, { x: 0, y: -d.height });


                if (gMap.eventRect) gMap.eventRect.setMap(null);

                gMap.eventRect = null;

                bounds = new google.maps.LatLngBounds(getLatLng(swLL), getLatLng(neLL));

                // Don't recreate rect
                gMap.eventRect = new google.maps.Rectangle({

                    strokeColor: '#FF0000',

                    strokeOpacity: 0.31,

                    strokeWeight: 0,

                    fillColor: '#6699cc',

                    fillOpacity: 0.16,

                    map: gMap,

                    bounds: bounds
                    
                });

                google.maps.event.addListener(gMap.eventRect, 'click', function() {

                    console.log('rect clicked');

                    EventDispatcher.trigger('truthupdate', { cmd: '' });

                });

            }*/

        });

        gMap.clickRect.setMap(hasDetails !== true ? null : gMap);

    }

    function refreshIcons_(models) { 

        console.log('refreshIcons_', models.length);

    }

    function refreshAll_(models) { 

        console.log('refreshAll_', models.length);

    }

    function renderLabels_(models) {

        console.log('renderLabels_', models.length);

        if (gMap.overlayMapTypes.length === 1) gMap.overlayMapTypes.removeAt(0);

        gMap.overlayMapTypes.insertAt(0, gMap.labelStrategy);    

    }

    function getMarker_(model) {

        var marker, icon = { 

            url: model.icon,  

            size: new google.maps.Size(16, 16),

            origin: new google.maps.Point(0,0),

            anchor: new google.maps.Point(8, 8)

        };

        //alert('creating marker');

        marker = _.extend(model, { icon: _.isString(model.icon) ? icon : null, visible: false, clickable: true, map: gMap, position: getLatLng(model.latlng) });

        return new google.maps.Marker(marker);

    }

    function renderIcons_(models) {

        _.each(models, getMarker);
/*
        var markers;

//return;

        console.log('renderIcons_', models.length);

        clear_();

        //gMap.markers = 

                    _.chain(models)

                        .reject(function(model) {

                            return model.icon === false;

                        })

                        .map(getMarker)

                        .each(function(marker) {

                            google.maps.event.addListener(marker, 'click', function() {

                                var locationid = _.getAttr(marker, 'locationid');

                                console.log('click', this);

                                DomManager.getInstance().$root.find('.label.active').removeClass('active fade-in shadow');


                                EventDispatcher.trigger('truthupdate', { details: locationid }); // locationid: locationid,

                            });

                            google.maps.event.addListener(marker, 'mouseover', function() {

                                //var selectedTileOffset = marker.tileCache[marker.zoom],

                                    //cache = MapUtils.getLocationsFromTileCache(selectedTileOffset.tile, marker.zoom);



                                //DomManager.getInstance().$root.find('.label.active').removeClass('active fade-in shadow');

                               //... refreshLabels_([marker]);

                                //_.each(hideMarkers, function(marker) { marker.setMap(null); });

                                //debugger;

                            });

                            google.maps.event.addListener(marker, 'mouseout', function() {

                                // DomManager.getInstance().$root.find('.label.active').removeClass('active fade-in shadow');

                                // refreshLabels_([]);

                                // _.each(gMap.markers, function(m) { 

                                //     if (!m.getMap()) m.setMap(gMap);

                                // })

                            });

                        })

                        .value();
*/
        return this;

    }

    function render_(models) {

        console.log('render_ (icons & labels)', models.length);

        //renderIcons_(models);

        //renderLabels_(models);

        return this;

    }

    function setCursor_(id) {

        gMap.setOptions({ draggableCursor: id });

    }

    function setZoom_(level) {

        level = parseInt(level);

        console.log('gmap setZoom_..', level);

        gMap.setZoom(level);/**/

    }

    function setMapType_(maptype) {

        console.log('gmap setMapType_..', maptype);

        gMap.setMapTypeId(maptype);

    }

    function clear_() {

        //alert(gMap.markers.length);

        _.each(gMap.markers, function(marker) { 

            google.maps.event.clearInstanceListeners(marker);

            marker.setMap(null);

            //marker = null; 

        });

    }

    function handleLatLng_(e, zoom) {

        var latlng, tileoffset, locs, locAtLatLng;

        latlng = e.latLng;

        tileoffset = MapUtils.latLngToTileOffset_({ lat: latlng.lat(), lng: latlng.lng() }, zoom);

        locs = MapUtils.getLocationsFromTileCache(tileoffset.tile, zoom);

        locAtLatLng = _.chain(locs)

                       .map(function(loc) { 

                          var latlng = loc.latlng;

                          return { locationid: loc.locationid, offset: MapUtils.latLngToTileOffset_({ lat: latlng[0], lng: latlng[1] }, zoom).offset };

                       })

                       .find(function(obj) {

                          return Math.abs(tileoffset.offset.x - obj.offset.x) < 12 && Math.abs(tileoffset.offset.y - obj.offset.y) < 12;

                       })

                       .value();

        return locAtLatLng;

    }

    function createMap_(el, latlng, zoom) {

        var thePanorama;

        gMap = new google.maps.Map(el, {

            center: new google.maps.LatLng(latlng[0], latlng[1]),

            zoom: zoom,

            styles: MapStyles.styles,

            mapTypeId: google.maps.MapTypeId.ROADMAP,

            navigationControl: true,

            navigationControlOptions: {

                style: google.maps.NavigationControlStyle.SMALL
                
            },

            panControl: false,

            zoomControl: false,

            mapTypeControl: false

        });

        gMap.clickRect = new google.maps.Rectangle({

            strokeColor: '#FF0000',

            strokeOpacity: 0.31,

            strokeWeight: 0,

            fillColor: '#6699cc',

            fillOpacity: 0.0,

            map: null,

            bounds: null
            
        });

        google.maps.event.addListener(gMap.clickRect, 'click', function() {

            console.log('rect clicked');

            EventDispatcher.trigger('truthupdate', { detailsview: '+' });

        });

        console.log('LabelMapType', LabelMapType);

        gMap.labelStrategy = new LabelMapType(new google.maps.Size(256, 256));

        gMap.overlayMapTypes.insertAt(0, gMap.labelStrategy);

        //gMap.markers = [];

        //thePanorama = gMap.getStreetView();

        //thePanorama.setOptions({

        //  addressControl: false

        //});

/*        google.maps.event.addListenerOnce(gMap, 'tilesloaded', function() {

            google.maps.event.addListener(thePanorama, 'visible_changed', function() {

                EventDispatcher.trigger('truthupdate', { streetview: thePanorama.getVisible() });

            });

            // Hack to give map keyboard focus
            //$("#map-canvas div:first div:first div:first").trigger('click');

            $("#map-canvas a").attr('tabindex', -1);


        });*/

/*        google.maps.event.addListener(gMap, 'dragend', function(ev) {

            EventDispatcher.trigger('truthupdate', { latlng: gMap.getCenter().toUrlValue() });

        });*/

       google.maps.event.addListener(gMap, 'zoom_changed', function(ev) {

            EventDispatcher.trigger('truthupdate', { zoom: this.getZoom() });

        });
 
        google.maps.event.addListener(gMap, 'click', function(ev) {

            //EventDispatcher.trigger('truthupdate', { details: '', cmd: '' });
            
            var loc, id, cmd, attrs, zoom = gMap.getZoom();

            loc = handleLatLng_(ev, zoom);

            id = (loc && loc.locationid || '');

            cmd = (loc && loc.locationid ? 'Location' : '');

            attrs = { details: id, highlight: id, cmd: cmd };

            EventDispatcher.trigger('truthupdate', attrs);

        });

        google.maps.event.addListener(gMap, 'mousemove', function (ev) { // _.throttle()
          
          var loc, attrs, zoom = gMap.getZoom(); //, tileoffset, locs, id, closest;

          loc = handleLatLng_(ev, zoom);
        
          attrs = _.isObject(loc) 

                    ? { highlight: loc.locationid, cursor: 'pointer' } 

                    : { highlight: '', cursor: '' };

          EventDispatcher.trigger('truthupdate', attrs);

        }, 40);

/*        EventDispatcher.on('maptype', function(maptype) {

            //var maptype = (type === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP);

            console.log('heard maptype event', maptype);

            gMap.setMapTypeId(maptype);

        });*/


    }

    return {

        init: init_,

        refresh: refresh_,

        refreshIcons: refreshIcons_,

        refreshLabels: refreshLabels_,

        refreshAll: refreshAll_,

        renderLabels: renderLabels_,

        renderIcons: renderIcons_,

        render: render_,

        setZoom: setZoom_,

        setCursor: setCursor_,

        setCenter: setCenter_,

        setMapType: setMapType_,

        clear: clear_

    };

});
