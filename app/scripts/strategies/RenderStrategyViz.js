
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
*/
                // Zoom is always first. It always does a label refresh automatically since all new tiles are loaded.
                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    var models, keys;

                    keys = _.keys(changedAttrs);

                    if (!_.contains(keys, 'zoom')) return;  

                    models = controller.setIconsAndLabels(locations, campus.iconStrategy, campus.labelStrategy, zoom);

                    MapUtils.resetCache();

                    controller.setTileCache(models);

                    viz.renderIcons(models);
                  
                    // Label refresh gets taken care of since zoom requires all new tiles loaded
                    //viz.renderLabels(models);
                    
                    // Handle here instead of TruthHandler because resetCache needs to happen before zoom changes.
                    viz.setZoom(changedAttrs['zoom']);

                    return true;              

                },


                // The details location changes
                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    var models, keys;

                    keys = _.keys(changedAttrs);

//_.size(keys) !== 1 || 
//
                    if (!_.contains(keys, 'details')) return;  

                    //models = controller.setIconsAndLabels(locations, campus.iconStrategy, campus.labelStrategy, zoom);

                    //MapUtils.resetCache();

                    //controller.setTileCache(models);

                    //viz.renderIcons(models);
                    
                    //viz.renderLabels(models);

                    viz.refreshLabels(locations);

                    return true;                 

                },

                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    var models, keys;

                    keys = _.keys(changedAttrs);

                    if (!_.contains(keys, 'highlight')) return;  

                    viz.refreshLabels(locations);

                    return true;        

                },

                // The label strategy changes -- always refresh all
                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    var models, keys;

                    keys = _.keys(changedAttrs);

                    if (!_.contains(keys, 'labelstrategy')) return;  

                    models = controller.setIconsAndLabels(locations, campus.iconStrategy, campus.labelStrategy, zoom);

                    MapUtils.resetCache();

                    controller.setTileCache(models);

                    viz.renderIcons(models);
                    
                    viz.renderLabels(models);

                    return true;                 

                },


                // The campusmap changes -- always refresh all
                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    var models, keys;

                    keys = _.keys(changedAttrs);

                    if (!_.contains(keys, 'campusmap')) return;  

                    models = controller.setIconsAndLabels(locations, campus.iconStrategy, campus.labelStrategy, zoom);

                    MapUtils.resetCache();

                    controller.setTileCache(models);

                    viz.renderIcons(models);
                    
                    viz.renderLabels(models);

                    return true;                 

                },

                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    var keys = _.keys(changedAttrs), val, locs;

                    if (keys.length !== 1 || !_.contains(keys, 'tile')) return;

                    viz.refreshLabels(locations);

                    return true;

                }

                // There's no default, a render may not always be needed
/*                function(controller, viz, locations, campus, zoom, changedAttrs, previousAttrs) { 

                    //var models = controller.setIconsAndLabels(locations, campus.iconStrategy, campus.labelStrategy, zoom);

                    //MapUtils.resetCache();

                    //controller.setTileCache(models);

                    //viz.render(models);                    

                    return true;

                } */              

            ]

        };

    }

});
