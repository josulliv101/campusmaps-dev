define([

    '_mixins',

    'backbone',

    'eventdispatcher'

], function(_, Backbone, EventDispatcher) {

    'use strict';


    //// Private ////
    
    function createMapList_(campuses) {

        return _.chain(campuses.models)

                .map(function(campus) { return campus.get('maps'); })

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

                var maps;                

                if (!campus) return;

                maps = _.getAttr(campus, 'maps');

                if (_.isObject(campus)) {

                    var f = _.filter(maps_.models, function(map) { 

                        return _.getAttr(map, 'campusid') === _.getAttr(campus, 'campusid'); });

                    console.log('@matching maps for campus', campus, f);

                    return f;

                }
            }

            function getCampusMaps_(campus) {

                if (!_.isObject(campus)) return;

                return mapsMatchingCampus_(campus); //_.getAttr(campus, 'maps');

            }

            function getItemByIdWrapForMap_(fn) {

                // Bind the fn to the map model data
                var args = _.cat([maps_.models], _.rest(arguments)), optsArg = args[2];

                !optsArg || (_.extend(optsArg, { restrictItemsToCampus: true }));

                return fn.apply(null, args); 
            }

            function getSelectedCampus_() {

                return _.getSelectedItem(campuses_.models);

            }

            function selectFirstCampus_() {

                if (campuses_.models.length === 0) return;

                return _.getItemAt(campuses_.models, 0, { select: true });

            }

            function selectFirstMap_(campus) {

                var maps = _.getAttr(campus, 'maps');

                if (maps.length === 0) return;

                return _.getItemAt(maps, 0, { select: true });

            }

            function selectDefaultMapForCampus_(campus) {

                var mapid, maps;

                if (!_.exists(campus)) return;

                mapid = campus.get("defaultmap");

                maps = _.getAttr(campus, 'maps');

console.log('selectDefaultMapForCampus_!!!', mapid, maps);
                
                EventDispatcher.trigger('truthupdate', { campusmap: mapid });

                // to do: move selection to truth handler
                return _.getItemById(maps, mapid, { id: 'mapid', select: true });

            }

            function getDefaultMap_(campus) {

                var defaultid, campusmaps, campusmap;

                if (!_.isObject(campus)) return;

                defaultid = campus.get('defaultmap');

                campusmaps = getCampusMaps_(campus);

                campusmap = _.getItemById(campusmaps, defaultid, { id: 'mapid' });

                // Returns both for easy chaining with selectItem method
                return campusmap;

            }

            // The Data Interface which every Datastore will implement
            return {

                // A function to get a campus, or if none found the selected one is returned
                campus: _.dispatch(

                    // Bind the campus models to getItemById so only an id & options args need to be passed in
                    _.partial(_.getItemById, campuses_.models),

                    // Return the selected campus if no match found
                    getSelectedCampus_,

                    // Return the first in list and select it
                    selectFirstCampus_

                ),

                // A function to get a map, or if none found the selected one of selected campus is returned
                map: _.dispatch(

                    // Bind the map models to getItemById so only an id & options need to be passed in
                    _.wrap(_.getItemById, getItemByIdWrapForMap_),

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
                    _.compose(selectDefaultMapForCampus_, getSelectedCampus_),

                    // If all else fails, just return the first map and select it
                    _.compose(

                        function(campusmaps) { if (campusmaps && campusmaps.length > 0 ) return _.getItemAt(campusmaps, 0, { select: true }); }, 

                        getCampusMaps_

                    )

                ),

                // Each datastore will overwrite this with its own way of fetching data
                fetch: function() { return campuses_; },

                mapList: function() { return maps_; },

                campusList: function() { return campuses_; },

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

                        var locations = map.get('locations');

                        

                        return map;
                    },

                    campus: function(campus) { 



                        var json = _.extend(campus.toJSON(), { 

                                selected: campus.selected,

                                maps: _.map(maps_.models, function(map) { 

                                    var locList = map.get('locations') || { length: 0 },

                                        jsonLocs = _.map(locList, function(loc) { return loc.toJSON()});

                                    //console.log('jsonLocs', jsonLocs);

                                    return _.extend(map.toJSON(), { selected: map.selected, locationTotal: locList.length, locations: jsonLocs }); 
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

                    selectFirstCampus: selectFirstCampus_,

                    selectFirstMap: selectFirstMap_,

                    getCampusMaps: getCampusMaps_,

                    selectDefaultMapForCampus: selectDefaultMapForCampus_
                }

            };

        }

    };

});
