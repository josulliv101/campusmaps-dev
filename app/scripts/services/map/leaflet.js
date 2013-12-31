
define([

    'jquery',

    '_mixins',

    'datastore',

    'eventdispatcher',

    'http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.js'

], function($, _, Datastore, EventDispatcher) {

    'use strict';

    // L object is now available
var map;

    //var createMap = _.once(createMap_), isInit = false, map;

    function init_(map) {

        // google object is now available
        
        var campus = Datastore.campus(),

            zoom = campus.get('zoom'),

            latlng = getLatLng(_.isString(Datastore.latlng) ? Datastore.latlng : campus.get('latlng')),

            el = document.getElementById('map-canvas');

        if (map) map.remove();

        $(el).parent().append($('<div id="map-canvas"/>'));

        $(el).remove();
        
        L.Icon.Default.imagePath = '/app/images';

        createMap_(map, document.getElementById('map-canvas'), latlng, zoom);
        
    }

    function getLatLng(latlng) {

        var ll = _.latLng(latlng);

        return ll; //new L.LatLng(ll[0], ll[1]);

    }

    function refresh_(latlng) {    

        var latlng = getLatLng(latlng);

        L.campusmap.panTo(latlng);
        
    }

    function render_() {

        var marker, campus = Datastore.campus(),

            json = Datastore.JSON.campus(campus),

            latlng = getLatLng(json.latlng);

            if (!latlng) return;

            marker = L.marker(latlng).addTo(L.campusmap);

    }

    function createMap_(map, el, latlng, zoom) {

        map = new L.Map(el);

L.campusmap = map;
        //map = L.map(el);

        map.setView(latlng, zoom);
        //https://b.tiles.mapbox.com/v3/examples.a3cad6da/13/2411/3078.png
        //http://a.tiles.mapbox.com/v3/examples.map-zr0njcqy
        //https://a.tiles.mapbox.com/v3/examples.bc17bb2a/13/2413/3079.png
        // https://d.tiles.mapbox.com/v3/examples.a4c252ab/13/2412/3079.png
        //http://c.tiles.mapbox.com/v3/examples.c7d2024a/13/2410/3081.png
        //https://a.tiles.mapbox.com/v3/pinterest.map-ho21rkos
        // http://somebits.com:8001/rivers/
        //L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/83612/256/{z}/{x}/{y}.png', {
       L.tileLayer('http://d.tiles.mapbox.com/v3/examples.a4c252ab/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
        }).addTo(map);

       map.on('moveend', function(ev) {

            var latlng = map.getCenter();

            console.log('leaflet dragend', latlng.lat);

            EventDispatcher.trigger('truthupdate', { latlng: latlng.lat + ',' + latlng.lng });

       });

/* 
        isInit = true;
        L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/997/256/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
        }).addTo(map);
*/
    }


    return {

        init: init_,

        refresh: refresh_,

        render: render_

    };

});
