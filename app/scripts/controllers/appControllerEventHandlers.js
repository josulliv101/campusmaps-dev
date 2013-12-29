define([

    'scripts/domManager'

    , 'scripts/moduleManager'

    , 'scripts/controllers/vizController'

    , 'datastore'

    , 'eventdispatcher'

], function(DomManager, ModuleManager, VizController, Datastore, EventDispatcher) {

    'use strict';

    function AppControllerEventHandlers(AppController, controller) {

        var domManager = DomManager.getInstance(),

        $root = domManager.$root;

console.log('DomManager!!', $root);

        AppControllerEventHandlers.prototype.getHandlers = function() {

            // Order matters, return functions off controller so this keyword remains intact
            return [

                controller.handleAttrCmd,

                controller.handleAttrLatLng,

                controller.handleAttrMapType,

                controller.handleVizPathChange,

                controller.handleAttrStreetview,

                controller.handleAttrFullscreen,

                controller.handleAttrCampusId,

                controller.handleResize

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


            console.log('...handleVizPathChange', model.cid, val, key);

            if (controller.vizController === undefined) {

                controller.vizController = new VizController();

                controller.vizController.init();

            }
            //AppController.prototype.loadViz.call(null, val);

            require([ val ], function (Viz) { 

                Viz.init();

                // A controller for all viz's is listening
                EventDispatcher.trigger('change:viz', Viz);

            });
            
            domManager.clearFlags();

            domManager.cssFlag(prefix + val);

            domManager.cssFlag(classname, { remove: val !== 'directory' });

            return true;

        }

        AppController.prototype.handleAttrStreetview = function(model, val, key) {

            var classname = 'hide-overlay';

            if (key !== 'streetview') return;

            console.log('...handleAttrStreetview', model.cid, val, key);

            domManager.cssFlag(classname, { remove: !val });

            return true;

        }

        AppController.prototype.handleAttrCampusId = function(theTruth, val, key) {

            if (key !== 'campusid') return;

            console.log('...handleAttrCampusId', theTruth, val, key);

            // Make sure Datastore is updated before views get notified of change
            Datastore.campus(val, { id: 'campusid', select: true });

            // The Truth's campus map attr needs to be in step with the campus change
            //theTruth.set({ mapid: 'medford-main' });


            console.log('...handleAttrCampusId (map)', Datastore.map());

            // Let an views listening know
            EventDispatcher.trigger('change:campus', Datastore.campus());

            return true;

        }

/*        AppController.prototype.handleAttrMapId = function(theTruth, val, key) {

            if (key !== 'mapid') return;

            console.log('...handleAttrMapId', theTruth, val, key);
 

            return true;

        }*/

        AppController.prototype.handleResize = function(model, val, key) {

            var path = ModuleManager.getVizPath();

            if (key !== 'resize') return;

            console.log('...handleResize', model.cid, val, key);

            // Reset the resize attr as well
            if (val === true) EventDispatcher.trigger('truthupdate', { vizpath: path, resize: false });

            return true;

        }

        AppController.prototype.handleAttrCmd = function(model, val, key) {

            if (key !== 'cmd') return;

            console.log('...handleAttrCmd', model.cid, val, key);

            // let the searchbox controller handle it
            EventDispatcher.trigger('cmd', val);

            return true;

        }

        AppController.prototype.handleAttrLatLng = function(model, val, key) {

            if (key !== 'latlng') return;

            console.log('...handleAttrLatLng', model.cid, val, key);

            Datastore.latlng = val;

            return true;

        }

        AppController.prototype.handleAttrMapType = function(model, val, key) {

            var classname = 'hide-overlay', opts = { silent: true };

            if (key !== 'maptype') return;

            console.log('...handleAttrMapType', model, val, key);

            // Only want this attribute handled when vizpath is googlemap
            if (model.get('vizpath') !== 'googlemap') return model.set('maptype', model.previous('maptype'), opts);

            // Toggle the hide-overlay class which has a css transition for hide/show
            domManager.cssFlag(classname, { remove: val !== 'satellite' });

            EventDispatcher.trigger('maptype', val);

            return true;

        }

        _.bindAll(controller, 'handleVizPathChange', 'handleAttrStreetview', 'handleAttrFullscreen', 'handleAttrCampusId');
    }

    return AppControllerEventHandlers;

});