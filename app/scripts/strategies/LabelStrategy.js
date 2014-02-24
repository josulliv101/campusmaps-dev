
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

                    var pos = ' ';

                    if (!_.getAttr(model, 'featured')) return;

                    if (_.getAttr(model, 'labelplacement')) pos = pos + _.getAttr(model, 'labelplacement');

                    return pos + ' emphasis' + _.getAttr(model, 'emphasis') + ' icon-star';

                },

                function(model, zoom) { // Location Model

                    var pos = ' ';

                    if (zoom < 19) return;

                    if (_.getAttr(model, 'labelplacement')) pos = pos + _.getAttr(model, 'labelplacement');

                    model.hide = false;

                    return pos + ' emphasis' + _.getAttr(model, 'emphasis') + ' icon-xsmall';

                },

               function(model, zoom) { 

                    var classname, emphasis, pos = ' ';

                    if (zoom !== 18) return;

                    emphasis = parseInt(_.getAttr(model, 'emphasis'));

                    if (emphasis < 2) return;

                    if (_.getAttr(model, 'labelplacement')) pos = pos + _.getAttr(model, 'labelplacement');

                    classname = emphasis === 2 ? ' icon-circle-small' : ' ';

                    model.hide = false;

                    return pos + ' emphasis' + emphasis + classname; // Show all label

                },

               function(model, zoom) { 

                    var emphasis, pos = ' ';

                    if (zoom !== 17) return;

                    emphasis = parseInt(_.getAttr(model, 'emphasis'));

                    if (emphasis < 4) return;

                    if (_.getAttr(model, 'labelplacement')) pos = pos + _.getAttr(model, 'labelplacement');

                    model.hide = false;

                    return pos + ' emphasis' + _.getAttr(model, 'emphasis') + ' icon-xsmall'; // Show all label

                },

                function(model, zoom) { // Location Model

                    var pos = ' ';

                    if (zoom > 17) return;

                    if (_.getAttr(model, 'labelplacement')) pos = pos + _.getAttr(model, 'labelplacement');

                    model.hide = true;

                    return pos + ' label-hide icon-hide'; 

                },


                function(model, zoom) { 

                    var pos = ' ';

                    model.hide = true;

                    if (_.getAttr(model, 'labelplacement')) pos = pos + _.getAttr(model, 'labelplacement');

                    return pos + ' label-hide icon-hide'; 

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

                    var position = model['labelplacement'] ? model['labelplacement'] : true;

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
