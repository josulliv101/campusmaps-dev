
define([

], function() {

    'use strict';

    var icon_base = 'app/images/icons/';

    return {

        env: {

            paths: {

                base: '/',

                icons: {

                    base: icon_base,

                    map: icon_base + 'map/'
                }

            }

        },

        defaults: {

            theTruth: {

                cmd: ''

                , iconstrategy: 'default'

                , labelstrategy: 'default'

                , mapcenteroffset: { x: 0, y: 0 }
                              
            }

        },

        search: {

            details: {

                nav: [{ order: 1, id: 'details' }, { order: 2, id: 'photo' }, { order: 3, id: 'offices' }, { order: 4, id: 'directions' }]

            }

        },

        throwError: {

        	appInit: function() { throw new Error('Error initializing App.')},

            strategyCreation: function() { throw new Error('Strategy requires an id and type')}
            
        }

    }

});
