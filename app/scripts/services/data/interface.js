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


    //// Public ////

    return {

        // Utility methods not part of interface
        utils: {

            createMapList: createMapList_

        },

        initialize: function(campuses, maps) {

            var campuses_ = campuses, 

                maps_ = maps,

                // Wraps the getItemById function so that the restrictItems to Campus is set to true
                fnMapWrap = function(fn) {

                    // Bind the fn to the map model data
                    var args = _.cat([maps_.models], _.rest(arguments)), optsArg = args[2];

                    !optsArg || (_.extend(optsArg, { restrictItemsToCampus: true }));

                    return fn.apply(null, args); 
                };

            // The Data Interface which every Datastore will implement
            return {

                // A function to get a campus, or if none found the selected one is returned
                campus: _.dispatch(

                    // Bind the campus models to getItemById so only an id & options args need to be passed in
                    _.partial(_.getItemById, campuses_.models),

                    // Return the selected campus if no match found
                    function() { return _.getSelectedItem(campuses_.models); }

                ),

                // A function to get a map, or if none found the selected one of selected campus is returned
                map: _.dispatch(

                    // Bind the map models to getItemById so only an id & options need to be passed in
                    _.wrap(_.getItemById, fnMapWrap),

                    // If an object is passed in, and it has a maps attr, return the selected map
                    function(campus, options) {

                        var maps;

                        if (_.isObject(campus) && campus.get) {

                            maps = _.filter(maps_.models, function(map) { return _.getAttr(map, 'campusid') === _.getAttr(campus, 'campusid'); });

                            return _.getSelectedItem(maps, options);

                        }

                    },

                    // Return the selected map if no match found
                    _.compose(

                        // First get the selected campus
                        function(maps) {

                            if (!_.exists(maps)) return;

                            return _.getSelectedItem(maps);

                        },

                        function() { 

                            var campus = _.getSelectedItem(campuses_.models);

                            // Then, return the selected campuses maps
                            if (_.exists(campus))

                                return _.filter(maps_.models, function(map) { return _.getAttr(map, 'campusid') === _.getAttr(campus, 'campusid'); });

                        }

                    )

                ),

                maps: function() { return maps_; },

                // Data pre-fetched so just return it
                fetch: function() { return campuses_; },

                campuses: campuses_

            };

        }

    };

});
