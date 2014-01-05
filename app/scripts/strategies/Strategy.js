
define([

    'underscore'

], function(_) {

    'use strict';

    //var cache_ = {}, defaultStrategy_;

    function Strategy(id, type, options) {

        options || (options = {});

        _.extend(this, options, { id: id, type: type });

        _.defaults(this, { fns: [] });

        console.log('Strategy created', this);

        if (!this.id || !this.type) throw new Error('Strategy requires an id and type');

        this.fns = _.dispatch.apply(this, this.fns);

    }
/*    
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
*/

    return Strategy;

});
