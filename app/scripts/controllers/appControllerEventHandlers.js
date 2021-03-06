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

                controller.handleAttrMapStyle,

                controller.handleAttrShowMe,

                controller.handleAttrLargeLabels,

                controller.handleAttrHighContrastLabels,

                controller.handleAttrCampusMap,

                controller.handleAttrCustomCampusMap,

                controller.handleAttrCampusId,

                controller.handleAttrZoom,

                controller.handleAttrLocationId,

                controller.handleAttrDetails,

                controller.handleAttrPanoramaDetails,

                controller.handleAttrPanoramaHighlight,

                controller.handleVizPathChange,

                controller.handleAttrFullscreen,         

                controller.handleResize,

                controller.handleAttrSatellite,

                controller.handleAttrStreetview,

                controller.handleAttrIconStrategy,

                controller.handleAttrLabelStrategy,

                controller.handleAttrAccessibility,

                controller.handleAttrParking,

                controller.handleAttrMapCenterOffset,

                controller.handleAttrHighlight,

                controller.handleAttrFocusElement,

                controller.handleAttrPanelAnimations,

                controller.handleAttrFeatured

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

        AppController.prototype.handleAttrFeatured = function(model, val, key) {

            var campus, campusmap, locs, tag, $el;

            // Add a 'featured' tag to each location. These locations will be exposed the same as a ny other tag.

            if (key !== 'featured') return;

            tag = 'featured';

            console.log('...handleAttrFeatured', model.cid, val, key);

            campus = Datastore.campus();

            campusmap = Datastore.map(Datastore.campus());

            locs = _.chain(val.split(','))

                    .map(function(id) { return Datastore.location(campusmap, id); })

                    .reject(function(loc) { return loc === undefined; })

                    .tap(function (all) { _.each(all, function(loc) {

                        var model = loc.attributes || loc;
                        // Featured property used in icon strategy if needed
                        model.featured = true;

                        model.tags = _.isEmpty(loc.tags) ? tag : ', ' + tag;

                    }); })

                    .value();
debugger;
            // Flag campus as having featured loc
            if (_.isArray(locs) && locs.length > 0) campus.set({ featured: locs.length }, { silent: true });
            
            $el = $root.closest('#app');

            if ($el.length === 0) $el = $root.closest('body');

            domManager.cssFlag('has-featured-locations', { $el: $el, remove: !(_.isArray(locs) && locs.length > 0) });

            return true;

        }

        

        // Handle a custom map
        AppController.prototype.handleAttrCustomCampusMap = function(model, val, key) {

            var campus, campusmap, locations, locs, tmpCampusmap;

            if (key !== 'customcampusmap') return;

/*            console.log('...handleAttrCustomCampusMap', model.cid, val, key);

            campus = Datastore.campus();

            campusmap = Datastore.map(Datastore.campus());

            locs = _.chain(val.split(','))

                    .map(function(id) { return Datastore.location(campusmap, id); })

                    .reject(function(loc) { return loc === undefined; })

                    //.tap(function (all) { _.each(all, function(loc) { loc.selected = true; }); })

                    .value();

            tmpCampusmap = _.pick(campusmap.attributes, 'className', 'latlng', 'zoom');

            _.extend(tmpCampusmap, { id: 'campusmap-tmp', mapid: 'campusmap-tmp', campusid: _.getAttr(campus, 'campusid'), extendsdata: campusmap.attributes.mapid, name: '* Featured Locations', locations: locs });

            Datastore.mapList().add(tmpCampusmap);

            var ml = Datastore.mapList();

            console.log('custom campus map', locs);*/

            return true;

        }

        AppController.prototype.handleAttrSatellite = function(model, val, key) {

            var classname = 'satellite';

            if (key !== 'satellite') return;

            console.log('...handleAttrSatellite', model.cid, val, key);

            domManager.cssFlag(classname, { remove: !val });

            return true;

        }

        AppController.prototype.handleAttrPanelAnimations = function(model, val, key) {

            var classname = 'transition-animations';

            if (key !== 'panelanimations') return;

            console.log('...handleAttrPanelAnimations', model.cid, val, key);

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

            var campus, campusmap, location, classname = 'details';

            if (key !== 'details') return;

            campus = Datastore.campus();

            campusmap = Datastore.map(Datastore.campus());

console.log('...handleAttrDetails', theTruth, val, key);
        
            _.chain(Datastore.locations(campusmap))

             .reject(function(loc) { return loc.details !== true; })

             .tap(function (all) { _.each(all, function(loc) { loc.details = false; }); })

             .value();

            if (_.isObject(campusmap.details)) {    

                campusmap.detailsPrevious = campusmap.details;

                campusmap.detailsPrevious.details = false;

            }

            location = Datastore.location(campusmap, val);

            if (_.isObject(location)) {

                location.details = true;

                location.zoom = theTruth.get('zoom');

                campusmap.details = location;

                //EventDispatcher.trigger('truthupdate', { latlng: location.latlng });

            } else {

                campusmap.details = null;

            }

            //domManager.cssFlag(classname, { remove: !campusmap.details });

            return true;

        }

        AppController.prototype.handleAttrHighlight = function(theTruth, val, key) {

            var campus, campusmap, locations, highlightLocations, changedLocations = [];

            if (key !== 'highlight') return;

            if (!val) val = '';

            campus = Datastore.campus();

            campusmap = Datastore.map(Datastore.campus()),

            locations = Datastore.locations(campusmap);

    
            changedLocations = _.chain(locations)

                                .reject(function(loc) { return loc.highlight !== true; })

                                .tap(function (all) { _.each(all, function(loc) { loc.highlight = false; }); })

                                .value();


            highlightLocations = _.chain(val.split(','))

                                  .map(function(locid) { return Datastore.location(campusmap, locid); })

                                  .reject(function(loc) { return loc === undefined; })

                                  .tap(function (all) { _.each(all, function(loc) { loc.highlight = true; }); })

                                  .value();

            campusmap.refreshLabels = changedLocations.concat(highlightLocations);

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

            if (_.getAttr(campusmap, 'extendsdata')) Datastore.extendData(campusmap);

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

        // Handle at local controller level
        AppController.prototype.handleAttrShowMe = function(model, val, key) {

            if (key !== 'showme') return;

            if (val !== true) return; // Skips if it's the coords object also

            ModuleManager.getLocation(function(ev) {

                EventDispatcher.trigger('truthupdate', { showme: { lat: ev.coords.latitude, lng: ev.coords.longitude } });

            })

            return true;

        }

        AppController.prototype.handleAttrLargeLabels = function(model, val, key) {

            var classname;

            if (key !== 'largelabels') return;

            if (_.isString(val)) {

                val = val === 'true' ? true : false;

                model.set({ largelabels: val }, { silent: true });

            }

            domManager.cssFlag('large-labels', { remove: !val });

            return true;

        }

        AppController.prototype.handleAttrHighContrastLabels = function(model, val, key) {

            var classname;

            if (key !== 'highcontrastlabels') return;

            domManager.cssFlag('highcontrast-labels', { remove: !val });

            return true;

        }

        AppController.prototype.handleAttrLabelStrategy = function(model, val, key) {

            var campus, strategy = StrategyManager.getStrategy;

            if (key !== 'labelstrategy') return;

            campus = Datastore.campus();

            campus.labelStrategy = strategy(val) || strategy(StrategyManager.TYPE.LABEL);

            return true;

        }


        AppController.prototype.handleAttrAccessibility = function(model, val, key) {

            if (key !== 'accessibility') return;

            if (val === 'false') val = false;

            else if (val === 'true') val = true;

            domManager.cssFlag('state-accessibility', { $el: $('#app'), remove: !val });

            return true;

        }

        AppController.prototype.handleAttrParking = function(model, val, key) {

            if (key !== 'parking') return;

            if (val === 'false') val = false;

            else if (val === 'true') val = true;

            domManager.cssFlag('state-parking', { $el: $('#app'), remove: !val });

            return true;

        }

        // Handle at global controller level, if needed, then delegate
        AppController.prototype.handleResize = function(model, val, key) {

            var path = ModuleManager.getVizPath();

            if (key !== 'resize') return;

            console.log('...handleResize', model.cid, val, key);

            //DomManager.getCenterOffset();

            // Reset the resize attr as well
            if (val === true) {

                EventDispatcher.trigger('truthupdate', { resize: _.uniqueId('resize') , mapcenteroffset: domManager.getCenterOffset() });

            }

            return true;

        }

        // Handle at a local controller level
        AppController.prototype.handleAttrPanoramaDetails = function(model, val, key) {

            if (key !== 'panoramadetails') return;

            console.log('...handleAttrPanoramaDetails', model.cid, val, key);

            return true;

        }

        // Handle at a local controller level
        AppController.prototype.handleAttrPanoramaHighlight = function(model, val, key) {

            var classname = 'panoramahighlight';

            if (key !== 'panoramahighlight') return;

            console.log('...handleAttrPanoramaHighlight', model.cid, val, key);

            //domManager.cssFlag(classname, { remove: !_.isObject(val) });

            return true;

        }

        

        // Handle at a local controller level
        AppController.prototype.handleAttrCmd = function(model, val, key) {

            var classname, remove = false, panelsClosed = false;

            if (key !== 'cmd') return;

            classname = 'details';

            if (val.indexOf('Results') === 0) remove = true; // || val.indexOf('Results') === 0

            if (val === '') panelsClosed = true;

            console.log('...handleAttrCmd', model.cid, val, key);

            // Set flag in DOM for searchbox vs non-searchbox 
            domManager.cssFlag(classname, { remove: remove });

            domManager.cssFlag('panels-closed', { remove: !panelsClosed });

            // Move to view
            domManager.disable('#searchbox', !remove && val !== '');

            return true;

        }

        // Handle at global controller level
        AppController.prototype.handleAttrLatLng = function(model, val, key) {

            if (key !== 'latlng') return;

            console.log('...handleAttrLatLng', model.cid, val, key);

            Datastore.latlng = val;

            return true;

        }

        AppController.prototype.handleAttrFocusElement = function(model, val, key) {

            if (key !== 'focuselement') return;

            console.log('...handleAttrFocusElement', model.cid, val, key);

            domManager.focus(val);

            return true;

        }

        AppController.prototype.handleAttrMapStyle = function(model, val, key) {

            var classname = 'mapstyle-inverted';

            if (key !== 'mapstyle') return;

            console.log('...handleAttrMapStyle', model.cid, val, key);

            domManager.cssFlag(classname, { remove: val !== 'inverted' });

            return true;

        }

        // Handle at global controller level, then delegate to viz controller
        AppController.prototype.handleAttrMapType = function(model, val, key) {

            var classname = 'hide-overlay', opts = { silent: true };

            if (key !== 'maptype') return;

            console.log('...handleAttrMapType', model, val, key);

            // Only want this attribute handled when vizpath is googlemap
            //if (model.get('vizpath') !== 'googlemap') return model.set('maptype', model.previous('maptype'), opts);

            // Toggle the hide-overlay class which has a css transition for hide/show
            //domManager.cssFlag(classname, { remove: val !== 'satellite' });

            return true;

        }

        _.bindAll(controller, 'handleVizPathChange', 'handleAttrFullscreen', 'handleAttrCampusId');
    }

    return AppControllerEventHandlers;

});