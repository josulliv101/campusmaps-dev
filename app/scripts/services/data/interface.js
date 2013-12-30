define([

    '_mixins',

    'backbone'

], function(_, Backbone) {

    'use strict';


    //// Private ////
    
    function createMapList_(campuses) {

        return _.chain(campuses.models)

                .map(function(campus) { return campus.get('maps'); })

                .reject(function(map) { return _.isUndefined(map); })

                .flatten()

                .value();

    }

    return {

        // Utility methods not part of interface
        utils: {

            createMapList: createMapList_

        },

        initialize: function(campuses, maps) {

            var campuses_ = campuses, maps_ = maps;


            //// Private ////


            function mapsMatchingCampus_(campus) {


                
                var maps;                

                if (!campus) return;

                maps = _.getAttr(campus, 'maps');

console.log('@maps', maps);

                if (_.isObject(campus)) {

                    var f = _.filter(maps, function(map) { 
console.log('@@', _.getAttr(map, 'campusid'), _.getAttr(campus, 'campusid'));
                        return _.getAttr(map, 'campusid') === _.getAttr(campus, 'campusid'); });

                    console.log('@matching maps for campus', campus, f);

                    return f;

                }
            }

            function getItemByIdWrapForMap_(fn) {

                // Bind the fn to the map model data
                var args = _.cat([maps_.models], _.rest(arguments)), optsArg = args[2];

                !optsArg || (_.extend(optsArg, { restrictItemsToCampus: true }));

                return fn.apply(null, args); 
            }

            function getSelectedCampus_() {

                return _.getSelectedItem(campuses_.models);

            }

            function selectFirstCampus_() {

                if (campuses_.models.length === 0) return;

                return _.getItemAt(campuses_.models, 0, { select: true });

            }

            function selectDefaultMapForCampus_(campus) {

                var mapid, maps;

                if (!_.exists(campus)) return;

                mapid = campus.get("defaultmap");

                maps = _.getAttr(campus, 'maps');

console.log('selectDefaultMapForCampus_!!!', mapid, maps);

                return _.getItemById(maps, mapid, { id: 'mapid', select: true });

            }

            // The Data Interface which every Datastore will implement
            return {

                // A function to get a campus, or if none found the selected one is returned
                campus: _.dispatch(

                    // Bind the campus models to getItemById so only an id & options args need to be passed in
                    _.partial(_.getItemById, campuses_.models),

                    // Return the selected campus if no match found
                    getSelectedCampus_,

                    // Return the first in list and select it
                    selectFirstCampus_

                ),

                // A function to get a map, or if none found the selected one of selected campus is returned
                map: _.dispatch(

                    // A campus object is passed in
                    _.compose(_.getSelectedItem, mapsMatchingCampus_),

                    // Bind the map models to getItemById so only an id & options need to be passed in
                    _.wrap(_.getItemById, getItemByIdWrapForMap_),

                    // Return the selected map if no match found
                    _.compose( _.getSelectedItem, mapsMatchingCampus_, function(arg) { console.log('arg', arg); return arg;}, getSelectedCampus_),

                    // Return the default map if none selected
                    _.compose(selectDefaultMapForCampus_, getSelectedCampus_)

                ),

                maps: function() { return maps_; },

                // Each datastore will overwrite this with its own way of fetching data
                fetch: function() { return campuses_; },

                campuses: function() { return campuses_; },

                Factory: {

                    model: function(attrs) { return new Backbone.Model(attrs); }
                    
                },

                JSON: {

                    campuses: function() { return _.map(campuses_.models, function(model) { 

                        return _.extend(model.toJSON(), { selected: model.selected }); 

                    }); }

                }

            };

        }

    };

});
