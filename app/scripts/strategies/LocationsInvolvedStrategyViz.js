
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

                function(controller, changedAttrs, previousAttrs, campusmap, locations) { 

                    var models = [], keys;

                    keys = _.keys(changedAttrs);

                    if (_.size(keys) !== 1 || !_.contains(keys, 'details')) return;  

                    return [campusmap.details, campusmap.detailsPrevious];                 

                },

                function(controller, changedAttrs, previousAttrs, campusmap, locations) { 

                    var models = [], keys;

                    keys = _.keys(changedAttrs);

                    if (_.size(keys) !== 2 || !_.contains(keys, 'details') || !_.contains(keys, 'cmd')) return;  

                    return [campusmap.details, campusmap.detailsPrevious];                 

                },

                function(controller, changedAttrs, previousAttrs, campusmap, locations) { 

                    var keys = _.keys(changedAttrs);

                    if (!(_.size(keys) < 3) || !_.contains(keys, 'highlight')) return;  

                    return campusmap.refreshLabels;                 

                },

                // The default, all locations associated with the campus map
                function(controller, changedAttrs, previousAttrs, campusmap, locations) { 

                    return locations;                    

                }               

            ]

        };

    }

});
