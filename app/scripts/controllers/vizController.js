define([

    'underscore',

    'eventdispatcher'

], function(_, EventDispatcher) {

    'use strict';

    function VizController() {

    	this.viz;

    }

    VizController.prototype.init = function() {

    	var viz = this.viz;

        EventDispatcher.on('change:viz', function(currentViz) {

            console.log('VizController heard change viz', currentViz);

            viz = currentViz;

        });

        EventDispatcher.on('change:campus', function(campus) {

        	var latlng = _.latLng(campus.get('latlng'));

            console.log('VizController heard change campus', campus, latlng);

            if (!!viz && !!latlng) viz.refresh(latlng);

        });

    };

    return VizController;

});