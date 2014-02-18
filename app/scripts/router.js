/*global define*/
define([

    'underscore',

    'backbone',

    'eventdispatcher'

], function(_, Backbone, EventDispatcher) {

    'use strict';

    var settingsUrl,

        urlLocationAttrWhiteList = ['details', 'campusmap', 'campusid'],
// 'latlng', ,  'highlight'
        urlAttrWhiteList = ['featured', 'query', 'querytype', 'customcampusmap', 'centeroffset', 'photowide', 'satellite', 'cmd', 'campusid', 'campusmap', 'locs', 'locationid', 'details', 'detailsview', 'vizpath!', 'zoom'], // 'vizpath',

        AppRouter = Backbone.Router.extend({

            routes: {

                //'_:cmd': 'command',

                // Default
                '*params': 'handleRoute'

            },

            initialize: function() {

                this.getLocationShareLink = _.compose(function(qs) {

                        return this.getBaseUrl() + "#cmd=Location&" + qs;

                    }, this.toLocationQueryString);

            },

            processQueryString: function(qs) {

                if (_.isString(qs)) {

                    qs = decodeURIComponent(qs);

                    qs = qs.replace(/[^a-zA-Z0-9-+_&=#,!\.:/|]/g, '');

                }

                qs = qs || '';

                // If not key/value pairs, assume it's a campus id
                if (qs.length > 0 && qs.indexOf('=') === -1 && qs.indexOf('&') === -1) {

                    qs = 'campusid=' + qs;

                }

                console.log('qs', qs);

                return qs;

            },

            handleRoute: function(q) {
                
                var settings = _.extend(this.settings, this.getDefaults(q));

                //settingsUrl = _.isString() ? this.getDefaults(q) : q;

                console.log('route:handleRoute', this.settings, this.getDefaults(q));

                //this.settings = settingsUrl;

                EventDispatcher.trigger('truthupdate', settings, { clear: false });

            },

            toQueryString: function(truth) {

                return  _.chain(truth)

                         .pick(urlAttrWhiteList)

                         // Watch XSS/urlencode
                         .map(function(val, key) { return key + '=' + (_.isObject(val) && val.value ? encodeURIComponent(val.value) : encodeURIComponent(val)); })

                         .value().join('&');

            },

            toLocationQueryString: function(truth) {

                return  _.chain(truth)

                         .pick(urlLocationAttrWhiteList)

                         // Watch XSS/urlencode
                         .map(function(val, key) { return key + '=' + (_.isObject(val) && val.value ? encodeURIComponent(val.value) : encodeURIComponent(val)); })

                         .value().join('&');

            },

            getBaseUrl: function() {

                var newURL = window.location.protocol + "//" + window.location.host + window.location.pathname;

                return newURL;

            },

            getLocationShareLink: function() {},

            getDefaults: function(qs) {

                var defaults, qs = this.processQueryString(qs);

                if (qs.indexOf('=') === -1) return {};

                defaults = _.chain(qs.split('&'))

                .map(function(pair) {

                    return pair.split('=');

                })

                .object()

                .value();

                console.log('defaults', defaults);

                return defaults;

            }

        });

    var init = function() {

        var appRouter = new AppRouter();

/*        appRouter.on('route:processDefaults', function(q) {

            settingsUrl = this.getDefaults(q);

            console.log('route:processDefaults', settingsUrl);

            appRouter.settings = settingsUrl;

            // DataManager is listening
            //EventDispatcher.trigger('set:defaults', defaults);

        });*/

        return appRouter;

    };

    return {

        init: init,

        settingsUrl: settingsUrl,

        start: function(options) { Backbone.history.start(options); }

    };
});
