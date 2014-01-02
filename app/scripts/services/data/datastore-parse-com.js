/*global define*/

define([

    'jquery',

    'underscore',

    'backbone',

    'datainterface',

    'parsecom'

], function($, _, Backbone, DataInterface, Parse) {

    'use strict';

    console.info('Datastore Parse.com');

    Parse.initialize("50A3Vx6JKSbeINjTrYH87uwRZWRvTsOShHnHImME", "V3huNugdDBVz8wPyXLXGfR9qn7n5QqM6bCZRP0OF");

    //// Private ////

    var campuses_ = new Parse.Collection(),

        // To do: campuses have no data yet, this needs to move.
        maps_ = new Parse.Collection(),

        fns_ = DataInterface.initialize(campuses_, maps_);


    // Wrap the Parse.com in a jquery deferred obj for consistency
    function fetch_() {

        var dfd = $.Deferred(), query;
        
        query = new Parse.Query('Campus')
        
        // Include nested object data in instead of just pointers to object ids
        .include('maps', 'maps.locations')
        
        .find({
            
            success: function(list) {

                campuses_.add(list, { silent: true });

                var m = DataInterface.utils.createMapList(campuses_);

                
                
                maps_.add(m, { silent: true });

                dfd.resolve( 'success' );
                
            },
            
            error: function() {
                
                alert('error');
                
                dfd.reject( 'error' );
                
            }
            
        });
                    
        return dfd.promise();           
                    
    }

    //// Public ////

    return _.extend(fns_, { fetch: fetch_ });

});
