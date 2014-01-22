
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'label-default', 

            type: StrategyManager.TYPE.LABEL,

            fns: [

                function(model, zoom) { // Location Model

                    if (model.featured !== true) return;

                    return 'active featured shadow'; // Show all label
                    

                    //return StrategyManager.getIconPath('circle_solid_center-big.png');

                },

                function(model, zoom) { // Location Model

                    if (model.emphasis > 3 || model.featured === true || model.selected === true) return;

                    return 'label-hide'; // Show all label
                    

                    //return StrategyManager.getIconPath('circle_solid_center-big.png');

                },

                function(model, zoom) { // Location Model

                    if (zoom < 14) return;

                    return model.selected !== true ? true : 'active shadow'; // Show all label
                    

                    //return StrategyManager.getIconPath('circle_solid_center-big.png');

                },

                function(model, zoom) { // Location Model

                    
                    return model.selected !== true ? undefined : 'active shadow';

                    //if (model.selected !== true) return;

                    //return StrategyManager.getIconPath('circle_solid_center-big.png');

                }

            ]

        };

    }

});
