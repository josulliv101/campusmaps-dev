define(['_mixins', '../scripts/services/data/datastore-injected'], function (_, Datastore) {

  describe('Datastore Tests', function () {

    var campuses, mapList;

    beforeEach(function() {

      campuses = Datastore.fetch();

      mapList = Datastore.maps();

      if (_.isObject(campuses) && _.isArray(campuses.models)) campuses = campuses.models;

    });

    afterEach(function(){

      campuses = null;

    });

    describe('Getting a campus', function () {

      it('should have a fetch method', function () {

        expect(Datastore.fetch).toBeDefined();

      });

      it('should have a fetch, campus method', function () {

        expect(Datastore.campus).toBeDefined();

      });

      it('should have a map method', function () {

        expect(Datastore.map).toBeDefined();

        expect(Datastore.maps).toBeDefined();

      });

      it('should return all maps', function () {

        expect(mapList.models.length).toBe(3);

      });

      it('should return a maps by id', function () {

        expect(Datastore.map('bosmap').id).toBe('bosmap');

        expect(Datastore.map('medmap').id).toBe('medmap');

      });

      it('should return a map by customid', function () {

        var options = { id: 'mapid' };

        expect(Datastore.map('boston-main', options).id).toBe('bosmap');

        expect(Datastore.map('engineering-main', options).id).toBe('engmap');

      });

      it('should return undefined if none if no map selected and no id passed in', function () {

        expect(Datastore.map()).toBeUndefined();

      });

      it('should return the default if none if no map selected and no id passed in even if campus selected', function () {

        // Select a campus, still no map selected
        Datastore.campus('hij', { select: true });

        expect(Datastore.campus().id).toBe('hij');

        expect(Datastore.map().attributes.mapid).toBe('medford-main');

      });

      it('should return a map if a map and its campus selected', function () {

        Datastore.campus('hij', { select: true });

        // Select a map by id that belongs to hij (medford) campus
        expect(Datastore.map('engmap', { select: true }).id).toBe('engmap');

        expect(Datastore.map('engmap').selected).toBe(true);

        //console.info('test', Datastore.map());

        expect(Datastore.map().id).toBe('engmap');

      });

      it('should have only a single map selected at once per campus', function () {

        Datastore.campus('hij', { select: true });

        // Select a map by id that belongs to hij (medford) campus
        expect(Datastore.map('engmap', { select: true }).id).toBe('engmap');

        Datastore.campus('abc', { select: true });

        // Default map
        expect(Datastore.map().id).toBe('bosmap');

        // Get map for passed in campus
        expect(Datastore.map( Datastore.campus('hij') ).id).toBe('engmap');

        //expect(Datastore.campus('hij').id).toBe('hij');

        // Medford campus should still have engmap selected
        //expect(Datastore.map( Datastore.campus('hij') ).id).toBe('engmap');
debugger;
        //Datastore.campus('hij', { select: true });
console.log('Datastore.campus()', Datastore.campus('hij') );
console.log('Datastore.maps()', Datastore.map( Datastore.campus('hij') ));

        //expect(Datastore.map().id).toBe('engmap');

      });

      it('should return the selected map if a campus passed in', function () {

        var bostonCampus = Datastore.campus('abc'), 

            medfordCampus = Datastore.campus('hij');

        console.log('bostonCampus', bostonCampus);

        expect(Datastore.map('engmap', { select: true }).id).toBe('engmap');

        expect(Datastore.map('bosmap', { select: true }).id).toBe('bosmap');

        console.log('bostonCampus2', Datastore.map(bostonCampus));

        expect(Datastore.map(bostonCampus).id).toBe('bosmap');

        expect(Datastore.map(medfordCampus).id).toBe('engmap');


      });

      it('should return campuses', function () {

        expect(campuses).toBeDefined();

      });

      it('should be able to get a campus by id', function () {

        expect(Datastore.campus('xyz')).toBeDefined();

        //console.info('campuses spec', Datastore.campus('xyz').id, campuses);

        expect(Datastore.campus('xyz')).toEqual(_.getItemAt(campuses, 1));

      });

      it('should be able to get a campus by a custom id', function () {

        var options = { id: 'campusid' };

        expect(Datastore.campus('grafton', options)).toEqual(_.getItemAt(campuses, 1));

      });

      it('should be able to get a selected campus if id not found or undefined', function () {

        _.resetItems(campuses);

        console.log('Datastore.campus()', Datastore.campus());

        // Nothing selected yet
        expect(Datastore.campus()).not.toBeDefined();

        Datastore.campus('xyz', { select: true });

        expect(Datastore.campus()).toBeDefined();

        expect(Datastore.campus()).toEqual(_.getItemAt(campuses, 1)); // grafton

        Datastore.campus('medford', { id: 'campusid', select: true });

        expect(Datastore.campus()).toEqual(_.getItemAt(campuses, 2));

      });

    });

  });

});