
define([

  'strategies/StrategyManager'

], function (StrategyManager) {

  describe('StrategyManager Tests', function () {


    beforeEach(function() {

      StrategyManager.clearCache();

    });

    afterEach(function(){


    });

    describe('Basic', function () {

      it('should have constants for icon and label types', function () {

        expect( StrategyManager.TYPE.ICON ).toBe('icon');

        expect( StrategyManager.TYPE.LABEL ).toBe('label');

      });

      it('should create space in cache for new types when adding a strategy', function () {

        // Directly test function
        StrategyManager.addTypeToCache({ type: 'icon' });

        expect(StrategyManager.cache_.icon).toBeDefined();

        // Test function as part of compose
        StrategyManager.add({ id: 'mystrategy', type: 'label' });

        expect(StrategyManager.cache_.label).toBeDefined();

      });

      it('should add a new strategy in the correct location for its type to cache', function () {

        StrategyManager.add({ id: 'obj1', type: 'icon' });

        StrategyManager.add({ id: 'obj2', type: 'icon' });

        expect(_.size(StrategyManager.cache_.icon)).toBe(2);

        expect(StrategyManager.cache_.label).not.toBeDefined();

        StrategyManager.add({ id: 'obj3', type: 'label' });

        expect(_.size(StrategyManager.cache_.label)).toBe(1);

      });

      it('should be able to reset the cache', function () {

        StrategyManager.add({ id: 'obj1', type: 'icon' });

        StrategyManager.clearCache();

        expect(_.size(StrategyManager.cache_)).toBe(0);

      });

      it('should be able to determine if a type is present in cache', function () {

        expect(StrategyManager.hasType('icon')).toBe(false);

        StrategyManager.add({ id: 'obj1', type: 'icon' });

        expect(StrategyManager.hasType('icon')).toBe(true);

      });

    });

    describe('Defaults', function () {

      it('should be able to check if a type is empty (no strategies)', function () {

        expect( StrategyManager.isTypeEmpty('icon') ).toEqual(true);

      });

      it('should return an empty obj if no strategies present for type', function () {

        expect( StrategyManager.getDefault('icon') ).toEqual({});

      });

     it('should return the first strategy if none marked as default', function () {

var c = StrategyManager.getCache();

        StrategyManager.add({ id: 'strategy1', type: 'label' });

        StrategyManager.add({ id: 'strategy2', type: 'label' });

        expect( StrategyManager.getDefault('label') ).toEqual('strategy2');
 
      });/* */

    });

  });

});

