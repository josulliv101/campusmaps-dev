
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

    function renderLabels_(models) {

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

                                console.log('click', this);

                                EventDispatcher.trigger('truthupdate', { locationid: _.getAttr(marker, 'locationid') });

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

        renderLabels: renderLabels_,

        renderIcons: renderIcons_,

        render: render_,

        setZoom: setZoom_,

        setCenter: setCenter_,

        setMapType: setMapType_,

        clear: clear_

    };

});
