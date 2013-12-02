
define(['jquery', '../scripts/views/searchbox', '../../bower_components/jasmine-jquery/lib/jasmine-jquery'], function ($, viewSearchbox) {

  describe('Searchbox View Tests', function () {

    var view;

    beforeEach(function() {

      view = new viewSearchbox();

      view.render();

    });

    afterEach(function(){

      view = undefined;

    });

    describe('Basics', function () {

      it('should render a div.searchbox', function () {

        expect(view.$el).toBe('div.searchbox');

        console.log('el', view.el);

      });
 
      it('should contain one form', function () {

        expect(view.$('form').length).toEqual(1);

      });

      it('should have one btn', function () {

        expect(view.$('button').length).toEqual(1);

      });

      it('should have one text input', function () {

        expect(view.$('input[type="text"]').length).toEqual(1);

      });

    });

    describe('Accessibility', function () {

      it('should have a form with aria role of "search"', function () {

        expect(view.$('form').attr('role')).toEqual('search');

      });

      it('should have an accessible label for the text input', function () {

        var txtId = view.$('input[type="text"]').attr('id');

        console.log('txtId', txtId);

        expect(view.$('label[for=' + txtId + ']').length).toEqual(1);

      });

      it('should have a btn with screen reader only text', function () {

        var btnScreenreaderTxt = view.$('button .sr-only').text();

        expect(view.$('button .sr-only').length).toEqual(1);

        console.log('btn txt', btnScreenreaderTxt);

        expect(btnScreenreaderTxt).not.toBeEmpty();

      });

    });

    describe('Events', function () {


      it('should have a clickable btn', function () {

        var $btn = view.$('button'),

            spyEvent = spyOnEvent($btn, 'click');

        $btn.click();

        expect('click').toHaveBeenTriggeredOn($btn);

        expect(spyEvent).toHaveBeenTriggered();

      });

/*      it('should have a clickable btn that responds to the enter key when focused', function () {

        var $btn = view.$('button')

            spyOn(view, 'handleBtnClick'), 

            e = $.Event('keypress');

        e.which = 13; e.keyCode = 13;

        $btn.focus();

        $btn.trigger(e);

        //expect('handleBtnClick').toHaveBeenTriggeredOn(view);

        expect(view.handleBtnClick).toHaveBeenCalled();

        //expect(spyEvent).toHaveBeenTriggered();

      });*/



    });

  });

});