define([

    'jquery'

    , '_mixins'

    , 'scripts/moduleManager'

    , 'eventdispatcher'

], function ($, _, ModuleManager, EventDispatcher) { 

    function DomManager() {

        _.bindAll(this,  'getRootEl', 'handleDomResizeEvent');

        this.$root = $('body') || $(window);

        this.getElement = _.dispatch(this.getHtmlEl, this.getRootEl);

$(window).unbind('resize');
        //// DOM Event handlers ////
        
        $(window).on('resize', this.handleDomResizeEvent);

    };

    DomManager.prototype.setAppRoot = function(el) {

        if (!el || !el.nodeType) throw new Error('A root DOM element is required.');

        this.$root = $(el);

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

    DomManager.prototype.handleDomResizeEvent = _.debounce(function(ev, options) {

        console.log('RESIZE');

        var path = ModuleManager.getVizPath();

        //EventDispatcher.trigger('truthupdate', { vizpath: path });

        EventDispatcher.trigger('truthupdate', { resize: true });

    }, 500)

    // Defined in init so this keyword behaves
    DomManager.prototype.getElement = function() {}

    return new DomManager();


});