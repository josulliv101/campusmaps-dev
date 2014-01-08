
define([

  '../scripts/services/map/MapUtils'

], function (MapUtils) {

	describe('MapUtils Tests', function () {


		beforeEach(function() {

			MapUtils.resetCache();

		});

		afterEach(function(){

		});

		describe('Basic', function () {

			it('should exist', function () {

				expect( MapUtils ).toBeDefined();

			});

			it('should be able to create a Point', function () {

				var point = MapUtils.point();

				expect( point.x ).toBe(0);

				expect( point.y ).toBe(0);

			});

			it('should be able to create a Point specifying x and y values', function () {

				var point = MapUtils.point(100, 120);

				expect( point.x ).toBe(100);

				expect( point.y ).toBe(120);

			});

		});

		describe('Conversions', function () {

			it('should convert a lat/lng to a point', function () {

				var latlng = { lat: 42.403686, lng: -71.120338 },

					point = MapUtils.latLngToWorldPoint(latlng);

				expect( point ).toBeDefined();

			});

			it('should convert a lat/lng to a tile', function () {

				var latlng = { lat: 42.403686, lng: -71.120338 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng, 15);

				expect( tileOffset1 ).toBeDefined();

				expect( tileOffset2 ).toBeDefined();

			});

			it('should have a tile x/y, zoom and offset defined for a tileOffset', function () {

				var latlng = { lat: 42.403686, lng: -71.120338 },

					tileOffset = MapUtils.latLngToTileOffset(latlng, 17);

				expect( tileOffset.tile.x ).toBeDefined();

				expect( tileOffset.tile.y ).toBeDefined();

				expect( tileOffset.zoom ).toBeDefined();

				expect( tileOffset.offset.x ).toBeDefined();

				expect( tileOffset.offset.y ).toBeDefined();

			});

		});

		describe('Cache', function () {

			it('should add a location to the tile cache', function () {

				var latlng = { lat: 42.403686, lng: -71.120338 },

					tileOffset = MapUtils.latLngToTileOffset(latlng, 17),

					cache = MapUtils.getTileCache();

				MapUtils.addLocationToTileCache(tileOffset, { locationid: 'myloc1' });

				expect( _.size(cache) ).toBe(1);

			});

			it('should store different lat/lngs in different spots in cache when just zoom is different', function () {

				var latlng1 = { lat: 42.403686, lng: -71.120338 },

					latlng2 = { lat: 42.403686, lng: -71.120338 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng1, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng2, 16),

					cache = MapUtils.getTileCache();

				MapUtils.addLocationToTileCache(tileOffset1, { locationid: 'myloc1' });

				MapUtils.addLocationToTileCache(tileOffset2, { locationid: 'myloc2' });

				expect( _.size(cache) ).toBe(2);

				debugger;

			});

			it('should store different lat/lngs in different spots in cache when just zoom is same, but coords are different', function () {

				var latlng1 = { lat: 42.49686, lng: -71.180338 },

					latlng2 = { lat: 42.403686, lng: -71.120338 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng1, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng2, 17),

					cache = MapUtils.getTileCache();

				MapUtils.addLocationToTileCache(tileOffset1, { locationid: 'myloc1' });

				MapUtils.addLocationToTileCache(tileOffset2, { locationid: 'myloc2' });

				expect( _.size(cache) ).toBe(2);

			});

			it('should store different lat/lngs in same spots in cache when just zoom is same, coords fall on same tile', function () {

				var latlng1 = { lat: 42.49686, lng: -71.180338 },

					latlng2 = { lat: 42.49686, lng: -71.180348 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng1, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng2, 17),

					cache = MapUtils.getTileCache();

				MapUtils.addLocationToTileCache(tileOffset1, { locationid: 'myloc1' });

				MapUtils.addLocationToTileCache(tileOffset2, { locationid: 'myloc2' });

				expect( _.size(cache) ).toBe(1);

			});

			it('should get locations from the tile cache', function () {

				var latlng1 = { lat: 42.49686, lng: -71.180338 },

					latlng2 = { lat: 42.49686, lng: -71.180348 },

					latlng3 = { lat: 32.49686, lng: -71.180348 },

					tileOffset1 = MapUtils.latLngToTileOffset(latlng1, 17),

					tileOffset2 = MapUtils.latLngToTileOffset(latlng2, 17),

					tileOffset3 = MapUtils.latLngToTileOffset(latlng3, 17),

					cache = MapUtils.getTileCache(), locs;

				MapUtils.addLocationToTileCache(tileOffset1, { locationid: 'myloc1' });

				MapUtils.addLocationToTileCache(tileOffset2, { locationid: 'myloc2' });

				MapUtils.addLocationToTileCache(tileOffset3, { locationid: 'far away myloc3' });

				locs = MapUtils.getLocationsFromTileCache(tileOffset1.tile, tileOffset1.zoom);

				expect( locs.length ).toBe(2);

			});


		});

	});

});
