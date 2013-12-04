define([

    'jquery',

    'underscore',

    'eventdispatcher'

], function($, _, EventDispatcher) {

    'use strict';

    function SearchboxController(searchboxview, searchpanelview) {

        _.bindAll(this, 'doCommands');

        this.view = searchboxview;

        this.panelView = searchpanelview;

        this.cmds = []; // List of <String> cmds

        EventDispatcher.on('cmd', this.handleCommand, this);

    }

    SearchboxController.prototype.handleCommand = function(cmd, options) {

        var fn, view = this.view,

            fnDoCmds = this.doCommands;

        options || (options = {});

        this.setCmds(cmd);

        fn = options.forceClose === true ? view.closePanels : function() {};

        console.log('Controller heard EventDispatcher', cmd, options);

        // Wait until panels are closed if force close option is true
        $.when( fn() ).done( fnDoCmds );

    };

    SearchboxController.prototype.setCmds = function(txt) {

        this.cmds = _.isString(txt) && txt.length > 0 ? txt.split('_') : [];

    };

    SearchboxController.prototype.doCommands = function() {

        var panel = this.view.getPanel('hellopanel', this.panelView);

        panel.show();

    };

    return SearchboxController;

});