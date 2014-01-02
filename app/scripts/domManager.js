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

            // Listen for clicks from elements with a 'data'cmd' attribute, and forward to router
            $('body').on('click', '[data-campusmap]', function(ev) {

                var data = $(this).data('campusmap');

                console.log('data-campusmap', _.stringToObject(data));

                // In case the element happens to be a link
                ev.preventDefault();

                // These will fisrt pass through the App Controller so the Truth can stay up-to-date
                EventDispatcher.trigger('truthupdate', _.stringToObject(data));

                // Must return false as well to keep Router Back Button integration working
                return false;

            });

        }

        return instance;
    };

    

    DomManager.prototype.render = function(el, view) {

        view.render().$el.appendTo(el);

    }

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

    DomManager.prototype.clearFlags = function (options) {

        var $el;

        options || (options = {});

        $el = this.getElement(options);

        $el.removeClass();

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