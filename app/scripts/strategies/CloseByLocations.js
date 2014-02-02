
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'locations_close_by', 

            type: StrategyManager.TYPE.LOCATIONS_CLOSE_BY,

            fns: [


                function(MapUtils, tile, zoom) { // Location Model

                   // if (model.emphasis > 2 || model.selected === true) return;

                   return 9;//MapUtils.getLocationsFromTileCache(tile, zoom);

                }

            ]

        };

    }

});
