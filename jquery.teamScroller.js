;(function ( $, window, document, undefined ) {

    // Create the defaults once
    var pluginName  = 'teamScroller';
    var defaults    = {
        activeClass: 'team-block__image--active',
        imageClass: '.team-block__image',
        breakpoints: {
            desktop: 992,
            tablet: 768
        }
    };

    function Plugin( element, options ) {
        this.element            = element;
        this.options            = $.extend( {}, defaults, options) ;
        this._defaults          = defaults;
        this._name              = pluginName;
        this.$scrollers         = $(this.element);
        this.$scrollersTarget   = this.$scrollers.find(this.options.imageClass);
        this.screenMid          = 0;
        this.$activeScroller    = {};

        this.init();
    }

    Plugin.prototype.init = function () {

        if( !this.$scrollers.length ) {
            return false;
        }

        this.setScrollHandler();
        this.setViewports();
        this.onResizeEvent();
    };

    Plugin.prototype.helperDebounce = function (func, wait, immediate) {
        var timeout;
        return function() {
            var context = this;
            var args    = arguments;
            var later   = function() {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };

            var callNow = immediate && !timeout;

            clearTimeout(timeout);
            timeout = setTimeout(later, wait);

            if (callNow) {
                func.apply(context, args);
            }
        };
    };

    Plugin.prototype.onResizeEvent = function () {
        var that = this;

        var myEfficientFn = this.helperDebounce(function() {
            that.setViewports();
        }, 250);

        window.addEventListener('resize', myEfficientFn);
    };

    Plugin.prototype.setViewports = function () {
        var res         = this.getCurrentResolution();
        var isDesktop   = res < this.options.breakpoints.desktop;
        var isTablet    = res < this.options.breakpoints.tablet;

        if( isDesktop && !isTablet ) {
            this.isResDesktop = true;
            this.isResTablet = false;
        }else if( isTablet ) {
            this.isResTablet = true;
            this.isResDesktop = false;
        }else{
            this.isResTablet = false;
            this.isResDesktop = false;
        }

        this.setScreenMiddle();
        this.scrollHandler();
        this.setScrollerClasses();
    };

    Plugin.prototype.setScrollHandler = function () {
        var scrollTimeout;
        var that = this;

        $(window).scroll(function () {
            if (scrollTimeout) {
                clearTimeout(scrollTimeout);
                scrollTimeout = null;
            }

            scrollTimeout = setTimeout(that.scrollHandler(), 1000);
        });
    };

    Plugin.prototype.scrollHandler = function () {
        this.setScreenMiddle();
        this.setScrollerClasses();
    };

    Plugin.prototype.setScreenMiddle = function () {
        this.screenMid = parseInt( $(window).height() / 2, 10);
    };

    Plugin.prototype.setScrollerClasses = function () {
        var windowsTop = $(window).scrollTop();

        this.$scrollersTarget.removeClass(this.options.activeClass);

        for( var i = 0; i < this.$scrollers.length; i++ ) {
            if( $(this.$scrollers[i]).offset().top > this.screenMid + windowsTop ) {
                if( windowsTop < $(this.$scrollers[0]).outerHeight() - windowsTop - $(this.$scrollers[i]).offset().top + this.screenMid ) {
                    this.$scrollersTarget.removeClass(this.options.activeClass);
                }

                break;
            }

            var h2 = $(this.$scrollers[i]).outerHeight();
            var c2 = windowsTop - $(this.$scrollers[i]).offset().top + this.screenMid;

            if( h2 > c2 ) {
                this.setActiveScroller($(this.$scrollers[i]).find(this.options.imageClass));
            }
        }
    };

    Plugin.prototype.setActiveScroller = function ($scroller, key) {
        this.$activeScroller = $scroller;

        if( !this.$activeScroller.hasClass(this.options.activeClass) ) {
            this.$activeScroller.addClass(this.options.activeClass);
        }
    };

    Plugin.prototype.getCurrentResolution = function () {
        return window.innerWidth || document.documentElement.clientWidth;
    };

    $.fn[pluginName] = function ( options ) {
        return this.each(function () {
            if (!$.data(this, 'plugin_' + pluginName)) {
                $.data(this, 'plugin_' + pluginName,
                    new Plugin( this, options ));
            }
        });
    };

})( jQuery, window, document );