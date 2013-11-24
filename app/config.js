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
            // ../bower_components/lodash/dist/lodash 

            '_mixins': './scripts/_mixins',

            'backbone': '../bower_components/backbone/backbone',

            'parsecom': 'http://www.parsecdn.com/js/parse-1.2.9.min',

            'datastore': './scripts/services/datastore-injected',

            'datamodel': './data/data-static'

        }

    });

}());