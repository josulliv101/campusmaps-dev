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

        // Style here instead of css file to make testing easier
        this.$tmp = $('<div/>').attr('id', 'tmp').css({ position: 'absolute', top: 0, left: 0 }).appendTo($('body'));

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

    // Expect <div>
    // 
    //          <label id="item1">label1</label>
    //          
    //          <label id="item2">label2</label>
    //          
    //        </div>
    DomManager.prototype.measure = function($el) {

        var $elements = $el.children(), items = {};

        this.$tmp.append($el);

        $elements.each(function() {

            var $el = $(this), id = $el.attr('id');

            items[id] = { id: id, width: $el.outerWidth(), height: $el.outerHeight() };

        });

        return items;

    }

    DomManager.prototype.create = function(attrs) {

        var $el, defaults = { tagname: 'div', classname: '', html: '', style: {} };

        attrs || (attrs = {});

        _.defaults(attrs, defaults);

        return $(document.createElement( attrs.tagname ))

            .attr('id', attrs.id)

            .addClass(attrs.classname)

            .html(attrs.html)

            .css(attrs.style);

    }

    // Compares width or height of attrs of 2 elements. Returns a ratio.
    DomManager.prototype.compareDimensions = function(el1, el2) {

        var w, h; // Dimensions

        if (!(el1 && el2)) return;

        w = el1.width() / el2.width();

        h = el1.height() / el2.height();

        if (!_.isNumber(h)) h = 0;

        if (!_.isNumber(w)) w = 0;

        return { width: w, height: h };

    }

    DomManager.prototype.setAppRoot = function(el) {

        if (!el || !el.nodeType) throw new Error('A root DOM element is required.');

        this.$root = $(el);

        console.log('dom root', this.$root);

    }

    DomManager.prototype.refreshLabel = function(location) {

        var id = _.getAttr(location, 'locationid'),

            classnames = 'active fade-in ';

        console.log('refreshLabel', location);

        if (!id) return;

        if (location.details && location.details === true) classnames = classnames + 'details shadow';

        else if (location.details !== true) this.$root.find('#' + id).removeClass('details shadow');

        this.$root.find('#' + id).addClass(classnames);

        return this.$root.find('#' + id);

    }

    DomManager.prototype.getDimensions = function($el) {

        return { width: $el.outerWidth(), height: $el.outerHeight() };

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