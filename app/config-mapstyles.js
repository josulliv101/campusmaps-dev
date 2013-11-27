
define([], function() {

    'use strict';

    return {

        styles: [{
                        'elementType': 'labels',
                        'stylers': [{
                            'visibility': 'off'
                        }]
                    }, {
                        'featureType': 'road',
                        'stylers': [{
                            'visibility': 'on'
                        }]
                    },

                    {
                        "featureType": "road.local",
                        "elementType": "geometry.stroke",
                        "stylers": [{
                            "weight": 0.4
                        }]
                    },

                    {
                        "featureType": "road",
                        "elementType": "labels.text",
                        "stylers": [{
                            "visibility": "on"
                        }, {
                            "lightness": 46
                        }]
                    },

                    {
                        "featureType": "road.local",
                        "elementType": "labels.text",
                        "stylers": [{
                            "visibility": "on"
                        }, {
                            "lightness": 20
                        }]
                    },

                    {
                        "featureType": "administrative.land_parcel",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    },

                    {
                        "stylers": [{
                            "saturation": -33
                        }]
                    },

                    {
                        "featureType": "poi.park",
                        "elementType": "geometry",
                        "stylers": [{
                            "gamma": 0.80
                        }]
                    },

                    {
                        "stylers": [{
                            "gamma": 0.94
                        }]
                    },

                    {
                        "featureType": "poi.school",
                        "elementType": "geometry",
                        "stylers": [{
                            "gamma": 0.90
                        }]
                    },

                    {
                        "featureType": "road.local",
                        "elementType": "labels.text.stroke",
                        "stylers": [{
                            "visibility": "off"
                        }]
                    }

                ]
    };

});
