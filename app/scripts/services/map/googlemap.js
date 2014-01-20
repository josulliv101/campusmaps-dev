
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
    
    var gMap;

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

        _.each(models, function(loc) {

            var dm = DomManager.getInstance(),

                $el = dm.refreshLabel(loc),

                offsetLatLng = MapUtils.offsetLatLngByPixels({ lat: loc.latlng[0], lng: loc.latlng[1] }, loc.zoom, { x: 12, y: 25 }),

                d, neLL, swLL, bounds;

            if (loc.details === true) {

                if (!$el) return;

                d = dm.getDimensions($el);

                neLL = MapUtils.offsetLatLngByPixels(offsetLatLng, loc.zoom, { x: -d.width, y: 0 });

                swLL = MapUtils.offsetLatLngByPixels(offsetLatLng, loc.zoom, { x: 0, y: -d.height });


                if (gMap.eventRect) gMap.eventRect.setMap(null);

                gMap.eventRect = null;

                bounds = new google.maps.LatLngBounds(getLatLng(swLL), getLatLng(neLL));

                gMap.eventRect = new google.maps.Rectangle({
                    strokeColor: '#FF0000',
                    strokeOpacity: 0.0,
                    strokeWeight: 2,
                    fillColor: '#FF0000',
                    fillOpacity: 0.0,
                    map: gMap,
                    bounds: bounds
                });

                loc.setClickable(false);

                var v = _.chain(gMap.markers)

                 .filter(function(m1) { var p = m1.getPosition(); var b = bounds.contains(p); return b; })

                 //.tap(function (all) { _.each(all, function(m) { m.setMap(null); }); })

                 .value();

                 //alert(v.length);

                 _.each(v, function(m) { m.setMap(null); });

/*                hideMarkers = _.filter(gMap.markers, function(m) { 

                    var tileOffset = m.tileCache[m.zoom];

                    if (m.locationid === marker.locationid) return false;

                    return m.tileCache[m.zoom].tile.x === selectedTileOffset.tile.x && m.tileCache[m.zoom].tile.y === selectedTileOffset.tile.y;

                })*/
                //debugger;
               

            }

        });

    }

    function renderLabels_(models) {

console.log('gMap.overlayMapTypes', gMap.overlayMapTypes);

        if (gMap.overlayMapTypes.length === 1) gMap.overlayMapTypes.removeAt(0);

        gMap.overlayMapTypes.insertAt(0, gMap.labelStrategy);    

    }

    function renderIcons_(models) {

        var markers;

        console.log('render models', models);

        clear_();

        gMap.markers = _.chain(models)

                        .map(function(model) {

                            var m = _.extend(model, { map: gMap, position: getLatLng(model.latlng) });

                            return new google.maps.Marker(m);

                        })

                        .each(function(marker) {

                            google.maps.event.addListener(marker, 'click', function() {

                                var locationid = _.getAttr(marker, 'locationid');

                                console.log('click', this);

                                DomManager.getInstance().$root.find('.label.active').removeClass('active fade-in shadow');


                                EventDispatcher.trigger('truthupdate', { details: locationid, cmd: 'Location' }); // locationid: locationid,

                            });

                            google.maps.event.addListener(marker, 'mouseover', function() {

                                //var selectedTileOffset = marker.tileCache[marker.zoom],

                                    //cache = MapUtils.getLocationsFromTileCache(selectedTileOffset.tile, marker.zoom);

/*                                    hideMarkers = _.filter(gMap.markers, function(m) { 

                                        var tileOffset = m.tileCache[m.zoom];

                                        if (m.locationid === marker.locationid) return false;

                                        return m.tileCache[m.zoom].tile.x === selectedTileOffset.tile.x && m.tileCache[m.zoom].tile.y === selectedTileOffset.tile.y;

                                    })*/

                                //DomManager.getInstance().$root.find('.label.active').removeClass('active fade-in shadow');

                                refreshLabels_([marker]);

                                //_.each(hideMarkers, function(marker) { marker.setMap(null); });

                                //debugger;

                            });

                            google.maps.event.addListener(marker, 'mouseout', function() {

                                DomManager.getInstance().$root.find('.label.active').removeClass('active fade-in shadow');

                                refreshLabels_([]);

                                _.each(gMap.markers, function(m) { 

                                    if (!m.getMap()) m.setMap(gMap);

                                })

                            });

                        })

                        .value();
    }

    function render_(json, iconstrategy, labelstrategy) {
/*
        var zoom = gMap.getZoom();

console.log('render__');

        _.each(json.locations, function(loc) {

            var marker, latlng, icon, label, tileOffset;

            if (!_.isObject(loc) || !_.isString(loc.latlng)) return;

            latlng = getLatLng(loc.latlng);

            if (!latlng) return;

            icon = iconstrategy.strategy(loc, zoom);



            marker = new google.maps.Marker({

                position: latlng,

                map: gMap,

                icon: icon

            });

            marker.setIcon(new google.maps.MarkerImage(icon));

            google.maps.event.addListener(marker, 'click', function() {

                EventDispatcher.trigger('viz:locationSelected', loc);

            });

            gMap.markers.push(marker);

        });

        console.log('MapUtils.getCache', MapUtils.getTileCache());
*/
    }

    function setZoom_(level) {

        level = parseInt(level);

        console.log('gmap setZoom_..', level);

        gMap.setZoom(level);

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

            marker = null; 

        });

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

        console.log('LabelMapType', LabelMapType);

        gMap.labelStrategy = new LabelMapType(new google.maps.Size(256, 256));

        //gMap.overlayMapTypes.insertAt(0, gMap.labelStrategy);

        gMap.markers = [];

        thePanorama = gMap.getStreetView();

        thePanorama.setOptions({

          addressControl: false

        });

        google.maps.event.addListenerOnce(gMap, 'tilesloaded', function() {

            google.maps.event.addListener(thePanorama, 'visible_changed', function() {

                EventDispatcher.trigger('truthupdate', { streetview: thePanorama.getVisible() });

            });

            // Hack to give map keyboard focus
            //$("#map-canvas div:first div:first div:first").trigger('click');

            $("#map-canvas a").attr('tabindex', -1);


        });

        google.maps.event.addListener(gMap, 'dragend', function(ev) {

            EventDispatcher.trigger('truthupdate', { latlng: gMap.getCenter().toUrlValue() });

        });

        google.maps.event.addListener(gMap, 'zoom_changed', function(ev) {

            EventDispatcher.trigger('truthupdate', { zoom: this.getZoom() });

        });

        google.maps.event.addListener(gMap, 'click', function(ev) {

            EventDispatcher.trigger('truthupdate', { details: '', cmd: '' });

        });

/*        EventDispatcher.on('maptype', function(maptype) {

            //var maptype = (type === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP);

            console.log('heard maptype event', maptype);

            gMap.setMapTypeId(maptype);

        });*/


    }

    return {

        init: init_,

        refresh: refresh_,

        refreshLabels: refreshLabels_,

        renderLabels: renderLabels_,

        renderIcons: renderIcons_,

        render: render_,

        setZoom: setZoom_,

        setCenter: setCenter_,

        setMapType: setMapType_,

        clear: clear_

    };

});
