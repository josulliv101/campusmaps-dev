
define([

      'underscore'

      , 'scripts/config'

      , 'strategies/Strategy'

      , 'strategies/IconStrategy'

      , 'strategies/IconStrategyClear'

      , 'strategies/IconStrategyFletcher'

      , 'strategies/LabelStrategy'

      , 'strategies/LabelStrategyBig'

], function(_, Config, Strategy, IconStrategy, IconStrategyClear, IconStrategyFletcher, LabelStrategy, LabelStrategyBig) {

    'use strict';

    var instance = null;

    function StrategyManager(options) {

        options || (options = {});

        _.bindAll(this, 'addTypeToCache', 'addStrategy', 'createStrategy', 'add', 'getDefaultForType', 'hasType', 'getStrategyById');

        this.cache_ = {};

        _.extend(this, options);

        this.add = _.compose(this.addStrategy, this.addTypeToCache, this.createStrategy);

        this.getStrategy = _.dispatch(

            // Assume the passed-in arg is a strategy id
            this.getStrategyById,

            // Assume the passed-in arg is a strategy type id
            this.getDefaultForType

        );

        this.add(IconStrategy);

        this.add(IconStrategyClear);

        this.add(IconStrategyFletcher);

        this.add(LabelStrategy);

        this.add(LabelStrategyBig);

    }

    StrategyManager.prototype.createStrategy = function(strategyFn) {

        var json = strategyFn(this);

        return new Strategy(json);

    }

    StrategyManager.prototype.hasType = function(type) {

        return _.exists(this.getCache()[type]);

    }

    StrategyManager.prototype.getStrategies = function(type) {

        var type = this.getCache(type);

        if (!type || _.isEmpty(type)) return;

        return type;

    }

    StrategyManager.prototype.getStrategyById = function(id) {

        var strategy;

        if (!_.isString(id)) return;

        strategy = _.chain(this.getCache())

                    // Don't include the default keys. These are references to existing strategy objects.
                    .map(function(type) { return _.omit(type, 'default'); })

                    .map(function(type) { return _.values(type); })

                    .flatten()

                    .find(function(strategy) { return strategy.id === id; })

                    .value();

        return strategy;

    }

    StrategyManager.prototype.getStrategy = function(strategyid, typeid) {}

    StrategyManager.prototype.addTypeToCache = function(strategy) {

        if (!strategy.type) return;

        this.hasType(strategy.type) || (this.getCache()[strategy.type] = {}) ;

        return strategy;

    }

    StrategyManager.prototype.addStrategy = function(strategy) {

        var typeObject;

        if (!strategy.id || !this.hasType(strategy.type)) return;

        typeObject = this.getCache(strategy.type);

        typeObject[strategy.id] = strategy;

        if (_.size(typeObject) === 1 || strategy.default === true) this.setDefault(strategy);;

        return strategy;

    }


    StrategyManager.prototype.clearCache = function() {

        this.cache_ = {};

    }

    StrategyManager.prototype.getCache = function(type) {

        if (_.exists(this.cache_[type])) return this.cache_[type];

        return this.cache_;

    }

    StrategyManager.prototype.setDefault = function(strategy) {

        var type = strategy.type, typeObject =this.getCache(type);

        if (!type) return;

        typeObject['default'] = strategy;

        return strategy;

    }

    StrategyManager.prototype.getDefaultForType = function(arg) {

        var typeObject, type;

        type = _.isObject(arg) ? arg.type : arg;

        if (!type) return;

        typeObject = this.getCache(type);

        return typeObject['default'];

    }

    StrategyManager.prototype.getIconPath = function(name) {

        return Config.env.paths.icons.map + name;

    }

    StrategyManager.prototype.add = function() {}

    StrategyManager.getInstance = function() {
        // summary:
        // Gets an instance of the singleton. It is better to use
        if (instance === null){

            instance = new StrategyManager();

            instance.TYPE = { ICON: 'icon', LABEL: 'label' };

            instance.DEFAULT = 'default';

        }

        return instance;
    };

    return StrategyManager.getInstance();

});
