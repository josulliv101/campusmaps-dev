
define([

    'jquery',

    '_mixins',

    'datastore',

    'http://cdn.leafletjs.com/leaflet-0.6.4/leaflet.js'

], function($, _, Datastore) {

    'use strict';

    // L object is now available
    
    var map;

    function init_() {

        // google object is now available
        
        var campus = Datastore.campus(),

            zoom = campus.get('zoom'),

            latlng = _.latLng(campus.get('latlng')),

            el = document.getElementById('map-canvas');


        createMap_(el, latlng, zoom);
        
    }

    function createMap_(el, latlng, zoom) {

        var map = L.map(el).setView(latlng, zoom);

        L.tileLayer('http://{s}.tile.cloudmade.com/BC9A493B41014CAABB98F0471D759707/1930/256/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: 'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://cloudmade.com">CloudMade</a>'
        }).addTo(map);

 

    }


    return {

        init: init_

    };

});
