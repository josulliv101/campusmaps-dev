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

        this.renderStrategy = StrategyManager.getStrategy(StrategyManager.TYPE.RENDER_VIZ);

        this.locationsInvolvedStrategy = StrategyManager.getStrategy(StrategyManager.TYPE.LOCATIONS_INVOLVED_VIZ);

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

    VizController.prototype.handleTruthChange = function(attrs, previousAttrs) {

        // A campusmap can also be created dynamically - an example would be map of locations tagged as 'dorm'
        var campus = Datastore.campus(), campusmap = Datastore.map(campus),

            locations = Datastore.locations(campusmap), strategies = Datastore.getStrategies(campus), 

            selectedLocations = campusmap.selectedLocations || [],

            //extendedMap = _.getAttr(campusmap, 'extendsdata'),

            zoom = campus.zoom,

            center = Datastore.latlng,

            offset = Datastore.mapCenterOffset,

            fnRender, locationsInvolved;

            //if (_.isString(extendedMap)) extendedMap = Datastore.map(extendedMap, { id: 'mapid' });

        console.log('VizController labelStrategy', attrs);


        // Strategy will take the appropriate action based on the Truth attributes that changed
        if (this.viz) {

            // Initial processing if of changed attributes
            this.handleTruthStrategy.strategy(this, this.viz, attrs, previousAttrs, campus, campusmap, selectedLocations, locations, center, offset, zoom);

            locationsInvolved = this.locationsInvolvedStrategy.strategy(this, attrs, previousAttrs, campusmap, locations); 

            // Get fn on how to refresh/render viz based on what has changed
            this.renderStrategy.strategy(this, this.viz, locationsInvolved, campus, zoom, attrs, previousAttrs);

        }

    }

    VizController.prototype.setTileCache = function(locations) {

        _.each(locations, function(loc) {

            var tileOffset;

            // Label may be a <String> -- force it into a boolean value
            if (!!loc.label !== true) return;

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
                    
                    // Don't alter the original model ... {},  remove for now
                    return _.extend(loc, strategies);

                 })

                 .reject(function(loc) { return loc === undefined; })

                 .value();

    }

    return VizController;

});