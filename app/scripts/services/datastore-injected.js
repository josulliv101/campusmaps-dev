define([

    'backbone',

    'scripts/services/datastore-interface',

    'data/data-static'

], function(Backbone, DataInterface, Data) {

    'use strict';

    //// Private ////

    var campuses_ = new Backbone.Collection(Data);

    //// Public ////

    console.info('campuses_.models length', campuses_);
    
    return DataInterface.initialize(campuses_);

});
