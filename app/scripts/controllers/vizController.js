define([

      'underscore'

    , 'datastore'

    , 'strategies/StrategyManager'

    , 'eventdispatcher'

], function(_, Datastore, StrategyManager, EventDispatcher) {

    'use strict';

    function VizController() {

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
        var campus = Datastore.campus(),

            campusmap = Datastore.map(campus),

            zoom = campus.zoom || 5,

            iconStrategy = campus.iconStrategy,

            labelStrategy = campus.labelStrategy,

            models = this.getMarkerModels(campusmap, zoom, iconStrategy, labelStrategy);

        console.log('VizController labelStrategy', attrs);
debugger;
        // Any Datastore updates have all been completed at the App Controller level

        // Strategy will take the appropriate action based on the Truth attributes that changed
        if (this.viz) this.handleTruthStrategy.strategy(this.viz, attrs, models);

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