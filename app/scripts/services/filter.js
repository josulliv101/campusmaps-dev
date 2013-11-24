/*
 *	Filter Locations
 *
 *  Get the appropriate locations based on appropriate filters. Filters
 *	include: all, by map, by tag
 *
 */

 define([

 	'_mixins'

 	], function(_) {

 		'use strict';

 		var query_ = { term: '' }, 

 		// Cache the created function for access later
 		getFilterFnForAttr_ = _.memoize(

	 		function(attr) {

	 			return function(loc) { 
					
					var val = _.getAttr(loc, attr);

	 				return _.exists(val) && val.indexOf(query_.term) > -1; 

	 			}

	 		}

 		)

 		// Convert filter params (a <String> key) to functions which can actually filter. If function passed in, just return it.
 		function filterParamsToFns_(filters) {

			return _.map(filters, function(filterParam) {

					var filter = filterParam.filter || filterParam;

					if (_.isFunction(filter)) return filter;

					// Return the filter matching an attr
					if (_.isString(filter)) return getFilterFnForAttr_(filter);

				});

 		}

 		function filter_(q, locations, filters) {

 			// Array of filter functions to apply to the locations
 			var fns;

 			if (!_.exists(locations) || !_.isArray(locations) ) return [];

 			_.isArray(filters) || (filters = [ filters ]);

 			// Update query object term
 			query_.term = q;

			fns = filterParamsToFns_(filters);

			// Apply the filters
 			_.each(fns, function(fn) { locations = _.filter(locations, fn); });

	 		return locations;

 		}


 		//// Public ////

 		return {

 			filter: filter_,

 			getQuery: function () { return query_; }

 		};

 	});
