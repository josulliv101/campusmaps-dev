
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 
        
console.log(StrategyManager);

        var path = StrategyManager.getIconPath;

        return {

            id: 'icon-default', 

            type: StrategyManager.TYPE.ICON,

            fns: [

                function(model, zoom) { // Location Model

                    if (model.selected !== true) return;

                    return path('circle_solid_center-big.png');

                },

                function(model, zoom) { // Location Model

                    if (zoom > 15) return;

                    return path('clear.png');

                },

                function(model, zoom) { // Location Model

                    var emphasis = parseInt(_.getAttr(model, 'emphasis'));

                    if (emphasis > 3) return;

                    return path('circle_outline_center.png');

                },

                function(model, zoom) { // Location Model

                    var emphasis = parseInt(_.getAttr(model, 'emphasis'));

                    if (emphasis <= 3) return;

                    return path('diamond_solid_center.png');

                }

            ]

        };

    }

});
