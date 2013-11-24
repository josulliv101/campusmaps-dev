define([

    'backbone',

    'datainterface',

    'datamodel'

], function(Backbone, DataInterface, DataModel) {

    'use strict';

    //// Private ////

    var campuses_ = new Backbone.Collection(DataModel);

    //// Public ////
    
    // Each Datastore makes use of a reusable interface which defines available functions
    return DataInterface.initialize(campuses_);

});
