
define([

      'underscore'

    , 'datastore'

    , 'scripts/services/map/MapUtils'

], function(_, Datastore, MapUtils) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'locations-involved-viz', 

            type: StrategyManager.TYPE.LOCATIONS_INVOLVED_VIZ,

            fns: [

                // The default, all locations associated with the campus map
                function(attrs, previousAttrs, locations) { 

                    return locations;                    

                }               

            ]

        };

    }

});
