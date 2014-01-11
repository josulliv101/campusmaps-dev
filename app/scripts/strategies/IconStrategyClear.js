
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'clear', 

            type: StrategyManager.TYPE.ICON,

            fns: [

                function(model, zoom) {

                    return StrategyManager.getIconPath('clear.png');

                }

            ]

        };

    }


});
