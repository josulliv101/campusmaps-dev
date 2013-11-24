/*global define*/

define([

    'jquery',

    'underscore',

    'backbone',

    'scripts/services/datastore-interface',

    'parsecom'

], function($, _, Backbone, DataInterface, Parse) {

    'use strict';

    Parse.initialize("50A3Vx6JKSbeINjTrYH87uwRZWRvTsOShHnHImME", "V3huNugdDBVz8wPyXLXGfR9qn7n5QqM6bCZRP0OF");

    //// Private ////

    var campuses_ = new Parse.Collection(),

        fns_ = DataInterface.initialize(campuses_);


    function fetch_() {

        var dfd = $.Deferred(), query;
        
        query = new Parse.Query('Campus')
        
        // Include nested object data in instead of just pointers to object ids
        .include('maps', 'maps.locations')
        
        .find({
            
            success: function(list) {

                campuses_.add(list, { silent: true });

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
