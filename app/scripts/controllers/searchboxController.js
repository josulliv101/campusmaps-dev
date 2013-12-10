define([

    'jquery',

    'underscore',

    'eventdispatcher',

    'animation'

], function($, _, EventDispatcher, Animation) {

    'use strict';



    function SearchboxController(searchboxview, animation) {

        var cmdFunctions;

        _.bindAll(this, 'doCommands', 'handleCommand', 'getViewPaths', 'doView', 'getDependencies', 'getCmds', 'loadViews');

        this.view = searchboxview;

        this.animation = animation;

        this.searchpanelPath = 'searchpanels'; // This is a requirejs alias

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

        // Handle when the Event Dispatcher triggers a cmd
        EventDispatcher.on('doAnimationOpen', function() { alert('animation open'); }, this);

        // Pass off any cmds from DOM elements to the Event Dispatcher
        $('body').on('click', '[data-cmd]', function(ev) {

            console.log('data-cmd', ev);

            // In case the element happens to be a link
            ev.preventDefault();

            EventDispatcher.trigger('cmd', $(this).data('cmd'));

        });

    }

    SearchboxController.prototype.handleCommand = function(cmds, options) {

        var fnForceClosePanels, deferreds = [this.loadViews(cmds)],

            dfdsClose = _.chain(this.view.cache)

                            // Don't close any that are open and need to be
                            .reject(function(val, key) { return _.contains(this.cmds, key); }, this)

                            .map(function(val, key) { 

                                console.log('closePanels', val, key, this.cmds);

                                var anim = new Animation();
                                
                                return anim.close(val);

                            }, this)

                            .value();

        options || (options = {});

        deferreds.concat(dfdsClose);

        console.log('deferreds', deferreds.concat(dfdsClose));

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

    SearchboxController.prototype.doView = function(Constructor, viewid) {

        console.log('doView', Constructor.id);

        var panel = this.view.getPanel(viewid, Constructor),

            state = panel.model.get('state');

        console.log('panel model', panel.model);

        // Panel must be in close state in order to open
        if (state === 'close') this.animation.open(panel);

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