define([

    'eventdispatcher'

], function(EventDispatcher) {

    'use strict';

    function SearchboxController() {

    	EventDispatcher.on('cmd', this.handleCmd);

    }

    SearchboxController.prototype.handleCmd = function(cmd, options) {

    	console.log('Controller heard EventDispatcher', cmd);

    };

    return SearchboxController;

});