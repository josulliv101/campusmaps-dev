
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'fletcher', 

            type: StrategyManager.TYPE.ICON,

            fns: [

                function(model, zoom) { // Location Model

                    return StrategyManager.getIconPath('circle_solid_center.png');

                }

            ]

        };

    }


});
