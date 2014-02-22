define([

    'searchpanels/base'

    , 'datastore'

    , 'eventdispatcher'

    , 'parsecom'

], function(Base, Datastore, EventDispatcher, Parse) {

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

            _.each(this.newLocations, function(attrs) { 

                var loc = new Datastore.Location(attrs);

                loc.save()

                .then(function() {

                    if (!map.has('locations')) map.set('locations', []); 

                    map.get('locations').push(loc);

                    map.save();

                });

            });

        },

        handleMapClick: function(latlng) {

        	var loc, campus, map, id = _.uniqueId('Location');

            campus = Datastore.campus();

            map = Datastore.map(campus);

        	loc = {

                locationid: id,

        		name: 'New Location',

                latlng: latlng,

                mapid: _.getAttr(map, 'mapid')

        	};

            if (!_.find(this.newLocations, function(model) { return model.latlng === latlng; })) this.newLocations.push(loc);

            //this.newLocations = _.uniq(this.newLocations);

            EventDispatcher.trigger('truthupdate', { locationsadded: _.map(this.newLocations, function(l){ return l.latlng; }).join('|') });

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