define([

    'searchpanels/base'

    , 'eventdispatcher'

], function(Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'Settings',

		events: {

		        'click [type="checkbox"]': 'handleCheckboxAnimations'

		},

        initialize: function() {

            var model = this.model;

            Base.prototype.initialize.call(this);

            this.listenTo(EventDispatcher, 'change:panelanimations', function(panelanimations) {

                console.log('change:panelanimations', panelanimations);

                model.set({ panelanimations: panelanimations }, { silent: true });

            });

        },

		handleCheckboxAnimations: function(ev) {

			var $checkbox = $(ev.currentTarget);

			console.log('handleCheckboxAnimations', $checkbox.is(':checked'));

			EventDispatcher.trigger('truthupdate', { panelanimations: $checkbox.is(':checked') });

		},

		getJSON: function() {

			return { data: this.model.toJSON() };

		}

    });

});
