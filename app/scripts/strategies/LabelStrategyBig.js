
define([

    'underscore'

], function(_) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'big', 

            type: StrategyManager.TYPE.LABEL,

            fns: [

                function(model, zoom) { // Location Model

                    var pos = ' ';

                    if (_.getAttr(model, 'labelplacement')) pos = pos + _.getAttr(model, 'labelplacement');

                    return pos + ' emphasis' + _.getAttr(model, 'emphasis') + ' icon-greenery';

                }

            ]

        };

    }

});
