
define(['jquery', '../scripts/views/searchpanel', '../../bower_components/jasmine-jquery/lib/jasmine-jquery'], function ($, SearchPanelView) {

  describe('SearchPanel View Tests', function () {

    var view;

    beforeEach(function() {

      view = new SearchPanelView();

      view.render();

    });

    afterEach(function(){

      view = undefined;

    });

    describe('Basics', function () {

      it('should render a div.searchpanel', function () {

        expect(view.$el).toBe('div.searchpanel');

        console.log('el', view.el);

      });
  
    });

    describe('Accessibility', function () {
 

    });

    describe('Events', function () {
 


    });

  });

});