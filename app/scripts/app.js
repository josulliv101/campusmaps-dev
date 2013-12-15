
define([

    'underscore'

    , 'backbone'

    , 'scripts/router'

    , 'datastore'

    , 'eventdispatcher'

    , 'scripts/moduleManager'

    , 'map'

], function(_, Backbone, Router, Datastore, EventDispatcher, ModuleManager, Map) {

    'use strict';

    //// Private ////
    
    var settings, vizList = new Backbone.Collection(), vizCache = {};

    function init_(options) {

        options || (options = {});

        settings = {

            campusid: options.campusid || 'medford'

            , vizid: options.vizid || 'googlemap'
            
        }

        vizList.add(options.vizList);

        $.when( Datastore.fetch() )

            .done(function() { 

                // Kicks off route parsing
                Router.init();
                
                // Url settings take precedence over passed-in options
                settings = _.extend(settings, Router.settingsUrl);

                // Select an inital campus
                Datastore.campus(settings.campusid, { id: 'campusid', select: true });

                // And a visualization
                _.getItemById(vizList.models, settings.vizid, { select: true });

                console.log('vizList', vizList);

                console.log('settings', settings);

                console.log('ModuleManager', ModuleManager.getViewportSize());

                loadVizModule_();

            })

            .fail(function() {

                alert('fail');
                
            });

            $(window).resize(_.debounce(function() {

                loadVizModule_();

            }, 500));

    }

    function loadVizModule_() {

        var path = ModuleManager.getVizPath();

console.log('Module', path, vizCache[path]);

        if (vizCache[path]) return vizCache[path].refresh();

        require([ path ], function (Viz) {

            vizCache[path] = Viz;

            console.log('Module viz', Viz.init());

        });

    }

    return {

        test: 'my app',

        verion: _.VERSION,

        init: init_

    };

});
