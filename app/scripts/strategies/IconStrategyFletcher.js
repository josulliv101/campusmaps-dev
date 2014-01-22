
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        var path = StrategyManager.getIconPath;
        
        return {

            id: 'fletcher', 

            type: StrategyManager.TYPE.ICON,

            fns: [

                function(model, zoom) { // Location Model

                    return StrategyManager.path('circle_solid_center.png');

                }

            ]

        };

    }


});
