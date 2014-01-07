
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'icon-default', 

            type: 'icon',

            fns: [

                function(model, zoom) { // Location Model

                    if (model.selected !== true) return;

                    return StrategyManager.getIconPath('circle_solid_center-big.png');

                },

                function(model, zoom) { // Location Model

                    var emphasis = parseInt(_.getAttr(model, 'emphasis'));

                    if (emphasis > 3) return;

                    return StrategyManager.getIconPath('circle_outline_center.png');

                },

                function(model, zoom) { // Location Model

                    var emphasis = parseInt(_.getAttr(model, 'emphasis'));

                    if (emphasis <= 3) return;

                    return StrategyManager.getIconPath('square_solid_center.gif');

                }

            ]

        };

    }

});
