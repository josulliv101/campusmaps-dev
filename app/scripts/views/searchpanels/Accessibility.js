define([

    'searchpanels/base'

    , 'eventdispatcher'

], function(Base, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'Accessibility',

        events: {

                //'click .accessibility [type="checkbox"]': 'handleCheckboxAccessibility'

        },

        initialize: function() {

            var model = this.model, self = this;

            Base.prototype.initialize.call(this);

            model.set({ accessibility: true });

            this.listenTo(EventDispatcher, 'change:accessibility', function(accessibility) {

                console.log('change:accessibility', accessibility);

                model.set({ accessibility: accessibility }, { silent: true });

                //self.render();

            });

        },

        handleCheckboxAccessibility: function(ev) {

            var $checkbox = $(ev.currentTarget);

            console.log('handleCheckboxAccessibility', $checkbox.is(':checked'));

            EventDispatcher.trigger('truthupdate', { accessibility: $checkbox.is(':checked') });

        },
/*
        handleOpenPreState: function() {

            var state = this.model.get('state');
            
            if (state !== 'openPre') return;

            //EventDispatcher.trigger('truthupdate', { labelstrategy: 'big', accessibility: true }); 
            
            //EventDispatcher.trigger('truthupdate', { accessibility: true }); 

        },
*/
        getJSON: function() {

            var json = this.model.toJSON();

            return { data: json };

        }/*,

        handleClosePreState: function() {

            var state = this.model.get('state');
            
            if (state !== 'closePre') return;

            //EventDispatcher.trigger('truthupdate', { labelstrategy: '', accessibility: false });
            
            //EventDispatcher.trigger('truthupdate', { accessibility: false }); 

        }*/

    });

});
