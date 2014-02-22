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

        fns_ = DataInterface.initialize(campuses_, maps_),

        classLocation_ = Parse.Object.extend({className: "Location"});


    // Wrap the Parse.com in a jquery deferred obj for consistency
    function fetch_() {

        var dfd = $.Deferred(), query;
        
        query = new Parse.Query('Campus')
        
        // Include nested object data in instead of just pointers to object ids
        .include('maps', 'maps.locations')
        
        .find({
            
            success: function(list) {

                var campus, defaults;

                campuses_.add(list, { silent: true });

                var m = DataInterface.utils.createMapList(campuses_);

                maps_.add(m, { silent: true });

                campus = _.find(campuses_.models, function(model) { return _.getAttr(model, 'default') === true; });

                defaults = !!campus ? _.pick(campus.toJSON(), 'campusid', 'defaultmap', 'latlng', 'zoom') : {};

                defaults.campusmap = defaults.defaultmap;

                delete defaults.defaultmap;

                dfd.resolve( defaults );
                
            },
            
            error: function() {
                
                alert('error');
                
                dfd.reject( 'error' );
                
            }
            
        });
                    
        return dfd.promise();           
                    
    }

    //// Public ////

    return _.extend(fns_, { fetch: fetch_, Location: classLocation_ });

    // , Factory: { model: function(attrs) { return new Backbone.Model(attrs); }}

});
