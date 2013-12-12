define([

	'scripts/modernizr'

], function (FeatureDetector) { 

    function parseQueryString_( queryString ) {

        var params = {}, queries, temp, i, l;
        
        if (queryString.indexOf('?') === 0) queryString = queryString.substring(1); 

        // Split into key/value pairs
        queries = queryString.split("&");
     
        // Convert the array of strings into an object
        for ( i = 0, l = queries.length; i < l; i++ ) {

            temp = queries[i].split('=');

            params[temp[0]] = temp[1];

        }
        
        return modules_(params);
    }

    function modules_( obj ) {

        var i, len, pairs, ret = {};

        if (obj.modules === undefined) return;

        pairs = obj.modules.split(',');

        for ( i = 0, len = pairs.length; i < len; i++ ) {
            
            var pair = pairs[i].split('|');

            if (pair.length === 2) ret[pair[0]] = pair[1];

        }

        return ret;

    }

	return {

		getOverrides: function (q) { 

	        var modules = {};

	        console.log('q', q);

            

	        if (q === undefined) return modules;

	        modules = parseQueryString_(q);

	        if (modules === undefined) return {};

	        if (modules.animation) return modules;

	        // Forcing a module via querystring params takes precedence over feature detection tweaks
	        if (Modernizr.cssanimations === true) modules.animation = 'animationCSS';

	        console.log('modules', modules, Modernizr.cssanimations );

	        return modules;

		}
	} 

});