(function () {

   'use strict';

    require.config({

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

            }
        },

        paths: {

            'jquery': '../bower_components/jquery/jquery',

            'underscore': '../bower_components/underscore/underscore', 
            // lodash/dist/lodash || underscore/underscore
            
            'isotope' : 'http://cdnjs.cloudflare.com/ajax/libs/jquery.isotope/1.5.25/jquery.isotope.min',

            'lazyload': 'http://cdnjs.cloudflare.com/ajax/libs/jquery.lazyload/1.9.0/jquery.lazyload.min',

            '_mixins': './scripts/_mixins',

            'app': './scripts/app',

            'animation': './scripts/animations/animationCSS3',

            'eventdispatcher': './scripts/eventdispatcher',

            'backbone': '../bower_components/backbone/backbone',

            'parsecom': 'http://www.parsecdn.com/js/parse-1.2.9.min',

            'datastore': './scripts/services/data/datastore-injected', // datastore-injected datastore-jsonp datastore-parse-com

            'datainterface': './scripts/services/data/interface',

            'datamodel': './data/data-static',

            'mapstyles': './config-mapstyles',

            'searchpanels': './scripts/views/searchpanels', // A short-cut

            'map': './scripts/services/map/leaflet', // leaflet googlemap directory

            'async': '../bower_components/requirejs-plugins/src/async',

            'domReady': '../bower_components/requirejs-domready/domReady',

            'templates': '../.tmp/scripts/templates'

        }

    });

}());