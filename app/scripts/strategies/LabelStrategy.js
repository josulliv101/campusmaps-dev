
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

                    if (!model.featured) return;

                    return 'emphasis' + model.emphasis + ' icon-star';

                },

                function(model, zoom) { // Location Model

                    if (zoom < 19) return;

                    model.hide = false;

                    return 'emphasis' + model.emphasis + ' icon-xsmall';

                },

               function(model, zoom) { 

                    var classname;

                    if (zoom !== 18) return;

                    if (model.emphasis < 3) return;

                    classname = model.emphasis === 3 ? ' icon-circle-small' : ' icon-small';

                    model.hide = false;

                    return 'emphasis' + model.emphasis + classname; // Show all label

                },

               function(model, zoom) { 

                    if (zoom !== 17) return;

                    if (model.emphasis < 5) return;

                    model.hide = false;

                    return 'emphasis' + model.emphasis + ' icon-xsmall'; // Show all label

                },

                function(model, zoom) { // Location Model

                    if (zoom > 17) return;

                    model.hide = true;

                    return 'label-hide icon-hide'; 

                },


                function(model, zoom) { 

                    model.hide = true;

                    return 'label-hide icon-hide'; 

                }



/*
                function(model, zoom) { // Location Model

                   // if (model.emphasis > 2 || model.selected === true) return;

                   // return 'label-hide icon-hide'; // Show all label

                },

                function(model, zoom) { // Location Model

                    if (model.collision !== true) return;

                    return 'label-hide icon-hide';

                },

                function(model, zoom) { // Location Model

                    if (model.emphasis > 1) return;

                    return 'emphasis' + model.emphasis + ' icon-xsmall'; // Show all label

                },

                function(model, zoom) { // Location Model

                    if (model.emphasis > 2) return;

                    return 'emphasis' + model.emphasis + ' icon-circle-small'; // Show all label

                },


                function(model, zoom) { // Location Model

                    if (model.emphasis !== 3) return;

                    return 'emphasis' + model.emphasis + ' icon-marker'; // Show all label

                },

                function(model, zoom) { // Location Model

                    var position = model['label-position'] ? model['label-position'] : true;

                    if (zoom <= 15) return;

                    return model.selected !== true ? position : position + ' active shadow'; // Show all label
                    

                    //return StrategyManager.getIconPath('circle_solid_center-big.png');

                },

                function(model, zoom) { // Location Model

                    return model.details !== true ? 'label-hide icon-hide' : 'details';

                }*/

            ]

        };

    }

});
