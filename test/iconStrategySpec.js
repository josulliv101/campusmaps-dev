
define([

  'strategies/IconStrategy'

], function (IconStrategy) {

  describe('IconStrategy Tests', function () {


    beforeEach(function() {

      IconStrategy._.clear();

    });

    afterEach(function(){


    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( IconStrategy ).toBeDefined();

      });

      it('should have a cache for icon strategies', function () {

        expect( IconStrategy._.cache() ).toBeDefined();

      });

    });

    describe('Defaults', function () {

      it('should have an id for the default IconStrategy', function () {

        expect( IconStrategy.getDefaultId() ).toBeDefined('default');

      });

      it('should be able to change the default id', function () {

        IconStrategy.setDefaultId('mydefault');

        expect( IconStrategy.getDefaultId() ).toBeDefined('mydefault');

      });

    });

    describe('Icon Path', function () {

      it('should be able to get a path to the icons folder', function () {

        var path = IconStrategy.getIconPath('myicon.png');

        expect( path ).toMatch(/(\/[a-z0-9A-Z-_]+)+\/myicon.png/);

      });

      it('should be able to get a custom path', function () {

        var path = IconStrategy.getIconPath('myicon.png', '/my/icons/');

        expect( path ).toMatch('/my/icons/myicon.png');

      });

      it('should be able to set a custom directory as icon source folder', function () {

        var path;

        IconStrategy.setIconPath('/my/icons/directory/');

        path = IconStrategy.getIconPath('myicon.png');

        expect( path ).toMatch('/my/icons/directory/myicon.png');

      });

    });

    describe('Strategy Creation', function () {


      it('should have a cache for icon strategies', function () {

        expect( IconStrategy._.cache() ).toBeDefined();

      });

      it('should throw exception if strategy has no id (internal methods)', function () {

        expect( function() { var strategy = IconStrategy._.create({}); IconStrategy._.addToCache(strategy) } ).toThrow(new Error('Icon Strategy requires an id'));

      });

      it('should throw exception if strategy has no id (public method)', function () {

        expect( function() { var strategy = IconStrategy.create({}); } ).toThrow(new Error('Icon Strategy requires an id'));

      });

      it('should add new strategies to the cache', function () {

       var strategy = IconStrategy.create({ id: 'default' });

        expect( _.size(IconStrategy._.cache()) ).toBe(1);
 
        strategy = IconStrategy.create({ id: 'other' });

        expect( _.size(IconStrategy._.cache()) ).toBe(2);/**/

      });

      it('should wrap the strategy functions in a dispatch fn', function () {

        var strategy = IconStrategy.create({ id: 'default', strategy: [

            function(arg) { }, function(arg) { }, function(arg) { }, 

          ] });

        expect( strategy.strategy.prototype ).toBeDefined();

      });

      it('should have a reference to its icons', function () {

        var strategy = IconStrategy.create({ id: 'default', icons: {

          small: 'small.png', big: 'big.png'

        }});

        expect( strategy.icons ).toBeDefined();

      });

      it('should set default via option on create', function () {

        var strategy = IconStrategy.create({ id: 'default', isDefault: true });

        expect( IconStrategy.getDefault() ).toBe(strategy);

      });

    });

    describe('Get a Strategy', function () {

      it('should return undefined if no default', function () {

        expect( IconStrategy.getStrategy() ).toBeUndefined();

      });

      it('should return the default when getDefault called', function () {

        var strategy = IconStrategy.create({ id: 'default', isDefault: true });

        expect( IconStrategy.getDefault().id ).toBe('default');

      });

      it('should retrieve an icon strategy by id', function () {

        var strategy = IconStrategy.create({ id: 'default', isDefault: true });

        expect( IconStrategy.getStrategy('default').id ).toBe('default');

      });

    });

  });

});

