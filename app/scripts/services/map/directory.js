
define([

    'jquery',

    '_mixins',

    'datastore',

    'isotope',

    'lazyload',

    'templates'

], function($, _, Datastore, Isotope, Lazyload, JST) {

    'use strict';

    var template = JST['app/scripts/templates/directory.ejs'];

    function init_() {

        var campus = Datastore.campus(),

            map = Datastore.map(),

            el = document.getElementById('map-canvas');

        console.log('map', map);

        createDirectory_(el, campus.get("name"));
        
    }

    function createDirectory_(el, name) {

        $(el).html(template({}));

        $('#container').isotope({

          itemSelector : '.item',

          layoutMode : 'fitRows'

        });

        $('.item img').lazyload({

            effect: 'fadeIn'

        });

        $('.item img').trigger('scroll');

        $(document).on('click', '.btn', function() {

            $('#container').isotope({ filter: $(this).attr('data-filter') });

        });

    }


    return {

        init: init_,

        refresh: function() {}

    };

});
