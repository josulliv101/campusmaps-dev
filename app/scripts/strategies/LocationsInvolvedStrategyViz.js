
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

                function(changedAttrs, previousAttrs, campusmap, locations) { 

                    var models = [], keys;

                    keys = _.keys(changedAttrs);

                    if (_.size(keys) !== 1 || !_.contains(keys, 'details')) return;  
debugger;
                    return [campusmap.details, campusmap.detailsPrevious];                 

                },

                // The default, all locations associated with the campus map
                function(changedAttrs, previousAttrs, campusmap, locations) { 

                    return locations;                    

                }               

            ]

        };

    }

});
