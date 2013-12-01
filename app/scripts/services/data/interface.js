define([

    '_mixins' 

], function(_) {

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

                if (_.exists(campus)) {

                    return _.filter(maps_.models, function(map) { return _.getAttr(map, 'campusid') === _.getAttr(campus, 'campusid'); });

                }
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

            function selectDefaultMapForCampus_(campus) {

                var mapid;

                if (!_.exists(campus)) return;

                mapid = campus.get("defaultmap");

                return _.getItemById(maps_.models, mapid, { id: 'mapid', select: true });

            }

            // The Data Interface which every Datastore will implement
            return {

                // A function to get a campus, or if none found the selected one is returned
                campus: _.dispatch(

                    // Bind the campus models to getItemById so only an id & options args need to be passed in
                    _.partial(_.getItemById, campuses_.models),

                    // Return the selected campus if no match found
                    getSelectedCampus_

                ),

                // A function to get a map, or if none found the selected one of selected campus is returned
                map: _.dispatch(

                    // Bind the map models to getItemById so only an id & options need to be passed in
                    _.wrap(_.getItemById, getItemByIdWrapForMap_),

                    // A campus object is passed in
                    _.compose(_.getSelectedItem, mapsMatchingCampus_),

                    // Return the selected map if no match found
                    _.compose(_.getSelectedItem, mapsMatchingCampus_, getSelectedCampus_)//,

                    //_.compose(selectDefaultMapForCampus_, getSelectedCampus_)

                ),

                maps: function() { return maps_; },

                // Each datastore will overwrite this with its own way of fetching data
                fetch: function() { return campuses_; },

                campuses: campuses_

            };

        }

    };

});
