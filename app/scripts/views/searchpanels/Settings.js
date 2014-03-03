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

                'click .showme [type="checkbox"]': 'handleCheckboxShowMe',

                'click .largelabels [type="checkbox"]': 'handleCheckboxLargeLabels',

                'click .highcontrastlabels [type="checkbox"]': 'handleCheckboxHighContrastLabels'



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

            this.listenTo(EventDispatcher, 'change:largelabels', function(bool) {

                console.log('change:largelabels', bool);

                //alert(latlng);

                model.set({ largelabels: bool }, { silent: true });


            });

            this.listenTo(EventDispatcher, 'change:highcontrastlabels', function(bool) {

                console.log('change:highcontrastlabels', bool);

                //alert(latlng);

                model.set({ highcontrastlabels: bool }, { silent: true });


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

        handleCheckboxLargeLabels: function(ev) {

            var $checkbox = $(ev.currentTarget);

            console.log('handleCheckboxLargeLabels', $checkbox.is(':checked'));

            EventDispatcher.trigger('truthupdate', { largelabels: $checkbox.is(':checked') });

        },

        handleCheckboxHighContrastLabels: function(ev) {

            var $checkbox = $(ev.currentTarget);

            console.log('handleCheckboxHighContrastLabels', $checkbox.is(':checked'));

            EventDispatcher.trigger('truthupdate', { highcontrastlabels: $checkbox.is(':checked') });

        },

        

		getJSON: function() {

			return { data: this.model.toJSON() };

		}

    });

});
