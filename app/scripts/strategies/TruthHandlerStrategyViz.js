
define([

      'underscore'

    , 'scripts/domManager'

    , 'datastore'

    , 'scripts/services/map/MapUtils'

], function(_, DomManager, Datastore, MapUtils) {

    'use strict';

    return function(StrategyManager) { 

        return {

            id: 'truth-handler-viz', 

            type: StrategyManager.TYPE.TRUTH_HANDLER_VIZ,

            fns: [

                // If multiple attributes change at once, process them individually with same strategy
                function(controller,  viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs);

                    if (_.size(changedAttrs) <= 1) return;

                    _.each(changedAttrs, function(val, key) {

                        console.log('this strategy', this, _.size(changedAttrs));

                        var strategy = StrategyManager.getStrategy(StrategyManager.TYPE.TRUTH_HANDLER_VIZ),

                            attr = {};

                        attr[key] = val;
                        
                        strategy.strategy(controller, viz, attr, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom);

                        //debugger;

                    });

                    return true;

                },

                // A full refreshing (labels & icons) of the map is needed if campus or campusmap changes
                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) {

                    var  keys = _.keys(changedAttrs),

                         latlng, locationModels = [];

                    if (keys.length !== 1 || !_.contains(keys, 'campusmap')) return;

/*                   locationModels = controller.setIconsAndLabels(allLocations, campus.iconStrategy, campus.labelStrategy, zoom);

                    MapUtils.resetCache();

                    controller.setTileCache(locationModels);

                    latlng = _.getAttr(campusmap, 'latlng');

                    if (latlng) viz.refresh(latlng);

                    //viz.renderIcons(locationModels);

                    viz.renderLabels(locationModels);

                    console.log('viz strategy - vizpath changed', viz, changedAttrs, locationModels);*/
//debugger;
                    return true;
                    
                },

                // Campus changed
                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) {

                    var attrs = ['campusid'],

                        keys = _.keys(changedAttrs),

                        latlng;

                    if (!_.isObject(campus) || keys.length !== 1 || !_.contains(keys, 'campusid')) return;

                    latlng = _.getAttr(campus, 'latlng');

                    //if (latlng) viz.refresh(latlng);

                   // console.log('viz strategy - vizpath changed', viz, changedAttrs, models);
//debugger;
                    return true;
                    
                },

                // Tile mouse is over has changed
                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs), val, locs;

                    if (keys.length !== 1 || !_.contains(keys, 'tile')) return;

                    return true;

                },

                // Label Strategy has changed
                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs), locationModels = [];

                    if (keys.length !== 1 || !_.contains(keys, 'labelstrategy')) return;

/*                    locationModels = controller.setIconsAndLabels(allLocations, campus.iconStrategy, campus.labelStrategy, zoom);

                    viz.renderLabels(locationModels);*/

                    return true;

                },

                // Selected location(s)
                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs), latlng;

                    if (keys.length !== 1 || !_.contains(keys, 'locationid')) return;

/*                    latlng = _.getAttr(campus, 'latlng');

                    //viz.renderLabels(models);

                    viz.refreshLabels(campusmap.selectedLocations);

                    //viz.renderIcons(models);

                    if (locations && _.size(locations) === 1) {

                        latlng = _.getAttr(_.first(locations), 'latlng');

                        //if (latlng) viz.setCenter(latlng, centerOffset);

                    }*/

                    return true;

                },

                // Details for location
                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs), loc, refreshLabels = [], center;

                    if (keys.length !== 1 || !_.contains(keys, 'details')) return;
/*
                    if (_.isObject(campusmap.details)) refreshLabels.push(campusmap.details);

                    if (_.isObject(campusmap.detailsPrevious)) refreshLabels.push(campusmap.detailsPrevious); 

                    loc = campusmap.details;

                    if (loc) viz.refreshLabels(refreshLabels);*/

                    if (!campusmap.details) return;

                    loc = campusmap.details;

                    center = loc.bounds && loc.bounds.getCenter().toUrlValue() || loc.latlng;

                    //if (campusmap.details) viz.setCenter(center, { x: 200, y: -60 });

                    return true;

                },

                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'cursor')) return;

                    viz.setCursor(changedAttrs.cursor);

                    return true;

                },

                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'panoramadetails')) return;
//debugger;
                    //viz.setPanorama(changedAttrs.panoramadetails);
                    //alert(zoom);
                    

                    return true;

                },

                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs), DM, classname, val, withinRadius, centerLat, centerLng;

                    if (keys.length !== 1 || !_.contains(keys, 'panoramahighlight')) return;
//      
                    if (!campusmap.details) return;

                    val = changedAttrs.panoramahighlight;

                    //if (!_.isObject(val)) return true;

                    centerLat = campusmap.details.latlng[0];

                    centerLng = campusmap.details.latlng[1];

                    
 
                    DM = DomManager.getInstance();

                    classname = 'panoramahighlight';
               
                    //viz.setPanorama(changedAttrs.panoramadetails);
                    viz.setPanoramaHighlight(val);
                    
                    DM.cssFlag(classname, { remove: !_.isObject(val) || !MapUtils.isWithinRadius(_.latLngObj(campusmap.details.latlng), _.latLngObj(val.latlng), zoom, 100) });

                    return true;

                },

                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'panoramas')) return;

                    viz.showPanoramas(changedAttrs.panoramas);

                    return true;

                },

                // Map center offset
                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs), latlng;

                    if (keys.length !== 1 || !_.contains(keys, 'mapcenteroffset')) return;

                    // Don't like this, handle better way
                    if (locations && _.size(locations) === 1) {

                        latlng = _.getAttr(_.first(locations), 'latlng');

                        if (latlng) viz.setCenter(latlng, centerOffset);

                    } else if (center) {

                        viz.setCenter(center, centerOffset);

                    }

                    return true;

                },

                // Icon Strategy has changed
                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs), locationModels = [];

                    if (keys.length !== 1 || !_.contains(keys, 'iconstrategy')) return;

/*                    locationModels = controller.setIconsAndLabels(allLocations, campus.iconStrategy, campus.labelStrategy, zoom);

                    viz.renderIcons(locationModels);*/

                    return true;

                },

                // Maptype has changed
                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs);

                    if (keys.length !== 1 || !_.contains(keys, 'maptype')) return;

                    viz.setMapType(changedAttrs['maptype']);

                    return true;

                },

                // Zoom has changed
                function(controller, viz, changedAttrs, previousAttrs, campus, campusmap, locations, allLocations, center, centerOffset, zoom) { 

                    var keys = _.keys(changedAttrs), locationModels = [];

                    if (keys.length !== 1 || !_.contains(keys, 'zoom')) return;
/*
                   locationModels = controller.setIconsAndLabels(allLocations, campus.iconStrategy, campus.labelStrategy, zoom);

                    MapUtils.resetCache();

                    controller.setTileCache(locationModels);

                    // Refresh needs to happen before zoom is updated
                    viz.renderIcons(locationModels);
 
                    viz.renderLabels(locationModels);
*/
                    //viz.setZoom(changedAttrs['zoom']);

                    return true;

                }

            ]

        };

    }

});
