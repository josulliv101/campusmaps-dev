
define([

    'jquery',

    '_mixins',

    'mapstyles',

    'datastore',

    'scripts/services/map/LabelMapType',

    'scripts/services/map/MapUtils',

    'eventdispatcher',

    'async!http://maps.google.com/maps/api/js?sensor=false'

], function($, _, MapStyles, Datastore, LabelMapType, MapUtils, EventDispatcher) {

    'use strict';

    // google object is now available
    
    var gMap;

    function init_(el, latlng, zoom) {    

/*        var campus = Datastore.campus(),

            zoom = campus.get('zoom'),

            latlng = _.latLng(_.isString(Datastore.latlng) ? Datastore.latlng : campus.get('latlng')),

            el = document.getElementById('map-canvas');*/

        createMap_.apply(this, arguments);

    }

    // To do: move all strategies to vizcontroller
    function refreshLabels_(json, labelstrategy) {    

        var zoom = gMap.getZoom();

        labelstrategy || (labelstrategy = gMap.labelStrategy);

        if (!labelstrategy) return;

        console.log('refreshLabels_', json, labelstrategy, gMap.overlayMapTypes);

       _.each(json.locations, function(loc) {

            var marker, latlng, icon, label, tileOffset;

            if (!_.isObject(loc) || !_.isString(loc.latlng)) return;

            latlng = getLatLng(loc.latlng);

            if (!latlng) return;

            label = labelstrategy.strategy(loc, zoom);

             if (label === true) {

                // The latLngToTileOffset function caches the return value for future use
                tileOffset = MapUtils.latLngToTileOffset({ lat: latlng.lat(), lng: latlng.lng() }, zoom);

                MapUtils.addLocationToTileCache(tileOffset, loc);

            }           

        });

        if (gMap.overlayMapTypes.length === 1) gMap.overlayMapTypes.removeAt(0);

        gMap.overlayMapTypes.insertAt(0, gMap.labelStrategy);

    }

    function refresh_(latlng) {    

        gMap.panTo(getLatLng(latlng));

    }

    function getLatLng(latlng) {

        var ll = _.isString(latlng) ? _.latLng(latlng) : latlng;

        return new google.maps.LatLng(ll[0], ll[1]);

    }

    function renderIcons_(models) {

        console.log('render models', models);

        var markers  = _.chain(models)

                        .map(function(model) {

                           var m = _.extend(model, { map: gMap, position: getLatLng(model.latlng) });

                           return new google.maps.Marker(m);

                        })

                        .value();

    }

    function render_(json, iconstrategy, labelstrategy) {

        var zoom = gMap.getZoom();

console.log('render__');

        _.each(json.locations, function(loc) {

            var marker, latlng, icon, label, tileOffset;

            if (!_.isObject(loc) || !_.isString(loc.latlng)) return;

            latlng = getLatLng(loc.latlng);

            if (!latlng) return;

            icon = iconstrategy.strategy(loc, zoom);

/*            label = labelstrategy.strategy(loc, zoom);

            if (label === true) {

                // The latLngToTileOffset function caches the return value for future use
                tileOffset = MapUtils.latLngToTileOffset({ lat: latlng.lat(), lng: latlng.lng() }, zoom);

                MapUtils.addLocationToTileCache(tileOffset, loc);

            }*/

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

            panControl: false

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
            $("#map-canvas div:first div:first div:first").trigger('click');

            $("#map-canvas a").attr('tabindex', -1);


        });

        google.maps.event.addListener(gMap, 'dragend', function(ev) {

            EventDispatcher.trigger('truthupdate', { latlng: gMap.getCenter().toUrlValue() });

        });

        google.maps.event.addListener(gMap, 'zoom_changed', function(ev) {

            EventDispatcher.trigger('truthupdate', { zoom: this.getZoom() });

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

        renderIcons: renderIcons_,

        refreshLabels: refreshLabels_,

        render: render_,

        setZoom: setZoom_,

        setMapType: setMapType_,

        clear: clear_

    };

});
