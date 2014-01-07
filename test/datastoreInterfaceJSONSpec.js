define(['_mixins', '../scripts/services/data/Datastore-jsonp'], function (_, DatastoreJSON) {

  describe('DatastoreJSON Tests', function () {

    var campusList, mapList;

    beforeEach(function() {

      campuses = _.resetItems(DatastoreJSON.campusList().models);

      maps = _.resetItems(DatastoreJSON.mapList().models);

    });

    afterEach(function(){

      

    });

    describe('Exposed methods', function () {

      it('should have a fetch method', function () {

        expect(DatastoreJSON.fetch).toBeDefined();

      });

      it('should have a campus method', function () {

        expect(DatastoreJSON.campus).toBeDefined();

      });

      it('should have a map method', function () {

        expect(DatastoreJSON.map).toBeDefined();

      });

      it('should have a campusList method', function () {

        expect(DatastoreJSON.campusList).toBeDefined();

      });

      it('should have a mapList method', function () {

        expect(DatastoreJSON.mapList).toBeDefined();

      });

    });

    describe('Internal', function () {

/*
      it('should reset selections after each test', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus = DatastoreJSON._.selectFirstCampus();

          console.info('\nInternal::should be able to get and select the first campus', campus);

          expect(campus.selected).toBe(true);

        });

      });

      it('should reset selections after each test', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus = DatastoreJSON.campusList().at(0);

          console.info('\nInternal::should reset selections', campus);

          expect(campus.selected).not.toEqual(true);

        });

      });*/

    });

    describe('Private methods', function () {

/*      it('should be able to get and select the first campus', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus = DatastoreJSON._.selectFirstCampus();

          console.info('\nPrivate::should be able to get and select the first campus', campus);

          expect(campus.selected).toBe(true);

          expect(_.getAttr(campus,'campusid')).toBe('boston');

        });

      });



      it('should be able to get and select the first map of a campus', function () {


        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus = DatastoreJSON._.selectFirstCampus(),

              map = DatastoreJSON._.selectFirstMap(campus);

          console.info('\nPrivate::should be able to get and select the first map', map );

          expect(map.selected).toBe(true);

          expect(map.mapid).toBe('boston-main');

        });

      });

      it('should be able to get the maps of a specific campus', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus1, maps1, campus2, maps2;

          campus1 = DatastoreJSON.campus('boston', { id: 'campusid' });

          maps1 = DatastoreJSON._.getCampusMaps(campus1);

          campus2 = DatastoreJSON.campus('medford', { id: 'campusid' });

          maps2 = DatastoreJSON._.getCampusMaps(campus2);

          expect(maps1.length).toBe(3);

          expect(maps2.length).toBe(4);

        });

      });

      it('should generate a list of all maps (all campuses)', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campusList = DatastoreJSON.campusList();

              mapList = DatastoreJSON._.createMapList(campusList);

          console.info('\nPrivate::should generate a list of all maps (all campuses)', mapList, console);

          expect(mapList.length).toBe(7);

        });

      });

      it('should get a map marked as default for a campus', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus = DatastoreJSON.campus(),

              map = DatastoreJSON.map(campus);

          console.info('\nPrivate::should get a map marked as default for a campus', campus, map);

          expect(map.mapid).toBe('boston-test');

        });

      });

      it('should get a selected campus', function () {


        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus;

          DatastoreJSON._.selectFirstCampus();

          campus = DatastoreJSON._.getSelectedCampus();

          console.info('\nPrivate::should get a selected campus', campus);

          expect(campus.selected).toBe(true);

          expect(DatastoreJSON.campus().selected).toBe(true);

        });

      });
*/
    });

    describe('All Items', function () {
/*
      it('should return all campuses', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          expect(DatastoreJSON.campusList().length).toBe(3);

        });

      });

      it('should return all maps', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          expect(DatastoreJSON.mapList().length).toBe(7);

          console.info('\nMaps::should return all maps', DatastoreJSON.mapList());

        });

      });
*/
      it('should only have 1 campus selected at a time', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          DatastoreJSON.campus('campus-medford', { select: true });

          expect(DatastoreJSON.campus().id).toBe('campus-medford');

          DatastoreJSON.campus('campus-boston', { select: true });

          expect(DatastoreJSON.campus().id).toBe('campus-boston');

          // Just getting the campus, not selecting it
          DatastoreJSON.campus('campus-grafton');

          // Getting selected campus
          expect(DatastoreJSON.campus().id).toBe('campus-boston');

        });


      });


      it('should have selected map for each campus', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          // Should return the first campus (boston)
          var campus = DatastoreJSON.campus(),

              map = DatastoreJSON.map(campus);

          expect(map.id).toBe('boston2');

          campus = DatastoreJSON.campus('campus-medford', { select: true });

          map = DatastoreJSON.map(campus);

          expect(map.id).toBe('medford1');


          // Boston map should still be selected
          campus = DatastoreJSON.campus('campus-boston');

          map = DatastoreJSON.map(campus);

          expect(map.id).toBe('boston2');

        });

      });

      it('should have only 1 selected map for each campus, never multiple', function () {


        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus = DatastoreJSON.campus('campus-boston', { select: true }), 

              map = DatastoreJSON.map(campus);

          // This is the default map
          expect(map.id).toBe('boston2');

          DatastoreJSON.map('boston2', { restrictItemsToCampus: true, select: true });

          DatastoreJSON.map('boston-main', { id: 'mapid', restrictItemsToCampus: true, select: true });

          map = DatastoreJSON.map(campus);

          expect(map.id).toBe('boston1');

          expect(DatastoreJSON.map('boston2').selected).toBe(false);

        });

      });

    });

