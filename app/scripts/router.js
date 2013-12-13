/*global define*/
define([

    'underscore',

    'backbone',

    'eventdispatcher'

], function(_, Backbone, EventDispatcher) {

    'use strict';

    var settingsUrl,

        AppRouter = Backbone.Router.extend({

            routes: {

                //'_:cmd': 'command',

                // Default
                '*params': 'processDefaults'

            },

            processQueryString: function(qs) {

                if (_.isString(qs)) qs = qs.replace(/[^a-zA-Z0-9-_&=,|]/g, '');

                qs = qs || '';

                // If not key/value pairs, assume it's a campus id
                if (qs.length > 0 && qs.indexOf('=') === -1 && qs.indexOf('&') === -1) {

                    qs = 'campusid=' + qs;

                }

                return qs;

            },

            getDefaults: function(qs) {

                var defaults, qs = this.processQueryString(qs);

                defaults = _.chain(qs.split('&'))

                .map(function(pair) {

                    return pair.split('=');

                })

                .object()

                .value();

                return defaults;

            }

        });

    var init = function() {

        var appRouter = new AppRouter();

        appRouter.on('route:processDefaults', function(q) {

            settingsUrl = this.getDefaults(q);

            console.log('route:processDefaults', settingsUrl);

            // DataManager is listening
            //EventDispatcher.trigger('set:defaults', defaults);

        });

        Backbone.history.start();

        return appRouter;

    };

    return {

        init: init

        , settingsUrl: settingsUrl 

    };
});
