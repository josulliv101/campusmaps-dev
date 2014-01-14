
define([

      'underscore'

    , 'datastore'

], function(_, Datastore) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'truth-handler-viz', 

            type: StrategyManager.TYPE.TRUTH_HANDLER_VIZ,

            fns: [

                // If multiple attributes change at once, process them individually with same strategy
                function(viz, changedAttrs, models, campus, campusmap, locations) { 

                    var keys = _.keys(changedAttrs);

                    if (_.size(changedAttrs) <= 1) return;

                    _.each(changedAttrs, function(val, key) {

                        console.log('this strategy', this, _.size(changedAttrs));

                        var strategy = StrategyManager.getStrategy(StrategyManager.TYPE.TRUTH_HANDLER_VIZ),

                            attr = {};

                        attr[key] = val;
                        
                        strategy.strategy(viz, attr, models, campus, campusmap, locations);

                        //debugger;

                    });

                    return true;

                },

                // A full refreshing (labels & icons) of the map is needed if campus or campusmap changes
                function(viz, changedAttrs, models, campus, campusmap, locations) {

                    var attrs = ['campusmap'],

                        keys = _.keys(changedAttrs),

                        latlng;

                    if (_.intersection(keys, attrs).length === 0) return; 

                    latlng = _.getAttr(campusmap, 'latlng');

                    if (latlng) viz.refresh(latlng);

                    viz.renderIcons(models);

                    viz.renderLabels(models);

                    console.log('viz strategy - vizpath changed', viz, changedAttrs, models);
//debugger;
                    return true;
                    
                },

                // A full refreshing (labels & icons) of the map is needed if campus or campusmap changes
                function(viz, changedAttrs, models, campus, campusmap, locations) {

                    var attrs = ['campusid'],

                        keys = _.keys(changedAttrs),

                        latlng;

                    if (!_.isObject(campus) || keys.length !== 1 || !_.contains(keys, 'campusid')) return;

                    latlng = _.getAttr(campus, 'latlng');

                    //if (latlng) viz.refresh(latlng);

                   // console.log('viz strategy - vizpath changed', viz, changedAttrs, models);
//debugger;
                    return true;
                    
                },

                // Label Strategy has changed
                function(viz, changedAttrs, models, campus, campusmap, locations) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'labelstrategy')) return;

                    viz.renderLabels(models);

                    return true;

                },

                // Selected location(s)
                function(viz, changedAttrs, models, campus, campusmap, locations) { 

                    var keys = _.keys(changedAttrs), latlng;

                    if (keys.length !== 1 || !_.contains(keys, 'locationid')) return;

                    latlng = _.getAttr(campus, 'latlng');

                    viz.renderLabels(models);

                    viz.renderIcons(models);

                    if (locations && _.size(locations) === 1) {

                        latlng = _.getAttr(_.first(locations), 'latlng');

                        if (latlng) viz.refresh(latlng);

                    }

                    return true;

                },

                // Icon Strategy has changed
                function(viz, changedAttrs, models, campus, campusmap, locations) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'iconstrategy')) return;

                    viz.renderIcons(models);

                    return true;

                },

                // Maptype has changed
                function(viz, changedAttrs, models, campus, campusmap, locations) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'maptype')) return;

                    viz.setMapType(changedAttrs['maptype']);

                    return true;

                },

                // Zoom has changed
                function(viz, changedAttrs, models, campus, campusmap, locations) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'zoom')) return;

                    viz.setZoom(changedAttrs['zoom']);

                    viz.renderIcons(models);

                    viz.renderLabels(models);

                    return true;

                }

            ]

        };

    }

});
