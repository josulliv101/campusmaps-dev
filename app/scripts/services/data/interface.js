define([

     '_mixins'

    , 'backbone'

    , 'strategies/StrategyManager'

    , 'eventdispatcher'

], function(_, Backbone, StrategyManager, EventDispatcher) {

    'use strict';


    //// Private ////
    
    function createMapList_(campuses) {

        return _.chain(campuses.models)

                .map(function(campus) { return _.getAttr(campus, 'maps'); })

                .reject(function(map) { return _.isUndefined(map); })

                .flatten()

                .value();

    }

    return {

        // Utility methods not part of interface
        utils: {

            createMapList: createMapList_

        },

        initialize: function(campuses, maps) {

            var campuses_ = campuses, maps_ = maps;


            //// Private ////


            function mapsMatchingCampus_(campus) {

                var maps, ret;                

                if (!_.isObject(campus)) return;

                maps = maps_;// _.getAttr(campus, 'maps');

                //if (!_.isArray(maps)) maps = maps_.models;

console.log('maps....$', campus, maps);

                // Always want to use the definitive collection of maps, not the maps associated with the campuses.
                ret = _.filter(maps_.models, function(map) { 

                    return _.getAttr(map, 'campusid') === _.getAttr(campus, 'campusid'); });

                return ret;

            }

            function getCampusMaps_(campus) {

                if (!_.isObject(campus)) return;

                return mapsMatchingCampus_(campus); //_.getAttr(campus, 'maps');

            }

            function getItemByIdWrapForMap_(fn) {

                var args, maps = _.exists(maps_.models) ? maps_.models : maps_;

                // Bind the fn to the map model data
                var args = _.cat([maps], _.rest(arguments)), optsArg = args[2];

                !optsArg || (_.extend(optsArg, { restrictItemsToCampus: true }));

                return fn.apply(null, args); 
            }

            function getSelectedCampus_(models) {

                return _.getSelectedItem(models);

            }

            function selectFirst_(models) {

                if (!models || models.length === 0) return;

                return _.getItemAt(models, 0, { select: true });

            }

            function selectFirstMap_(campus) {

                var maps = _.getAttr(campus, 'maps');

                if (maps.length === 0) return;

                return _.getItemAt(maps, 0, { select: true });

            }

            function selectDefaultMapForCampus_(campus) {

                var mapid, maps;

                if (!_.exists(campus)) return;

                mapid = _.getAttr(campus, "defaultmap");

                maps = _.getAttr(campus, 'maps');

console.log('selectDefaultMapForCampus_!!!', mapid, maps);
                
                EventDispatcher.trigger('truthupdate', { campusmap: mapid });

                // to do: move selection to truth handler
                return _.getItemById(maps, mapid, { id: 'mapid', select: true });

            }

            // Can take a campus object or campusmaps object
            function getStrategies_(campus) {

                if (!_.isObject(campus)) return {};

                return { 

                    icon: campus.iconStrategy || StrategyManager.getStrategy(StrategyManager.TYPE.ICON), 

                    label: campus.labelStrategy || StrategyManager.getStrategy(StrategyManager.TYPE.LABEL)

                };

            }

            function getDefaultMap_(campus) {

                var defaultid, campusmaps, campusmap;

                if (!_.isObject(campus)) return;

                defaultid = _.getAttr(campus, 'defaultmap');

                campusmaps = getCampusMaps_(campus);

                campusmap = _.getItemById(campusmaps, defaultid, { id: 'mapid' });

                // Returns both for easy chaining with selectItem method
                return campusmap;

            }

            function extendData_(campusmap) {

                var campusmapBase, locids, locations, extendedLocs, extendedlocids, newLocs, idBase = _.getAttr(campusmap, 'extendsdata');

                if (!_.isObject(campusmap) || !idBase) return;

                campusmap.featuredLocations = [];

                locids = _.map(_.getAttr(campusmap, 'locations'), function(loc) { return loc.locationid; });

                campusmapBase = _.getItemById(maps_.models, idBase, { id: 'mapid' });

                extendedLocs = _.filter(_.getAttr(campusmapBase, 'locations'), function(loc) { var dup = _.contains(locids, loc.locationid); return dup; });

                extendedlocids = _.map(extendedLocs, function(loc) { return loc.locationid; });

                newLocs = _.reject(_.getAttr(campusmap, 'locations'), function(loc) { var dup = _.contains(extendedlocids, loc.locationid); return dup; });

                locations = _.chain(_.getAttr(campusmapBase, 'locations') || [])

                             .reject(function(loc) { var dup = _.contains(locids, loc.locationid); return dup; })

                             .union(_.map(extendedLocs, function(loc) { 

                                var copy = _.clone(loc), locs = _.getAttr(campusmap, 'locations'),

                                    match = _.find(locs, function(l2) { return copy.locationid === l2.locationid; });

                                if (match) {

                                    _.extend(copy, match);

                                    newLocs.push(copy);
 
                                }

                                return copy; 

                            }))

                             .union(newLocs)

                             .reject(function(loc) { return !_.exists(_.getAttr(loc, 'name')) || !_.exists(_.getAttr(loc, 'latlng')) || !_.exists(_.getAttr(loc, 'locationid')); })

                             .value();

                newLocs = _.reject(newLocs, function(loc) { return !_.exists(_.getAttr(loc, 'name')) || !_.exists(_.getAttr(loc, 'latlng')) || !_.exists(_.getAttr(loc, 'locationid')); });

                debugger;

                campusmap.set({ 'locations': locations, featured: _.filter(newLocs, function(loc) { return loc.featured === 'true'; }), extendsdata: null });

                return campusmap;

            }

            // The Data Interface which every Datastore will implement
            return {

                // A function to get a campus, or if none found the selected one is returned
                campus: _.dispatch(
function() {},
                    // Bind the campus models to getItemById so only an id & options args need to be passed in
                    _.partial(_.getItemById, campuses_.models),

                    // Return the selected campus if no match found
                    //getSelectedCampus_,
                    _.partial(getSelectedCampus_, campuses_.models),

                    // Return the first in list and select it
                    //selectFirstCampus_
                    _.partial(selectFirst_, campuses_.models)

                ),

                // A function to get a map, or if none found the selected one of selected campus is returned
                map: _.dispatch(
function() {   },
                    // Bind the map models to getItemById so only an id & options need to be passed in
                    //_.wrap(_.getItemById, getItemByIdWrapForMap_),

                    _.partial(_.getItemById, maps_.models),

                    // A campus object is passed in, and one is selected
                    _.compose(_.getSelectedItem, getCampusMaps_),

                    // A campus is passed-in
                    _.compose(

                        _.wrap(_.selectItem, function(fn) { 

                            var args = _.chain(arguments)

                                        .rest()

                                        .cat({ restrictItemsToCampus: true })

                                        .value()

                            return fn.apply(null, args); 

                        }) 

                        , getDefaultMap_

                    ),

                    // Return the selected map if no match found
                    _.compose( _.getSelectedItem, getCampusMaps_, getSelectedCampus_),

                    // Return the default map if none selected
                    //_.compose(selectDefaultMapForCampus_, getSelectedCampus_),

                    // If all else fails and a campus was passed-in, just return the first map and select it
                    _.compose(

                        function(campusmaps) { if (campusmaps && campusmaps.length > 0 ) return _.getItemAt(campusmaps, 0, { select: true }); }, 

                        getCampusMaps_

                    ),

                    // If all else fails and no campus as arg, use selected
                    _.compose( 

                        function(campusmaps) {  if (campusmaps && campusmaps.length > 0 ) return _.getItemAt(campusmaps, 0, { select: true }); }

                        , function(arg2) { return arg2; }

                        , getCampusMaps_

                        , function(arg) { return arg; }

                        , getSelectedCampus_

                    )

                ),

                locations: 

                    function(map) {

                        if (!map) return;

                        return _.getAttr(map, 'locations');

                    }

                ,

                location: 

                    function(map, locationid) {

                        var locations, location;

                        if (!map) return;

                        locations = _.getAttr(map, 'locations');

                        location = _.find(locations, function(loc) { return _.getAttr(loc, 'locationid') === locationid; });

                        return location;

                    }

                ,

                // Each datastore will overwrite this with its own way of fetching data
                fetch: function() { return campuses_; },

                getStrategies: getStrategies_,

                mapList: function() { return maps_; },

                campusList: function() { return campuses_; },

                extendData: extendData_,

                Factory: {

                    model: function(attrs) { return new Backbone.Model(attrs); }
                    
                },

                JSON: {

                    campuses: function() { return _.map(campuses_.models, function(model) { 

                        return _.extend(model.toJSON(), { selected: model.selected }); 

                    }); },

                    maps: function(campus) { 

                        var maps = getCampusMaps_(campus);

                        return _.map(maps, function(map) { return map.toJSON(); });
                    },

                    map: function(map) { 

                        var map, locations;

                        if (!map) return;
                        
                        locations = _.chain(_.getAttr(map, 'locations'))

                                     .map(function(loc) { var json = !!loc.toJSON ? loc.toJSON() : loc; var selected = loc.selected && loc.selected === true ? true : false;  return json; })

                                     .value();

                        return _.extend(map.toJSON(), { locations: locations });

                    },

                    location: function(loc) { 

                        return loc.toJSON ? loc.toJSON() : loc;

                    },

                    locations: function(locs) { 

                        return _.map(locs, function(loc) { 

                            return _.extend(loc.toJSON(), { selected: loc.selected });

                        });

                    },

                    campus: function(campus) { 

                        var json, campusmaps = getCampusMaps_(campus);

console.log('@campusmaps', campus, campusmaps);

                        json = _.extend(campus.toJSON(), { 

                            selected: campus.selected,

                            maps: _.map(campusmaps, function(map) { 

                                var locList = _.getAttr(map, 'featured') || (_.getAttr(map, 'locations') || { length: 0 }),

                                    jsonLocs = _.map(locList, function(loc) { return !!loc.toJSON ? loc.toJSON() : loc; });

                                //console.log('jsonLocs', jsonLocs);

                                return _.extend(!!map.toJSON ? map.toJSON() : map, { selected: map.selected, locationTotal: locList.length, locations: jsonLocs }); 
                            })

                        });

                        return json;
                    }

                },

                // Exposed for test purposes
                _: {

                    mapsMatchingCampus: mapsMatchingCampus_,

                    createMapList: createMapList_,

                    getItemByIdWrapForMap: getItemByIdWrapForMap_,

                    getSelectedCampus: getSelectedCampus_,

                    selectFirst: selectFirst_,

                    selectFirstMap: selectFirstMap_,

                    getCampusMaps: getCampusMaps_,

                    selectDefaultMapForCampus: selectDefaultMapForCampus_
                }

            };

        }

    };

});
