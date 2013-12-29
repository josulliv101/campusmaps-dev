define([

    'datastore'

    , 'searchpanels/base'

], function(Datastore, Base) {

    'use strict';

    return Base.extend({

        id: 'LocationList',

        getJSON: function() {

            var json = { campuses: Datastore.JSON.campuses() };

            console.log('LocationList', Datastore.campuses());

            return { data: json };

        }

    });

});
