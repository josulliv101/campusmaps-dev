define([

      'underscore'

    , 'datastore'

    , 'strategies/StrategyManager'

    , 'eventdispatcher'

], function(_, Datastore, StrategyManager, EventDispatcher) {

    'use strict';

    function LocationDetailsController() {

        

    }

    LocationDetailsController.prototype.init = function() {

        // Get the default for the Viz strategies
        //this.handleTruthStrategy = StrategyManager.getStrategy(StrategyManager.TYPE.TRUTH_HANDLER_VIZ);

        //_.bindAll(this, 'handleTruthChange', 'handleChangeViz');

        EventDispatcher.on('delegateTruth', this.handleTruthChange);

    };

    LocationDetailsController.prototype.handleTruthChange = function(attrs) {

        // Strategy will take the appropriate action based on the Truth attributes that changed
        //if (this.viz) this.handleTruthStrategy.strategy(this.viz, attrs, models, campus, campusmap, selectedLocations, center, offset);

    }


    return LocationDetailsController;

});