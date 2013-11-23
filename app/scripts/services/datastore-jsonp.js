/*global define*/

define([
    
    'jquery',

    'underscore',

    'backbone',

    'scripts/services/datastore-interface'

], function($, _, Backbone, DataInterface) {

    'use strict';


    //// Private ////


    var campuses_, 

        url_ = 'http://s125381.gridserver.com/data/data.json'; 

    // A collection of campuses, each with an array of maps -- each map has an array of locations.
    campuses_ = new Backbone.Collection([]);

    campuses_.url = url_;

    function fetch_() {

        return campuses_.fetch({ 

            jsonpCallback: 'cb', 

            dataType: 'jsonp',

            success: function(coll, data){

                console.info('!data', coll, data.results);

                campuses_.add(data.results, { silent: true });

                return data;

            }

        });
    }


    //// Public ////

    var obj = DataInterface.initialize(campuses_);

    return _.extend(obj, { fetch: fetch_ });

});