/*
        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

        });
*/


    describe('Defaults', function () {

      it('should grab the first campus if none selected', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus = DatastoreJSON.campus();

          expect(campus.id).toBe('campus-boston');

        });

      });

      it('should select the first campus if none selected', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus = DatastoreJSON.campus();

          expect(campus.selected).toBe(true);

        });

      });

      it('should grab the first map of a campus if none marked as default, and select it', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var map,

            campus = DatastoreJSON.campus('campus-boston');

          campus.set('defaultmap', null);

          _.resetItems(DatastoreJSON._.getCampusMaps(campus));

          map = DatastoreJSON.map(campus);

          expect(map.id).toBe('boston1');

          expect(map.selected).toBe(true);

        });

      });

    });

    describe('By Ids', function () {

      it('should return any campus by id', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var boston = DatastoreJSON.campus('campus-boston'),

            medford = DatastoreJSON.campus('campus-medford'),

            grafton = DatastoreJSON.campus('campus-grafton');

          expect(boston.id).toBe('campus-boston');

          expect(medford.id).toBe('campus-medford');

          expect(grafton.id).toBe('campus-grafton');

        });

      });

      it('should return any map by id', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var map1 = DatastoreJSON.map('medford3'),

            map2 = DatastoreJSON.map('boston3');

          expect(map1.id).toBe('medford3');

          expect(map2.id).toBe('boston3');

        });

      });


    });

    describe('JSON', function () {

      it('should return any array of JSON objects for campuses', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var json = DatastoreJSON.JSON.campuses();

          console.log('json', json);

          expect(json.length).toBe(3);

          expect(json[0].campusid).toBe('boston');

        });

      });

      it('should return any array of JSON objects for maps of a campus', function () {

        DatastoreJSON.fetch();

        waitsFor(function() {

          return DatastoreJSON.campusList().length > 0;

        }, "fetch data", 5000);

        runs(function () {

          var campus = DatastoreJSON.campus('campus-boston'),

              json = DatastoreJSON.JSON.maps(campus);

          console.log('map json', json);

          expect(json.length).toBe(3);

          // maps have a campusid too
          expect(json[0].campusid).toBe('boston');

        });

      });

    });

  });

});