define([

    'jquery'

    , '_mixins'

    , 'scripts/moduleManager'

    , 'eventdispatcher'

], function ($, _, ModuleManager, EventDispatcher) { 

    var instance = null;

    function DomManager() {

        if (instance !== null) {

            throw new Error("Cannot instantiate more than one MySingleton, use MySingleton.getInstance()");
        
        }

        _.bindAll(this,  'getRootEl', 'handleDomResizeEvent', 'handleDomResizeEventDebounced');

        this.$root = $('body') || $(window);

        this.getElement = _.dispatch(this.getHtmlEl, this.getRootEl);

        //$(window).unbind('resize');

        console.log('DomManager', this.$root);

    };

    DomManager.getInstance = function() {

        if (instance === null) {

            instance = new DomManager();

            //// DOM Event handlers ////

            console.log('!!!', DomManager.prototype);

            //instance.handleDomResizeEventDebounced = function(){};

            $(window).on('resize', DomManager.prototype.handleDomResizeEventDebounced);

        }

        return instance;
    };

    DomManager.prototype.setAppRoot = function(el) {

        if (!el || !el.nodeType) throw new Error('A root DOM element is required.');

        this.$root = $(el);

        console.log('dom root', this.$root);

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

    DomManager.prototype.handleDomResizeEvent = function(ev, options) {

        console.log('RESIZE');

        var path = ModuleManager.getVizPath();

        //EventDispatcher.trigger('truthupdate', { vizpath: path });

        EventDispatcher.trigger('truthupdate', { resize: true });

    };

    DomManager.prototype.handleDomResizeEventDebounced = _.debounce(DomManager.prototype.handleDomResizeEvent, 500);

    // Defined in init so this keyword behaves
    DomManager.prototype.getElement = function() {}

    return DomManager;

});