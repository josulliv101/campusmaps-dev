/*global define*/
define([

], function() {

    'use strict';

    return  [

        {
            "campusid": "boston",
            "id" : "campus-boston",
            "defaultmap": "boston-main2",
            "latlng": "42.407678,-71.120939",
            "maps": [{
                "id": "bosmap1",
                "extendsdata": "",
                "latlng": "42.407678,-71.120939",
                "locations": [],
                "mapid": "boston-main1",
                "campusid": "boston",
                "name": "Main Boston Campus",
                "zoom": "18",
                "objectId": "bostonmap",
                "__type": "Object",
                "className": "Map"
            },{
                "id": "bosmap2",
                "extendsdata": "",
                "latlng": "42.407678,-71.120939",
                "locations": [],
                "mapid": "boston-main2",
                "campusid": "boston",
                "name": "Main Boston Campus",
                "zoom": "18",
                "objectId": "bostonmap",
                "__type": "Object",
                "className": "Map"
            },{
                "id": "bosmap3",
                "extendsdata": "",
                "latlng": "42.407678,-71.120939",
                "locations": [],
                "mapid": "boston-main3",
                "campusid": "boston",
                "name": "Main Boston Campus",
                "zoom": "18",
                "objectId": "bostonmap",
                "__type": "Object",
                "className": "Map"
            }],
            "name": "Boston",
            "zoom": 15,
            "objectId": "4ITKheBPqs"
        }, {
            "campusid": "grafton",
            "id" : "campus-grafton",
            "latlng": "42.39253,-71.124802",
            "name": "Grafton",
            "zoom": 13,
            "objectId": "Pi8dCQgLvN"
        }, {
            "campusid": "medford",
            "id" : "campus-medford",
            "defaultmap": "medford-main",
            "latlng": "42.405967,-71.117506",
            "maps": [{
                    "id": "engmap",
                    "campusid": "medford",
                    "extendsdata": "",
                    "latlng": "42.405967,-71.117506",
                    "locations": [],
                    "mapid": "engineering-main",
                    "name": "Main Engineering Campus",
                    "zoom": "18",
                    "objectId": "engmap",
                    "__type": "Object",
                    "className": "Map"
                },{
                "id": "medmap",
                "campusid": "medford",
                "extendsdata": "",
                "latlng": "42.406561,-71.120886",
                "locations": [{
                    "attachmentpoint": {
                        "x": -50,
                        "y": -23.5
                    },
                    "country": "United States",
                    "emphasis": "4",
                    "isvisible": "true",
                    "labelVisible": false,
                    "labeldimensions": {
                        "height": 17,
                        "width": 85
                    },
                    "latlng": "42.409199,-71.122699",
                    "locationid": "m001",
                    "mapid": "medford-main",
                    "name": "Carmichael Hall",
                    "state": "MA",
                    "tags": "dorm",
                    "objectId": "1gocQ9aAT6",
                    "__type": "Object",
                    "className": "Location"
                }],
                "mapid": "medford-main",
                "name": "Main Campus",
                "zoom": "18",
                "objectId": "trlVXBszaK",
                "__type": "Object",
                "className": "Map"
            }],
            "name": "Medford&#x2F;Somerville",
            "zoom": 17,
            "objectId": "gkovYGr6Ry"
        }
    ];

});
