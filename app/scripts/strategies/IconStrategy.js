
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

                    return path('clear16x16.png');
                    
                    if (model.emphasis === 3 || model.selected === true) return;
                    
                    //if (model.name.indexOf('Center') > -1) return path('clear16x16.png');;

                    return false; // Show all label

                },

                function(model, zoom) { // Location Model

                    if (zoom <= 15) return;

                    return path('clear16x16.png'); // Show all label
                    

                    //return StrategyManager.getIconPath('circle_solid_center-big.png');

                },

                function(model, zoom) { // Location Model

                    
                    return model.details !== true ? false : path('clear16x16.png');

                }
/*
                function(model, zoom) { 

                    if (zoom > 15) return;

                    return false; 

                },

                function(model, zoom) { // Location Model

                    return path('clear16x16.png');

                },

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
*/
            ]

        };

    }

});
