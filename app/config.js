(function () {
   'use strict';

    require.config({

        shim: {

            underscore: {
                exports: '_'
            },

            _mixins: {
                deps: ['underscore']
            },

            backbone: {

                deps: ['underscore'],

                exports: 'Backbone'

            }
        },

        paths: {

            'jquery': '../bower_components/jquery/jquery',

            'underscore': '../bower_components/underscore/underscore', 
            // ../bower_components/lodash/dist/lodash 

            '_mixins': './scripts/_mixins',

            'backbone': '../bower_components/backbone/backbone',

            'datastore': './scripts/services/datastore-injected'

        }

    });

}());