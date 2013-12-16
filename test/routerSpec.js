
define([

  '../scripts/router'

], function (Router) {

  describe('Router Tests', function () {

    var router;

    beforeEach(function() {

      router = Router.init();

    });

    afterEach(function(){

        Backbone.history.stop();

        router = null;

    });

    describe('Basic', function () {

      it('should exist', function () {

        expect( router ).toBeDefined();

      });

      it('should have routes and appropriate methods', function () {

        expect( router.routes ).toBeDefined();

        expect( router.processQueryString ).toBeDefined();

        expect( router.getDefaults ).toBeDefined();

      });

    });

    describe('Query Strings', function () {

      it('should be able to transform a single slug to campusid', function () {

        expect( router.processQueryString('medford') ).toBe('campusid=medford');

      });

    });

    describe('Defaults', function () {

      it('should be able to transform a query string to an object', function () {

        var defaults = router.getDefaults('test=mytest');

        console.log('defaults', defaults);

        expect( defaults.test ).toBe('mytest');

      });

      it('should assume a non-key/val pair is a campus id', function () {

        var defaults = router.getDefaults('medford');

        console.log('defaults', defaults);

        expect( defaults.campusid ).toBe('medford');

      });

      it('should remove appropriate characters', function () {

        var defaults = router.getDefaults('test=mytest<script>');

        console.log('defaults', defaults);

        expect( defaults.test ).toBe('mytestscript');

      });

      it('should handle multiple key/val pairs', function () {

        var defaults = router.getDefaults('test1=mytest1&test2=mytest2&test3=mytest3');

        console.log('defaults', defaults);

        expect( defaults.test1 ).toBe('mytest1');

        expect( defaults.test2 ).toBe('mytest2');

        expect( defaults.test3 ).toBe('mytest3');

      });

      it('should handle an empty querystring', function () {

        var defaults = router.getDefaults(' ');

        console.log('defaults', defaults);

        expect( defaults ).toEqual({});

      });

    });

  });

});

function FakeView() { this.$el = $('<div><div class="panel"></div></div>'); }

FakeView.prototype.$ = function() { return this.$el.find('.panel'); }

function FakeModel() { this.state = "close"; }

FakeModel.prototype.get = function(attr) { return this.state; };

FakeModel.prototype.set = function(attr, val) { this.state = val; };