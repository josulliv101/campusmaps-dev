
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

/*        var delta = 128, size = 256;

        function bordersEast(point) {

            return size - point.x > delta;

        }
*/
        return {

            id: 'locations_close_by', 

            type: StrategyManager.TYPE.LOCATIONS_CLOSE_BY,

            fns: [

                // Include tile to the East
                function(MapUtils, tile, zoom) { // Location Model

                   // if (model.emphasis > 2 || model.selected === true) return;

                   return 9;//MapUtils.getLocationsFromTileCache(tile, zoom);

                }

            ]

        };

    }

});
