
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'truth-handler-viz', 

            type: StrategyManager.TYPE.TRUTH_HANDLER_VIZ,

            fns: [

                function(changedAttrs) { // The Viz & an object of the Truth attributes that have changed

                    if (!_.has(changedAttrs, 'vizpath')) return; // Show all label

                    console.log('viz strategy - vizpath changed', changedAttrs);

                },

                function(changedAttrs) { // The Viz & an object of the Truth attributes that have changed

                    console.log('viz strategy - other changed', changedAttrs);

                    return true;

                }

            ]

        };

    }

});
