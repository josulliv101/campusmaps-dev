
define([

    'underscore'

], function(_) {

    'use strict';

    var base_ = '',

        dir_ = '/app/images/icons/map/', // to do: use Env module

        defaults = { icons: {}, strategy: [] },

        cache_ = {}, defaultId_ = 'default', defaultStrategy_;

    function IconStrategy(options /* id, icons, array of functions as the strategy */) {

        options || (options = {});

        _.defaults(this, options, defaults);

        if (!this.id) throw new Error('Icon Strategy requires an id');

        this.strategy = _.dispatch.apply(this, this.strategy);

        console.log('IconStrategy created', this.icons, this.strategy);

    }

    function getIconPath_(icon, dir) { 

        dir || (dir = dir_);

        return base_ + dir + icon; 

    } 

    function setIconPath_(path) { 

        return dir_ = path; 

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

        strategy = new IconStrategy(options);

        if (options.isDefault === true) setDefault(strategy);

        return strategy;

    }

    function setDefault(iconstrategy) {

        return defaultStrategy_ = iconstrategy;

    }

    function getDefaultId_() {

        return defaultId_;

    }

    function setDefaultId_(id) {

        return defaultId_ = id || defaultId_;

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

/*        function(id) {

            var icons, strategy, path = IconStrategy.prototype.path;

            icons = {

                small: path('marker-icon.png'),

                medium: path('marker-icon.png'),

                large: path('marker-icon.png'),

                xlarge: path('marker-icon.png')

            };

            return new IconStrategy(icons, strategy)

        }*/

    return {

        getIconPath: getIconPath_,

        setIconPath: setIconPath_,

        getStrategy: _.dispatch(getFromCache, getDefault_),

        setDefaultId: setDefaultId_,

        getDefaultId: getDefaultId_,

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
