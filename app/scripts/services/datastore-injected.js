define([

    'backbone',

    'scripts/services/datastore-interface',

    'datamodel'

], function(Backbone, DataInterface, DataModel) {

    'use strict';

    //// Private ////

    var campuses_ = new Backbone.Collection(DataModel);

    //// Public ////
    
    return DataInterface.initialize(campuses_);

});
