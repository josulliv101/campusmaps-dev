
define([

    'jquery',

    '_mixins',

    'datastore',

    'mapstyles',

    'async!http://maps.google.com/maps/api/js?sensor=false'

], function($, _, Datastore, MapStyles) {

    'use strict';

    function init_(options) {

        // google object is available
        
        var campusid;

        options = options || {};

        campusid = options.campusid;

        console.log('App init');

        console.log('MapStyles', MapStyles);

        $.when(Datastore.fetch())

        .done(function() {

            var campus = Datastore.campus(campusid, { id: 'campusid', select: true }),

                zoom = campus.get('zoom'),

                latlng = _.latLng(campus.get('latlng'));

            console.log('Datastore', Datastore.campuses);

            //console.log('MapAPI', new google.maps.LatLng.apply(null, latlng));

            console.log('medford campus', campus);

            console.log('selected campus', Datastore.campus());

            

            var map, mapDiv = document.getElementById('map-canvas');



            map = new google.maps.Map(mapDiv, {
                center: new google.maps.LatLng(latlng[0], latlng[1]),
                zoom: zoom,
                styles: MapStyles.styles,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                navigationControl: true,
                navigationControlOptions: {
                    style: google.maps.NavigationControlStyle.SMALL
                }

            });

        })

        .fail(function() {

            alert('fail');
            
        });

    }


    return {

        test: 'my app',

        verion: _.VERSION,

        init: init_

    };

});
