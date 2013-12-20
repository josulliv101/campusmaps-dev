define([

], function() {

    'use strict';

    function AppControllerEventHandlers(AppController, controller) {

        console.log('controller arg', controller);

        AppControllerEventHandlers.prototype.getHandlers = function() {

            // Order matters, return functions off controller so this keyword remains intact
            return [

                controller.handleVizPathChange,

                controller.handleAttrStreetview,

                controller.handleAttrFullscreen,

                controller.handleAttrChange3

            ];

        }

        AppController.prototype.handleAttrFullscreen = function(model, val, key) {

            var prefix = 'map-',

                $root = this.viewManager.$root;

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

            this.viewManager.addCssFlagToHtmlTag(prefix + key);

            return true;

        }

        AppController.prototype.handleVizPathChange = function(model, val, key) {

            var prefix = 'viz-',

                forced = model.attributes['vizpath!'];

            if (key !== 'vizpath') return;

            // vizpath can be forced
            if (forced) val = forced;


            console.log('...handleVizPathChange', model.cid, val, key);

            AppController.prototype.loadViz.call(null, val);
            
            this.viewManager.addCssFlag(prefix + val);

            return true;

        }

        AppController.prototype.handleAttrStreetview = function(model, val, key) {

            var fn, vm = this.viewManager;

            if (key !== 'streetview') return;

            console.log('...handleAttrStreetview', model.cid, val, key);

            fn = val === true ? vm.addCssFlag : vm.removeCssFlag;

            fn.call(vm, key);

            return true;

        }

        AppController.prototype.handleAttrChange3 = function(model, val, key) {

            console.log('...handleAttrChange3', model.cid, val, key);

            return true;

        }

        _.bindAll(controller, 'handleVizPathChange', 'handleAttrStreetview', 'handleAttrFullscreen');
    }

    return AppControllerEventHandlers;

});