define([

    'jquery'

    , '_mixins'

    , 'scripts/moduleManager'

    , 'eventdispatcher'

], function ($, _, ModuleManager, EventDispatcher) { 

    function DomManager() {}

    DomManager.prototype.init = function(el) {

         _.bindAll(this,  'getRootEl', 'handleDomResizeEvent');

        if (!el || !el.nodeType) throw new Error('A root DOM element is required.');

        this.$root = $(el);

        this.getElement = _.dispatch(this.getHtmlEl, this.getRootEl);


        //// DOM Event handlers ////
        
        $(window).on('resize', this.handleDomResizeEvent);

    }

    DomManager.prototype.cssFlag = function (name, options) {

        var action, $el;

        options || (options = {});

        $el = this.getElement(options);

        options.remove !== true ? $el.addClass(name) : $el.removeClass(name);

    }

    DomManager.prototype.getRootEl = function(options) {

        return this.$root;

    }

    DomManager.prototype.getHtmlEl = function(options) {

        options || (options = {});

        if (options.el && options.el.toLowerCase() === 'html') return $('html');

    }

    // Defined in init so this keyword behaves
    DomManager.prototype.getElement = function() {}

    DomManager.prototype.handleDomResizeEvent = _.debounce(function(ev, options) {

        var path = ModuleManager.getVizPath();

        EventDispatcher.trigger('truthupdate', { vizpath: path });

/*        var width = this.$root.outerWidth();

        options || (options = {});

        if (options.silent !== true) EventDispatcher.trigger('truthupdate', { appwidth: width });*/

    }, 500)

    return DomManager;

});