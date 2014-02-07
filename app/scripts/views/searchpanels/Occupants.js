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

        /*,

        refresh: function (occupant) {

            var $el = this.$el, $panel, $nav, removeClasses, activePreviousId = this.model.get('activeprevious');

            panelid || (panelid = this.model.get('detailsview'));

            removeClasses = _.map(this.nav, function(item) { return 'active-' + item.navid + ' card-' + item.navid; }).join(" ");

            $el.find('.content-container,.card').removeClass(removeClasses);

            $el.find('.content-container').addClass('active-' + panelid);

            $el.find('.card').addClass('card-' + panelid);

            $el.find('.panel-content, .nav-details .nav-item').removeClass('active active-previous');

            $panel = $el.find('#' + panelid);

            $nav = $el.find('.nav-details .' + panelid);

            if (activePreviousId) {

                $el.find('#' + activePreviousId).addClass('active-previous');

            }

            Base.prototype.refresh.call(this);

            $panel.addClass('active');

            $nav.addClass('active');


        }*/

    });

});
