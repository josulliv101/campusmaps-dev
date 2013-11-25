define([

    '_mixins'

], function(_) {

    'use strict';


    //// Private ////
    
    function createMapList_(campuses) {

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

            var campuses_ = campuses, maps_ = maps;

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
                    _.partial(_.getItemById, maps_.models),

                    // Return the selected campus if no match found
                    function() { 

                        // The selected campus
                        var campus = _.getItemById(campuses_.models);

                        return _.exists(campus) ? _.getSelectedItem(campus.get('maps')) : undefined; 

                    }

                ),

                maps: function() { return maps_; },

                // Data pre-fetched
                fetch: function() { return campuses_; },

                campuses: campuses_

            };

        }

    };

});
