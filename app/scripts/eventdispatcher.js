define([

	'underscore',

	'backbone'

	], function(_, Backbone) {

	var instance = null;

	function MySingleton() {

		if (instance !== null) {

			throw new Error("Cannot instantiate more than one MySingleton, use MySingleton.getInstance()");
		
		}

		this.initialize();

	}

	MySingleton.prototype = {

		initialize: function() {

			// summary:
			// Initializes the singleton.
			this.foo = 0;

			this.bar = 1;

		}
		
	};

	MySingleton.getInstance = function() {
		// summary:
		// Gets an instance of the singleton. It is better to use
		if (instance === null){

			instance = _.extend({}, Backbone.Events);

			instance.foo = 'bar';

		}

		return instance;
	};

	return MySingleton.getInstance();

});
