define([

    'backbone',

    'datainterface',

    'datamodel'

], function(Backbone, DataInterface, DataModel) {

    'use strict';

    console.info('Datastore Injected');

    //// Private ////

    var campuses_ = new Backbone.Collection(DataModel),

        maps_ = new Backbone.Collection(DataInterface.utils.createMapList(campuses_));

    console.log('Data injected::campuses', campuses_.models.length);

    console.log('Data injected::maps', maps_.models.length);

    //// Public ////
    
    // Each Datastore makes use of a reusable interface which defines available functions
    return DataInterface.initialize(campuses_, maps_);

});
