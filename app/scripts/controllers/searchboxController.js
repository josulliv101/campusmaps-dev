define([

    'jquery',

    'underscore',

    'eventdispatcher'

], function($, _, EventDispatcher) {

    'use strict';

    function SearchboxController(searchboxview) {

        _.bindAll(this, 'doCommands', 'handleCommand', 'getViewPaths', 'doView', 'getDependencies', 'getCmds', 'loadViews');

        this.view = searchboxview;

        this.searchpanelPath = 'searchpanels'; // This is a requirejs alias

        EventDispatcher.on('cmd', this.handleCommand, this);

        // Defined here so this binding behaves when creating unit test spies
        this.loadViews = _.compose(

                // Load constructor if needed
                this.getDependencies, // Returns deferred object

                // Convert cmd ids to corresponding path-to-file
                this.getViewPaths, 

                // Convert string to an array of cmds
                this.getCmds // Starts here, goes from right to left. Return obj becomes arg for next fn
            
            );

    }

    SearchboxController.prototype.handleCommand = function(cmds, options) {

        var fnForceClosePanels;

        options || (options = {});

        fnForceClosePanels = options.forceClose === true ? this.view.closePanels : function() {};

        $.when(this.loadViews(cmds),  fnForceClosePanels()).done( this.doCommands );

    };

    SearchboxController.prototype.getCmds = function(txt) {

        console.log('*** getCmds ***');

        return this.cmds = _.isString(txt) && txt.length > 0 ? txt.split('_') : [];

    };

    SearchboxController.prototype.getViewPaths = function(cmds) {

        console.log('*** getViewPaths ***');

        return _.map(cmds, function(cmd) { return this.searchpanelPath + '/' + cmd; }, this);

    };

    // Paths and constructors arrays will always match in length
    SearchboxController.prototype.prettyPackageViewsData = function(paths, constructors) {

        var viewids;

        if (paths.length !== constructors.length) return {};

        viewids = _.map(paths, function(path) { return _.last( path.split('/') ); });

        return _.object(viewids, constructors);

    };

    SearchboxController.prototype.getDependencies = function(paths) {

        var dfd = $.Deferred(), 

            fnPrettyViewsData = this.prettyPackageViewsData;

        console.log('*** getDependencies ***');

        require.onError = function() {

            dfd.reject( { error: true } );

        };

        require(paths, function() {

            var ret = fnPrettyViewsData(paths, _.toArray(arguments));

            // Arguments are constructors for each view retrieved
            dfd.resolve(ret);

        });

        // Add check for error
        
        return dfd.promise();

    };

    SearchboxController.prototype.doView = function(Constructor, viewid) {

        console.log('doView', Constructor.id);

        var panel = this.view.getPanel(viewid, Constructor),

            state = panel.model.get('state'),

            fn = state === 'created' ? this.view.open : this.view.close;

        console.log('panel model', panel.model);

        fn(panel);

        panel.model.set('state', state === 'created' ? 'open' : 'created');

    };

    SearchboxController.prototype.doCommands = function(constructors) {

        console.log('doing commands Constructors', constructors);

        if (!_.isObject(constructors)) return;

        _.each(constructors, this.doView, this);

    };

    // Stub -- defined in constructor so this keyword behaves when unit testing
    SearchboxController.prototype.loadViews = function() {};

    return SearchboxController;

});