define([

      'underscore'

    , 'strategies/StrategyManager'

    , 'eventdispatcher'

], function(_, StrategyManager, EventDispatcher) {

    'use strict';

    function VizController() {

    	this.viz;

        this.iconStrategy = null;

    }

    VizController.prototype.init = function() {

    	var viz = this.viz, iconStrategy = 1;

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

console.log('viz controller icon strategy change heard');
            var map = Datastore.map();

            renderCampusMap(map, iconstrategy);

            // To do: make more efficient in cases where this is called multiple times

        });

        EventDispatcher.on('change:locationid', function(loc) {

            var campusmap = Datastore.map(),

                json = Datastore.JSON.map(campusmap);

            if (json && _.exists(campusmap.iconstrategy)) renderCampusMap(campusmap, campusmap.iconstrategy);

            console.log('new loc selected', loc);

        });

        EventDispatcher.on('viz:locationSelected', function(loc) {

            console.log('new loc selected', loc);

            EventDispatcher.trigger('truthupdate', { locationid: loc.locationid, cmd: { value: 'Location', forceClose: true, uid: _.uniqueId()  } });

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

            console.log('VizController renderCampusMap', viz, json, iconstrategy);

            viz.clear();

            viz.render(json, iconstrategy);

        }

    };


    return VizController;

});