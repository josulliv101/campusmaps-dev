/*global define*/

define([

    'underscore',

    'backbone',

    'datainterface'

], function(_, Backbone, DataInterface) {

    'use strict';

    //// Private ////

    var fns_, url_ = 'http://s125381.gridserver.com/data/data.json',

        campuses_ = new Backbone.Collection();


    fns_ = DataInterface.initialize(campuses_);

    campuses_.url = url_;
    

    function fetch_() {

        return campuses_.fetch({ 

            jsonpCallback: 'cb',  dataType: 'jsonp',

            success: function(coll, data){

                return campuses_.reset(data.results, { silent: true });
            }
        });
    }

    //// Public ////

    return _.extend(fns_, { fetch: fetch_ });

});
