
define(['jquery', '../scripts/views/searchbox', '../scripts/views/searchpanel', '../../bower_components/jasmine-jquery/lib/jasmine-jquery'], function ($, SearchboxView, SearchPanelView) {

  describe('Searchbox View Tests', function () {

    var view;

    beforeEach(function() {

      spyOn(SearchboxView.prototype, 'createPanel').andCallThrough();

      spyOn(SearchboxView.prototype, 'getCachedPanel').andCallThrough();

console.log('SearchboxView', SearchboxView.prototype);

      view = new SearchboxView();

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

    describe('Getting Panels', function () {

      it('should have a cache', function () {

        expect(view.cache).toBeDefined();

      });

      it('should return undefined if a panel is not in cache', function () {

        expect(view.getCachedPanel('mypanel')).toBeUndefined();

        view.cache = { mypanel: 'view' };

        expect(view.getCachedPanel('mypanel')).toBeDefined();

      });

      it('should be able to create a new panel with an id, and model ("created" state)', function () {

        var panel = view.createPanel('mynewpanel', SearchPanelView);

        expect(panel).toBeDefined();

        expect(panel.model).toBeDefined();

        expect(panel.id).toBeDefined();

        expect(panel.model.get('state')).toEqual('created');

        console.log('panel', panel);

      });

      it('should be able to cache a panel by id', function () {

        var panel = { id: 'myfakepanel' };

        view.cache = {};

        view.cachePanel(panel);

        console.log('fakepanel cached?', view.cache);

        expect(view.getCachedPanel('myfakepanel')).toBeDefined();

      });

      it('should be able to use a dispatch function to get a new panel', function () {

        spyOn(view, 'getPanel').andCallThrough();

        var panel1 = view.getPanel('myotherpanel', SearchPanelView);

        console.log('myotherpanel ?', panel1);

        expect(SearchboxView.prototype.getCachedPanel).toHaveBeenCalled();

        expect(SearchboxView.prototype.createPanel).toHaveBeenCalled();

        expect(view.getPanel).toHaveBeenCalled();

        expect(panel1.id).toBe('myotherpanel');

      });

      it('should be able to use a dispatch function to get a cached panel', function () {

        var panel;

        spyOn(view, 'getPanel').andCallThrough();

        view.cachePanel({ id: 'myfakepanel' });

        panel = view.getPanel('myfakepanel', SearchPanelView);

        expect(view.getPanel).toHaveBeenCalled();

        expect(SearchboxView.prototype.getCachedPanel).toHaveBeenCalled();

        expect(SearchboxView.prototype.createPanel).not.toHaveBeenCalled();

      });

    });

  });

});