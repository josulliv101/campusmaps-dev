define([

    'datastore'

    , 'searchpanels/base'

    , 'scripts/domManager'

    , 'eventdispatcher'

], function(Datastore, Base, DomManager, EventDispatcher) {

    'use strict';

    return Base.extend({

        id: 'LocationLink',

        initialize: function() {

            //var model = this.model, self = this;

            Base.prototype.initialize.call(this);

/*            this.listenTo(EventDispatcher, 'change:occupant', function(occupant) {

                model.set('occupant', occupant, { silent: true });

                //this.refresh(occupant);

                console.log('heard occupant', occupant);

                self.render();

            });*/

        },

        getJSON: function() {

            var json = { url: this.model.get('locationlink') || 'No Link' };

            return { data: json };

        }

    });

});
