define([

    'scripts/domManager'

    , 'scripts/services/map/MapUtils'

    , 'datastore'

    , 'searchpanels/base'

    , 'eventdispatcher'

    , 'async!http://maps.google.com/maps/api/js?sensor=false'

], function(DomManager, MapUtils, Datastore, Base, EventDispatcher) {

    'use strict';

    var StreetviewView = Base.extend({

        id: 'Streetview',

        events: {

            'mouseover .btn-panorama' : 'handleFocus',

            'mouseout .btn-panorama' : 'handleUnFocus',

            'focus .btn-panorama' : 'handleFocus',

            'blur .btn-panorama' : 'handleUnFocus',

            'click .btn-streetview' : function(ev) {
    
                var campus = Datastore.campus(),

                    map = Datastore.map(campus),

                    location = map.details,

                    panoramas = !_.isEmpty(_.getAttr(location, 'panoramas')) ? _.getAttr(location, 'panoramas') : [];

                if (panoramas) EventDispatcher.trigger('truthupdate', { panoramas: panoramas });

            },


            'click .btn-satellite' : function(ev) {

                EventDispatcher.trigger('truthupdate', { maptype: 'toggle' });

            }

        },

        template: JST['app/scripts/templates/searchpanels/Streetview.ejs'],

        handleFocus: function(ev) {

            var $btn = $(ev.currentTarget),

                index = $btn.data('photoindex') || 0,

                panoramas = this.model.get('panoramas'),

                url;

            if (_.isEmpty(panoramas)) return;

            url = MapUtils.getStreetviewStaticUrl(panoramas[index]);

            EventDispatcher.trigger('truthupdate', { 

                photowide: MapUtils.getStreetviewStaticUrl(panoramas[index]),

                panoramahighlight: panoramas[index]

            });


        },

        handleUnFocus: function(ev) {

            EventDispatcher.trigger('truthupdate', { photowide: '', panoramahighlight: '' });

        },

        getJSON: function() {

            var campus = Datastore.campus(),

                map = Datastore.map(campus),

                location = map.details, 

                json = _.getAttr(location, 'panoramas') || [];

            return { data: json };

        },

        handleOpenPreState: function() {

            var state = this.model.get('state'),

                $thumbs = this.$el.find('.streetview-thumbnails'),

                DM = DomManager.getInstance(),

                model = this.model;

            this.stopListening(EventDispatcher, 'change:panoramas');

            this.listenTo(EventDispatcher, 'change:panoramas', function(panoramas) {

                var classname = 'active';

                if (state !== 'open') return;

                DM.cssFlag(classname, { remove: panoramas.length === 0, $el: $thumbs });

                model.set('panoramas', panoramas, { silent: true });

            });

            Base.prototype.handleOpenPreState.call(this);

        },

       handleClosePostState: function() {

            this.stopListening(EventDispatcher, 'change:panoramas');

            Base.prototype.handleClosePostState.call(this);

        }

    });

    return StreetviewView;

});
