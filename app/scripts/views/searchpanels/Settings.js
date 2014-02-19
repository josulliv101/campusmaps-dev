define([

    'searchpanels/base'

    , 'eventdispatcher'

], function(Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'Settings',

		events: {

		        'click .animation [type="checkbox"]': 'handleCheckboxAnimations',

                'click .style [type="checkbox"]': 'handleCheckboxStyle',

                'click .showme [type="checkbox"]': 'handleCheckboxShowMe'

		},

        initialize: function() {

            var model = this.model;

            Base.prototype.initialize.call(this);

            this.listenTo(EventDispatcher, 'change:panelanimations', function(panelanimations) {

                console.log('change:panelanimations', panelanimations);

                model.set({ panelanimations: panelanimations }, { silent: true });

            });

            this.listenTo(EventDispatcher, 'change:mapstyle', function(mapstyle) {

                console.log('change:mapstyle', mapstyle);

                model.set({ highcontrast: mapstyle === 'inverted' }, { silent: true });

            });

            this.listenTo(EventDispatcher, 'change:showme', function(latlng) {

                console.log('change:showme', latlng);

                //alert(latlng);

                model.set({ showme: latlng }, { silent: true });


            });

        },

        handleCheckboxStyle: function(ev) {

            var $checkbox = $(ev.currentTarget);

            console.log('handleCheckboxStyle', $checkbox.is(':checked'));

            EventDispatcher.trigger('truthupdate', { mapstyle: $checkbox.is(':checked') ? 'inverted' : 'plain' });

        },

		handleCheckboxAnimations: function(ev) {

			var $checkbox = $(ev.currentTarget);

			console.log('handleCheckboxAnimations', $checkbox.is(':checked'));

			EventDispatcher.trigger('truthupdate', { panelanimations: $checkbox.is(':checked') });

		},

        handleCheckboxShowMe: function(ev) {

            var $checkbox = $(ev.currentTarget);

            console.log('handleCheckboxShowMe', $checkbox.is(':checked'));

            EventDispatcher.trigger('truthupdate', { showme: $checkbox.is(':checked') });

        },

		getJSON: function() {

			return { data: this.model.toJSON() };

		}

    });

});
