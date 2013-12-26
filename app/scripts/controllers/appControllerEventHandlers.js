define([

    'scripts/domManager'

    , 'scripts/moduleManager'

    , 'datastore'

    , 'eventdispatcher'

], function(DomManager, ModuleManager, Datastore, EventDispatcher) {

    'use strict';

    function AppControllerEventHandlers(AppController, controller) {

        var domManager = DomManager.getInstance(),

        $root = domManager.$root;

console.log('DomManager!!', $root);

        AppControllerEventHandlers.prototype.getHandlers = function() {

            // Order matters, return functions off controller so this keyword remains intact
            return [

                controller.handleAttrViews,

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

                forced = model.attributes['vizpath!'];

            if (key !== 'vizpath') return;

            // vizpath can be forced
            if (forced) val = forced;


            console.log('...handleVizPathChange', model.cid, val, key);

            //AppController.prototype.loadViz.call(null, val);

            require([ val ], function (Viz) { Viz.init(); });
            
            domManager.cssFlag(prefix + val);

            return true;

        }

        AppController.prototype.handleAttrStreetview = function(model, val, key) {

            if (key !== 'streetview') return;

            console.log('...handleAttrStreetview', model.cid, val, key);

            domManager.cssFlag(key, { remove: val });

            return true;

        }

        AppController.prototype.handleAttrCampusId = function(model, val, key) {

            if (key !== 'campusid') return;

            console.log('...handleAttrCampusId', model.cid, val, key);

            Datastore.campus(val, { id: 'campusid', select: true });

            return true;

        }

        AppController.prototype.handleResize = function(model, val, key) {

            var path = ModuleManager.getVizPath();

            if (key !== 'resize') return;

            console.log('...handleResize', model.cid, val, key);

            // Reset the resize attr as well
            if (val === true) EventDispatcher.trigger('truthupdate', { vizpath: path, resize: false });

            return true;

        }

        AppController.prototype.handleAttrViews = function(model, val, key) {

            //var $root = DomManager.$root;

            if (key !== 'views') return;

            console.log('...handleAttrViews', $root);

            _.each(val, function(ViewConstructor) {

                var view = new ViewConstructor({ el: $root, model: Datastore.Factory.model() });

                view.render().$el.appendTo($root);

                console.log('handleAttrViews', view.$el);

            });

            return true;

        }

        _.bindAll(controller, 'handleVizPathChange', 'handleAttrStreetview', 'handleAttrFullscreen', 'handleAttrCampusId');
    }

    return AppControllerEventHandlers;

});