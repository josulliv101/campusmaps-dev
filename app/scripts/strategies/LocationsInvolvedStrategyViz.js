
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

                function(controller, changedAttrs, previousAttrs, campusmap, locations, extendedMap) { 

                    var models = [], keys;

                    keys = _.keys(changedAttrs);

                    if (_.size(keys) !== 1 || !_.contains(keys, 'details')) return;  

                    return changedAttrs.details === '' ? locations : [campusmap.details, campusmap.detailsPrevious].concat(campusmap.closeby);                 

                },

                function(controller, changedAttrs, previousAttrs, campusmap, locations, extendedMap) { 

                    var models = [], keys;

                    keys = _.keys(changedAttrs);

                    if (_.size(keys) !== 2 || !_.contains(keys, 'details') || !_.contains(keys, 'cmd')) return;  

                    return changedAttrs.details === '' ? locations : [campusmap.details, campusmap.detailsPrevious].concat(campusmap.closeby);                 

                },

                function(controller, changedAttrs, previousAttrs, campusmap, locations, extendedMap) { 

                    var keys = _.keys(changedAttrs);

                    if (!(_.size(keys) < 3) || !_.contains(keys, 'highlight')) return;  

                    return campusmap.refreshLabels;                 

                },

                function(controller, changedAttrs, previousAttrs, campusmap, locations, extendedMap) { 

                    var models = [], keys, val, locs;

                    keys = _.keys(changedAttrs);

                    if (_.size(keys) !== 1 || !_.contains(keys, 'tile')) return;  

                    val = changedAttrs.tile.split('_');               

                    locs = MapUtils.getCloseByLocationsFromTileCache({ x: val[0], y: val[1] }, val[2]);

                    return locs;                

                },

                // The default, all locations associated with the campus map
                function(controller, changedAttrs, previousAttrs, campusmap, locations, extendedMap) { 

/*                    var locs =  _.chain(_.getAttr(extendedMap, 'locations'))

                                 .union(locations)

                                 .uniq()

                                 .value();
debugger;*/
                    return locations;                    

                }               

            ]

        };

    }

});
