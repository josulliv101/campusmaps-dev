define([

      'underscore'

    , 'datastore'

    , 'strategies/StrategyManager'

    , 'scripts/services/map/MapUtils'

    , 'eventdispatcher'

], function(_, Datastore, StrategyManager, MapUtils, EventDispatcher) {

    'use strict';

    function VizController() {

        this.viz;

    }

    VizController.prototype.init = function() {

        // Get the default for the Viz strategies
        this.handleTruthStrategy = StrategyManager.getStrategy(StrategyManager.TYPE.TRUTH_HANDLER_VIZ);

        _.bindAll(this, 'handleTruthChange', 'handleChangeViz');

        EventDispatcher.on('delegateTruth', this.handleTruthChange);

        EventDispatcher.on('change:viz', this.handleChangeViz);

    };

    VizController.prototype.handleChangeViz = function(viz) {


        var campus = Datastore.campus(),

            zoom = campus.zoom || _.getAttr(campus, 'zoom'),

            latlng = _.latLng(_.isString(Datastore.latlng) ? Datastore.latlng : _.getAttr(campus, 'latlng')),

            el = document.getElementById('map-canvas');

        this.viz = viz;

        this.viz.init(el, latlng, zoom);

        console.log('VizController handleChangeViz', this);

    }

    VizController.prototype.handleTruthChange = function(attrs) {

        // A campusmap can also be created dynamically - an example would be map of locations tagged as 'dorm'
        var campus = Datastore.campus(), campusmap = Datastore.map(campus),

            locations = Datastore.locations(campusmap), strategies = Datastore.getStrategies(campus), 

            zoom = campus.zoom,

            iconStrategy = strategies.icon,

            labelStrategy = strategies.label,

            models = this.setIconsAndLabels(locations, iconStrategy, labelStrategy, zoom); //this.getMarkerModels(campusmap, zoom, iconStrategy, labelStrategy);

        console.log('VizController labelStrategy', attrs);

MapUtils.resetCache();

        this.setTileCache(models);


        // Any Datastore updates have all been completed at the App Controller level

        // Strategy will take the appropriate action based on the Truth attributes that changed
        if (this.viz) this.handleTruthStrategy.strategy(this.viz, attrs, models);

    }

    VizController.prototype.setTileCache = function(locations) {

        _.each(locations, function(loc) {

            var tileOffset;

            if (loc.label !== true) return;

            // The latLngToTileOffset function caches the return value for future use
            tileOffset = MapUtils.latLngToTileOffset({ lat: loc.latlng[0], lng: loc.latlng[1] }, loc.zoom);

            MapUtils.addLocationToTileCache(tileOffset, loc); 

        });

    }

    VizController.prototype.setIconsAndLabels = function(locations, iconStrategy, labelStrategy, zoom) {

        if (!_.isArray(locations)) return [];

        return  _.chain(locations)

                 .map(function(loc) {

                    var strategies = {}, latlng = _.getAttr(loc, 'latlng');

                    if (!latlng) return;

                    strategies = { 

                        latlng: _.latLng(latlng), 

                        icon: iconStrategy.strategy(loc, zoom), 

                        label: labelStrategy.strategy(loc, zoom), 

                        zoom: zoom  

                    };
                    
                    // Don't alter the original model
                    return _.extend({}, loc, strategies);

                    //return loc;

                 })

                 .reject(function(loc) { return loc === undefined; })

                 .value();

    }

    // To do: memoize this fn in init()
    VizController.prototype.getMarkerModels = function(campusmap, zoom, iconStrategy, labelStrategy) {

        var locations = Datastore.locations(campusmap);

            //iconStrategy = campus.iconStrategy || StrategyManager.getStrategy(StrategyManager.TYPE.ICON),

            //labelStrategy = StrategyManager.getStrategy(StrategyManager.TYPE.LABEL);

        return _.chain(locations)

                .map(function(loc) {

                    var latlng = _.getAttr(loc, 'latlng');

                    if (!latlng) return;

                    return { 

                        name: _.getAttr(loc, 'name'),

                        latlng: _.latLng(latlng),

                        emphasis: parseInt(_.getAttr(loc, 'emphasis')),

                        icon: iconStrategy.strategy(loc, zoom),

                        label: labelStrategy.strategy(loc, zoom),

                        zoom: zoom

                    }

                })

                .reject(function(loc) { return loc === undefined; })

                .value();

    }

    return VizController;

});