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

            },

            modernizr: {

                exports: 'Modernizr'

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

            'animation': './scripts/animations/animationBase',

            'animationCSS': './scripts/animations/animationCSS3',

            'eventdispatcher': './scripts/eventdispatcher',

            'backbone': '../bower_components/backbone/backbone',

            'parsecom': 'http://www.parsecdn.com/js/parse-1.2.9.min',

            'datastore': './scripts/services/data/datastore-injected', // datastore-injected datastore-jsonp datastore-parse-com

            'datainterface': './scripts/services/data/interface',

            'datamodel': './data/data-static',

            'mapstyles': './config-mapstyles',

            'searchpanels': './scripts/views/searchpanels', // A short-cut

            'map': './scripts/services/map/leaflet', // leaflet googlemap directory

            'leaflet': './scripts/services/map/leaflet',

            'googlemap': './scripts/services/map/googlemap',

            'async': '../bower_components/requirejs-plugins/src/async',

            'domReady': '../bower_components/requirejs-domready/domReady',

            'templates': '../.tmp/scripts/templates',

            'modulemanager': './scripts/moduleManager',

            'modernizr': './scripts/modernizr' // Just a wrapper for Moderizr global object

        }

    });



    require.config({

        // '*' signifies that these mappings should be used everywhere (all modules)
        map: { '*':  getModuleOverrides(window.location.search) }

    });

    function parseQueryString( queryString ) {

        var params = {}, queries, temp, i, l;
        
        if (queryString.indexOf('?') === 0) queryString = queryString.substring(1); 

        // Split into key/value pairs
        queries = queryString.split("&");
     
        // Convert the array of strings into an object
        for ( i = 0, l = queries.length; i < l; i++ ) {
            temp = queries[i].split('=');
            params[temp[0]] = temp[1];
        }
        
        return modules(params);
    }

    function modules( obj ) {

        var i, len, pairs, ret = {};

        if (obj.modules === undefined) return;

        pairs = obj.modules.split('|');

        for ( i = 0, len = pairs.length; i < len; i++ ) {
            
            var pair = pairs[i].split(',');

            if (pair.length === 2) ret[pair[0]] = pair[1];

        }


        return ret;

    }

    function getModuleOverrides(querystring) {

        var modules = parseQueryString(querystring);

        console.log('modules', modules);

        return modules;
    }







}());