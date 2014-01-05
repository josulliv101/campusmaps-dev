
define([

      'underscore'

    , 'strategies/Strategy'

], function(_, Strategy) {

    'use strict';

    function StrategyManager(options) {

        var isTypeEmpty;

        options || (options = {});

        _.bindAll(this, 'addTypeToCache', 'addStrategy', 'add', 'getDefault', 'isTypeEmpty', 'hasType');

        this.cache_ = {};

        _.extend(this, options);

        this.add = _.compose(this.addStrategy, this.addTypeToCache);

        isTypeEmpty = this.isTypeEmpty;

        this.getDefault = _.dispatch(

            // Is not empty
            //_.wrap(isTypeEmpty, function(fn) { return fn(arguments[1]) ? {} : undefined; }),

            // Return the default for a specific type
            this.hasType,

            // Return the first one. It's not empty since it passed the first dispatch fn.
            function(type) { return _.first(this.getCache()[type]); }

        );

    }

    StrategyManager.prototype.isTypeEmpty = function(type) {

        return !this.hasType(type) || !_.isEmpty(this.getCache()[type]);

    }

    StrategyManager.prototype.hasType = function(type) {

        return _.exists(this.getCache()[type]);

    }

    StrategyManager.prototype.addTypeToCache = function(strategy) {

        if (!strategy.type) return;

        this.hasType(strategy.type) || (this.getCache()[strategy.type] = {}) ;

        return strategy;

    }

    StrategyManager.prototype.addStrategy = function(strategy) {

        if (!strategy.id || !this.hasType(strategy.type)) return;

        this.getCache()[strategy.type][strategy.id] = strategy;

        return strategy;

    }


    StrategyManager.prototype.clearCache = function() {

        this.cache_ = {};

    }

    StrategyManager.prototype.getCache = function() {

        return this.cache_;

    }

    StrategyManager.prototype.add = function() {}

    StrategyManager.prototype.getDefault = function(type) {}
 
/*    StrategyManager.prototype.getStrategy = function(id, options) {

        var strategy;

        options || (options = {});

        strategy = new LabelStrategy(options);

        if (options.isDefault === true) setDefault(strategy);

        return strategy;

    }*/

/*    StrategyManager.prototype.setDefault = function(iconstrategy) {

        return defaultStrategy_ = iconstrategy;

    }*/

/*    StrategyManager.prototype.getDefault = function() {

        return defaultStrategy_;

    }*/

    var manager = new StrategyManager();

    manager.TYPE = { ICON: 'icon', LABEL: 'label' };

    manager.DEFAULT = 'default';

    return manager;

});
