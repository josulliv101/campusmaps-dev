
define([

  '../scripts/viewManager'

], function (ViewManager) {

  describe('ViewManager Tests', function () {

    var manager = ViewManager;

    beforeEach(function() {

    });

    afterEach(function(){

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( manager ).toBeDefined();

      });

      it('should hava an init method', function () {

        expect( manager.init ).toBeDefined();

      });

    });

  });

});
