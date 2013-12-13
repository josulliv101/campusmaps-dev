
define([

    'underscore'

    , 'backbone'

    , 'scripts/router'

    , 'datastore'

    , 'eventdispatcher'

], function(_, Backbone, Router, Datastore, EventDispatcher) {

    'use strict';

    //// Private ////
    
    var settings, vizList = new Backbone.Collection();

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
