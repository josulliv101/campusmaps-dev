
define([

  '../scripts/app'

], function (App) {

  describe('App Tests', function () {

    var app;

    beforeEach(function() {

      app = new App({ el: document.getElementsByTagName('body')[0] });

    });

    afterEach(function(){

        $(window).unbind('resize');

        app = null;

        Backbone.history.stop();

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( app ).toBeDefined();

      });

      it('should have an init method', function () {

        expect( app.init_ ).toBeDefined();

      });

      it('should throw an error if no root dom element', function () {

        // Creating a new app will cause error if not stopped
        Backbone.history.stop();

        var el = document.getElementsByTagName('body')[0];

        expect( function() { new App() } ).toThrow();

        expect( function() { new App({ el: el }) } ).not.toThrow();

      });

      it('should add a resize event listener', function () {

        expect( app.init_ ).toBeDefined();

      });

    });

  });

});
