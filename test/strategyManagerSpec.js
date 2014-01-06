
define([

  'underscore'

  , 'strategies/StrategyManager'

], function (_, StrategyManager) {

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
        //StrategyManager.add( function() { return { id: 'mystrategy', type: 'label' }; });
        StrategyManager.add(new FakeStrategy('mystrategy', 'label'));

        expect(StrategyManager.cache_.label).toBeDefined();

      });

      it('should add a new strategy in the correct location for its type to cache', function () {

        StrategyManager.add(new FakeStrategy('obj1', 'icon'));

        StrategyManager.add(new FakeStrategy('obj2', 'icon'));

        // Size includes added default property
        expect(_.size(StrategyManager.cache_.icon)).toBe(3);

        expect(StrategyManager.cache_.label).not.toBeDefined();

        StrategyManager.add(new FakeStrategy('obj3', 'label'));

        // Size includes added default property
        expect(_.size(StrategyManager.cache_.label)).toBe(2);

      });

      it('should be able to reset the cache', function () {

        StrategyManager.add(new FakeStrategy('obj1', 'icon'));

        StrategyManager.clearCache();

        expect(_.size(StrategyManager.cache_)).toBe(0);

      });

      it('should be able to determine if a type is present in cache', function () {

        expect(StrategyManager.hasType('icon')).toBe(false);

        StrategyManager.add(new FakeStrategy('obj1', 'icon'));

        expect(StrategyManager.hasType('icon')).toBe(true);

      });

      it('should get all strategies associated with a type', function () {

        StrategyManager.add(new FakeStrategy('strategy1', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy2', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy3', 'label'));

        // Size includes the default property
        expect(_.size(StrategyManager.getStrategies('icon'))).toBe(3);

        // Size includes the default property
        expect(_.size(StrategyManager.getStrategies('label'))).toBe(2);

      });

      it('should get a strategy by id (getStrategy method)', function () {

        var strategy;

        StrategyManager.add(new FakeStrategy('strategy1', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy2', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy3', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy4', 'label'));

        StrategyManager.add(new FakeStrategy('strategy5', 'label'));

        strategy = StrategyManager.getStrategy('strategy3');

        expect(strategy.id).toBe('strategy3');

        strategy = StrategyManager.getStrategy('strategy5');

        expect(strategy.id).toBe('strategy5');

      });

      it('should get a default strategy if strategy id returns undefined (getStrategy method)', function () {

        var strategy;

        StrategyManager.add(new FakeStrategy('strategy1', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy2', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy3', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy4', 'label'));

        StrategyManager.add(new FakeStrategy('strategy5', 'label'));

        strategy = StrategyManager.getStrategy('icon');

        // The default strategy will be the first unless changed
        expect(strategy.id).toBe('strategy1');

        strategy = StrategyManager.getStrategy('label');

        expect(strategy.id).toBe('strategy4');

      });

      it('should get a default strategy when default set manually (getStrategy method)', function () {

        var strategy;

        StrategyManager.add(new FakeStrategy('strategy1', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy2', 'icon', true));

        StrategyManager.add(new FakeStrategy('strategy3', 'icon'));

        strategy = StrategyManager.getStrategy('icon');

        expect(strategy.id).toBe('strategy2');

      });

    });

    describe('Defaults', function () {

      it('should mark the first strategy of a certain type as the default', function () {

        var strategy;

        StrategyManager.add(new FakeStrategy('strategy1', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy2', 'icon'));

        strategy = StrategyManager.getDefaultForType('icon');

        expect(strategy.id).toBe('strategy1');

      });


      it('should have a default for each type', function () {

        var iconStrategy, labelStrategy;

        StrategyManager.add(new FakeStrategy('strategy1', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy2', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy3', 'label'));

        StrategyManager.add(new FakeStrategy('strategy4', 'label'));

        iconStrategy = StrategyManager.getDefaultForType('icon');

        labelStrategy = StrategyManager.getDefaultForType('label');

        expect(iconStrategy.id).toBe('strategy1');

        expect(labelStrategy.id).toBe('strategy3');

      });

      it('should be able to set a specific strategy as a default', function () {

        var strategy;

        StrategyManager.add(new FakeStrategy('strategy1', 'icon'));

        strategy = StrategyManager.add(new FakeStrategy('strategy2', 'icon'));

        StrategyManager.setDefault(strategy);

        expect(strategy.id).toBe('strategy2');

      });

      it('should be able to set a specific strategy by strategy attribute', function () {

        StrategyManager.add(new FakeStrategy('strategy1', 'icon'));

        StrategyManager.add(new FakeStrategy('strategy2', 'icon', true));

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

function FakeStrategy(id, type, isDefault) {

  return function() { return { id: id, type: type, default: isDefault || false }; }

}