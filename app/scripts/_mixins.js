
define([

    'underscore'

], function(_) {

    'use strict';

    _.mixin({

        /**
         * Delete attributes that have no value from an object
         * @param  Object The object to check
         * @return Object  The updated object
         */
        compactObject: function(o) {

            _.each(o, function(v, k) {

                if (!v) delete o[k];

            });

            return o;
        },

        exists: function(x) {

            return x != null;

        },

        truthy: function(x) {

            return (x !== false) && _.exists(x);

        },

        cat: function() {

            var head = _.first(arguments);

            if (_.exists(head)) {

                return head.concat.apply(head, _.rest(arguments));

            } else return [];

        },

        construct: function(head, tail) {

            return _.cat([head], _.toArray(tail));

        },

        dispatch: function( /* functions */ ) {

            var fns = _.toArray(arguments),

                len = fns.length;

            return function(target /*, args */ ) {

                var ret, fn, i = 0,

                    args = _.rest(arguments);

                for (i; i < len; i++) {

                    fn = fns[i];

                    ret = fn.apply(fn, _.construct(target, args));

                    // Return the first one that returns a valid value
                    if (_.exists(ret)) return ret;
                }

                return ret;

            };
        },

        getAttr: function(item, attr) {

            return item.attributes && item.attributes[attr] || item[attr];

        },

        getItemById: function(items, id, options) {

            var item, fn, idAttr = 'id';

            if (!_.isString(id)) return;

            if (!_.exists(options)) options = {};

            idAttr = options.id || idAttr;

            fn = function(itm) { return id === _.getAttr(itm, idAttr);};

            item = _.find(items, fn);

            return options.select !== true ? item : _.selectItem(item, items, options);

        },

        getItemAt: function(items, index, options) {

            var item = items[index];

            if (!_.exists(options)) options = {};

            return options.select !== true ? item : _.selectItem(item, items, options);

        },

        getSelectedItem: function(items) {

            if (!_.exists(items)) return;
            
            return _.find(items, function(item) {

                return item.selected === true;

            });
        },

        resetItems: function(items) {

            // Unselect
            _.each(items, function(item) { item.selected = false; });

            return items;
        },

        selectItem: function(targetItem, items, options) {

            var coll;

            if (!targetItem) return;

            coll = targetItem.collection;

            options || (options = {});

            items = items || (_.isArray(coll) ? coll : coll.models);

            // Limit the items reset when selecting.
            if (options.restrictItemsToCampus === true) {

                console.log('restrictItemsToCampus', targetItem, items);

                items = _.filter(items, function(item) { return _.getAttr(item, 'campusid') === _.getAttr(targetItem, 'campusid'); });

            }

            _.resetItems(items);

            targetItem.selected = true;

            console.log('restrictItemsToCampus selected', targetItem, targetItem.selected);

            return targetItem;

        },

        latLng: function(txtLatLng) {

            var coords = txtLatLng.replace(/ /g,'').split(",");

            return _.map(coords, function(coord) { return parseFloat(coord); });
        },

        stringToObject: function(txt, delimitPairs, delimitKeyVal) {

            var delimPairs = delimitPairs || ',',

                delimKeyVal = delimitKeyVal || ':';

            return _.chain(txt.split(delimPairs))

                    .map(function(pair) { return pair.split(delimKeyVal); })

                    .object()

                    .value();

        },

        orderAttributes: function() {


        }

    });

    return _;

});
