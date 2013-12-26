
define([

    'jquery',

    '_mixins',

    'datastore',

    'http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.js'

], function($, _, Datastore) {

    'use strict';

    // L object is now available
var map;

    //var createMap = _.once(createMap_), isInit = false, map;

    function init_(map) {

        // google object is now available
        
        var campus = Datastore.campus(),

            zoom = campus.get('zoom'),

            latlng = _.latLng(campus.get('latlng')),

            el = document.getElementById('map-canvas');



       // var p = $('#map-canvas').parent();

       // var e = $('#map-canvas').remove();

       // p.append(e);

        //if (L.map(el)) L.map(el).remove();
 

        


//L.map(el).remove();

        if (map) map.remove();

        $(el).parent().append($('<div id="map-canvas"/>'));

        $(el).remove();
        
 
        createMap_(map, document.getElementById('map-canvas'), latlng, zoom);
        
    }

    function createMap_(map, el, latlng, zoom) {


 
        map = new L.Map(el);


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
/*
        isInit = true;*/

    }


    return {

        init: init_,

        refresh: function() {}

    };

});
