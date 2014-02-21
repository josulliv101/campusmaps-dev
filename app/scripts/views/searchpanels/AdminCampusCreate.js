define([

    'searchpanels/base'

    , 'eventdispatcher'

], function(Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'AdminCampusCreate',

        initialize: function() {

        	var $el = this.$el;

        	this.campus = {};

            Base.prototype.initialize.call(this);

            this.listenTo(EventDispatcher, 'change:adminmarker', function(latlng) {

                if (_.isString(latlng)) $el.find('#inputLatLng').val(latlng);

            });

            this.listenTo(EventDispatcher, 'change:zoom', function(zoom) {

                if (_.isNumber(zoom)) $el.find('#inputZoom').val(zoom);

            });

        },

        getJSON: function() {

			return { data: { zoom: this.model.get('zoom') || 14 }};

        },

        getInput: function() {

            return _.compactObject({

                campusid: _.escape(this.$el.find('#inputId').val()),

                name: _.escape(this.$el.find('#inputName').val()),

                latlng: _.escape(this.$el.find('#inputLatLng').val()),

                zoom: _.escape(this.$el.find('#inputZoom').val())

            });

        },

		handleOpenState: function() {

            var state = this.model.get('state');

            if (state !== 'open') return;

            this.init = true;

			EventDispatcher.trigger('truthupdate', { adminmarker: 'center' });

		},

		handleCloseState: function() {

            var state = this.model.get('state');
            
            if (state !== 'close') return;

		    EventDispatcher.trigger('truthupdate', { adminmarker: '' });

		}

    });

});
