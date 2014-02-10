define([

    'datastore'

    , 'searchpanels/base'

    , 'scripts/domManager'

    , 'eventdispatcher'

], function(Datastore, Base, DomManager, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'Directions',

        initialize: function() {

            Base.prototype.initialize.call(this);

        },

        getJSON: function() {

            var json = {};

            return { data: json };

        }

    });

});
