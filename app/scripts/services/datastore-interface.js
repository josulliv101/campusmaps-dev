define([

    '_mixins'

], function(_) {

    'use strict';

    //// Public ////

    return {

        initialize: function(campuses) {

            var campuses_ = campuses;

            return {

                // A function to get the current campus, or set it if there's an <String>id or <Integer>index arg passed in
                campus: _.dispatch(

                    // First try to find a campus by an "id" attribute, can accept custom id attr in options arg
                    function(id, options) { return _.getItemById(campuses_.models, id, options); },

                    // Return the selected campus if no match found
                    function() { return _.getSelectedItem(campuses_.models); }

                ),

                // A function to get the current map, or set it if there's an <String>id or <Integer>index arg passed in
                map: function() {},

                // Data pre-fetched
                fetch: function() { 

                    console.info('fetch', campuses_.toString());

                    return campuses_; 

                },

                campuses: campuses_

            };

        }

    };

});
