
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

                    if (!_.getAttr(model, 'featured')) return;

                    return 'emphasis' + _.getAttr(model, 'emphasis') + ' icon-star';

                },

                function(model, zoom) { // Location Model

                    if (zoom < 19) return;

                    model.hide = false;

                    return 'emphasis' + _.getAttr(model, 'emphasis') + ' icon-xsmall';

                },

               function(model, zoom) { 

                    var classname, emphasis;

                    if (zoom !== 18) return;

                    emphasis = parseInt(_.getAttr(model, 'emphasis'));

                    if (emphasis < 2) return;

                    classname = emphasis === 2 ? ' icon-circle-small' : ' ';
debugger;
                    model.hide = false;

                    return 'emphasis' + emphasis + classname; // Show all label

                },

               function(model, zoom) { 

                    var emphasis;

                    if (zoom !== 17) return;

                    emphasis = parseInt(_.getAttr(model, 'emphasis'));

                    if (emphasis < 4) return;

                    model.hide = false;

                    return 'emphasis' + _.getAttr(model, 'emphasis') + ' icon-xsmall'; // Show all label

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
