
define([

    'jquery',

    '_mixins',

    'mapstyles',

    'datastore',

    'eventdispatcher',

    'async!http://maps.google.com/maps/api/js?sensor=false'

], function($, _, MapStyles, Datastore, EventDispatcher) {

    'use strict';

    // google object is now available
    
    var gMap;

    function init_() {    

        var campus = Datastore.campus(),

            zoom = campus.get('zoom'),

            latlng = _.latLng(_.isString(Datastore.latlng) ? Datastore.latlng : campus.get('latlng')),

            el = document.getElementById('map-canvas');


        createMap_(el, latlng, zoom);
        
    }

    function refresh_(latlng) {    

        gMap.panTo(getLatLng(latlng));

    }

    function getLatLng(latlng) {

        var ll = _.latLng(latlng);

        return new google.maps.LatLng(ll[0], ll[1]);

    }

    function render_(json, icons) {


        _.each(json.locations, function(loc) {

            var marker, latlng, icon;

            if (!_.isObject(loc) || !_.isString(loc.latlng)) return;

            latlng = getLatLng(loc.latlng);

            if (!latlng) return;

            icon = icons.strategy(loc);

            marker = new google.maps.Marker({

                position: latlng,

                map: gMap,

                icon: icons.strategy(loc)

            });

            marker.setIcon(new google.maps.MarkerImage(icon));

console.log('loc..', loc);

            gMap.markers.push(marker);

        })

/*        var marker, campus = Datastore.campus(),

            json = Datastore.JSON.campus(campus),

            map = _.find(json.maps, function(map) { return map.selected === true; }),

            latlng = getLatLng(map.latlng);

            if (!latlng) return;

            marker = new google.maps.Marker({

                position: latlng,

                map: gMap

            });*/

    }

    function clear_() {

        //alert(gMap.markers.length);

        _.each(gMap.markers, function(marker) { marker.setMap(null); });

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

        EventDispatcher.on('maptype', function(maptype) {

            //var maptype = (type === 'satellite' ? google.maps.MapTypeId.SATELLITE : google.maps.MapTypeId.ROADMAP);

            console.log('heard maptype event', maptype);

            gMap.setMapTypeId(maptype);

        });

    }


    return {

        init: init_,

        refresh: refresh_,

        render: render_,

        clear: clear_

    };

});
