
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

                    if (model.emphasis > 3 || model.selected === true) return;

                    return 'label-hide icon-hide'; // Show all label

                },

                function(model, zoom) { // Location Model

                    if (zoom <= 15) return;

                    return model.selected !== true ? true : 'active shadow'; // Show all label
                    

                    //return StrategyManager.getIconPath('circle_solid_center-big.png');

                },

                function(model, zoom) { // Location Model

                    
                    return model.details !== true ? 'label-hide icon-hide' : 'details';

                    //if (model.selected !== true) return;

                    //return StrategyManager.getIconPath('circle_solid_center-big.png');

                }

            ]

        };

    }

});
