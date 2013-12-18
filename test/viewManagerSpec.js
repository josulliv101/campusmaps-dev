
define([

  '../scripts/viewManager'

], function (ViewManager) {

  describe('ViewManager Tests', function () {

    var manager;

    beforeEach(function() {

      manager = new ViewManager(document.getElementsByTagName('body')[0]);

      manager.init();

      console.log('ViewManager test', manager);

    });

    afterEach(function(){

      manager.$root.removeClass();

      manager = null;

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( manager ).toBeDefined();

      });

      it('should hava an init method', function () {

        expect( manager.init ).toBeDefined();

      });

    });

    describe('Adding a class to root el', function () {

      it('should hava an addCssFlag method', function () {

        expect( manager.addCssFlag ).toBeDefined();

      });

      it('should be able to add a flag to the root el', function () {

        manager.addCssFlag('myflag');
          
        expect( manager.$root ).toHaveClass('myflag');

      });

    });

  });

});
