define([

    'searchpanels/base'

    , 'datastore'

    , 'eventdispatcher'

], function(Base, Datastore, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'AdminLocationsAdd',

        events: {

        	'click .save': 'save'
        },

        initialize: function() {

        	_.bindAll(this, 'handleMapClick');

            Base.prototype.initialize.call(this);

            this.newLocations = [];

        },

        save: function(ev) {

        	var campus, map;

        	ev.preventDefault();

			campus = Datastore.campus();

            map = Datastore.map(campus);
            
        	alert(this.newLocations.length);

        },

        handleMapClick: function(latlng) {
debugger;
        	var loc, campus, map;

            campus = Datastore.campus();

            map = Datastore.map(campus);

        	loc = {

        		name: 'New Location',

                latlng: latlng,

                mapid: _.getAttr(map, 'mapid')

        	};

            this.newLocations.push(loc);

            //EventDispatcher.trigger('truthupdate', { locationsadded: this.newLocations });

        	this.render();

        },

        getJSON: function(latlng) {

        	var json = { locationsTotal: this.newLocations.length };
        	
        	return { data: json };

        },

		handleOpenState: function() {

            var state = this.model.get('state');

            if (state !== 'open') return;

            this.init = true;

            this.stopListening(EventDispatcher, 'change:mapclick');

			this.listenTo(EventDispatcher, 'change:mapclick', this.handleMapClick);

		},

		handleCloseState: function() {

            var state = this.model.get('state');
            
            if (state !== 'close') return;

		    this.stopListening(EventDispatcher, 'change:mapclick');

            EventDispatcher.trigger('truthupdate', { locationsadded: null });

		    this.newLocations = [];

		}

    });

});