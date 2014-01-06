
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

        // Size includes added default property
        expect(_.size(StrategyManager.cache_.icon)).toBe(3);

        expect(StrategyManager.cache_.label).not.toBeDefined();

        StrategyManager.add({ id: 'obj3', type: 'label' });

        // Size includes added default property
        expect(_.size(StrategyManager.cache_.label)).toBe(2);

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

      it('should get all strategies associated with a type', function () {

        StrategyManager.add({ id: 'strategy1', type: 'icon' });

        StrategyManager.add({ id: 'strategy2', type: 'icon' });

        StrategyManager.add({ id: 'strategy3', type: 'label' });

        // Size includes the default property
        expect(_.size(StrategyManager.getStrategies('icon'))).toBe(3);

        // Size includes the default property
        expect(_.size(StrategyManager.getStrategies('label'))).toBe(2);

      });

      it('should get a strategy by id (getStrategy method)', function () {

        var strategy;

        StrategyManager.add({ id: 'strategy1', type: 'icon' });

        StrategyManager.add({ id: 'strategy2', type: 'icon' });

        StrategyManager.add({ id: 'strategy3', type: 'icon' });

        StrategyManager.add({ id: 'strategy4', type: 'label' });

        StrategyManager.add({ id: 'strategy5', type: 'label' });

        strategy = StrategyManager.getStrategy('strategy3');

        expect(strategy.id).toBe('strategy3');

        strategy = StrategyManager.getStrategy('strategy5');

        expect(strategy.id).toBe('strategy5');

      });

      it('should get a default strategy if strategy id returns undefined (getStrategy method)', function () {

        var strategy;

        StrategyManager.add({ id: 'strategy1', type: 'icon' });

        StrategyManager.add({ id: 'strategy2', type: 'icon' });

        StrategyManager.add({ id: 'strategy3', type: 'icon' });

        StrategyManager.add({ id: 'strategy4', type: 'label' });

        StrategyManager.add({ id: 'strategy5', type: 'label' });

        strategy = StrategyManager.getStrategy('icon');

        // The default strategy will be the first unless changed
        expect(strategy.id).toBe('strategy1');

        strategy = StrategyManager.getStrategy('label');

        expect(strategy.id).toBe('strategy4');

      });

      it('should get a default strategy when default set manually (getStrategy method)', function () {

        var strategy;

        StrategyManager.add({ id: 'strategy1', type: 'icon' });

        StrategyManager.add({ id: 'strategy2', type: 'icon', default: true });

        StrategyManager.add({ id: 'strategy3', type: 'icon' });

        strategy = StrategyManager.getStrategy('icon');

        expect(strategy.id).toBe('strategy2');

      });

    });

    describe('Defaults', function () {

      it('should mark the first strategy of a certain type as the default', function () {

        var strategy;

        StrategyManager.add({ id: 'strategy1', type: 'icon' });

        StrategyManager.add({ id: 'strategy2', type: 'icon' });

        strategy = StrategyManager.getDefaultForType('icon');

        expect(strategy.id).toBe('strategy1');

      });


      it('should have a default for each type', function () {

        var iconStrategy, labelStrategy;

        StrategyManager.add({ id: 'strategy1', type: 'icon' });

        StrategyManager.add({ id: 'strategy2', type: 'icon' });

        StrategyManager.add({ id: 'strategy3', type: 'label' });

        StrategyManager.add({ id: 'strategy4', type: 'label' });

        iconStrategy = StrategyManager.getDefaultForType('icon');

        labelStrategy = StrategyManager.getDefaultForType('label');

        expect(iconStrategy.id).toBe('strategy1');

        expect(labelStrategy.id).toBe('strategy3');

      });

      it('should be able to set a specific strategy as a default', function () {

        var strategy;

        StrategyManager.add({ id: 'strategy1', type: 'icon' });

        strategy = StrategyManager.add({ id: 'strategy2', type: 'icon' });

        StrategyManager.setDefault(strategy);

        expect(strategy.id).toBe('strategy2');

      });

      it('should be able to set a specific strategy by strategy attribute', function () {

        StrategyManager.add({ id: 'strategy1', type: 'icon' });

        StrategyManager.add({ id: 'strategy2', type: 'icon', default: true });

        expect(StrategyManager.getDefaultForType('icon').id).toBe('strategy2');

      });

/*
      it('should return an empty obj if no strategies present for type', function () {

        expect( StrategyManager.getDefaultForType('icon') ).toEqual({});

      });

     it('should return the first strategy if none marked as default', function () {

var c = StrategyManager.getCache();

        StrategyManager.add({ id: 'strategy1', type: 'label' });

        StrategyManager.add({ id: 'strategy2', type: 'label' });

        expect( StrategyManager.getDefaultForType('label') ).toEqual('strategy2');
 
      }); */

    });

  });

});

