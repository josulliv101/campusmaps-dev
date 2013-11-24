define(['jquery', '_mixins', '../scripts/services/datastore-parse-com'], function ($, _, Datastore) {

  describe('Datastore Parse.com Tests', function () {

    describe('Getting a campus', function () {

    afterEach(function(){

      campuses = null;

    });

      it('should have a fetch, campus and map method', function () {

        var callback = jasmine.createSpy();

        //console.info('Datastore fetch', Datastore);

        expect(Datastore.fetch).toBeDefined();

        expect(Datastore.campus).toBeDefined();
       
        $.when(Datastore.fetch())

         .then(function() { callback(); });

        waitsFor(function() {

            return callback.callCount > 0;

        });

        runs(function() {
        
            var campuses = Datastore.campuses;

            if (_.isObject(campuses) && _.isArray(campuses.models)) campuses = campuses.models;

            expect(callback).toHaveBeenCalled();

            expect(campuses).toBeDefined();

            expect(campuses.length).toEqual(3);

//console.info('test get', _.getItemAt(campuses, 2).id );

            expect(Datastore.campus('gkovYGr6Ry')).toBeDefined();

            expect(Datastore.campus('gkovYGr6Ry')).toEqual(_.getItemAt(campuses, 2));

        });

      });

    });

  });

});