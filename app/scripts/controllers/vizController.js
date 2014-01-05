define([

      'underscore'

    , 'strategies/iconStrategy'

    , 'eventdispatcher'

], function(_, IconStrategy, EventDispatcher) {

    'use strict';

    function VizController() {

    	this.viz;

        this.iconStrategy = null;

    }

    VizController.prototype.init = function() {

    	var viz = this.viz, iconStrategy = 1;

        this.setIconStrategies();

        console.log('VizController.prototype.init');

        EventDispatcher.on('change:viz', function(currentViz) {

            console.log('VizController heard change viz', currentViz);

            viz = currentViz;

        });

/*        EventDispatcher.on('change:campus', function(campus) {

        	var latlng;

            if (!campus) return;

            latlng = _.getAttr(campus, 'latlng'); //_.latLng(campus.get('latlng'));

            console.log('VizController heard change campus', campus, latlng);

            if (!!viz && !!latlng) viz.refresh(latlng);

        });*/

/*        EventDispatcher.on('change:campusmap', function(campusmap) {

            var strategy = IconStrategy.getStrategy();

            renderCampusMap(campusmap, strategy);

        });*/

        EventDispatcher.on('change:zoom', function(zoom) {

            console.log('VizController heard change zoom', zoom);

            viz.setZoom(zoom);

        });

        EventDispatcher.on('change:iconstrategy', function(iconstrategy) {

            var map = Datastore.map();

            renderCampusMap(map, iconstrategy);

            // To do: make more efficient in cases where this is called multiple times

        });

        EventDispatcher.on('viz:refreshView', function(campusmap, iconstrategy) {

            renderCampusMap(campusmap, iconstrategy);

            // To do: make more efficient in cases where this is called multiple times

        });

        function renderCampusMap(campusmap, iconstrategy) {

            var locations, json;

            if (!campusmap || !viz) return;

            json = Datastore.JSON.map(campusmap);

            locations = Datastore.locations(campusmap);

            console.log('VizController heard change campusmap', viz, json);

            viz.clear();

            viz.render(json, iconstrategy);

        }

    };

    VizController.prototype.setIconStrategies = function() {

        IconStrategy.create({ 

            id: 'default', 

            isDefault: true, 

            icons: {

                small: 'marker-icon.png', 

                big: 'marker-icon.png'

            },

            strategy: [

/*                function(model, zoom) { // Location Model

                    if (zoom === 15) return IconStrategy.getIconPath('clear.png');

                },*/

                function(model, zoom) { // Location Model

                    var emphasis = parseInt(_.getAttr(model, 'emphasis'));

                    if (emphasis > 3) return;

                    return IconStrategy.getIconPath('circle_outline_center.png');;

                },

                function(model, zoom) { // Location Model

                    var emphasis = parseInt(_.getAttr(model, 'emphasis'));

                    if (emphasis <= 3) return;

                    return IconStrategy.getIconPath('circle_solid_center.png');;

                }

            ]

        });

        IconStrategy.create({ 

            id: 'fletcher', 

            icons: {

                small: 'marker-icon.png', 

                big: 'marker-icon.png'

            },

            strategy: [

/*                function(model, zoom) { // Location Model

                    if (zoom === 15) return IconStrategy.getIconPath('clear.png');

                },*/

                function(model, zoom) { // Location Model

                    var tags = model.tags;

                    if (!tags || tags.indexOf('fletcher') === -1 ) return;

                    return IconStrategy.getIconPath('circle_solid_center.png');

                },

                function(model, zoom) { // Location Model

                    return IconStrategy.getIconPath('circle_outline_center.png');;

                }

            ]

        });

        IconStrategy.create({ 

            id: 'clear', 

            icons: {},

            strategy: [

                function(model, zoom) { // Location Model

                    return IconStrategy.getIconPath('clear.png');;

                }

            ]

        });

    }

    return VizController;

});