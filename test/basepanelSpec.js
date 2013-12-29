
define(['jquery', 'backbone', 'searchpanels/base', '../../bower_components/jasmine-jquery/lib/jasmine-jquery'], function ($, Backbone, SearchPanelView) {

  describe('Base SearchPanel View Tests', function () {

    var view, model;

    beforeEach(function() {

      model = new Backbone.Model({ state: 'created' });
      
      view = new SearchPanelView({ model: model });

      view.render();

    });

    afterEach(function(){

      view = undefined;

    });

    describe('Basics', function () {

      it('should render a div.panel', function () {

        expect(view.$el).toBe('div');

        console.log('el', view.el);

      });

      it('should render a div.panel', function () {

        expect(view.$el).toBe('div');

        console.log('el', view.el);

      });
  
    });

    describe('Accessibility', function () {
 

    });

    describe('Events', function () {
 


    });

  });

});