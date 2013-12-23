
define([

  '../scripts/controllers/appController'

], function (AppController) {

  describe('App Controller Tests', function () {

    var controller;

    beforeEach(function() {

      //var div = document.createElement('div');

      //document.getElementsByTagName('body')[0].appendChild(div);
      


      controller = new AppController();

      spyOn(controller, 'attrChangeDispatch');
      
      controller.init();

    });

    afterEach(function(){

        controller = null;

        Backbone.history.stop();

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( controller ).toBeDefined();

      });

      it('should have an init method', function () {

        expect( controller.init ).toBeDefined();

      });

/*      it('should have a root dom element', function () {

        expect( controller.$root ).toBeDefined();

      });*/

      it('should have a reference to the router', function () {

        expect(controller.router).toBeDefined();

      });

      it('should return a deferred object when getData called', function () {

        //expect( controller.getData().promise ).toBeDefined();

      });
 
    });

  });

});
