
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'big', 

            type: StrategyManager.TYPE.LABEL,

            fns: [

                function(model, zoom) { // Location Model

                    if (model.emphasis < 4) return; 

                    return true; // Show all label

                    //if (model.selected !== true) return;

                    //return StrategyManager.getIconPath('circle_solid_center-big.png');

                }

            ]

        };

    }

});
