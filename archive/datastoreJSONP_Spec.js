define(['jquery', '_mixins', '../scripts/services/datastore-jsonp'], function ($, _, Datastore) {

  describe('Datastore Tests', function () {

    

    describe('Getting a campus', function () {

      afterEach(function(){

        campuses = null;

      });

      it('should have a fetch, campus and map method', function () {

        var callback = jasmine.createSpy();

        //console.info('Datastore fetch', Datastore);

        expect(Datastore.fetch).toBeDefined();
        
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

            //expect(campuses.length).toEqual(3);

            expect(Datastore.campus('xyz')).toBeDefined();

            console.info('test get', campuses.length);

            expect(Datastore.campus('xyz')).toEqual(_.getItemAt(campuses, 1));

        });

      });

    });

  });

});