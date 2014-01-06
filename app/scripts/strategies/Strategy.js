
define([

    'underscore'

    , 'scripts/config'

], function(_, Config) {

    'use strict';

    function Strategy(id, type, options) {

        options || (options = {});

        if (arguments.length === 1) options = id;

        _.extend(this, options);

        _.defaults(this, { id: id, type: type, fns: [] });

        console.log('Strategy created', this);

        if (!this.id || !this.type) Config.throwError.strategyCreation();

        //this.refreshStrategies();

        this.strategy = _.dispatch.apply(this, this.fns);

    }

    Strategy.prototype.addFunction = function() {


    }

    Strategy.prototype.refreshStrategies = function() {

        this.strategy = _.dispatch.apply(this, this.fns);

    }

    return Strategy;

});
