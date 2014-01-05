
define([

    'underscore'

], function(_) {

    'use strict';

    var cache_ = {}, defaultStrategy_;

    function LabelStrategy(options /* id, array of functions as the strategy */) {

        options || (options = {});

        _.defaults(this, options, { strategy: [] });

        if (!this.id) throw new Error('Label Strategy requires an id');

        this.strategy = _.dispatch.apply(this, this.strategy);

        console.log('LabelStrategy created', this.strategy);

    }
    
    function clear_() { 

        cache_ = {}; 

        defaultStrategy_ = undefined;

    } 

    function getFromCache(id) { 

        if (!_.isString(id) || !cache_[id]) return; 

        return cache_[id];

    } 

    function create_(options) {

        var strategy;

        options || (options = {});

        strategy = new LabelStrategy(options);

        if (options.isDefault === true) setDefault(strategy);

        return strategy;

    }

    function setDefault(iconstrategy) {

        return defaultStrategy_ = iconstrategy;

    }

    function getDefault_() {

        return defaultStrategy_;

    }

    function addToCache_(strategy) {

        return _.exists(strategy) 

            // Overwrite any existing if needed
            ? (cache_[strategy.id] = strategy)

            : undefined;

    }


    return {

        getStrategy: _.dispatch(getFromCache, getDefault_),

        getDefault: getDefault_,

        // Always add new strategies to the cache
        create: _.compose(addToCache_, create_),

        _ : {

              addToCache: addToCache_

            , cache: function() { return cache_; }

            , create: create_

            , clear: clear_

        }   

    };

});
