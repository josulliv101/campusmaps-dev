define(['_mixins', '../scripts/services/data/datastore-injected'], function (_, Datastore) {

  describe('Datastore Tests', function () {

    var campuses, maps;

    beforeEach(function() {

      console.info('Datastore fetch');

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

      it('should return the selected map if no id, or undefined if none', function () {

        expect(Datastore.map()).toBeUndefined();

        // Select a campus, still no map selected
        Datastore.campus('hij', { select: true });

        expect(Datastore.map()).toBeUndefined();

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