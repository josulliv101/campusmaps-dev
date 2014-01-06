
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
                              
            }

        },

        throwError: {

        	appInit: function() { throw new Error('Error initializing App.')},

            strategyCreation: function() { throw new Error('Strategy requires an id and type')}
            
        }

    }

});
