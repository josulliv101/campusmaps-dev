
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

                    var pos = ' ', classname;

                    if (_.getAttr(model, 'labelplacement')) pos = pos + _.getAttr(model, 'labelplacement');

                    classname = _.getAttr(model, 'accessibility') > 0 ? ' accessibility-' + _.getAttr(model, 'accessibility') : ' label-hide icon-hide';

                    return pos + ' emphasis' + classname + ' ';

                }

            ]

        };

    }

});
