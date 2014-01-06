
define([

  'strategies/Strategy'

], function (Strategy) {

  describe('Strategy Tests', function () {

    beforeEach(function() {


    });

    afterEach(function(){


    });

    describe('Basic', function () {

      it('should throw an error if no id or type', function () {

        var error = new Error('Strategy requires an id and type');

        expect( function() { var strategy = new Strategy(); } ).toThrow(error);

        expect( function() { var strategy = new Strategy('myid'); } ).toThrow(error);

        expect( function() { var strategy = new Strategy(null, 'icon'); } ).toThrow(error);

        expect( function() { var strategy = new Strategy('myid', 'icon'); } ).not.toThrow(error);

      });

      it('should create instance properties for any passed in options', function () {

        var strategy = new Strategy('myid', 'icon', { alphabet: 'abc' });

        expect(strategy.alphabet).toBe('abc')

      });

      it('should always have a fns property', function () {

        var strategy = new Strategy('myid', 'icon', {});

        expect(strategy.fns).toBeDefined()

      });

      it('should create a strategy dispatch function', function () {

        var strategy = new Strategy('myid', 'icon', { fns: [ function() { return true; } ]});

        expect(strategy.strategy.prototype).toBeDefined();

      });

    });

  });

});

