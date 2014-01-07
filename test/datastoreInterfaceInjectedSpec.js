define(['_mixins', '../scripts/services/data/datastore-injected'], function (_, Datastore) {

  describe('Datastore Tests', function () {


    beforeEach(function() {

      var campusList, mapList;

      campuses = _.resetItems(Datastore.campusList().models);

      maps = _.resetItems(Datastore.mapList().models);

    });

    afterEach(function(){

    });

    describe('Exposed methods', function () {

      it('should have a fetch method', function () {

        expect(Datastore.fetch).toBeDefined();

      });

      it('should have a campus method', function () {

        expect(Datastore.campus).toBeDefined();

      });

      it('should have a map method', function () {

        expect(Datastore.map).toBeDefined();

      });

      it('should have a campusList method', function () {

        expect(Datastore.campusList).toBeDefined();

      });

      it('should have a mapList method', function () {

        expect(Datastore.mapList).toBeDefined();

      });

    });

    describe('Internal', function () {

      it('should reset selections after each test', function () {

        var campus = Datastore._.selectFirst();

        console.info('\nInternal::should be able to get and select the first campus', campus);

        expect(campus.selected).toBe(true);

      });


      it('should reset selections after each test', function () {

        var campus = Datastore.campusList().at(0);

        console.info('\nInternal::should reset selections', campus);

        expect(campus.selected).not.toEqual(true);

      });

    });

    describe('Private methods', function () {

      it('should be able to get and select the first campus', function () {

        var campus = Datastore._.selectFirst();

        console.info('\nPrivate::should be able to get and select the first campus', campus);

        expect(campus.selected).toBe(true);

        expect(campus.id).toBe('campus-boston');

      });

      it('should be able to get and select the first map of a campus', function () {

        var campus = Datastore._.selectFirst(),

            map = Datastore._.selectFirstMap(campus);

        console.info('\nPrivate::should be able to get and select the first map', map);

        expect(map.selected).toBe(true);

        expect(map.id).toBe('bosmap1');

      });

      it('should be able to get the maps of a specific campus', function () {

        var campus1 = Datastore.campus('campus-boston'),

            maps1 = Datastore._.getCampusMaps(campus1),

            campus2 = Datastore.campus('campus-medford'),

            maps2 = Datastore._.getCampusMaps(campus2)

        console.info('\nPrivate::should be able to get the maps of a specific campus', maps1);

        expect(maps1.length).toBe(3);

        expect(maps2.length).toBe(2);

      });

      it('should generate a list of all maps (all campuses)', function () {

        var campusList = Datastore.campusList();

            mapList = Datastore._.createMapList(campusList);

        console.info('\nPrivate::should generate a list of all maps (all campuses)', mapList, console);

        expect(mapList.length).toBe(5);

      });

      it('should get a map marked as default for a campus', function () {

        var campus = Datastore.campus('campus-boston'),

            map = Datastore._.selectDefaultMapForCampus(campus);

        console.info('\nPrivate::should get a map marked as default for a campus', map);

        expect(map.id).toBe('bosmap2');

      });

      it('should get a selected campus', function () {

        var campus;

        Datastore._.selectFirst();

        campus = Datastore._.getSelectedCampus();

        console.info('\nPrivate::should get a selected campus', campus);

        expect(campus.selected).toBe(true);

      });

    });

    describe('All Items', function () {

      it('should return all campuses', function () {

        expect(Datastore.campusList().length).toBe(3);

        console.info('\nCampuses::should return all campuses', Datastore.campusList());

      });

      it('should return all maps', function () {

        expect(Datastore.mapList().length).toBe(5);

        console.info('\nMaps::should return all maps', Datastore.mapList());

      });

      it('should only have 1 campus selected at a time', function () {

        var campus = Datastore.campus();

        expect(campus.id).toBe('campus-boston');

        campus = Datastore.campus('campus-medford', { select: true });

        expect(campus.id).toBe('campus-medford');

        campus = Datastore.campus('campus-grafton', { select: true });

        expect(campus.id).toBe('campus-grafton');

        // Just getting the campus, not selecting it
        campus = Datastore.campus('campus-boston');

        // Getting selected campus
        expect(Datastore.campus().id).toBe('campus-grafton');

      });

      it('should have selected map for each campus', function () {

        // Should return the first campus (boston)
        var campus = Datastore.campus(),

            map = Datastore.map(campus);

        expect(map.id).toBe('bosmap2');

        campus = Datastore.campus('campus-medford', { select: true });

        map = Datastore.map(campus);

        console.log('@medford', campus, map);
        
        expect(map.id).toBe('medmap');

        // Boston map should still be selected
        campus = Datastore.campus('campus-boston');

        map = Datastore.map(campus);

        console.log('@boston', campus, map);

        expect(map.id).toBe('bosmap2');

      });

      it('should have only 1 selected map for each campus, never multiple', function () {

        var campus = Datastore.campus('campus-boston'), 

            map = Datastore.map(campus);

        // This is the default map
        expect(map.id).toBe('bosmap2');

        //Datastore.map('bosmap1', { restrictItemsToCampus: true, select: true });

        Datastore.map('boston-main1', { id: 'mapid', restrictItemsToCampus: true, select: true });

        

        map = Datastore.map(campus);

        console.log('@all maps', Datastore.mapList());

        expect(map.id).toBe('bosmap1');

      });

    });

    describe('Defaults', function () {

      it('should grab the first campus if none selected', function () {

        var campus = Datastore.campus();

        expect(campus.id).toBe('campus-boston');

      });

      it('should select the first campus if none selected', function () {

        var campus = Datastore.campus();

        expect(campus.selected).toBe(true);

      });

      it('should grab the first map of a campus if none marked as default, and select it', function () {

        var map,

          campus = Datastore.campus('campus-boston');

        campus.set('defaultmap', null);

        _.resetItems(Datastore._.getCampusMaps(campus));

        map = Datastore.map(campus);

        expect(map.id).toBe('bosmap1');

        expect(map.selected).toBe(true);

      });

    });

    describe('By Ids', function () {

      it('should return any campus by id', function () {

          var boston = Datastore.campus('campus-boston'),

            medford = Datastore.campus('campus-medford'),

            grafton = Datastore.campus('campus-grafton');

          expect(boston.id).toBe('campus-boston');

          expect(medford.id).toBe('campus-medford');

          expect(grafton.id).toBe('campus-grafton');

      });

      it('should return any map by id', function () {

          var map1 = Datastore.map('engmap'),

            map2 = Datastore.map('bosmap2');

          expect(map1.id).toBe('engmap');

          expect(map2.id).toBe('bosmap2');

      });

    });

    describe('JSON', function () {

      it('should return any array of JSON objects for campuses', function () {

          var json = Datastore.JSON.campuses();

          console.log('json', json);

          expect(json.length).toBe(3);

          expect(json[0].campusid).toBe('boston');

      });

      it('should return any array of JSON objects for maps of a campus', function () {

          var campus = Datastore.campus('campus-boston'),

              json = Datastore.JSON.maps(campus);

          console.log('map json', json);

          expect(json.length).toBe(3);

          // maps have a campusid too
          expect(json[0].campusid).toBe('boston');

      });

    });

  });

});