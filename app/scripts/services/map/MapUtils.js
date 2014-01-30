
define([

  '_mixins'

], function(_) {


    'use strict';


    var TILE_SIZE = 256,

      PX_ORIGIN = { x: TILE_SIZE / 2, y: TILE_SIZE / 2 },

      PX_PER_LON_DEGREE = TILE_SIZE / 360,

      PX_PER_LON_RADIAN = TILE_SIZE / (2 * Math.PI),

      tileCache = {};


    function Utils() {

      this.memoizeFunctions();

    }

    function Point(x, y) {

      this.x = x || 0;

      this.y = y || 0;

    }

    function getTileZoomId(tile, zoom) {

      return tile.x + '_' + tile.y + '_' + zoom;

    }

    function latLngToString(latLng) {

      if (latLng.lat && latLng.lng) return latLng.lat + ',' + latLng.lng;

      if (latLng.lat.prototype && latLng.lng.prototype) return latLng.lat() + ',' + latLng.lng();

      return latLng;

    }

    function getLatLngZoomId(latLng, zoom) {

      latLng = latLngToString(latLng);

      return latLng + 'z' + zoom;

    }

    function bound(value, opt_min, opt_max) {

        if (opt_min != null) value = Math.max(value, opt_min);

        if (opt_max != null) value = Math.min(value, opt_max);

        return value;

    }

    function degreesToRadians(deg) {

        return deg * (Math.PI / 180);

    }

    function radiansToDegrees(rad) {

        return rad / (Math.PI / 180);

    }

    Utils.prototype.getTileZoomId = getTileZoomId;

    Utils.prototype.point = function(x, y) { return new Point(x, y); };

    // See https://developers.google.com/maps/documentation/javascript/examples/map-coordinates?csw=1
    Utils.prototype.latLngToWorldPoint = function(latLng) {

      var point, siny;

      point = new Point();

      point.x = PX_ORIGIN.x + latLng.lng * PX_PER_LON_DEGREE;

      siny = bound(Math.sin(degreesToRadians(latLng.lat)), -0.9999, 0.9999);

      point.y = PX_ORIGIN.y + 0.5 * Math.log((1 + siny) / (1 - siny)) * -PX_PER_LON_RADIAN;

      return point;

    };

    Utils.prototype.worldPointToLatLng = function(point) {

      var origin = PX_ORIGIN;

      var lng = (point.x - origin.x) / PX_PER_LON_DEGREE;

      var latRadians = (point.y - origin.y) / -PX_PER_LON_RADIAN;

      var lat = radiansToDegrees(2 * Math.atan(Math.exp(latRadians)) - Math.PI / 2);

      return { lat: lat, lng: lng };

    }

    Utils.prototype.pixelCoordinateToWorldPoint = function(pxCoord, zoom) {

      var numTiles = 1 << zoom;

      return { x: pxCoord.x / numTiles, y: pxCoord.y / numTiles };

    }

    Utils.prototype.worldPointToPixelCoordinate = function(worldCoordinate, zoom) {

      var numTiles = 1 << zoom;

      return { x: worldCoordinate.x * numTiles, y: worldCoordinate.y * numTiles };

    }

    Utils.prototype.offsetLatLngByPixels = function(latLng, zoom, offset) {

      var worldPoint = this.latLngToWorldPoint(latLng),

          pxCoord = this.worldPointToPixelCoordinate(worldPoint, zoom),

          newWorldPoint, newLatLng;

      offset || (offset = {});

      // Adjust px coords by offsets
      pxCoord.x = pxCoord.x - (offset.x || 0);

      pxCoord.y = pxCoord.y - (offset.y || 0);

      newWorldPoint = this.pixelCoordinateToWorldPoint(pxCoord, zoom);

      newLatLng = this.worldPointToLatLng(newWorldPoint);

      return newLatLng;

    }

    Utils.prototype.getTileCache = function() {

      return tileCache;

    }

    // Done this way so it can reset easily when testing
    Utils.prototype.memoizeFunctions = function() {

      this.latLngToTileOffset = this.latLngToTileOffset_; //_.memoize( this.latLngToTileOffset_, function(latLng, zoom) { return getLatLngZoomId(latLng, zoom); });

      this.addLocationToTileCache = this.addLocationToTileCache_; //_.memoize( this.addLocationToTileCache_, function(tileOffset, loc) { return _.getAttr(loc, 'locationid') + getTileZoomId(tileOffset.tile, tileOffset.zoom); });

    }

    Utils.prototype.resetCache = function() {

      // Clear memoize cache by regenerating function, for test
      this.memoizeFunctions();

      return tileCache = {};

    }

    Utils.prototype.getLocationsFromTileCache = function(tile, zoom) {

      var key = getTileZoomId(tile, zoom);

      return tileCache[key] || [];

    }

    Utils.prototype.addLocationToTileCache_ = function(tileOffset, loc) {

      var key = getTileZoomId(tileOffset.tile, tileOffset.zoom);

      tileCache[key] || (tileCache[key] = []);

      tileCache[key].push(loc);

//console.log('tileCache', tileCache);

      // Give the loc a reference by zoom
      loc.tileCache || (loc.tileCache = {});

      loc.tileCache[tileOffset.zoom] = tileOffset;

      return loc;

    }


    Utils.prototype.latLngToTileOffset_ = function(latLng, zoom) {

      var zoomOrig = zoom, numTiles = 1 << zoom, worldCoordinate, pixelCoordinate, tileCoordinate;

      worldCoordinate = this.latLngToWorldPoint(latLng);

      pixelCoordinate = { x: worldCoordinate.x * numTiles, y: worldCoordinate.y * numTiles };

      tileCoordinate = { x: Math.floor(pixelCoordinate.x / TILE_SIZE), y: Math.floor(pixelCoordinate.y / TILE_SIZE) };

      return {

          tile: tileCoordinate,

          zoom: zoomOrig,

          offset: {

              x: Math.floor(pixelCoordinate.x % TILE_SIZE),

              y: Math.floor(pixelCoordinate.y % TILE_SIZE)

          }

      };

    }

    Utils.prototype.getStreetviewStaticUrl = function(obj) {

        var url = obj.photo || "http://maps.googleapis.com/maps/api/streetview?size=343x132&location=" + obj.position.lat() + "," + obj.position.lng() + "&fov=90&heading=" + obj.position.heading + "&pitch=" + obj.position.pitch + "&sensor=false";

        return encodeURIComponent(url);

    }
 
    return new Utils();

});