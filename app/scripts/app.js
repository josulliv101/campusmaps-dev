
define([

    'jquery',

    '_mixins',

    'datastore',

    'map',

    'scripts/views/searchbox',

    'scripts/controllers/searchboxController',

    'animation'

], function($, _, Datastore, Map, SearchboxView, SearchboxController, Animation) {

    'use strict';

    function init_(options) {

        var campusid = options && options.campusid || 'medford';

        $.when(Datastore.fetch())

        .done(function() { 

            var campus = Datastore.campus(campusid, { id: 'campusid', select: true }),

                vSearchbox, searchboxController;

            console.log('Datastore', Datastore.campuses);

            console.log('medford campus', campus);

            console.log('Map init', Map.init());

            vSearchbox = new SearchboxView({ el: $('#ui-search') }).render();

            searchboxController = new SearchboxController(vSearchbox, new Animation());

            console.log('vSearchbox', vSearchbox);

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
