
define([

    'jquery',

    '_mixins',

    'datastore'

], function($, _, Datastore) {

    'use strict';

    function init_() {

        var campus = Datastore.campus(),

            map = Datastore.map(),

            el = document.getElementById('map-canvas');

        console.log('map', map);

        createDirectory_(el, campus.get("name"));
        
    }

    function createDirectory_(el, name) {

        $(el).html(name);

    }


    return {

        init: init_

    };

});
