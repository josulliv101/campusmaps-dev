define([

    'datastore'

    , 'searchpanels/base'

    , 'scripts/domManager'

    , 'eventdispatcher'

], function(Datastore, Base, DomManager, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'occupants',

        initialize: function() {

            var model = this.model, self = this;

            Base.prototype.initialize.call(this);

            this.listenTo(EventDispatcher, 'change:occupant', function(occupant) {

                model.set('occupant', occupant, { silent: true });

                //this.refresh(occupant);

                console.log('heard occupant', occupant);

                self.render();

            });

        },

        getJSON: function() {

            var json = this.model.get('occupant') || { name: 'No Occupants' };

            return { data: json };

        }


    });

});
