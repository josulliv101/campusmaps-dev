define([

	'datastore'

    , 'searchpanels/base'

    , 'eventdispatcher'

], function(Datastore, Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'AdminLocation',

        title: function() { 

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = Datastore.location(map, this.model.get('details'));

            return _.getAttr(location, 'name') || '..'; 

        },

        events: {

        	'click .btn-save': 'save'

        },

        initialize: function() {

            var model = this.model, self = this, $el = this.$el;

            Base.prototype.initialize.call(this);

            _.bindAll(this, 'title');

            this.listenTo(EventDispatcher, 'change:details', function(locationid) {

                var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details;

                model.set('label', locationid, { silent: true });

                if (locationid && _.isString(locationid)) self.render();


            });

            this.listenTo(EventDispatcher, 'change:adminmarker', function(latlng) {

                if (_.isString(latlng)) $el.find('#inputLatLng').val(latlng);

            });

        },

        getInput: function() {

            return _.compactObject({

                locationid: _.escape(this.$el.find('#inputId').val()),

                name: _.escape(this.$el.find('#inputName').val()),

                nameshort: _.escape(this.$el.find('#inputNameShort').val()),

                latlng: _.escape(this.$el.find('#inputLatLng').val()),

                emphasis: _.escape(this.$el.find('#inputEmphasis').val()),

                labelplacement: _.escape(this.$el.find('#inputLabelPlacement').val()),

                address1: _.escape(this.$el.find('#inputAddress1').val()),

                address2: _.escape(this.$el.find('#inputAddress2').val()),

                city: _.escape(this.$el.find('#inputCity').val()),

                zip: _.escape(this.$el.find('#inputZip').val()),

                state: _.escape(this.$el.find('#inputState').val()),

                country: _.escape(this.$el.find('#inputCountry').val()),

                website: _.escape(this.$el.find('#inputWebsite').val()),

                phone: _.escape(this.$el.find('#inputPhone').val()),

                imageurl: _.escape(this.$el.find('#inputImage').val()),

                mapid: _.escape(this.$el.find('#inputMapId').val()),

                isvisible: _.escape(this.$el.find('#inputIsVisible').val()),

                tags: _.escape(this.$el.find('#inputTags').val())

            });

        },

        getJSON: function() {

			var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details,

                json = {};

            if (location) json = Datastore.JSON.location(location);

			return { data: json };

        },

        save: function(ev) {

			var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details,

                inputObj;

            ev.preventDefault();


            if (!location) return;

            inputObj = this.getInput();

            inputObj.mapid = _.getAttr(map, 'mapid');

            location.save(inputObj)

            .then(function() {

            	alert('saved');

            });

        },

		handleOpenState: function() {

            var state = this.model.get('state');

            if (state !== 'open') return;

            this.init = true;

			var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details;

		    if (location) EventDispatcher.trigger('truthupdate', { adminmarker: _.getAttr(location, 'latlng') });

		},

		handleCloseState: function() {

            var state = this.model.get('state');
            
            if (state !== 'close') return;

		    EventDispatcher.trigger('truthupdate', { adminmarker: '' });

		}

    });

});