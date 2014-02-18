(function () {

   'use strict';

    require.config({

        catchError: true,

        shim: {

            jquery: {
                exports: '$'
            },

            underscore: {
                exports: '_'
            },

            _mixins: {
                deps: ['underscore']
            },

            lazyload: {
                deps: ['jquery']
            },

            isotope: {
                deps: ['jquery']
            },

            backbone: {

                deps: ['jquery', 'underscore'],

                exports: 'Backbone'

            },
            
            parsecom: {

                deps: ['backbone'],

                exports: 'Parse'

            },

            modernizr: {

                exports: 'Modernizr'

            }
        },

        paths: {

            'jquery': '../bower_components/jquery/jquery',

            'underscore': '../bower_components/lodash/dist/lodash', 
            // lodash/dist/lodash || underscore/underscore
            
            'isotope' : 'http://cdnjs.cloudflare.com/ajax/libs/jquery.isotope/1.5.25/jquery.isotope.min',

            'lazyload': 'http://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.0/jquery.lazyload.min',

            '_mixins': './scripts/_mixins',

            'app': './scripts/app',

            'animation': './scripts/animations/animationCSS3',

            'animationCSS': './scripts/animations/animationCSS3',

            'eventdispatcher': './scripts/eventdispatcher',

            'backbone': '../bower_components/backbone/backbone',

            'parsecom': 'http://www.parsecdn.com/js/parse-1.2.9.min',

            'datastore': './scripts/services/data/datastore-jsonp', // datastore-injected datastore-jsonp datastore-parse-com

            'datainterface': './scripts/services/data/interface',

            'datamodel': './data/data-static',

            'mapstyles': './config-mapstyles',

            'searchpanels': './scripts/views/searchpanels', // A short-cut

            'strategies': './scripts/strategies',

            'map': './scripts/services/map/leaflet', // leaflet googlemap directory

            'leaflet': './scripts/services/map/leaflet',

            'googlemap': './scripts/services/map/googlemap',

            'directory': './scripts/services/map/directory',

            'viz': './scripts/services/map/directory',

            'async': '../bower_components/requirejs-plugins/src/async',

            'domReady': '../bower_components/requirejs-domready/domReady',

            'templates': '../.tmp/scripts/templates',

            'modernizr': './scripts/modernizr' // Just a wrapper for Moderizr global object

        }

    });

}());
