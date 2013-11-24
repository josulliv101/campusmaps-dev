/*global define*/
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

                console.log('dispatch inner', args);

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

            return options.select !== true ? item : _.selectItem(item, items);

        },

        getItemAt: function(items, index, options) {

            var item = items[index];

            if (!_.exists(options)) options = {};

            return options.select !== true ? item : _.selectItem(item, items);

        },

        getSelectedItem: function(items) {

            return _.find(items, function(item) {

                return item.selected === true;

            });
        },

        selectItem: function(targetItem, items) {

            var coll = targetItem.collection;

            items = items || (_.isArray(coll) ? coll : coll.models);

            _.each(items, function(item) { item.selected = false; });

            targetItem.selected = true;

            return targetItem;

        }

    });

    return _;

});
