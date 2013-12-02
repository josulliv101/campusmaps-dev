
define([

    'jquery',

    '_mixins',

    'datastore',

    'map',

    'scripts/views/searchbox'

], function($, _, Datastore, Map, SearchboxView) {

    'use strict';

    function init_(options) {

        var campusid = options && options.campusid || 'medford';

        $.when(Datastore.fetch())

        .done(function() { 

            var campus = Datastore.campus(campusid, { id: 'campusid', select: true }),

                vSearchbox;

            console.log('Datastore', Datastore.campuses);

            console.log('medford campus', campus);

            console.log('Map init', Map.init());

            vSearchbox = new SearchboxView({ el: $('#ui-search') }).render();

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
