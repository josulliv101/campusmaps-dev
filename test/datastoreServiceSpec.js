define(['_mixins', 'datastore'], function (_, Datastore) {

  describe('Datastore Tests', function () {

    var campuses;

    beforeEach(function() {

      campuses = Datastore.fetch();

      if (_.isObject(campuses) && _.isArray(campuses.models)) campuses = campuses.models;

    });

    afterEach(function(){

      campuses = null;

    });

    describe('Getting a campus', function () {

      it('should have a fetch, campus and map method', function () {

        expect(Datastore.fetch).toBeDefined();

        expect(Datastore.campus).toBeDefined();

        expect(Datastore.map).toBeDefined();

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