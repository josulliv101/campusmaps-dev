define(['_mixins', '../scripts/services/data/datastore-injected'], function (_, DatastoreInterface) {

  describe('Datastore Tests', function () {


    beforeEach(function() {

      var campusList, mapList;

      campuses = _.resetItems(DatastoreInterface.campusList().models);

      maps = _.resetItems(DatastoreInterface.mapList().models);

    });

    afterEach(function(){

    });

    describe('Exposed methods', function () {

      it('should have a fetch method', function () {

        expect(DatastoreInterface.fetch).toBeDefined();

      });

      it('should have a campus method', function () {

        expect(DatastoreInterface.campus).toBeDefined();

      });

      it('should have a map method', function () {

        expect(DatastoreInterface.map).toBeDefined();

      });

      it('should have a campusList method', function () {

        expect(DatastoreInterface.campusList).toBeDefined();

      });

      it('should have a mapList method', function () {

        expect(DatastoreInterface.mapList).toBeDefined();

      });

    });

    describe('Internal', function () {

      it('should reset selections after each test', function () {

        var campus = DatastoreInterface._.selectFirst(DatastoreInterface.campusList().models);

        console.info('\nInternal::should be able to get and select the first campus', campus);

        expect(campus.selected).toBe(true);

      });


      it('should reset selections after each test', function () {

        var campus = DatastoreInterface.campusList().at(0);

        console.info('\nInternal::should reset selections', campus);

        expect(campus.selected).not.toEqual(true);

      });

    });

    describe('Private methods', function () {

      it('should be able to get and select the first campus', function () {

        var campus = DatastoreInterface._.selectFirst(DatastoreInterface.campusList().models);

        console.info('\nPrivate::should be able to get and select the first campus', campus);

        expect(campus.selected).toBe(true);

        expect(campus.id).toBe('campus-boston');

      });

      it('should be able to get and select the first map of a campus', function () {

        var campus = DatastoreInterface._.selectFirst(DatastoreInterface.campusList().models),

            map = DatastoreInterface._.selectFirstMap(campus);

        console.info('\nPrivate::should be able to get and select the first map', map);

        expect(map.selected).toBe(true);

        expect(map.id).toBe('bosmap1');

      });

      it('should be able to get the maps of a specific campus', function () {

        var campus1 = DatastoreInterface.campus('campus-boston'),

            maps1 = DatastoreInterface._.getCampusMaps(campus1),

            campus2 = DatastoreInterface.campus('campus-medford'),

            maps2 = DatastoreInterface._.getCampusMaps(campus2)

        console.info('\nPrivate::should be able to get the maps of a specific campus', maps1);

        expect(maps1.length).toBe(3);

        expect(maps2.length).toBe(2);

      });

      it('should generate a list of all maps (all campuses)', function () {

        var campusList = DatastoreInterface.campusList();

            mapList = DatastoreInterface._.createMapList(campusList);

        console.info('\nPrivate::should generate a list of all maps (all campuses)', mapList, console);

        expect(mapList.length).toBe(5);

      });

      it('should get a map marked as default for a campus', function () {

        var campus = DatastoreInterface.campus('campus-boston', { select: true }),

            map = DatastoreInterface.map(campus);

        console.info('\nPrivate::should get a map marked as default for a campus', map);

        expect(map.id).toBe('bosmap2');

      });

      it('should get a selected campus', function () {

        var campus;

        DatastoreInterface._.selectFirst(DatastoreInterface.campusList().models);

        campus = DatastoreInterface.campus();

        console.info('\nPrivate::should get a selected campus', campus);

        expect(campus.selected).toBe(true);

      });

    });

    describe('All Items', function () {

      it('should return all campuses', function () {

        expect(DatastoreInterface.campusList().length).toBe(3);

        console.info('\nCampuses::should return all campuses', DatastoreInterface.campusList());

      });

      it('should return all maps', function () {

        expect(DatastoreInterface.mapList().length).toBe(5);

        console.info('\nMaps::should return all maps', DatastoreInterface.mapList());

      });

      it('should only have 1 campus selected at a time', function () {

        var campus = DatastoreInterface.campus();

        expect(campus.id).toBe('campus-boston');

        campus = DatastoreInterface.campus('campus-medford', { select: true });

        expect(campus.id).toBe('campus-medford');

        campus = DatastoreInterface.campus('campus-grafton', { select: true });

        expect(campus.id).toBe('campus-grafton');

        // Just getting the campus, not selecting it
        campus = DatastoreInterface.campus('campus-boston');

        // Getting selected campus
        expect(DatastoreInterface.campus().id).toBe('campus-grafton');

      });

      it('should have selected map for each campus', function () {

        // Should return the first campus (boston)
        var campus = DatastoreInterface.campus(),

            map = DatastoreInterface.map(campus);

        expect(map.id).toBe('bosmap2');

        campus = DatastoreInterface.campus('campus-medford', { select: true });

        map = DatastoreInterface.map(campus);

        console.log('@medford', campus, map);
        
        expect(map.id).toBe('medmap');

        // Boston map should still be selected
        campus = DatastoreInterface.campus('campus-boston');

        map = DatastoreInterface.map(campus);

        console.log('@boston', campus, map);

        expect(map.id).toBe('bosmap2');

      });

      it('should have only 1 selected map for each campus, never multiple', function () {

        var campus = DatastoreInterface.campus('campus-boston'), 

            map = DatastoreInterface.map(campus);

        // This is the default map
        expect(map.id).toBe('bosmap2');

        //DatastoreInterface.map('bosmap1', { restrictItemsToCampus: true, select: true });

        DatastoreInterface.map('boston-main1', { id: 'mapid', restrictItemsToCampus: true, select: true });

        

        map = DatastoreInterface.map(campus);

        console.log('@all maps', DatastoreInterface.mapList());

        expect(map.id).toBe('bosmap1');

      });

    });

    describe('Defaults', function () {

      it('should grab the first campus if none selected', function () {

        var campus = DatastoreInterface.campus();

        expect(campus.id).toBe('campus-boston');

      });

      it('should select the first campus if none selected', function () {

        var campus = DatastoreInterface.campus();

        expect(campus.selected).toBe(true);

      });

      it('should grab the first map of a campus if none marked as default, and select it', function () {

        var map,

          campus = DatastoreInterface.campus('campus-boston');

        campus.set('defaultmap', null);

        _.resetItems(DatastoreInterface._.getCampusMaps(campus));

        map = DatastoreInterface.map(campus);

        expect(map.id).toBe('bosmap1');

        expect(map.selected).toBe(true);

      });

    });

    describe('By Ids', function () {

      it('should return any campus by id', function () {

          var boston = DatastoreInterface.campus('campus-boston'),

            medford = DatastoreInterface.campus('campus-medford'),

            grafton = DatastoreInterface.campus('campus-grafton');

          expect(boston.id).toBe('campus-boston');

          expect(medford.id).toBe('campus-medford');

          expect(grafton.id).toBe('campus-grafton');

      });

      it('should return any map by id', function () {

          var map1 = DatastoreInterface.map('engmap'),

            map2 = DatastoreInterface.map('bosmap2');

          expect(map1.id).toBe('engmap');

          expect(map2.id).toBe('bosmap2');

      });

    });

    describe('JSON', function () {

      it('should return any array of JSON objects for campuses', function () {

          var json = DatastoreInterface.JSON.campuses();

          console.log('json', json);

          expect(json.length).toBe(3);

          expect(json[0].campusid).toBe('boston');

      });

      it('should return any array of JSON objects for maps of a campus', function () {

          var campus = DatastoreInterface.campus('campus-boston'),

              json = DatastoreInterface.JSON.maps(campus);

          console.log('map json', json);

          expect(json.length).toBe(3);

          // maps have a campusid too
          expect(json[0].campusid).toBe('boston');

      });

    });

  });

});