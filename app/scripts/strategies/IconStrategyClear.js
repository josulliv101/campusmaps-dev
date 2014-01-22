
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        var path = StrategyManager.getIconPath;
        
        return {

            id: 'clear', 

            type: StrategyManager.TYPE.ICON,

            fns: [

                function(model, zoom) {

                    return StrategyManager.path('clear.png');

                }

            ]

        };

    }


});
