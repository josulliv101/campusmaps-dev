define([

    '_mixins' 

], function(_) {

    'use strict';


    //// Private ////
    
    function createMapList_(campuses) {

        console.log('createMapList_', campuses);

        var maps = _.chain(campuses.models)

                    .map(function(campus) { return campus.get('maps'); })

                    .flatten()

                    .reject(function(map) { return _.isUndefined(map); })

                    .value();

        return maps;
    }

    //// Public ////

    console.info('Data Interface');

    return {

        // Utility methods not part of interface
        utils: {

            createMapList: createMapList_,

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

                    // Return the selected map if no match found
                    _.compose(

                        // First get the selected campus
                        function(maps) {

                            console.log('maps!', maps);

                            if (!_.exists(maps)) return;

                            return _.getSelectedItem(maps);

                        },

                        function() { 

                            var campus = _.getSelectedItem(campuses_.models);

                            console.log('selected campus!', campuses_, campus);

                            console.log('maps_.models@', maps_.models);

                            // Then, return the selected campuses maps
                            return _.exists(campus) ? _.filter(maps_.models, function(map) { return map.getAttr('campusid') === campus.getAttr('campusid'); }) : undefined;

                        }

                    )
                    
                    // function() { 

                    //     // The selected campus
                    //     var campus = _.getItemById(campuses_.models),

                    //         campusSpecificMaps = _.exists(campus) && campus.get('maps') || [];

                    //     return _.getSelectedItem(campusSpecificMaps);

                    // }

                ),

                maps: function() { return maps_; },

                // Data pre-fetched so just return it
                fetch: function() { return campuses_; },

                campuses: campuses_

            };

        }

    };

});
