define([

      'underscore'

    , 'strategies/StrategyManager'

    , 'eventdispatcher'

], function(_, StrategyManager, EventDispatcher) {

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

        this.viz = viz;
        
        console.log('VizController handleChangeViz', this);

    }

    VizController.prototype.handleTruthChange = function(attrs) {

        console.log('VizController handleTheTruth', attrs);

        // Strategy will take the appropriate action based on the Truth attributes that changed
        this.handleTruthStrategy.strategy(attrs);

    }

    return VizController;

});