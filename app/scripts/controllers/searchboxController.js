define([

    'jquery',

    'underscore',

    'eventdispatcher'

], function($, _, EventDispatcher) {

    'use strict';


    function SearchboxController(searchboxview, AnimationConstructor) {

        var cmdFunctions;

        _.bindAll(this, 'doCommands', 'handleCommand', 'getViewPaths', 'doView', 'getDependencies', 'getCmds', 'loadViews');

        this.view = searchboxview;

        this.searchpanelPath = 'searchpanels'; // This is a requirejs alias

        this.panelAnimation = AnimationConstructor;

        // Defined here so this binding behaves when creating unit test spies
        this.loadViews = _.compose(

                // Load constructor if needed
                this.getDependencies, // Returns deferred object

                // Convert cmd ids to corresponding path-to-file
                this.getViewPaths, 

                // Convert string to an array of cmds
                this.getCmds // Starts here, goes from right to left. Return obj becomes arg for next fn
            
            );


        //// Event Listeners ////
        
        // Handle when the Event Dispatcher triggers a cmd
        EventDispatcher.on('cmd', this.handleCommand, this);

        // Pass off any cmds from DOM elements to the Event Dispatcher
        $('body').on('click', '[data-cmd]', function(ev) {

            console.log('data-cmd', ev);

            // In case the element happens to be a link
            ev.preventDefault();

            EventDispatcher.trigger('cmd', $(this).data('cmd'));

        });

    }

    SearchboxController.prototype.handleCommand = function(cmds, options) {

        var fnForceClosePanels, deferreds = [this.loadViews(cmds)], AnimationConstructor = this.panelAnimation, 

            dfdsClose = _.chain(this.view.cache)

                            // Don't close any that are open and need to be
                            .reject(function(val, key) { return _.contains(this.cmds, key); }, this)

                            .map(function(val, key) { 

                                console.log('closePanels', val, key, this.cmds);

                                var anim = new AnimationConstructor();
                                
                                return anim.close(val);

                            }, this)

                            .value();

        options || (options = {});

        deferreds.concat(dfdsClose);

        console.log('deferreds', deferreds, (dfdsClose));

        $.when.apply( $,  deferreds.concat(dfdsClose) ).done( this.doCommands );

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

    SearchboxController.prototype.doView = function(Constructor, viewid, position) {

        console.log('doView', Constructor, viewid, position);

        var panel = this.view.getPanel(viewid, Constructor, position),

            state = panel.model.get('state'),

            AnimationConstructor = this.panelAnimation,

            anim = new AnimationConstructor();

        console.log('panel model', Constructor, viewid);

        // Panel must be in close state in order to open
        if (state === 'close') AnimationConstructor.prototype.open.call(anim, panel, position);

    };

    SearchboxController.prototype.doCommands = function(constructors) {

        console.log('doing commands Constructors', constructors);

        var i = 0;

        if (!_.isObject(constructors)) return;

        _.each(constructors, function(val, key) {

            console.log('panel', val, key);

            this.doView(val, key, i++);

        }, this);

    };

    // Stub -- defined in constructor so this keyword behaves when unit testing
    SearchboxController.prototype.loadViews = function() {};

    return SearchboxController;

});