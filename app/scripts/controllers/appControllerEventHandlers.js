define([

    'scripts/domManager'

    , 'scripts/moduleManager'

    , 'scripts/controllers/vizController'

    , 'datastore'

    , 'strategies/iconStrategy'

    , 'strategies/StrategyManager'

    , 'eventdispatcher'

], function(DomManager, ModuleManager, VizController, Datastore, IconStrategy, StrategyManager, EventDispatcher) {

    'use strict';

    function AppControllerEventHandlers(AppController, controller) {

        var domManager = DomManager.getInstance(),

        $root = domManager.$root;

        AppControllerEventHandlers.prototype.getHandlers = function() {

            // Order matters, return functions off controller so this keyword remains intact
            return [

                controller.handleAttrCmd,

                controller.handleAttrLatLng,

                controller.handleAttrMapType,

                controller.handleAttrCampusMap,

                controller.handleAttrCampusId,

                controller.handleAttrZoom,

                controller.handleAttrLocationId,

                controller.handleAttrDetails,

                controller.handleVizPathChange,

                controller.handleAttrFullscreen,         

                controller.handleResize,

                controller.handleAttrStreetview,

                controller.handleAttrIconStrategy,

                controller.handleAttrLabelStrategy,

                controller.handleAttrMapCenterOffset

            ];

        }

        AppController.prototype.handleAttrFullscreen = function(model, val, key) {

            var prefix = 'map-';

            if (key !== 'fullscreen') return;

            console.log('handleAttrFullscreen');

            $root.one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {

                var $div = $('<div/>')

                            .addClass('overlay')

                            .appendTo($('body'));

                _.delay(function() { 

                    $root.css({ opacity: 1 })

                    $div.addClass('slideRight'); 

                }, 600);

            }); 

            domManager.cssFlag(prefix + key, { el: 'html' });

            return true;

        }

        AppController.prototype.handleVizPathChange = function(model, val, key) {

            var prefix = 'viz-',

                forced = model.attributes['vizpath!'],

                classname = 'hide-overlay';

            if (key !== 'vizpath') return;

            // vizpath can be forced
            if (forced) val = forced;


            console.log('...handleVizPathChange', model, val, key, model.changedAttributes());

            if (controller.vizController === undefined) {

                controller.vizController = new VizController();

                controller.vizController.init();

            }


            require([ val ], function (Viz) { 

                console.log('handleVizPathChange require returned', controller, model);

                // A controller for all viz's is listening
                EventDispatcher.trigger('change:viz', Viz);

                if (_.size(model.changedAttributes()) > 1) controller.dispatchTruth(model);

            });
            
            domManager.clearFlags();

            domManager.cssFlag(prefix + val);

            domManager.cssFlag(classname, { remove: val !== 'directory' });

            return true;

        }

        // Handle at local controller level
        AppController.prototype.handleAttrStreetview = function(model, val, key) {

            var classname = 'hide-overlay';

            if (key !== 'streetview') return;

            console.log('...handleAttrStreetview', model.cid, val, key);

            domManager.cssFlag(classname, { remove: !val });

            return true;

        }

        // Handle at global controller level, if needed, then delegate
        AppController.prototype.handleAttrCampusId = function(theTruth, val, key) {

            var campus;

            if (key !== 'campusid') return;

            console.log('...handleAttrCampusId', theTruth, val, key);

            // Make sure Datastore is updated before views get notified of change
            campus = Datastore.campus(val, { id: 'campusid', select: true });

            return true;

        }


        AppController.prototype.handleAttrDetails = function(theTruth, val, key) {

            var campus, campusmap, location;

            if (key !== 'details') return;

            campus = Datastore.campus();

            campusmap = Datastore.map(Datastore.campus());

    
            _.chain(Datastore.locations(campusmap))

             .reject(function(loc) { return loc.featured !== true; })

             .tap(function (all) { _.each(all, function(loc) { loc.details = false; }); })

             .value();

            if (_.isObject(campusmap.details)) {    

                campusmap.detailsPrevious = campusmap.details;

                campusmap.detailsPrevious.details = false;

            }

            location = Datastore.location(campusmap, val);

            if (_.isObject(location)) {

                location.details = true;

                campusmap.details = location;

            }

            return true;

        }

        // Handle at global controller level, if needed, then delegate
        AppController.prototype.handleAttrLocationId = function(theTruth, val, key) {

            // When a locationid change happens, it's assumed that the change applies to the currently selected map
            var campusmap, location, ids, locs, selected, classname = 'location-details', view = theTruth.get('cmd');

            if (key !== 'locationid') return;

            campusmap = Datastore.map(Datastore.campus());

            // Reset selected
            selected = _.resetItems(Datastore.locations(campusmap));

            locs = _.chain(val.split(','))

                    .map(function(id) { return Datastore.location(campusmap, id); })

                    .reject(function(loc) { return loc === undefined; })
                    //.each(function(loc) { loc.selected = true; })

                    .tap(function (all) { _.each(all, function(loc) { loc.selected = true; }); })

                    .value();

            campusmap.selectedLocations = locs;

            domManager.cssFlag(classname, { remove: locs.length !== 1 });

            return true;

        }

        // val can be <String> id or object
        // Handle at global controller level, if needed, then delegate
        AppController.prototype.handleAttrCampusMap = function(theTruth, val, key) {

            var campusmap;

            if (key !== 'campusmap') return;

            if (!(_.isObject(val) || _.isString(val))) return;

            campusmap = Datastore.map(val, { id: 'mapid', select: true, restrictItemsToCampus: true })

            console.log('...handleAttrCampusMap', theTruth, val, key);

            console.log('...handleAttrCampusMap campus',  Datastore.JSON.maps(), Datastore.mapList());

            return true;

        }

        // Handle at global controller level, if needed, then delegate --- +/- logic
        AppController.prototype.handleAttrZoom = function(model, val, key) {

            var campus, previousZoom;

            if (key !== 'zoom') return;

            campus = Datastore.campus();

            campus.zoom = _.isString(val) ? parseInt(val) : val;

            console.log('...handleAttrZoom', model, val, key, model.previous('maptype'));

            return true;

        }

        // Handle at global controller level
        AppController.prototype.handleAttrMapCenterOffset = function(model, val, key) {

            if (key !== 'mapcenteroffset') return;

            Datastore.mapCenterOffset = val;

            return true;

        }


        // Handle at local controller level
        AppController.prototype.handleAttrIconStrategy = function(model, val, key) {

            var campus, strategy = StrategyManager.getStrategy;

            if (key !== 'iconstrategy') return;

            campus = Datastore.campus();

            campus.iconStrategy = strategy(val) || strategy(StrategyManager.TYPE.ICON);

            return true;

        }

        AppController.prototype.handleAttrLabelStrategy = function(model, val, key) {

            var campus, strategy = StrategyManager.getStrategy;

            if (key !== 'labelstrategy') return;

            campus = Datastore.campus();

            campus.labelStrategy = strategy(val) || strategy(StrategyManager.TYPE.LABEL);

            return true;

        }

        // Handle at global controller level, if needed, then delegate
        AppController.prototype.handleResize = function(model, val, key) {

            var path = ModuleManager.getVizPath();

            if (key !== 'resize') return;

            console.log('...handleResize', model.cid, val, key);

            // Reset the resize attr as well
            if (val === true) EventDispatcher.trigger('truthupdate', { vizpath: path, resize: false });

            return true;

        }

        // Handle at a local controller level
        AppController.prototype.handleAttrCmd = function(model, val, key) {

            if (key !== 'cmd') return;

            console.log('...handleAttrCmd', model.cid, val, key);

            return true;

        }

        // Handle at global controller level
        AppController.prototype.handleAttrLatLng = function(model, val, key) {

            if (key !== 'latlng') return;

            console.log('...handleAttrLatLng', model.cid, val, key);

            Datastore.latlng = val;

            return true;

        }

        // Handle at global controller level, then delegate to viz controller
        AppController.prototype.handleAttrMapType = function(model, val, key) {

            var classname = 'hide-overlay', opts = { silent: true };

            if (key !== 'maptype') return;

            console.log('...handleAttrMapType', model, val, key);

            // Only want this attribute handled when vizpath is googlemap
            if (model.get('vizpath') !== 'googlemap') return model.set('maptype', model.previous('maptype'), opts);

            // Toggle the hide-overlay class which has a css transition for hide/show
            domManager.cssFlag(classname, { remove: val !== 'satellite' });

            return true;

        }

        _.bindAll(controller, 'handleVizPathChange', 'handleAttrFullscreen', 'handleAttrCampusId');
    }

    return AppControllerEventHandlers;

});