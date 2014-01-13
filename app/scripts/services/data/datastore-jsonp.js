/*global define*/

define([

    'underscore',

    'backbone',

    'datainterface'

], function(_, Backbone, DataInterface) {

    'use strict';

    console.info('Datastore JSONP');

    //// Private ////

    var fns_, url_ = '/app/data/data.json', //url_ = 'http://s125381.gridserver.com/data/data.json',

        campuses_ = new Backbone.Collection(),

        maps_ = new Backbone.Collection();


    fns_ = DataInterface.initialize(campuses_, maps_);

    campuses_.url = url_;
    

    function fetch_() {

        var dfd = $.Deferred();

console.log('fetching data');

        // only want defaults settings returned, not all data. use custom deferred instead of the fetch's return value
        campuses_.fetch({ 

            jsonpCallback: 'cb',  

            dataType: 'jsonp',

            success: function(coll, data){

                maps_.add(DataInterface.utils.createMapList(campuses_), { silent: true });

                campuses_.reset(data, { silent: true });

                dfd.resolve( { deferred: 'defaults go here' });

            },

            error: function() {
                
                dfd.reject( 'error' );
                
            }
            
        });

        return dfd.promise(); 
    }

    //// Public ////

    return _.extend(fns_, { fetch: fetch_ });

});
