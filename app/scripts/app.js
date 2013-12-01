
define([

    'jquery',

    '_mixins',

    'datastore',

    'map'

], function($, _, Datastore, Map) {

    'use strict';

    function init_(options) {

        var campusid = options && options.campusid || 'medford';

        $.when(Datastore.fetch())

        .done(function() {

            var campus = Datastore.campus(campusid, { id: 'campusid', select: true });

            console.log('Datastore', Datastore.campuses);

            console.log('medford campus', campus);

            console.log('Map init', Map.init());

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
