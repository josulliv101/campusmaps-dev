
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'truth-handler-viz', 

            type: StrategyManager.TYPE.TRUTH_HANDLER_VIZ,

            fns: [

                // If multiple attributes change at once, process them individually with same strategy
                function(viz, changedAttrs, models) { 

                    var keys = _.keys(changedAttrs);

                    if (_.size(changedAttrs) <= 1) return;

                    _.each(changedAttrs, function(val, key) {

                        console.log('this strategy', this, _.size(changedAttrs));

                        var strategy = StrategyManager.getStrategy(StrategyManager.TYPE.TRUTH_HANDLER_VIZ),

                            attr = {};

                        attr[key] = val;
                        
                        strategy.strategy(viz, attr, models);

                        //debugger;

                    });

                    return true;

                },

                // A full refreshing (labels & icons) of the map is needed if campus or campusmap changes
                function(viz, changedAttrs, models) {

                    var attrs = ['campusmap'],

                        keys = _.keys(changedAttrs);

                    if (_.intersection(keys, attrs).length === 0) return; 

                    viz.renderIcons(models);

                    console.log('viz strategy - vizpath changed', viz, changedAttrs, models);
//debugger;
                    return true;
                    
                },

                // Icon Strategy has changed
                function(viz, changedAttrs, models) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'iconstrategy')) return;

                    viz.renderIcons(models);

                    return true;

                },

                // Maptype has changed
                function(viz, changedAttrs, models) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'maptype')) return;

                    viz.setMapType(changedAttrs['maptype']);

                    return true;

                },

                // Zoom has changed
                function(viz, changedAttrs, models) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'zoom')) return;

                    viz.setZoom(changedAttrs['zoom']);

                    return true;

                }

            ]

        };

    }

});
