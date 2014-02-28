
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'parking', 

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

                    if (!_.getAttr(model, 'details')) return;

                    if (_.getAttr(model, 'labelplacement')) pos = pos + _.getAttr(model, 'labelplacement');

                    return pos + ' emphasis' + _.getAttr(model, 'emphasis') + ' icon-star';

                },

                function(model, zoom) { // Location Model

                    var pos = ' ', classname;

                    if (_.getAttr(model, 'type') !== 'parking') return;

                    if (_.getAttr(model, 'labelplacement')) pos = pos + _.getAttr(model, 'labelplacement');

                    return pos + ' emphasis' + classname + ' icon-parking';

                }

            ]

        };

    }

});
