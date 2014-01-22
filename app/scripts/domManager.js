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

    DomManager.prototype.px = function(num) {

        return num + 'px';

    }


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

            classnames = ' ';

        console.log('refreshLabel', location);

        if (!id) return;

        if (location.details && location.details === true) classnames = classnames + 'details';

        else if (location.details !== true) this.$root.find('#' + id).removeClass('details');

        this.$root.find('#' + id).addClass(classnames);

        return this.$root.find('#' + id);

    }

    // Setting tile divs innerHTML seems best performance
    DomManager.prototype.createLabelHtml = function(model) {

        var tile = model.tileCache[model.zoom],

            offset = tile.offset, px = this.px,

            iconSize = { width: 16, height: 16 },

            id = _.getAttr(model, 'locationid'),

            thumbnail = _.getAttr(model, 'thumbnail'),

            labelClasses = _.getAttr(model, 'label'),

            details = _.getAttr(model, 'details') ? 'details ' : '',

            img = _.exists(thumbnail) ? '<img class="img-th shadow" src="./app/images/thumbs/' + thumbnail + '" />' : '';

        return "<div class='location " + details + labelClasses + "' style='top: " + px(offset.y - iconSize.height/2) + "; left: " + px(offset.x - iconSize.width/2) + ";' id='" + id + "'><div class='icon'></div><div class='bd'><div class='txt shadow'>" + _.getAttr(model, 'name') + "</div><div class='thumb'>" + img + "</div></div></div>";

    }

    // Do I want to memoize here --- prevent DOM el from being released when offscreen? _.memoize()
    DomManager.prototype.getLabelTile = function(id, ownerDocument, models) {

        var div = ownerDocument.createElement('div'), labels;

        labels = _.map(models, function(loc) { return DomManager.getInstance().createLabelHtml(loc); });

        div.className = 'label-tile';

        div.innerHTML = labels.join('');

        div.style.position = 'relative';

        div.style.width = '256px';

        div.style.height = '256px';

        return div;

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