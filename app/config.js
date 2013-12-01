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

            '_mixins': './scripts/_mixins',

            'app': './scripts/app',

            'backbone': '../bower_components/backbone/backbone',

            'parsecom': 'http://www.parsecdn.com/js/parse-1.2.9.min',

            'datastore': './scripts/services/data/datastore-injected', // datastore-injected datastore-jsonp datastore-parse-com

            'datainterface': './scripts/services/data/interface',

            'datamodel': './data/data-static',

            'mapstyles': './config-mapstyles',

            'map': './scripts/services/map/directory',

            'async': '../bower_components/requirejs-plugins/src/async',

            'domReady': '../bower_components/requirejs-domready/domReady'

        }

    });

}());