
define([

    'jquery',

    '_mixins',

    'mapstyles',

    'datastore',

    'async!http://maps.google.com/maps/api/js?sensor=false'

], function($, _, MapStyles, Datastore) {

    'use strict';

    // google object is now available
    
    var gMap;

    function init_() {

        
        
        var campus = Datastore.campus(),

            zoom = campus.get('zoom'),

            latlng = _.latLng(campus.get('latlng')),

            el = document.getElementById('map-canvas');


        createMap_(el, latlng, zoom);
        
    }

    function createMap_(el, latlng, zoom) {

        gMap = new google.maps.Map(el, {

            center: new google.maps.LatLng(latlng[0], latlng[1]),

            zoom: zoom,

            styles: MapStyles.styles,

            mapTypeId: google.maps.MapTypeId.ROADMAP,

            navigationControl: true,

            navigationControlOptions: {

                style: google.maps.NavigationControlStyle.SMALL
                
            }

        });

    }


    return {

        init: init_

    };

});
