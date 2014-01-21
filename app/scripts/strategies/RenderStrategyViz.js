
define([

      'underscore'

    , 'datastore'

    , 'scripts/services/map/MapUtils'

], function(_, Datastore, MapUtils) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'render-viz', 

            type: StrategyManager.TYPE.RENDER_VIZ,

            fns: [

/*                // Just the label strategy changes
                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'labelstrategy')) return;  

                    //return viz.renderLabels;                

                },

                // Just the icon strategy changes
                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'iconstrategy')) return;  

                    //return viz.renderIcons;                

                },

                // The selected locations changes
                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'locationid')) return;  

                    //return viz.refreshLabels;                

                },

                // The zoom changes, map will automatically do label map type update
                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    var keys = _.keys(changedAttrs), models;

                    if (keys.length !== 1 || !_.contains(keys, 'zoom')) return;  

                    models = controller.setIconsAndLabels(locations, campus.iconStrategy, campus.labelStrategy, zoom);

                    viz.setZoom(changedAttrs['zoom']);

                    viz.renderIcons(models);  

                    return true;              

                },
*/
                // The default, full render
                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    //var models = controller.setIconsAndLabels(locations, campus.iconStrategy, campus.labelStrategy, zoom);

                    //MapUtils.resetCache();

                    //controller.setTileCache(models);

                    //viz.render(models);                    

                    return true;

                }               

            ]

        };

    }

});
