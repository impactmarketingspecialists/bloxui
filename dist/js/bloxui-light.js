/*!
 * Bootstrap v3.3.2 (http://getbootstrap.com)
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 */

if (typeof jQuery === 'undefined') {
  throw new Error('Bootstrap\'s JavaScript requires jQuery')
}

+function ($) {
  'use strict';
  var version = $.fn.jquery.split(' ')[0].split('.')
  if ((version[0] < 2 && version[1] < 9) || (version[0] == 1 && version[1] == 9 && version[2] < 1)) {
    throw new Error('Bootstrap\'s JavaScript requires jQuery version 1.9.1 or higher')
  }
}(jQuery);

/* ========================================================================
 * Bootstrap: transition.js v3.3.2
 * http://getbootstrap.com/javascript/#transitions
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
  // ============================================================

  function transitionEnd() {
    var el = document.createElement('bootstrap')

    var transEndEventNames = {
      WebkitTransition : 'webkitTransitionEnd',
      MozTransition    : 'transitionend',
      OTransition      : 'oTransitionEnd otransitionend',
      transition       : 'transitionend'
    }

    for (var name in transEndEventNames) {
      if (el.style[name] !== undefined) {
        return { end: transEndEventNames[name] }
      }
    }

    return false // explicit for ie8 (  ._.)
  }

  // http://blog.alexmaccaw.com/css-transitions
  $.fn.emulateTransitionEnd = function (duration) {
    var called = false
    var $el = this
    $(this).one('bsTransitionEnd', function () { called = true })
    var callback = function () { if (!called) $($el).trigger($.support.transition.end) }
    setTimeout(callback, duration)
    return this
  }

  $(function () {
    $.support.transition = transitionEnd()

    if (!$.support.transition) return

    $.event.special.bsTransitionEnd = {
      bindType: $.support.transition.end,
      delegateType: $.support.transition.end,
      handle: function (e) {
        if ($(e.target).is(this)) return e.handleObj.handler.apply(this, arguments)
      }
    }
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: alert.js v3.3.2
 * http://getbootstrap.com/javascript/#alerts
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // ALERT CLASS DEFINITION
  // ======================

  var dismiss = '[data-dismiss="alert"]'
  var Alert   = function (el) {
    $(el).on('click', dismiss, this.close)
  }

  Alert.VERSION = '3.3.2'

  Alert.TRANSITION_DURATION = 150

  Alert.prototype.close = function (e) {
    var $this    = $(this)
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = $(selector)

    if (e) e.preventDefault()

    if (!$parent.length) {
      $parent = $this.closest('.alert')
    }

    $parent.trigger(e = $.Event('close.bs.alert'))

    if (e.isDefaultPrevented()) return

    $parent.removeClass('in')

    function removeElement() {
      // detach from parent, fire event then clean up data
      $parent.detach().trigger('closed.bs.alert').remove()
    }

    $.support.transition && $parent.hasClass('fade') ?
      $parent
        .one('bsTransitionEnd', removeElement)
        .emulateTransitionEnd(Alert.TRANSITION_DURATION) :
      removeElement()
  }


  // ALERT PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.alert')

      if (!data) $this.data('bs.alert', (data = new Alert(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.alert

  $.fn.alert             = Plugin
  $.fn.alert.Constructor = Alert


  // ALERT NO CONFLICT
  // =================

  $.fn.alert.noConflict = function () {
    $.fn.alert = old
    return this
  }


  // ALERT DATA-API
  // ==============

  $(document).on('click.bs.alert.data-api', dismiss, Alert.prototype.close)

}(jQuery);

/* ========================================================================
 * Bootstrap: button.js v3.3.2
 * http://getbootstrap.com/javascript/#buttons
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // BUTTON PUBLIC CLASS DEFINITION
  // ==============================

  var Button = function (element, options) {
    this.$element  = $(element)
    this.options   = $.extend({}, Button.DEFAULTS, options)
    this.isLoading = false
  }

  Button.VERSION  = '3.3.2'

  Button.DEFAULTS = {
    loadingText: 'loading...'
  }

  Button.prototype.setState = function (state) {
    var d    = 'disabled'
    var $el  = this.$element
    var val  = $el.is('input') ? 'val' : 'html'
    var data = $el.data()

    state = state + 'Text'

    if (data.resetText == null) $el.data('resetText', $el[val]())

    // push to event loop to allow forms to submit
    setTimeout($.proxy(function () {
      $el[val](data[state] == null ? this.options[state] : data[state])

      if (state == 'loadingText') {
        this.isLoading = true
        $el.addClass(d).attr(d, d)
      } else if (this.isLoading) {
        this.isLoading = false
        $el.removeClass(d).removeAttr(d)
      }
    }, this), 0)
  }

  Button.prototype.toggle = function () {
    var changed = true
    var $parent = this.$element.closest('[data-toggle="buttons"]')

    if ($parent.length) {
      var $input = this.$element.find('input')
      if ($input.prop('type') == 'radio') {
        if ($input.prop('checked') && this.$element.hasClass('active')) changed = false
        else $parent.find('.active').removeClass('active')
      }
      if (changed) $input.prop('checked', !this.$element.hasClass('active')).trigger('change')
    } else {
      this.$element.attr('aria-pressed', !this.$element.hasClass('active'))
    }

    if (changed) this.$element.toggleClass('active')
  }


  // BUTTON PLUGIN DEFINITION
  // ========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.button')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.button', (data = new Button(this, options)))

      if (option == 'toggle') data.toggle()
      else if (option) data.setState(option)
    })
  }

  var old = $.fn.button

  $.fn.button             = Plugin
  $.fn.button.Constructor = Button


  // BUTTON NO CONFLICT
  // ==================

  $.fn.button.noConflict = function () {
    $.fn.button = old
    return this
  }


  // BUTTON DATA-API
  // ===============

  $(document)
    .on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      var $btn = $(e.target)
      if (!$btn.hasClass('btn')) $btn = $btn.closest('.btn')
      Plugin.call($btn, 'toggle')
      e.preventDefault()
    })
    .on('focus.bs.button.data-api blur.bs.button.data-api', '[data-toggle^="button"]', function (e) {
      $(e.target).closest('.btn').toggleClass('focus', /^focus(in)?$/.test(e.type))
    })

}(jQuery);

/* ========================================================================
 * Bootstrap: carousel.js v3.3.2
 * http://getbootstrap.com/javascript/#carousel
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // CAROUSEL CLASS DEFINITION
  // =========================

  var Carousel = function (element, options) {
    this.$element    = $(element)
    this.$indicators = this.$element.find('.carousel-indicators')
    this.options     = options
    this.paused      =
    this.sliding     =
    this.interval    =
    this.$active     =
    this.$items      = null

    this.options.keyboard && this.$element.on('keydown.bs.carousel', $.proxy(this.keydown, this))

    this.options.pause == 'hover' && !('ontouchstart' in document.documentElement) && this.$element
      .on('mouseenter.bs.carousel', $.proxy(this.pause, this))
      .on('mouseleave.bs.carousel', $.proxy(this.cycle, this))
  }

  Carousel.VERSION  = '3.3.2'

  Carousel.TRANSITION_DURATION = 600

  Carousel.DEFAULTS = {
    interval: 5000,
    pause: 'hover',
    wrap: true,
    keyboard: true
  }

  Carousel.prototype.keydown = function (e) {
    if (/input|textarea/i.test(e.target.tagName)) return
    switch (e.which) {
      case 37: this.prev(); break
      case 39: this.next(); break
      default: return
    }

    e.preventDefault()
  }

  Carousel.prototype.cycle = function (e) {
    e || (this.paused = false)

    this.interval && clearInterval(this.interval)

    this.options.interval
      && !this.paused
      && (this.interval = setInterval($.proxy(this.next, this), this.options.interval))

    return this
  }

  Carousel.prototype.getItemIndex = function (item) {
    this.$items = item.parent().children('.item')
    return this.$items.index(item || this.$active)
  }

  Carousel.prototype.getItemForDirection = function (direction, active) {
    var activeIndex = this.getItemIndex(active)
    var willWrap = (direction == 'prev' && activeIndex === 0)
                || (direction == 'next' && activeIndex == (this.$items.length - 1))
    if (willWrap && !this.options.wrap) return active
    var delta = direction == 'prev' ? -1 : 1
    var itemIndex = (activeIndex + delta) % this.$items.length
    return this.$items.eq(itemIndex)
  }

  Carousel.prototype.to = function (pos) {
    var that        = this
    var activeIndex = this.getItemIndex(this.$active = this.$element.find('.item.active'))

    if (pos > (this.$items.length - 1) || pos < 0) return

    if (this.sliding)       return this.$element.one('slid.bs.carousel', function () { that.to(pos) }) // yes, "slid"
    if (activeIndex == pos) return this.pause().cycle()

    return this.slide(pos > activeIndex ? 'next' : 'prev', this.$items.eq(pos))
  }

  Carousel.prototype.pause = function (e) {
    e || (this.paused = true)

    if (this.$element.find('.next, .prev').length && $.support.transition) {
      this.$element.trigger($.support.transition.end)
      this.cycle(true)
    }

    this.interval = clearInterval(this.interval)

    return this
  }

  Carousel.prototype.next = function () {
    if (this.sliding) return
    return this.slide('next')
  }

  Carousel.prototype.prev = function () {
    if (this.sliding) return
    return this.slide('prev')
  }

  Carousel.prototype.slide = function (type, next) {
    var $active   = this.$element.find('.item.active')
    var $next     = next || this.getItemForDirection(type, $active)
    var isCycling = this.interval
    var direction = type == 'next' ? 'left' : 'right'
    var that      = this

    if ($next.hasClass('active')) return (this.sliding = false)

    var relatedTarget = $next[0]
    var slideEvent = $.Event('slide.bs.carousel', {
      relatedTarget: relatedTarget,
      direction: direction
    })
    this.$element.trigger(slideEvent)
    if (slideEvent.isDefaultPrevented()) return

    this.sliding = true

    isCycling && this.pause()

    if (this.$indicators.length) {
      this.$indicators.find('.active').removeClass('active')
      var $nextIndicator = $(this.$indicators.children()[this.getItemIndex($next)])
      $nextIndicator && $nextIndicator.addClass('active')
    }

    var slidEvent = $.Event('slid.bs.carousel', { relatedTarget: relatedTarget, direction: direction }) // yes, "slid"
    if ($.support.transition && this.$element.hasClass('slide')) {
      $next.addClass(type)
      $next[0].offsetWidth // force reflow
      $active.addClass(direction)
      $next.addClass(direction)
      $active
        .one('bsTransitionEnd', function () {
          $next.removeClass([type, direction].join(' ')).addClass('active')
          $active.removeClass(['active', direction].join(' '))
          that.sliding = false
          setTimeout(function () {
            that.$element.trigger(slidEvent)
          }, 0)
        })
        .emulateTransitionEnd(Carousel.TRANSITION_DURATION)
    } else {
      $active.removeClass('active')
      $next.addClass('active')
      this.sliding = false
      this.$element.trigger(slidEvent)
    }

    isCycling && this.cycle()

    return this
  }


  // CAROUSEL PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.carousel')
      var options = $.extend({}, Carousel.DEFAULTS, $this.data(), typeof option == 'object' && option)
      var action  = typeof option == 'string' ? option : options.slide

      if (!data) $this.data('bs.carousel', (data = new Carousel(this, options)))
      if (typeof option == 'number') data.to(option)
      else if (action) data[action]()
      else if (options.interval) data.pause().cycle()
    })
  }

  var old = $.fn.carousel

  $.fn.carousel             = Plugin
  $.fn.carousel.Constructor = Carousel


  // CAROUSEL NO CONFLICT
  // ====================

  $.fn.carousel.noConflict = function () {
    $.fn.carousel = old
    return this
  }


  // CAROUSEL DATA-API
  // =================

  var clickHandler = function (e) {
    var href
    var $this   = $(this)
    var $target = $($this.attr('data-target') || (href = $this.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '')) // strip for ie7
    if (!$target.hasClass('carousel')) return
    var options = $.extend({}, $target.data(), $this.data())
    var slideIndex = $this.attr('data-slide-to')
    if (slideIndex) options.interval = false

    Plugin.call($target, options)

    if (slideIndex) {
      $target.data('bs.carousel').to(slideIndex)
    }

    e.preventDefault()
  }

  $(document)
    .on('click.bs.carousel.data-api', '[data-slide]', clickHandler)
    .on('click.bs.carousel.data-api', '[data-slide-to]', clickHandler)

  $(window).on('load', function () {
    $('[data-ride="carousel"]').each(function () {
      var $carousel = $(this)
      Plugin.call($carousel, $carousel.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: collapse.js v3.3.2
 * http://getbootstrap.com/javascript/#collapse
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // COLLAPSE PUBLIC CLASS DEFINITION
  // ================================

  var Collapse = function (element, options) {
    this.$element      = $(element)
    this.options       = $.extend({}, Collapse.DEFAULTS, options)
    this.$trigger      = $(this.options.trigger).filter('[href="#' + element.id + '"], [data-target="#' + element.id + '"]')
    this.transitioning = null

    if (this.options.parent) {
      this.$parent = this.getParent()
    } else {
      this.addAriaAndCollapsedClass(this.$element, this.$trigger)
    }

    if (this.options.toggle) this.toggle()
  }

  Collapse.VERSION  = '3.3.2'

  Collapse.TRANSITION_DURATION = 350

  Collapse.DEFAULTS = {
    toggle: true,
    trigger: '[data-toggle="collapse"]'
  }

  Collapse.prototype.dimension = function () {
    var hasWidth = this.$element.hasClass('width')
    return hasWidth ? 'width' : 'height'
  }

  Collapse.prototype.show = function () {
    if (this.transitioning || this.$element.hasClass('in')) return

    var activesData
    var actives = this.$parent && this.$parent.children('.panel').children('.in, .collapsing')

    if (actives && actives.length) {
      activesData = actives.data('bs.collapse')
      if (activesData && activesData.transitioning) return
    }

    var startEvent = $.Event('show.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    if (actives && actives.length) {
      Plugin.call(actives, 'hide')
      activesData || actives.data('bs.collapse', null)
    }

    var dimension = this.dimension()

    this.$element
      .removeClass('collapse')
      .addClass('collapsing')[dimension](0)
      .attr('aria-expanded', true)

    this.$trigger
      .removeClass('collapsed')
      .attr('aria-expanded', true)

    this.transitioning = 1

    var complete = function () {
      this.$element
        .removeClass('collapsing')
        .addClass('collapse in')[dimension]('')
      this.transitioning = 0
      this.$element
        .trigger('shown.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    var scrollSize = $.camelCase(['scroll', dimension].join('-'))

    this.$element
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)[dimension](this.$element[0][scrollSize])
  }

  Collapse.prototype.hide = function () {
    if (this.transitioning || !this.$element.hasClass('in')) return

    var startEvent = $.Event('hide.bs.collapse')
    this.$element.trigger(startEvent)
    if (startEvent.isDefaultPrevented()) return

    var dimension = this.dimension()

    this.$element[dimension](this.$element[dimension]())[0].offsetHeight

    this.$element
      .addClass('collapsing')
      .removeClass('collapse in')
      .attr('aria-expanded', false)

    this.$trigger
      .addClass('collapsed')
      .attr('aria-expanded', false)

    this.transitioning = 1

    var complete = function () {
      this.transitioning = 0
      this.$element
        .removeClass('collapsing')
        .addClass('collapse')
        .trigger('hidden.bs.collapse')
    }

    if (!$.support.transition) return complete.call(this)

    this.$element
      [dimension](0)
      .one('bsTransitionEnd', $.proxy(complete, this))
      .emulateTransitionEnd(Collapse.TRANSITION_DURATION)
  }

  Collapse.prototype.toggle = function () {
    this[this.$element.hasClass('in') ? 'hide' : 'show']()
  }

  Collapse.prototype.getParent = function () {
    return $(this.options.parent)
      .find('[data-toggle="collapse"][data-parent="' + this.options.parent + '"]')
      .each($.proxy(function (i, element) {
        var $element = $(element)
        this.addAriaAndCollapsedClass(getTargetFromTrigger($element), $element)
      }, this))
      .end()
  }

  Collapse.prototype.addAriaAndCollapsedClass = function ($element, $trigger) {
    var isOpen = $element.hasClass('in')

    $element.attr('aria-expanded', isOpen)
    $trigger
      .toggleClass('collapsed', !isOpen)
      .attr('aria-expanded', isOpen)
  }

  function getTargetFromTrigger($trigger) {
    var href
    var target = $trigger.attr('data-target')
      || (href = $trigger.attr('href')) && href.replace(/.*(?=#[^\s]+$)/, '') // strip for ie7

    return $(target)
  }


  // COLLAPSE PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.collapse')
      var options = $.extend({}, Collapse.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data && options.toggle && option == 'show') options.toggle = false
      if (!data) $this.data('bs.collapse', (data = new Collapse(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.collapse

  $.fn.collapse             = Plugin
  $.fn.collapse.Constructor = Collapse


  // COLLAPSE NO CONFLICT
  // ====================

  $.fn.collapse.noConflict = function () {
    $.fn.collapse = old
    return this
  }


  // COLLAPSE DATA-API
  // =================

  $(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
    var $this   = $(this)

    if (!$this.attr('data-target')) e.preventDefault()

    var $target = getTargetFromTrigger($this)
    var data    = $target.data('bs.collapse')
    var option  = data ? 'toggle' : $.extend({}, $this.data(), { trigger: this })

    Plugin.call($target, option)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: dropdown.js v3.3.2
 * http://getbootstrap.com/javascript/#dropdowns
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // DROPDOWN CLASS DEFINITION
  // =========================

  var backdrop = '.dropdown-backdrop'
  var toggle   = '[data-toggle="dropdown"]'
  var Dropdown = function (element) {
    $(element).on('click.bs.dropdown', this.toggle)
  }

  Dropdown.VERSION = '3.3.2'

  Dropdown.prototype.toggle = function (e) {
    var $this = $(this)

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    clearMenus()

    if (!isActive) {
      if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
        // if mobile we use a backdrop because click events don't delegate
        $('<div class="dropdown-backdrop"/>').insertAfter($(this)).on('click', clearMenus)
      }

      var relatedTarget = { relatedTarget: this }
      $parent.trigger(e = $.Event('show.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this
        .trigger('focus')
        .attr('aria-expanded', 'true')

      $parent
        .toggleClass('open')
        .trigger('shown.bs.dropdown', relatedTarget)
    }

    return false
  }

  Dropdown.prototype.keydown = function (e) {
    if (!/(38|40|27|32)/.test(e.which) || /input|textarea/i.test(e.target.tagName)) return

    var $this = $(this)

    e.preventDefault()
    e.stopPropagation()

    if ($this.is('.disabled, :disabled')) return

    var $parent  = getParent($this)
    var isActive = $parent.hasClass('open')

    if ((!isActive && e.which != 27) || (isActive && e.which == 27)) {
      if (e.which == 27) $parent.find(toggle).trigger('focus')
      return $this.trigger('click')
    }

    var desc = ' li:not(.divider):visible a'
    var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc)

    if (!$items.length) return

    var index = $items.index(e.target)

    if (e.which == 38 && index > 0)                 index--                        // up
    if (e.which == 40 && index < $items.length - 1) index++                        // down
    if (!~index)                                      index = 0

    $items.eq(index).trigger('focus')
  }

  function clearMenus(e) {
    if (e && e.which === 3) return
    $(backdrop).remove()
    $(toggle).each(function () {
      var $this         = $(this)
      var $parent       = getParent($this)
      var relatedTarget = { relatedTarget: this }

      if (!$parent.hasClass('open')) return

      $parent.trigger(e = $.Event('hide.bs.dropdown', relatedTarget))

      if (e.isDefaultPrevented()) return

      $this.attr('aria-expanded', 'false')
      $parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget)
    })
  }

  function getParent($this) {
    var selector = $this.attr('data-target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && /#[A-Za-z]/.test(selector) && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    var $parent = selector && $(selector)

    return $parent && $parent.length ? $parent : $this.parent()
  }


  // DROPDOWN PLUGIN DEFINITION
  // ==========================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.dropdown')

      if (!data) $this.data('bs.dropdown', (data = new Dropdown(this)))
      if (typeof option == 'string') data[option].call($this)
    })
  }

  var old = $.fn.dropdown

  $.fn.dropdown             = Plugin
  $.fn.dropdown.Constructor = Dropdown


  // DROPDOWN NO CONFLICT
  // ====================

  $.fn.dropdown.noConflict = function () {
    $.fn.dropdown = old
    return this
  }


  // APPLY TO STANDARD DROPDOWN ELEMENTS
  // ===================================

  $(document)
    .on('click.bs.dropdown.data-api', clearMenus)
    .on('click.bs.dropdown.data-api', '.dropdown form', function (e) { e.stopPropagation() })
    .on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
    .on('keydown.bs.dropdown.data-api', toggle, Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="menu"]', Dropdown.prototype.keydown)
    .on('keydown.bs.dropdown.data-api', '[role="listbox"]', Dropdown.prototype.keydown)

}(jQuery);

/* ========================================================================
 * Bootstrap: modal.js v3.3.2
 * http://getbootstrap.com/javascript/#modals
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // MODAL CLASS DEFINITION
  // ======================

  var Modal = function (element, options) {
    this.options        = options
    this.$body          = $(document.body)
    this.$element       = $(element)
    this.$backdrop      =
    this.isShown        = null
    this.scrollbarWidth = 0

    if (this.options.remote) {
      this.$element
        .find('.modal-content')
        .load(this.options.remote, $.proxy(function () {
          this.$element.trigger('loaded.bs.modal')
        }, this))
    }
  }

  Modal.VERSION  = '3.3.2'

  Modal.TRANSITION_DURATION = 300
  Modal.BACKDROP_TRANSITION_DURATION = 150

  Modal.DEFAULTS = {
    backdrop: true,
    keyboard: true,
    show: true
  }

  Modal.prototype.toggle = function (_relatedTarget) {
    return this.isShown ? this.hide() : this.show(_relatedTarget)
  }

  Modal.prototype.show = function (_relatedTarget) {
    var that = this
    var e    = $.Event('show.bs.modal', { relatedTarget: _relatedTarget })

    this.$element.trigger(e)

    if (this.isShown || e.isDefaultPrevented()) return

    this.isShown = true

    this.checkScrollbar()
    this.setScrollbar()
    this.$body.addClass('modal-open')

    this.escape()
    this.resize()

    this.$element.on('click.dismiss.bs.modal', '[data-dismiss="modal"]', $.proxy(this.hide, this))

    this.backdrop(function () {
      var transition = $.support.transition && that.$element.hasClass('fade')

      if (!that.$element.parent().length) {
        that.$element.appendTo(that.$body) // don't move modals dom position
      }

      that.$element
        .show()
        .scrollTop(0)

      if (that.options.backdrop) that.adjustBackdrop()
      that.adjustDialog()

      if (transition) {
        that.$element[0].offsetWidth // force reflow
      }

      that.$element
        .addClass('in')
        .attr('aria-hidden', false)

      that.enforceFocus()

      var e = $.Event('shown.bs.modal', { relatedTarget: _relatedTarget })

      transition ?
        that.$element.find('.modal-dialog') // wait for modal to slide in
          .one('bsTransitionEnd', function () {
            that.$element.trigger('focus').trigger(e)
          })
          .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
        that.$element.trigger('focus').trigger(e)
    })
  }

  Modal.prototype.hide = function (e) {
    if (e) e.preventDefault()

    e = $.Event('hide.bs.modal')

    this.$element.trigger(e)

    if (!this.isShown || e.isDefaultPrevented()) return

    this.isShown = false

    this.escape()
    this.resize()

    $(document).off('focusin.bs.modal')

    this.$element
      .removeClass('in')
      .attr('aria-hidden', true)
      .off('click.dismiss.bs.modal')

    $.support.transition && this.$element.hasClass('fade') ?
      this.$element
        .one('bsTransitionEnd', $.proxy(this.hideModal, this))
        .emulateTransitionEnd(Modal.TRANSITION_DURATION) :
      this.hideModal()
  }

  Modal.prototype.enforceFocus = function () {
    $(document)
      .off('focusin.bs.modal') // guard against infinite focus loop
      .on('focusin.bs.modal', $.proxy(function (e) {
        if (this.$element[0] !== e.target && !this.$element.has(e.target).length) {
          this.$element.trigger('focus')
        }
      }, this))
  }

  Modal.prototype.escape = function () {
    if (this.isShown && this.options.keyboard) {
      this.$element.on('keydown.dismiss.bs.modal', $.proxy(function (e) {
        e.which == 27 && this.hide()
      }, this))
    } else if (!this.isShown) {
      this.$element.off('keydown.dismiss.bs.modal')
    }
  }

  Modal.prototype.resize = function () {
    if (this.isShown) {
      $(window).on('resize.bs.modal', $.proxy(this.handleUpdate, this))
    } else {
      $(window).off('resize.bs.modal')
    }
  }

  Modal.prototype.hideModal = function () {
    var that = this
    this.$element.hide()
    this.backdrop(function () {
      that.$body.removeClass('modal-open')
      that.resetAdjustments()
      that.resetScrollbar()
      that.$element.trigger('hidden.bs.modal')
    })
  }

  Modal.prototype.removeBackdrop = function () {
    this.$backdrop && this.$backdrop.remove()
    this.$backdrop = null
  }

  Modal.prototype.backdrop = function (callback) {
    var that = this
    var animate = this.$element.hasClass('fade') ? 'fade' : ''

    if (this.isShown && this.options.backdrop) {
      var doAnimate = $.support.transition && animate

      this.$backdrop = $('<div class="modal-backdrop ' + animate + '" />')
        .prependTo(this.$element)
        .on('click.dismiss.bs.modal', $.proxy(function (e) {
          if (e.target !== e.currentTarget) return
          this.options.backdrop == 'static'
            ? this.$element[0].focus.call(this.$element[0])
            : this.hide.call(this)
        }, this))

      if (doAnimate) this.$backdrop[0].offsetWidth // force reflow

      this.$backdrop.addClass('in')

      if (!callback) return

      doAnimate ?
        this.$backdrop
          .one('bsTransitionEnd', callback)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callback()

    } else if (!this.isShown && this.$backdrop) {
      this.$backdrop.removeClass('in')

      var callbackRemove = function () {
        that.removeBackdrop()
        callback && callback()
      }
      $.support.transition && this.$element.hasClass('fade') ?
        this.$backdrop
          .one('bsTransitionEnd', callbackRemove)
          .emulateTransitionEnd(Modal.BACKDROP_TRANSITION_DURATION) :
        callbackRemove()

    } else if (callback) {
      callback()
    }
  }

  // these following methods are used to handle overflowing modals

  Modal.prototype.handleUpdate = function () {
    if (this.options.backdrop) this.adjustBackdrop()
    this.adjustDialog()
  }

  Modal.prototype.adjustBackdrop = function () {
    this.$backdrop
      .css('height', 0)
      .css('height', this.$element[0].scrollHeight)
  }

  Modal.prototype.adjustDialog = function () {
    var modalIsOverflowing = this.$element[0].scrollHeight > document.documentElement.clientHeight

    this.$element.css({
      paddingLeft:  !this.bodyIsOverflowing && modalIsOverflowing ? this.scrollbarWidth : '',
      paddingRight: this.bodyIsOverflowing && !modalIsOverflowing ? this.scrollbarWidth : ''
    })
  }

  Modal.prototype.resetAdjustments = function () {
    this.$element.css({
      paddingLeft: '',
      paddingRight: ''
    })
  }

  Modal.prototype.checkScrollbar = function () {
    this.bodyIsOverflowing = document.body.scrollHeight > document.documentElement.clientHeight
    this.scrollbarWidth = this.measureScrollbar()
  }

  Modal.prototype.setScrollbar = function () {
    var bodyPad = parseInt((this.$body.css('padding-right') || 0), 10)
    if (this.bodyIsOverflowing) this.$body.css('padding-right', bodyPad + this.scrollbarWidth)
  }

  Modal.prototype.resetScrollbar = function () {
    this.$body.css('padding-right', '')
  }

  Modal.prototype.measureScrollbar = function () { // thx walsh
    var scrollDiv = document.createElement('div')
    scrollDiv.className = 'modal-scrollbar-measure'
    this.$body.append(scrollDiv)
    var scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth
    this.$body[0].removeChild(scrollDiv)
    return scrollbarWidth
  }


  // MODAL PLUGIN DEFINITION
  // =======================

  function Plugin(option, _relatedTarget) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.modal')
      var options = $.extend({}, Modal.DEFAULTS, $this.data(), typeof option == 'object' && option)

      if (!data) $this.data('bs.modal', (data = new Modal(this, options)))
      if (typeof option == 'string') data[option](_relatedTarget)
      else if (options.show) data.show(_relatedTarget)
    })
  }

  var old = $.fn.modal

  $.fn.modal             = Plugin
  $.fn.modal.Constructor = Modal


  // MODAL NO CONFLICT
  // =================

  $.fn.modal.noConflict = function () {
    $.fn.modal = old
    return this
  }


  // MODAL DATA-API
  // ==============

  $(document).on('click.bs.modal.data-api', '[data-toggle="modal"]', function (e) {
    var $this   = $(this)
    var href    = $this.attr('href')
    var $target = $($this.attr('data-target') || (href && href.replace(/.*(?=#[^\s]+$)/, ''))) // strip for ie7
    var option  = $target.data('bs.modal') ? 'toggle' : $.extend({ remote: !/#/.test(href) && href }, $target.data(), $this.data())

    if ($this.is('a')) e.preventDefault()

    $target.one('show.bs.modal', function (showEvent) {
      if (showEvent.isDefaultPrevented()) return // only register focus restorer if modal will actually get shown
      $target.one('hidden.bs.modal', function () {
        $this.is(':visible') && $this.trigger('focus')
      })
    })
    Plugin.call($target, option, this)
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tooltip.js v3.3.2
 * http://getbootstrap.com/javascript/#tooltip
 * Inspired by the original jQuery.tipsy by Jason Frame
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TOOLTIP PUBLIC CLASS DEFINITION
  // ===============================

  var Tooltip = function (element, options) {
    this.type       =
    this.options    =
    this.enabled    =
    this.timeout    =
    this.hoverState =
    this.$element   = null

    this.init('tooltip', element, options)
  }

  Tooltip.VERSION  = '3.3.2'

  Tooltip.TRANSITION_DURATION = 150

  Tooltip.DEFAULTS = {
    animation: true,
    placement: 'top',
    selector: false,
    template: '<div class="tooltip" role="tooltip"><div class="tooltip-arrow"></div><div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    container: false,
    viewport: {
      selector: 'body',
      padding: 0
    }
  }

  Tooltip.prototype.init = function (type, element, options) {
    this.enabled   = true
    this.type      = type
    this.$element  = $(element)
    this.options   = this.getOptions(options)
    this.$viewport = this.options.viewport && $(this.options.viewport.selector || this.options.viewport)

    var triggers = this.options.trigger.split(' ')

    for (var i = triggers.length; i--;) {
      var trigger = triggers[i]

      if (trigger == 'click') {
        this.$element.on('click.' + this.type, this.options.selector, $.proxy(this.toggle, this))
      } else if (trigger != 'manual') {
        var eventIn  = trigger == 'hover' ? 'mouseenter' : 'focusin'
        var eventOut = trigger == 'hover' ? 'mouseleave' : 'focusout'

        this.$element.on(eventIn  + '.' + this.type, this.options.selector, $.proxy(this.enter, this))
        this.$element.on(eventOut + '.' + this.type, this.options.selector, $.proxy(this.leave, this))
      }
    }

    this.options.selector ?
      (this._options = $.extend({}, this.options, { trigger: 'manual', selector: '' })) :
      this.fixTitle()
  }

  Tooltip.prototype.getDefaults = function () {
    return Tooltip.DEFAULTS
  }

  Tooltip.prototype.getOptions = function (options) {
    options = $.extend({}, this.getDefaults(), this.$element.data(), options)

    if (options.delay && typeof options.delay == 'number') {
      options.delay = {
        show: options.delay,
        hide: options.delay
      }
    }

    return options
  }

  Tooltip.prototype.getDelegateOptions = function () {
    var options  = {}
    var defaults = this.getDefaults()

    this._options && $.each(this._options, function (key, value) {
      if (defaults[key] != value) options[key] = value
    })

    return options
  }

  Tooltip.prototype.enter = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (self && self.$tip && self.$tip.is(':visible')) {
      self.hoverState = 'in'
      return
    }

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'in'

    if (!self.options.delay || !self.options.delay.show) return self.show()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'in') self.show()
    }, self.options.delay.show)
  }

  Tooltip.prototype.leave = function (obj) {
    var self = obj instanceof this.constructor ?
      obj : $(obj.currentTarget).data('bs.' + this.type)

    if (!self) {
      self = new this.constructor(obj.currentTarget, this.getDelegateOptions())
      $(obj.currentTarget).data('bs.' + this.type, self)
    }

    clearTimeout(self.timeout)

    self.hoverState = 'out'

    if (!self.options.delay || !self.options.delay.hide) return self.hide()

    self.timeout = setTimeout(function () {
      if (self.hoverState == 'out') self.hide()
    }, self.options.delay.hide)
  }

  Tooltip.prototype.show = function () {
    var e = $.Event('show.bs.' + this.type)

    if (this.hasContent() && this.enabled) {
      this.$element.trigger(e)

      var inDom = $.contains(this.$element[0].ownerDocument.documentElement, this.$element[0])
      if (e.isDefaultPrevented() || !inDom) return
      var that = this

      var $tip = this.tip()

      var tipId = this.getUID(this.type)

      this.setContent()
      $tip.attr('id', tipId)
      this.$element.attr('aria-describedby', tipId)

      if (this.options.animation) $tip.addClass('fade')

      var placement = typeof this.options.placement == 'function' ?
        this.options.placement.call(this, $tip[0], this.$element[0]) :
        this.options.placement

      var autoToken = /\s?auto?\s?/i
      var autoPlace = autoToken.test(placement)
      if (autoPlace) placement = placement.replace(autoToken, '') || 'top'

      $tip
        .detach()
        .css({ top: 0, left: 0, display: 'block' })
        .addClass(placement)
        .data('bs.' + this.type, this)

      this.options.container ? $tip.appendTo(this.options.container) : $tip.insertAfter(this.$element)

      var pos          = this.getPosition()
      var actualWidth  = $tip[0].offsetWidth
      var actualHeight = $tip[0].offsetHeight

      if (autoPlace) {
        var orgPlacement = placement
        var $container   = this.options.container ? $(this.options.container) : this.$element.parent()
        var containerDim = this.getPosition($container)

        placement = placement == 'bottom' && pos.bottom + actualHeight > containerDim.bottom ? 'top'    :
                    placement == 'top'    && pos.top    - actualHeight < containerDim.top    ? 'bottom' :
                    placement == 'right'  && pos.right  + actualWidth  > containerDim.width  ? 'left'   :
                    placement == 'left'   && pos.left   - actualWidth  < containerDim.left   ? 'right'  :
                    placement

        $tip
          .removeClass(orgPlacement)
          .addClass(placement)
      }

      var calculatedOffset = this.getCalculatedOffset(placement, pos, actualWidth, actualHeight)

      this.applyPlacement(calculatedOffset, placement)

      var complete = function () {
        var prevHoverState = that.hoverState
        that.$element.trigger('shown.bs.' + that.type)
        that.hoverState = null

        if (prevHoverState == 'out') that.leave(that)
      }

      $.support.transition && this.$tip.hasClass('fade') ?
        $tip
          .one('bsTransitionEnd', complete)
          .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
        complete()
    }
  }

  Tooltip.prototype.applyPlacement = function (offset, placement) {
    var $tip   = this.tip()
    var width  = $tip[0].offsetWidth
    var height = $tip[0].offsetHeight

    // manually read margins because getBoundingClientRect includes difference
    var marginTop = parseInt($tip.css('margin-top'), 10)
    var marginLeft = parseInt($tip.css('margin-left'), 10)

    // we must check for NaN for ie 8/9
    if (isNaN(marginTop))  marginTop  = 0
    if (isNaN(marginLeft)) marginLeft = 0

    offset.top  = offset.top  + marginTop
    offset.left = offset.left + marginLeft

    // $.fn.offset doesn't round pixel values
    // so we use setOffset directly with our own function B-0
    $.offset.setOffset($tip[0], $.extend({
      using: function (props) {
        $tip.css({
          top: Math.round(props.top),
          left: Math.round(props.left)
        })
      }
    }, offset), 0)

    $tip.addClass('in')

    // check to see if placing tip in new offset caused the tip to resize itself
    var actualWidth  = $tip[0].offsetWidth
    var actualHeight = $tip[0].offsetHeight

    if (placement == 'top' && actualHeight != height) {
      offset.top = offset.top + height - actualHeight
    }

    var delta = this.getViewportAdjustedDelta(placement, offset, actualWidth, actualHeight)

    if (delta.left) offset.left += delta.left
    else offset.top += delta.top

    var isVertical          = /top|bottom/.test(placement)
    var arrowDelta          = isVertical ? delta.left * 2 - width + actualWidth : delta.top * 2 - height + actualHeight
    var arrowOffsetPosition = isVertical ? 'offsetWidth' : 'offsetHeight'

    $tip.offset(offset)
    this.replaceArrow(arrowDelta, $tip[0][arrowOffsetPosition], isVertical)
  }

  Tooltip.prototype.replaceArrow = function (delta, dimension, isHorizontal) {
    this.arrow()
      .css(isHorizontal ? 'left' : 'top', 50 * (1 - delta / dimension) + '%')
      .css(isHorizontal ? 'top' : 'left', '')
  }

  Tooltip.prototype.setContent = function () {
    var $tip  = this.tip()
    var title = this.getTitle()

    $tip.find('.tooltip-inner')[this.options.html ? 'html' : 'text'](title)
    $tip.removeClass('fade in top bottom left right')
  }

  Tooltip.prototype.hide = function (callback) {
    var that = this
    var $tip = this.tip()
    var e    = $.Event('hide.bs.' + this.type)

    function complete() {
      if (that.hoverState != 'in') $tip.detach()
      that.$element
        .removeAttr('aria-describedby')
        .trigger('hidden.bs.' + that.type)
      callback && callback()
    }

    this.$element.trigger(e)

    if (e.isDefaultPrevented()) return

    $tip.removeClass('in')

    $.support.transition && this.$tip.hasClass('fade') ?
      $tip
        .one('bsTransitionEnd', complete)
        .emulateTransitionEnd(Tooltip.TRANSITION_DURATION) :
      complete()

    this.hoverState = null

    return this
  }

  Tooltip.prototype.fixTitle = function () {
    var $e = this.$element
    if ($e.attr('title') || typeof ($e.attr('data-original-title')) != 'string') {
      $e.attr('data-original-title', $e.attr('title') || '').attr('title', '')
    }
  }

  Tooltip.prototype.hasContent = function () {
    return this.getTitle()
  }

  Tooltip.prototype.getPosition = function ($element) {
    $element   = $element || this.$element

    var el     = $element[0]
    var isBody = el.tagName == 'BODY'

    var elRect    = el.getBoundingClientRect()
    if (elRect.width == null) {
      // width and height are missing in IE8, so compute them manually; see https://github.com/twbs/bootstrap/issues/14093
      elRect = $.extend({}, elRect, { width: elRect.right - elRect.left, height: elRect.bottom - elRect.top })
    }
    var elOffset  = isBody ? { top: 0, left: 0 } : $element.offset()
    var scroll    = { scroll: isBody ? document.documentElement.scrollTop || document.body.scrollTop : $element.scrollTop() }
    var outerDims = isBody ? { width: $(window).width(), height: $(window).height() } : null

    return $.extend({}, elRect, scroll, outerDims, elOffset)
  }

  Tooltip.prototype.getCalculatedOffset = function (placement, pos, actualWidth, actualHeight) {
    return placement == 'bottom' ? { top: pos.top + pos.height,   left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'top'    ? { top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2 } :
           placement == 'left'   ? { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth } :
        /* placement == 'right' */ { top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width }

  }

  Tooltip.prototype.getViewportAdjustedDelta = function (placement, pos, actualWidth, actualHeight) {
    var delta = { top: 0, left: 0 }
    if (!this.$viewport) return delta

    var viewportPadding = this.options.viewport && this.options.viewport.padding || 0
    var viewportDimensions = this.getPosition(this.$viewport)

    if (/right|left/.test(placement)) {
      var topEdgeOffset    = pos.top - viewportPadding - viewportDimensions.scroll
      var bottomEdgeOffset = pos.top + viewportPadding - viewportDimensions.scroll + actualHeight
      if (topEdgeOffset < viewportDimensions.top) { // top overflow
        delta.top = viewportDimensions.top - topEdgeOffset
      } else if (bottomEdgeOffset > viewportDimensions.top + viewportDimensions.height) { // bottom overflow
        delta.top = viewportDimensions.top + viewportDimensions.height - bottomEdgeOffset
      }
    } else {
      var leftEdgeOffset  = pos.left - viewportPadding
      var rightEdgeOffset = pos.left + viewportPadding + actualWidth
      if (leftEdgeOffset < viewportDimensions.left) { // left overflow
        delta.left = viewportDimensions.left - leftEdgeOffset
      } else if (rightEdgeOffset > viewportDimensions.width) { // right overflow
        delta.left = viewportDimensions.left + viewportDimensions.width - rightEdgeOffset
      }
    }

    return delta
  }

  Tooltip.prototype.getTitle = function () {
    var title
    var $e = this.$element
    var o  = this.options

    title = $e.attr('data-original-title')
      || (typeof o.title == 'function' ? o.title.call($e[0]) :  o.title)

    return title
  }

  Tooltip.prototype.getUID = function (prefix) {
    do prefix += ~~(Math.random() * 1000000)
    while (document.getElementById(prefix))
    return prefix
  }

  Tooltip.prototype.tip = function () {
    return (this.$tip = this.$tip || $(this.options.template))
  }

  Tooltip.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.tooltip-arrow'))
  }

  Tooltip.prototype.enable = function () {
    this.enabled = true
  }

  Tooltip.prototype.disable = function () {
    this.enabled = false
  }

  Tooltip.prototype.toggleEnabled = function () {
    this.enabled = !this.enabled
  }

  Tooltip.prototype.toggle = function (e) {
    var self = this
    if (e) {
      self = $(e.currentTarget).data('bs.' + this.type)
      if (!self) {
        self = new this.constructor(e.currentTarget, this.getDelegateOptions())
        $(e.currentTarget).data('bs.' + this.type, self)
      }
    }

    self.tip().hasClass('in') ? self.leave(self) : self.enter(self)
  }

  Tooltip.prototype.destroy = function () {
    var that = this
    clearTimeout(this.timeout)
    this.hide(function () {
      that.$element.off('.' + that.type).removeData('bs.' + that.type)
    })
  }


  // TOOLTIP PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.tooltip')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.tooltip', (data = new Tooltip(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tooltip

  $.fn.tooltip             = Plugin
  $.fn.tooltip.Constructor = Tooltip


  // TOOLTIP NO CONFLICT
  // ===================

  $.fn.tooltip.noConflict = function () {
    $.fn.tooltip = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: popover.js v3.3.2
 * http://getbootstrap.com/javascript/#popovers
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // POPOVER PUBLIC CLASS DEFINITION
  // ===============================

  var Popover = function (element, options) {
    this.init('popover', element, options)
  }

  if (!$.fn.tooltip) throw new Error('Popover requires tooltip.js')

  Popover.VERSION  = '3.3.2'

  Popover.DEFAULTS = $.extend({}, $.fn.tooltip.Constructor.DEFAULTS, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip"><div class="arrow"></div><h3 class="popover-title"></h3><div class="popover-content"></div></div>'
  })


  // NOTE: POPOVER EXTENDS tooltip.js
  // ================================

  Popover.prototype = $.extend({}, $.fn.tooltip.Constructor.prototype)

  Popover.prototype.constructor = Popover

  Popover.prototype.getDefaults = function () {
    return Popover.DEFAULTS
  }

  Popover.prototype.setContent = function () {
    var $tip    = this.tip()
    var title   = this.getTitle()
    var content = this.getContent()

    $tip.find('.popover-title')[this.options.html ? 'html' : 'text'](title)
    $tip.find('.popover-content').children().detach().end()[ // we use append for html objects to maintain js events
      this.options.html ? (typeof content == 'string' ? 'html' : 'append') : 'text'
    ](content)

    $tip.removeClass('fade top bottom left right in')

    // IE8 doesn't accept hiding via the `:empty` pseudo selector, we have to do
    // this manually by checking the contents.
    if (!$tip.find('.popover-title').html()) $tip.find('.popover-title').hide()
  }

  Popover.prototype.hasContent = function () {
    return this.getTitle() || this.getContent()
  }

  Popover.prototype.getContent = function () {
    var $e = this.$element
    var o  = this.options

    return $e.attr('data-content')
      || (typeof o.content == 'function' ?
            o.content.call($e[0]) :
            o.content)
  }

  Popover.prototype.arrow = function () {
    return (this.$arrow = this.$arrow || this.tip().find('.arrow'))
  }

  Popover.prototype.tip = function () {
    if (!this.$tip) this.$tip = $(this.options.template)
    return this.$tip
  }


  // POPOVER PLUGIN DEFINITION
  // =========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.popover')
      var options = typeof option == 'object' && option

      if (!data && option == 'destroy') return
      if (!data) $this.data('bs.popover', (data = new Popover(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.popover

  $.fn.popover             = Plugin
  $.fn.popover.Constructor = Popover


  // POPOVER NO CONFLICT
  // ===================

  $.fn.popover.noConflict = function () {
    $.fn.popover = old
    return this
  }

}(jQuery);

/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.2
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    var process  = $.proxy(this.process, this)

    this.$body          = $('body')
    this.$scrollElement = $(element).is('body') ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', process)
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.2'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var offsetMethod = 'offset'
    var offsetBase   = 0

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.offsets = []
    this.targets = []
    this.scrollHeight = this.getScrollHeight()

    var self     = this

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        self.offsets.push(this[0])
        self.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (!offsets[i + 1] || scrollTop <= offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
        '[data-target="' + target + '"],' +
        this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);

/* ========================================================================
 * Bootstrap: tab.js v3.3.2
 * http://getbootstrap.com/javascript/#tabs
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // TAB CLASS DEFINITION
  // ====================

  var Tab = function (element) {
    this.element = $(element)
  }

  Tab.VERSION = '3.3.2'

  Tab.TRANSITION_DURATION = 150

  Tab.prototype.show = function () {
    var $this    = this.element
    var $ul      = $this.closest('ul:not(.dropdown-menu)')
    var selector = $this.data('target')

    if (!selector) {
      selector = $this.attr('href')
      selector = selector && selector.replace(/.*(?=#[^\s]*$)/, '') // strip for ie7
    }

    if ($this.parent('li').hasClass('active')) return

    var $previous = $ul.find('.active:last a')
    var hideEvent = $.Event('hide.bs.tab', {
      relatedTarget: $this[0]
    })
    var showEvent = $.Event('show.bs.tab', {
      relatedTarget: $previous[0]
    })

    $previous.trigger(hideEvent)
    $this.trigger(showEvent)

    if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) return

    var $target = $(selector)

    this.activate($this.closest('li'), $ul)
    this.activate($target, $target.parent(), function () {
      $previous.trigger({
        type: 'hidden.bs.tab',
        relatedTarget: $this[0]
      })
      $this.trigger({
        type: 'shown.bs.tab',
        relatedTarget: $previous[0]
      })
    })
  }

  Tab.prototype.activate = function (element, container, callback) {
    var $active    = container.find('> .active')
    var transition = callback
      && $.support.transition
      && (($active.length && $active.hasClass('fade')) || !!container.find('> .fade').length)

    function next() {
      $active
        .removeClass('active')
        .find('> .dropdown-menu > .active')
          .removeClass('active')
        .end()
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', false)

      element
        .addClass('active')
        .find('[data-toggle="tab"]')
          .attr('aria-expanded', true)

      if (transition) {
        element[0].offsetWidth // reflow for transition
        element.addClass('in')
      } else {
        element.removeClass('fade')
      }

      if (element.parent('.dropdown-menu')) {
        element
          .closest('li.dropdown')
            .addClass('active')
          .end()
          .find('[data-toggle="tab"]')
            .attr('aria-expanded', true)
      }

      callback && callback()
    }

    $active.length && transition ?
      $active
        .one('bsTransitionEnd', next)
        .emulateTransitionEnd(Tab.TRANSITION_DURATION) :
      next()

    $active.removeClass('in')
  }


  // TAB PLUGIN DEFINITION
  // =====================

  function Plugin(option) {
    return this.each(function () {
      var $this = $(this)
      var data  = $this.data('bs.tab')

      if (!data) $this.data('bs.tab', (data = new Tab(this)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.tab

  $.fn.tab             = Plugin
  $.fn.tab.Constructor = Tab


  // TAB NO CONFLICT
  // ===============

  $.fn.tab.noConflict = function () {
    $.fn.tab = old
    return this
  }


  // TAB DATA-API
  // ============

  var clickHandler = function (e) {
    e.preventDefault()
    Plugin.call($(this), 'show')
  }

  $(document)
    .on('click.bs.tab.data-api', '[data-toggle="tab"]', clickHandler)
    .on('click.bs.tab.data-api', '[data-toggle="pill"]', clickHandler)

}(jQuery);

/* ========================================================================
 * Bootstrap: affix.js v3.3.2
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      =
    this.unpin        =
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.2'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = $('body').height()

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);

/**
 * TableDnD plug-in for JQuery, allows you to drag and drop table rows
 * You can set up various options to control how the system will work
 * Copyright (c) Denis Howlett <denish@isocra.com>
 * Licensed like jQuery, see http://docs.jquery.com/License.
 *
 * Configuration options:
 *
 * onDragStyle
 *     This is the style that is assigned to the row during drag. There are limitations to the styles that can be
 *     associated with a row (such as you can't assign a border--well you can, but it won't be
 *     displayed). (So instead consider using onDragClass.) The CSS style to apply is specified as
 *     a map (as used in the jQuery css(...) function).
 * onDropStyle
 *     This is the style that is assigned to the row when it is dropped. As for onDragStyle, there are limitations
 *     to what you can do. Also this replaces the original style, so again consider using onDragClass which
 *     is simply added and then removed on drop.
 * onDragClass
 *     This class is added for the duration of the drag and then removed when the row is dropped. It is more
 *     flexible than using onDragStyle since it can be inherited by the row cells and other content. The default
 *     is class is tDnD_whileDrag. So to use the default, simply customise this CSS class in your
 *     stylesheet.
 * onDrop
 *     Pass a function that will be called when the row is dropped. The function takes 2 parameters: the table
 *     and the row that was dropped. You can work out the new order of the rows by using
 *     table.rows.
 * onDragStart
 *     Pass a function that will be called when the user starts dragging. The function takes 2 parameters: the
 *     table and the row which the user has started to drag.
 * onAllowDrop
 *     Pass a function that will be called as a row is over another row. If the function returns true, allow
 *     dropping on that row, otherwise not. The function takes 2 parameters: the dragged row and the row under
 *     the cursor. It returns a boolean: true allows the drop, false doesn't allow it.
 * scrollAmount
 *     This is the number of pixels to scroll if the user moves the mouse cursor to the top or bottom of the
 *     window. The page should automatically scroll up or down as appropriate (tested in IE6, IE7, Safari, FF2,
 *     FF3 beta
 * dragHandle
 *     This is a jQuery mach string for one or more cells in each row that is draggable. If you
 *     specify this, then you are responsible for setting cursor: move in the CSS and only these cells
 *     will have the drag behaviour. If you do not specify a dragHandle, then you get the old behaviour where
 *     the whole row is draggable.
 *
 * Other ways to control behaviour:
 *
 * Add class="nodrop" to any rows for which you don't want to allow dropping, and class="nodrag" to any rows
 * that you don't want to be draggable.
 *
 * Inside the onDrop method you can also call $.tableDnD.serialize() this returns a string of the form
 * <tableID>[]=<rowID1>&<tableID>[]=<rowID2> so that you can send this back to the server. The table must have
 * an ID as must all the rows.
 *
 * Other methods:
 *
 * $("...").tableDnDUpdate()
 * Will update all the matching tables, that is it will reapply the mousedown method to the rows (or handle cells).
 * This is useful if you have updated the table rows using Ajax and you want to make the table draggable again.
 * The table maintains the original configuration (so you don't have to specify it again).
 *
 * $("...").tableDnDSerialize()
 * Will serialize and return the serialized string as above, but for each of the matching tables--so it can be
 * called from anywhere and isn't dependent on the currentTable being set up correctly before calling
 *
 * Known problems:
 * - Auto-scoll has some problems with IE7  (it scrolls even when it shouldn't), work-around: set scrollAmount to 0
 *
 * Version 0.2: 2008-02-20 First public version
 * Version 0.3: 2008-02-07 Added onDragStart option
 *                         Made the scroll amount configurable (default is 5 as before)
 * Version 0.4: 2008-03-15 Changed the noDrag/noDrop attributes to nodrag/nodrop classes
 *                         Added onAllowDrop to control dropping
 *                         Fixed a bug which meant that you couldn't set the scroll amount in both directions
 *                         Added serialize method
 * Version 0.5: 2008-05-16 Changed so that if you specify a dragHandle class it doesn't make the whole row
 *                         draggable
 *                         Improved the serialize method to use a default (and settable) regular expression.
 *                         Added tableDnDupate() and tableDnDSerialize() to be called when you are outside the table
 * Version 0.6: 2011-12-02 Added support for touch devices
 * Version 0.7  2012-04-09 Now works with jQuery 1.7 and supports touch, tidied up tabs and spaces
 */
!function ($, window, document, undefined) {
// Determine if this is a touch device
var hasTouch   = 'ontouchstart' in document.documentElement,
    startEvent = 'touchstart mousedown',
    moveEvent  = 'touchmove mousemove',
    endEvent   = 'touchend mouseup';

// If we're on a touch device, then wire up the events
// see http://stackoverflow.com/a/8456194/1316086
hasTouch
    && $.each("touchstart touchmove touchend".split(" "), function(i, name) {
        $.event.fixHooks[name] = $.event.mouseHooks;
    });


$(document).ready(function () {
    function parseStyle(css) {
        var objMap = {},
            parts = css.match(/([^;:]+)/g) || [];
        while (parts.length)
            objMap[parts.shift()] = parts.shift().trim();

        return objMap;
    }
    $('table').each(function () {
        if ($(this).data('table') == 'dnd') {

            $(this).tableDnD({
                onDragStyle: $(this).data('ondragstyle') && parseStyle($(this).data('ondragstyle')) || null,
                onDropStyle: $(this).data('ondropstyle') && parseStyle($(this).data('ondropstyle')) || null,
                onDragClass: $(this).data('ondragclass') == undefined && "tDnD_whileDrag" || $(this).data('ondragclass'),
                onDrop: $(this).data('ondrop') && new Function('table', 'row', $(this).data('ondrop')), // 'return eval("'+$(this).data('ondrop')+'");') || null,
                onDragStart: $(this).data('ondragstart') && new Function('table', 'row' ,$(this).data('ondragstart')), // 'return eval("'+$(this).data('ondragstart')+'");') || null,
                scrollAmount: $(this).data('scrollamount') || 5,
                sensitivity: $(this).data('sensitivity') || 10,
                hierarchyLevel: $(this).data('hierarchylevel') || 0,
                indentArtifact: $(this).data('indentartifact') || '<div class="indent">&nbsp;</div>',
                autoWidthAdjust: $(this).data('autowidthadjust') || true,
                autoCleanRelations: $(this).data('autocleanrelations') || true,
                jsonPretifySeparator: $(this).data('jsonpretifyseparator') || '\t',
                serializeRegexp: $(this).data('serializeregexp') && new RegExp($(this).data('serializeregexp')) || /[^\-]*$/,
                serializeParamName: $(this).data('serializeparamname') || false,
                dragHandle: $(this).data('draghandle') || null
            });
        }


    });
});

jQuery.tableDnD = {
    /** Keep hold of the current table being dragged */
    currentTable: null,
    /** Keep hold of the current drag object if any */
    dragObject: null,
    /** The current mouse offset */
    mouseOffset: null,
    /** Remember the old value of X and Y so that we don't do too much processing */
    oldX: 0,
    oldY: 0,

    /** Actually build the structure */
    build: function(options) {
        // Set up the defaults if any

        this.each(function() {
            // This is bound to each matching table, set up the defaults and override with user options
            this.tableDnDConfig = $.extend({
                onDragStyle: null,
                onDropStyle: null,
                // Add in the default class for whileDragging
                onDragClass: "tDnD_whileDrag",
                onDrop: null,
                onDragStart: null,
                scrollAmount: 5,
                /** Sensitivity setting will throttle the trigger rate for movement detection */
                sensitivity: 10,
                /** Hierarchy level to support parent child. 0 switches this functionality off */
                hierarchyLevel: 0,
                /** The html artifact to prepend the first cell with as indentation */
                indentArtifact: '<div class="indent">&nbsp;</div>',
                /** Automatically adjust width of first cell */
                autoWidthAdjust: true,
                /** Automatic clean-up to ensure relationship integrity */
                autoCleanRelations: true,
                /** Specify a number (4) as number of spaces or any indent string for JSON.stringify */
                jsonPretifySeparator: '\t',
                /** The regular expression to use to trim row IDs */
                serializeRegexp: /[^\-]*$/,
                /** If you want to specify another parameter name instead of the table ID */
                serializeParamName: false,
                /** If you give the name of a class here, then only Cells with this class will be draggable */
                dragHandle: null
            }, options || {});

            // Now make the rows draggable
            $.tableDnD.makeDraggable(this);
            // Prepare hierarchy support
            this.tableDnDConfig.hierarchyLevel
                && $.tableDnD.makeIndented(this);
        });

        // Don't break the chain
        return this;
    },
    makeIndented: function (table) {
        var config = table.tableDnDConfig,
            rows = table.rows,
            firstCell = $(rows).first().find('td:first')[0],
            indentLevel = 0,
            cellWidth = 0,
            longestCell,
            tableStyle;

        if ($(table).hasClass('indtd'))
            return null;

        tableStyle = $(table).addClass('indtd').attr('style');
        $(table).css({whiteSpace: "nowrap"});

        for (var w = 0; w < rows.length; w++) {
            if (cellWidth < $(rows[w]).find('td:first').text().length) {
                cellWidth = $(rows[w]).find('td:first').text().length;
                longestCell = w;
            }
        }
        $(firstCell).css({width: 'auto'});
        for (w = 0; w < config.hierarchyLevel; w++)
            $(rows[longestCell]).find('td:first').prepend(config.indentArtifact);
        firstCell && $(firstCell).css({width: firstCell.offsetWidth});
        tableStyle && $(table).css(tableStyle);

        for (w = 0; w < config.hierarchyLevel; w++)
            $(rows[longestCell]).find('td:first').children(':first').remove();

        config.hierarchyLevel
            && $(rows).each(function () {
                indentLevel = $(this).data('level') || 0;
                indentLevel <= config.hierarchyLevel
                    && $(this).data('level', indentLevel)
                    || $(this).data('level', 0);
                for (var i = 0; i < $(this).data('level'); i++)
                    $(this).find('td:first').prepend(config.indentArtifact);
            });

        return this;
    },
    /** This function makes all the rows on the table draggable apart from those marked as "NoDrag" */
    makeDraggable: function(table) {
        var config = table.tableDnDConfig;

        config.dragHandle
            // We only need to add the event to the specified cells
            && $(config.dragHandle, table).each(function() {
                // The cell is bound to "this"
                $(this).bind(startEvent, function(e) {
                    $.tableDnD.initialiseDrag($(this).parents('tr')[0], table, this, e, config);
                    return false;
                });
            })
            // For backwards compatibility, we add the event to the whole row
            // get all the rows as a wrapped set
            || $(table.rows).each(function() {
                // Iterate through each row, the row is bound to "this"
                if (! $(this).hasClass("nodrag")) {
                    $(this).bind(startEvent, function(e) {
                        if (e.target.tagName == "TD") {
                            $.tableDnD.initialiseDrag(this, table, this, e, config);
                            return false;
                        }
                    }).css("cursor", "move"); // Store the tableDnD object
                }
            });
    },
    currentOrder: function() {
        var rows = this.currentTable.rows;
        return $.map(rows, function (val) {
            return ($(val).data('level') + val.id).replace(/\s/g, '');
        }).join('');
    },
    initialiseDrag: function(dragObject, table, target, e, config) {
        this.dragObject    = dragObject;
        this.currentTable  = table;
        this.mouseOffset   = this.getMouseOffset(target, e);
        this.originalOrder = this.currentOrder();

        // Now we need to capture the mouse up and mouse move event
        // We can use bind so that we don't interfere with other event handlers
        $(document)
            .bind(moveEvent, this.mousemove)
            .bind(endEvent, this.mouseup);

        // Call the onDragStart method if there is one
        config.onDragStart
            && config.onDragStart(table, target);
    },
    updateTables: function() {
        this.each(function() {
            // this is now bound to each matching table
            if (this.tableDnDConfig)
                $.tableDnD.makeDraggable(this);
        });
    },
    /** Get the mouse coordinates from the event (allowing for browser differences) */
    mouseCoords: function(e) {
        if (event.changedTouches)
            return {
                x: event.changedTouches[0].clientX,
                y: event.changedTouches[0].clientY
            };
        
        if(e.pageX || e.pageY)
            return {
                x: e.pageX,
                y: e.pageY
            };

        return {
            x: e.clientX + document.body.scrollLeft - document.body.clientLeft,
            y: e.clientY + document.body.scrollTop  - document.body.clientTop
        };
    },
    /** Given a target element and a mouse eent, get the mouse offset from that element.
     To do this we need the element's position and the mouse position */
    getMouseOffset: function(target, e) {
        var mousePos,
            docPos;

        e = e || window.event;

        docPos    = this.getPosition(target);
        mousePos  = this.mouseCoords(e);

        return {
            x: mousePos.x - docPos.x,
            y: mousePos.y - docPos.y
        };
    },
    /** Get the position of an element by going up the DOM tree and adding up all the offsets */
    getPosition: function(element) {
        var left = 0,
            top  = 0;

        // Safari fix -- thanks to Luis Chato for this!
        // Safari 2 doesn't correctly grab the offsetTop of a table row
        // this is detailed here:
        // http://jacob.peargrove.com/blog/2006/technical/table-row-offsettop-bug-in-safari/
        // the solution is likewise noted there, grab the offset of a table cell in the row - the firstChild.
        // note that firefox will return a text node as a first child, so designing a more thorough
        // solution may need to take that into account, for now this seems to work in firefox, safari, ie
        if (element.offsetHeight == 0)
            element = element.firstChild; // a table cell

        while (element.offsetParent) {
            left   += element.offsetLeft;
            top    += element.offsetTop;
            element = element.offsetParent;
        }

        left += element.offsetLeft;
        top  += element.offsetTop;

        return {
            x: left,
            y: top
        };
    },
    autoScroll: function (mousePos) {
      var config       = this.currentTable.tableDnDConfig,
          yOffset      = window.pageYOffset,
          windowHeight = window.innerHeight
            ? window.innerHeight
            : document.documentElement.clientHeight
            ? document.documentElement.clientHeight
            : document.body.clientHeight;

        // Windows version
        // yOffset=document.body.scrollTop;
        if (document.all)
            if (typeof document.compatMode != 'undefined'
                && document.compatMode != 'BackCompat')
                yOffset = document.documentElement.scrollTop;
            else if (typeof document.body != 'undefined')
                yOffset = document.body.scrollTop;

        mousePos.y - yOffset < config.scrollAmount
            && window.scrollBy(0, - config.scrollAmount)
        || windowHeight - (mousePos.y - yOffset) < config.scrollAmount
            && window.scrollBy(0, config.scrollAmount);

    },
    moveVerticle: function (moving, currentRow) {

        if (0 != moving.vertical
            // If we're over a row then move the dragged row to there so that the user sees the
            // effect dynamically
            && currentRow
            && this.dragObject != currentRow
            && this.dragObject.parentNode == currentRow.parentNode)
            0 > moving.vertical
                && this.dragObject.parentNode.insertBefore(this.dragObject, currentRow.nextSibling)
            || 0 < moving.vertical
                && this.dragObject.parentNode.insertBefore(this.dragObject, currentRow);

    },
    moveHorizontal: function (moving, currentRow) {
        var config       = this.currentTable.tableDnDConfig,
            currentLevel;

        if (!config.hierarchyLevel
            || 0 == moving.horizontal
            // We only care if moving left or right on the current row
            || !currentRow
            || this.dragObject != currentRow)
                return null;

            currentLevel = $(currentRow).data('level');

            0 < moving.horizontal
                && currentLevel > 0
                && $(currentRow).find('td:first').children(':first').remove()
                && $(currentRow).data('level', --currentLevel);

            0 > moving.horizontal
                && currentLevel < config.hierarchyLevel
                && $(currentRow).prev().data('level') >= currentLevel
                && $(currentRow).children(':first').prepend(config.indentArtifact)
                && $(currentRow).data('level', ++currentLevel);

    },
    mousemove: function(e) {
        var dragObj      = $($.tableDnD.dragObject),
            config       = $.tableDnD.currentTable.tableDnDConfig,
            currentRow,
            mousePos,
            moving,
            x,
            y;

        e && e.preventDefault();

        if (!$.tableDnD.dragObject)
            return false;

        // prevent touch device screen scrolling
        e.type == 'touchmove'
            && event.preventDefault(); // TODO verify this is event and not really e

        // update the style to show we're dragging
        config.onDragClass
            && dragObj.addClass(config.onDragClass)
            || dragObj.css(config.onDragStyle);

        mousePos = $.tableDnD.mouseCoords(e);
        x = mousePos.x - $.tableDnD.mouseOffset.x;
        y = mousePos.y - $.tableDnD.mouseOffset.y;

        // auto scroll the window
        $.tableDnD.autoScroll(mousePos);

        currentRow = $.tableDnD.findDropTargetRow(dragObj, y);
        moving = $.tableDnD.findDragDirection(x, y);

        $.tableDnD.moveVerticle(moving, currentRow);
        $.tableDnD.moveHorizontal(moving, currentRow);

        return false;
    },
    findDragDirection: function (x,y) {
        var sensitivity = this.currentTable.tableDnDConfig.sensitivity,
            oldX        = this.oldX,
            oldY        = this.oldY,
            xMin        = oldX - sensitivity,
            xMax        = oldX + sensitivity,
            yMin        = oldY - sensitivity,
            yMax        = oldY + sensitivity,
            moving      = {
                horizontal: x >= xMin && x <= xMax ? 0 : x > oldX ? -1 : 1,
                vertical  : y >= yMin && y <= yMax ? 0 : y > oldY ? -1 : 1
            };

        // update the old value
        if (moving.horizontal != 0)
            this.oldX    = x;
        if (moving.vertical   != 0)
            this.oldY    = y;

        return moving;
    },
    /** We're only worried about the y position really, because we can only move rows up and down */
    findDropTargetRow: function(draggedRow, y) {
        var rowHeight = 0,
            rows      = this.currentTable.rows,
            config    = this.currentTable.tableDnDConfig,
            rowY      = 0,
            row       = null;

        for (var i = 0; i < rows.length; i++) {
            row       = rows[i];
            rowY      = this.getPosition(row).y;
            rowHeight = parseInt(row.offsetHeight) / 2;
            if (row.offsetHeight == 0) {
                rowY      = this.getPosition(row.firstChild).y;
                rowHeight = parseInt(row.firstChild.offsetHeight) / 2;
            }
            // Because we always have to insert before, we need to offset the height a bit
            if (y > (rowY - rowHeight) && y < (rowY + rowHeight))
                // that's the row we're over
                // If it's the same as the current row, ignore it
                if (draggedRow.is(row)
                    || (config.onAllowDrop
                    && !config.onAllowDrop(draggedRow, row))
                    // If a row has nodrop class, then don't allow dropping (inspired by John Tarr and Famic)
                    || $(row).hasClass("nodrop"))
                        return null;
                else
                    return row;
        }
        return null;
    },
    processMouseup: function() {
        if (!this.currentTable || !this.dragObject)
            return null;

        var config      = this.currentTable.tableDnDConfig,
            droppedRow  = this.dragObject,
            parentLevel = 0,
            myLevel     = 0;

        // Unbind the event handlers
        $(document)
            .unbind(moveEvent, this.mousemove)
            .unbind(endEvent,  this.mouseup);

        config.hierarchyLevel
            && config.autoCleanRelations
            && $(this.currentTable.rows).first().find('td:first').children().each(function () {
                myLevel = $(this).parents('tr:first').data('level');
                myLevel
                    && $(this).parents('tr:first').data('level', --myLevel)
                    && $(this).remove();
            })
            && config.hierarchyLevel > 1
            && $(this.currentTable.rows).each(function () {
                myLevel = $(this).data('level');
                if (myLevel > 1) {
                    parentLevel = $(this).prev().data('level');
                    while (myLevel > parentLevel + 1) {
                        $(this).find('td:first').children(':first').remove();
                        $(this).data('level', --myLevel);
                    }
                }
            });

        // If we have a dragObject, then we need to release it,
        // The row will already have been moved to the right place so we just reset stuff
        config.onDragClass
            && $(droppedRow).removeClass(config.onDragClass)
            || $(droppedRow).css(config.onDropStyle);

        this.dragObject = null;
        // Call the onDrop method if there is one
        config.onDrop
            && this.originalOrder != this.currentOrder()
            && $(droppedRow).hide().fadeIn('fast')
            && config.onDrop(this.currentTable, droppedRow);

        this.currentTable = null; // let go of the table too
    },
    mouseup: function(e) {
        e && e.preventDefault();
        $.tableDnD.processMouseup();
        return false;
    },
    jsonize: function(pretify) {
        var table = this.currentTable;
        if (pretify)
            return JSON.stringify(
                this.tableData(table),
                null,
                table.tableDnDConfig.jsonPretifySeparator
            );
        return JSON.stringify(this.tableData(table));
    },
    serialize: function() {
        return $.param(this.tableData(this.currentTable));
    },
    serializeTable: function(table) {
        var result = "";
        var paramName = table.tableDnDConfig.serializeParamName || table.id;
        var rows = table.rows;
        for (var i=0; i<rows.length; i++) {
            if (result.length > 0) result += "&";
            var rowId = rows[i].id;
            if (rowId && table.tableDnDConfig && table.tableDnDConfig.serializeRegexp) {
                rowId = rowId.match(table.tableDnDConfig.serializeRegexp)[0];
                result += paramName + '[]=' + rowId;
            }
        }
        return result;
    },
    serializeTables: function() {
        var result = [];
        $('table').each(function() {
            this.id && result.push($.param(this.tableData(this)));
        });
        return result.join('&');
    },
    tableData: function (table) {
        var config = table.tableDnDConfig,
            previousIDs  = [],
            currentLevel = 0,
            indentLevel  = 0,
            rowID        = null,
            data         = {},
            getSerializeRegexp,
            paramName,
            currentID,
            rows;

        if (!table)
            table = this.currentTable;
        if (!table || !table.id || !table.rows || !table.rows.length)
            return {error: { code: 500, message: "Not a valid table, no serializable unique id provided."}};

        rows      = config.autoCleanRelations
                        && table.rows
                        || $.makeArray(table.rows);
        paramName = config.serializeParamName || table.id;
        currentID = paramName;

        getSerializeRegexp = function (rowId) {
            if (rowId && config && config.serializeRegexp)
                return rowId.match(config.serializeRegexp)[0];
            return rowId;
        };

        data[currentID] = [];
        !config.autoCleanRelations
            && $(rows[0]).data('level')
            && rows.unshift({id: 'undefined'});



        for (var i=0; i < rows.length; i++) {
            if (config.hierarchyLevel) {
                indentLevel = $(rows[i]).data('level') || 0;
                if (indentLevel == 0) {
                    currentID   = paramName;
                    previousIDs = [];
                }
                else if (indentLevel > currentLevel) {
                    previousIDs.push([currentID, currentLevel]);
                    currentID = getSerializeRegexp(rows[i-1].id);
                }
                else if (indentLevel < currentLevel) {
                    for (var h = 0; h < previousIDs.length; h++) {
                        if (previousIDs[h][1] == indentLevel)
                            currentID         = previousIDs[h][0];
                        if (previousIDs[h][1] >= currentLevel)
                            previousIDs[h][1] = 0;
                    }
                }
                currentLevel = indentLevel;

                if (!$.isArray(data[currentID]))
                    data[currentID] = [];
                rowID = getSerializeRegexp(rows[i].id);
                rowID && data[currentID].push(rowID);
            }
            else {
                rowID = getSerializeRegexp(rows[i].id);
                rowID && data[currentID].push(rowID);
            }
        }
        return data;
    }
};

jQuery.fn.extend(
    {
        tableDnD             : $.tableDnD.build,
        tableDnDUpdate       : $.tableDnD.updateTables,
        tableDnDSerialize    : $.proxy($.tableDnD.serialize, $.tableDnD),
        tableDnDSerializeAll : $.tableDnD.serializeTables,
        tableDnDData         : $.proxy($.tableDnD.tableData, $.tableDnD)
    }
);

}(jQuery, window, window.document);

(function(d){d.Observe={}})(jQuery);
(function(d,q){var r=function(e,f){f||(f=e,e=window.document);var m=[];d(f).each(function(){for(var l=[],g=d(this),h=g.parent();h.length&&!g.is(e);h=h.parent()){var f=g.get(0).tagName.toLowerCase();l.push(f+":eq("+h.children(f).index(g)+")");g=h}(h.length||g.is(e))&&m.push("> "+l.reverse().join(" > "))});return m.join(", ")};q.path={get:r,capture:function(e,f){f||(f=e,e=window.document);var m=[];d(f).each(function(){var l=-1,g=this;if(this instanceof Text)for(var g=this.parentNode,h=g.childNodes,
f=0;f<h.length;f++)if(h[f]===this){l=f;break}var k=r(e,g),n=d(e).is(g);m.push(function(e){e=n?e:d(e).find(k);return-1===l?e:e.contents()[l]})});return function(e){e=e||window.document;return m.reduce(function(d,f){return d.add(f(e))},d([]))}}}})(jQuery,jQuery.Observe);(function(d,q){var r=function(e){this.original=d(e);this.root=this.original.clone(!1,!0)};r.prototype.find=function(d){return q.path.capture(this.original,d)(this.root)};q.Branch=r})(jQuery,jQuery.Observe);
(function(d,q){var r=function(a,b){var c={};a.forEach(function(a){(a=b(a))&&(c[a[0]]=a[1])});return c},e=r("childList attributes characterData subtree attributeOldValue characterDataOldValue attributeFilter".split(" "),function(a){return[a.toLowerCase(),a]}),f=r(Object.keys(e),function(a){if("attributefilter"!==a)return[e[a],!0]}),m=r(["added","removed"],function(a){return[a.toLowerCase(),a]}),l=d([]),g=function(a){if("object"===typeof a)return a;a=a.split(/\s+/);var b={};a.forEach(function(a){a=
a.toLowerCase();if(!e[a]&&!m[a])throw Error("Unknown option "+a);b[e[a]||m[a]]=!0});return b},h=function(a){return"["+Object.keys(a).sort().reduce(function(b,c){var d=a[c]&&"object"===typeof a[c]?h(a[c]):a[c];return b+"["+JSON.stringify(c)+":"+d+"]"},"")+"]"},t=window.MutationObserver||window.WebKitMutationObserver,k=function(a,b,c,s){this._originalOptions=d.extend({},b);b=d.extend({},b);this.attributeFilter=b.attributeFilter;delete b.attributeFilter;c&&(b.subtree=!0);b.childList&&(b.added=!0,b.removed=
!0);if(b.added||b.removed)b.childList=!0;this.target=d(a);this.options=b;this.selector=c;this.handler=s};k.prototype.is=function(a,b,c){return h(this._originalOptions)===h(a)&&this.selector===b&&this.handler===c};k.prototype.match=function(a){var b=this.options,c=a.type;if(!this.options[c])return l;if(this.selector)switch(c){case "attributes":if(!this._matchAttributeFilter(a))break;case "characterData":return this._matchAttributesAndCharacterData(a);case "childList":if(a.addedNodes&&a.addedNodes.length&&
b.added&&(c=this._matchAddedNodes(a),c.length))return c;if(a.removedNodes&&a.removedNodes.length&&b.removed)return this._matchRemovedNodes(a)}else{var s=a.target instanceof Text?d(a.target).parent():d(a.target);if(!b.subtree&&s.get(0)!==this.target.get(0))return l;switch(c){case "attributes":if(!this._matchAttributeFilter(a))break;case "characterData":return this.target;case "childList":if(a.addedNodes&&a.addedNodes.length&&b.added||a.removedNodes&&a.removedNodes.length&&b.removed)return this.target}}return l};
k.prototype._matchAttributesAndCharacterData=function(a){return this._matchSelector(this.target,[a.target])};k.prototype._matchAddedNodes=function(a){return this._matchSelector(this.target,a.addedNodes)};k.prototype._matchRemovedNodes=function(a){var b=new q.Branch(this.target),c=Array.prototype.slice.call(a.removedNodes).map(function(a){return a.cloneNode(!0)});a.previousSibling?b.find(a.previousSibling).after(c):a.nextSibling?b.find(a.nextSibling).before(c):(this.target===a.target?b.root:b.find(a.target)).empty().append(c);
return this._matchSelector(b.root,c).length?d(a.target):l};k.prototype._matchSelector=function(a,b){var c=a.find(this.selector);b=Array.prototype.slice.call(b);return c=c.filter(function(){var a=this;return b.some(function(b){return b instanceof Text?b.parentNode===a:b===a||d(b).has(a).length})})};k.prototype._matchAttributeFilter=function(a){return this.attributeFilter&&this.attributeFilter.length?0<=this.attributeFilter.indexOf(a.attributeName):!0};var n=function(a){this.patterns=[];this._target=
a;this._observer=null};n.prototype.observe=function(a,b,c){var d=this;this._observer?this._observer.disconnect():this._observer=new t(function(a){a.forEach(function(a){d.patterns.forEach(function(b){var c=b.match(a);c.length&&c.each(function(){b.handler.call(this,a)})})})});this.patterns.push(new k(this._target,a,b,c));this._observer.observe(this._target,this._collapseOptions())};n.prototype.disconnect=function(a,b,c){var d=this;this._observer&&(this.patterns.filter(function(d){return d.is(a,b,c)}).forEach(function(a){a=
d.patterns.indexOf(a);d.patterns.splice(a,1)}),this.patterns.length||this._observer.disconnect())};n.prototype.disconnectAll=function(){this._observer&&(this.patterns=[],this._observer.disconnect())};n.prototype.pause=function(){this._observer&&this._observer.disconnect()};n.prototype.resume=function(){this._observer&&this._observer.observe(this._target,this._collapseOptions())};n.prototype._collapseOptions=function(){var a={};this.patterns.forEach(function(b){var c=a.attributes&&a.attributeFilter;
if(!c&&a.attributes||!b.attributeFilter)c&&b.options.attributes&&!b.attributeFilter&&delete a.attributeFilter;else{var e={},f=[];(a.attributeFilter||[]).concat(b.attributeFilter).forEach(function(a){e[a]||(f.push(a),e[a]=1)});a.attributeFilter=f}d.extend(a,b.options)});Object.keys(m).forEach(function(b){delete a[m[b]]});return a};var p=function(a){this.patterns=[];this._paused=!1;this._target=a;this._events={};this._handler=this._handler.bind(this)};p.prototype.NS=".jQueryObserve";p.prototype.observe=
function(a,b,c){a=new k(this._target,a,b,c);d(this._target);a.options.childList&&(this._addEvent("DOMNodeInserted"),this._addEvent("DOMNodeRemoved"));a.options.attributes&&this._addEvent("DOMAttrModified");a.options.characterData&&this._addEvent("DOMCharacerDataModified");this.patterns.push(a)};p.prototype.disconnect=function(a,b,c){var e=d(this._target),f=this;this.patterns.filter(function(d){return d.is(a,b,c)}).forEach(function(a){a=f.patterns.indexOf(a);f.patterns.splice(a,1)});var g=this.patterns.reduce(function(a,
b){b.options.childList&&(a.DOMNodeInserted=!0,a.DOMNodeRemoved=!0);b.options.attributes&&(a.DOMAttrModified=!0);b.options.characterData&&(a.DOMCharacerDataModified=!0);return a},{});Object.keys(this._events).forEach(function(a){g[a]||(delete f._events[a],e.off(a+f.NS,f._handler))})};p.prototype.disconnectAll=function(){var a=d(this._target),b;for(b in this._events)a.off(b+this.NS,this._handler);this._events={};this.patterns=[]};p.prototype.pause=function(){this._paused=!0};p.prototype.resume=function(){this._paused=
!1};p.prototype._handler=function(a){if(!this._paused){var b={type:null,target:null,addedNodes:null,removedNodes:null,previousSibling:null,nextSibling:null,attributeName:null,attributeNamespace:null,oldValue:null};switch(a.type){case "DOMAttrModified":b.type="attributes";b.target=a.target;b.attributeName=a.attrName;b.oldValue=a.prevValue;break;case "DOMCharacerDataModified":b.type="characterData";b.target=d(a.target).parent().get(0);b.attributeName=a.attrName;b.oldValue=a.prevValue;break;case "DOMNodeInserted":b.type=
"childList";b.target=a.relatedNode;b.addedNodes=[a.target];b.removedNodes=[];break;case "DOMNodeRemoved":b.type="childList",b.target=a.relatedNode,b.addedNodes=[],b.removedNodes=[a.target]}for(a=0;a<this.patterns.length;a++){var c=this.patterns[a],e=c.match(b);e.length&&e.each(function(){c.handler.call(this,b)})}}};p.prototype._addEvent=function(a){this._events[a]||(d(this._target).on(a+this.NS,this._handler),this._events[a]=!0)};q.Pattern=k;q.MutationObserver=n;q.DOMEventObserver=p;d.fn.observe=
function(a,b,c){b?c||(c=b,b=null):(c=a,a=f);return this.each(function(){var e=d(this),f=e.data("observer");f||(f=t?new n(this):new p(this),e.data("observer",f));a=g(a);f.observe(a,b,c)})};d.fn.disconnect=function(a,b,c){a&&(b?c||(c=b,b=null):(c=a,a=f));return this.each(function(){var e=d(this),f=e.data("observer");f&&(a?(a=g(a),f.disconnect(a,b,c)):(f.disconnectAll(),e.removeData("observer")))})}})(jQuery,jQuery.Observe);

(function() {
  var SELECTOR, addEventListener, clickEvent, numberRegExp, sortable, touchDevice, trimRegExp;

  SELECTOR = 'table[data-sortable]';

  numberRegExp = /^-?[£$¤]?[\d,.]+%?$/;

  trimRegExp = /^\s+|\s+$/g;

  touchDevice = 'ontouchstart' in document.documentElement;

  clickEvent = touchDevice ? 'touchstart' : 'click';

  addEventListener = function(el, event, handler) {
    if (el.addEventListener != null) {
      return el.addEventListener(event, handler, false);
    } else {
      return el.attachEvent("on" + event, handler);
    }
  };

  sortable = {
    init: function(options) {
      var table, tables, _i, _len, _results;
      if (options == null) {
        options = {};
      }
      if (options.selector == null) {
        options.selector = SELECTOR;
      }
      tables = document.querySelectorAll(options.selector);
      _results = [];
      for (_i = 0, _len = tables.length; _i < _len; _i++) {
        table = tables[_i];
        _results.push(sortable.initTable(table));
      }
      return _results;
    },
    initTable: function(table) {
      var i, th, ths, _i, _len, _ref;
      if (((_ref = table.tHead) != null ? _ref.rows.length : void 0) !== 1) {
        return;
      }
      if (table.getAttribute('data-sortable-initialized') === 'true') {
        return;
      }
      table.setAttribute('data-sortable-initialized', 'true');
      ths = table.querySelectorAll('th');
      for (i = _i = 0, _len = ths.length; _i < _len; i = ++_i) {
        th = ths[i];
        if (th.getAttribute('data-sortable') !== 'false') {
          sortable.setupClickableTH(table, th, i);
        }
      }
      return table;
    },
    setupClickableTH: function(table, th, i) {
      var type;
      type = sortable.getColumnType(table, i);
      return addEventListener(th, clickEvent, function(e) {
        var newSortedDirection, row, rowArray, rowArrayObject, sorted, sortedDirection, tBody, ths, _i, _j, _k, _len, _len1, _len2, _ref, _results;
        sorted = this.getAttribute('data-sorted') === 'true';
        sortedDirection = this.getAttribute('data-sorted-direction');
        if (sorted) {
          newSortedDirection = sortedDirection === 'ascending' ? 'descending' : 'ascending';
        } else {
          newSortedDirection = type.defaultSortDirection;
        }
        ths = this.parentNode.querySelectorAll('th');
        for (_i = 0, _len = ths.length; _i < _len; _i++) {
          th = ths[_i];
          th.setAttribute('data-sorted', 'false');
          th.removeAttribute('data-sorted-direction');
        }
        this.setAttribute('data-sorted', 'true');
        this.setAttribute('data-sorted-direction', newSortedDirection);
        tBody = table.tBodies[0];
        rowArray = [];
        _ref = tBody.rows;
        for (_j = 0, _len1 = _ref.length; _j < _len1; _j++) {
          row = _ref[_j];
          rowArray.push([sortable.getNodeValue(row.cells[i]), row]);
        }
        if (sorted) {
          rowArray.reverse();
        } else {
          rowArray.sort(type.compare);
        }
        _results = [];
        for (_k = 0, _len2 = rowArray.length; _k < _len2; _k++) {
          rowArrayObject = rowArray[_k];
          _results.push(tBody.appendChild(rowArrayObject[1]));
        }
        return _results;
      });
    },
    getColumnType: function(table, i) {
      var row, text, _i, _len, _ref;
      _ref = table.tBodies[0].rows;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        row = _ref[_i];
        text = sortable.getNodeValue(row.cells[i]);
        if (text !== '') {
          if (text.match(numberRegExp)) {
            return sortable.types.numeric;
          }
          if (!isNaN(Date.parse(text))) {
            return sortable.types.date;
          }
        }
      }
      return sortable.types.alpha;
    },
    getNodeValue: function(node) {
      if (!node) {
        return '';
      }
      if (node.getAttribute('data-value') !== null) {
        return node.getAttribute('data-value');
      }
      if (typeof node.innerText !== 'undefined') {
        return node.innerText.replace(trimRegExp, '');
      }
      return node.textContent.replace(trimRegExp, '');
    },
    types: {
      numeric: {
        defaultSortDirection: 'descending',
        compare: function(a, b) {
          var aa, bb;
          aa = parseFloat(a[0].replace(/[^0-9.-]/g, ''), 10);
          bb = parseFloat(b[0].replace(/[^0-9.-]/g, ''), 10);
          if (isNaN(aa)) {
            aa = 0;
          }
          if (isNaN(bb)) {
            bb = 0;
          }
          return bb - aa;
        }
      },
      alpha: {
        defaultSortDirection: 'ascending',
        compare: function(a, b) {
          return a[0].localeCompare(b[0]);
        }
      },
      date: {
        defaultSortDirection: 'ascending',
        compare: function(a, b) {
          var aa, bb;
          aa = Date.parse(a[0]);
          bb = Date.parse(b[0]);
          if (isNaN(aa)) {
            aa = 0;
          }
          if (isNaN(bb)) {
            bb = 0;
          }
          return aa - bb;
        }
      }
    }
  };

  setTimeout(sortable.init, 0);

  window.Sortable = sortable;

}).call(this);

/*
 * Filter.js
 * version: 1.5.2 (12/5/2014)
 *
 * Licensed under the MIT:
 *   http://www.opensource.org/licenses/mit-license.php
 *
 * Copyright 2013 Jiren Patel[ joshsoftware.com ]
 * 
 * Dependency:
 *  jQuery(v1.8 >=)
 */

(function(window) {

  'use strict';

  var FilterJS = function(data, container, view, options) {
    return new _FilterJS(data, container, view, options);
  };

  FilterJS.VERSION = '1.5.1';

  $.fn.filterjs = function(data, view, options) {
    var $this = $(this);
    if ($this.data('fjs')) return;
    $this.data('fjs', new _FilterJS(data, $this, view, options));
  };

  window.FilterJS = FilterJS;

  var _FilterJS = function(data, container, view, options) {
    var property_count = 0, name;

    this.data = data;
    this.view = view;
    this.container = container;
    this.options = options || {};
    this.categories_map = {}
    this.record_ids = [];

    if (this.data.constructor != Array) this.data = [this.data];

    for (name in this.data[0]){
      this.root = name;
      property_count += 1;
    }

    if (property_count == 1){
      this.getRecord = function(i, d){ return d[i][this.root]; }
    }else{
      this.getRecord = function(i, d){ return d[i]; }
      this.root = 'fjs';
    }

    this.id_field = this.options.id_field || 'id';
    this.render(this.data);
    this.parseOptions();
    this.buildCategoryMap(this.data);
    this.bindEvents();

    this.options.callbacks = this.options.callbacks || {};
    this.execCallBack('after_init', this.record_ids);
    this.execCallBack('after_add', this.data);
    this.options.filter_types = this.options.filter_types || {};

    if (!this.options.filter_types['range'])
      this.options.filter_types['range'] = this.rangeFilter;

    this.options.streaming = this.options.streaming || {};
    if (this.options.streaming.data_url){
      this.options.streaming.stream_after = (this.options.streaming.stream_after || 2)*1000;
      this.options.streaming.batch_size = this.options.streaming.batch_size || false;
      this.streamData(this.options.streaming.stream_after);
    }

    if(this.options.filter_on_init == undefined || this.options.filter_on_init == true){
      this.options.filter_on_init = true;
      this.filter();
    }
    
    return this;
  };

  _FilterJS.prototype = {

    //Render Html using JSON data
    render: function(data, offset) {
      var $container = $(this.container), record, el;

      if (!data) return;

      for (var i = 0, l = data.length; i < l; i++){
        record = this.getRecord(i, data);
        el = $(this.view(record));
        el.attr({id: this.root + '_' + record[this.id_field], 'data-fjs': true});
        el = $container.append(el);
      }
    },

    //Bind Events to filter html elements
    bindEvents: function() {
      var self = this, s = this.options.selectors, i = 0, l = s.length;

      for (i; i < l; i++){
        this.bindSelectorEvent(s[i], self);
      }

      if (this.options.search){
        $(this.options.search.input).on('keyup', function(e){
          self.filter();
        });
      }
    },

    bindSelectorEvent: function(selector, context) {
      $(selector.element).on(selector.events, function(e) {
        context.filter();
      });
    },

    //Unbind fileter events
    clear: function() {
      var s = this.options.selectors, i = 0, l = s.length;

      for (i; i < l; i++)
        $(s[i].element).off(s[i].events);

      if (this.options.search) $(this.options.search.input).off('keyup');

      this.category_map = null;
      this.record_ids = null;
    },
                  
    //Find elements accroding to selection criteria.
    filter: function(){
      var result, s, selected_vals, records, selected_none = false, i = 0, l = this.options.selectors.length;

      //Check if criteria option is specified
      if(l) {
        for (i; i < l; i++){
          s = this.options.selectors[i];
          selected_vals = $(s.element).filter(s.select).map(function() {
            return $(this).val();
          });

          if (selected_vals.length) {
            records = this.findObjects(selected_vals, this.categories_map[s.name], this.options.filter_types[s.type]);

            result = $.grep((result || this.record_ids), function(v) {
              return (records.indexOf(v) != -1);
            });
          }else{
            selected_none = true;
          }
        }

        if (selected_none && this.options.and_filter_on) result = [];
      }
      else{
        result = this.record_ids;
      }

      if (this.options.search) result = this.search(this.options.search, result);
      
      this.hideShow(result);
      this.execCallBack('after_filter', result);
    },

    //Compare and collect objects
    findObjects: function(category_vals, category_map, filter_type_func) {
      var r = [], ids, category_val, i = 0, l = category_vals.length;

      for (i; i < l; i++){
        category_val = category_vals[i];
        
        if (filter_type_func){
          ids = $.map(category_map, function(n,v){
            if (filter_type_func(category_val, v)) return n;
          });
        } else {
          ids = category_map.constructor == Array ? category_map : category_map[category_val];
        }

        if (ids) r = r.concat(ids);
      }

      return r;
    },

    //Make eval expresssion  to collect object from the json data.
    buildEvalString: function(field_map) {
      var fields = field_map.split('.ARRAY.'), eval_str, i = 1, l = fields.length;

      eval_str = fields[0];

      for (i; i < l; i++) {
        eval_str += ".filter_collect('" + fields[i] + "')";
      }

      return eval_str;
    },

    addFilterCriteria: function(name, criteria, ids_or_mapping) {
      this.categories_map[name] = {};

      var selector = this.parseSelectorOptions({name: name}, [criteria]);
      ids_or_mapping = ids_or_mapping || $(selector.element).data('ids') || [];

      this.options.selectors.push(selector);
      this.categories_map[name] = ids_or_mapping;

      this.bindSelectorEvent(selector, this);
    },

    //Create map accroding to selection criteria.
    parseOptions: function() {
      var filter_criteria = this.options.filter_criteria, selector, criteria, ele, ele_type, name;
      this.options.selectors = [];

      for (name in filter_criteria) {

        criteria = filter_criteria[name];
        selector = this.parseSelectorOptions({name: name}, criteria);

        this.options.selectors.push(selector);

        criteria.push(this.buildEvalString(criteria[1]));
        this.categories_map[name] = {};
      }
    },

    parseSelectorOptions: function(selector, criteria) {
      selector.element = criteria[0].split(/.EVENT.|.SELECT.|.TYPE./)[0];
      selector.events = (criteria[0].match(/.EVENT.(\S*)/) || [])[1];
      selector.select = (criteria[0].match(/.SELECT.(\S*)/) || [])[1];
      selector.type = (criteria[0].match(/.TYPE.(\S*)/) || [])[1];

      var ele = $(selector.element),
          ele_type = ele.attr('type');

      if (!selector.select){
        if (ele.get(0).tagName == 'INPUT'){
          if (ele_type == 'checkbox' || ele_type == 'radio'){
            selector.select = ':checked';
          }else if (ele_type == 'hidden' || ele_type == 'text'){
            selector.select = ':input';
          }
        }else if (ele.get(0).tagName == 'SELECT'){
           selector.select = 'select';
        }
      }

      if (!selector.events){
        if (ele_type == 'checkbox' ||ele_type == 'radio'){
          selector.events = 'click';
        }else if (ele_type == 'hidden' || ele.get(0).tagName == 'SELECT'){
          selector.events = 'change';
        }
      }

      return selector;
    },

    buildCategoryMap: function(data) {
      var filter_criteria = this.options.filter_criteria, record, categories, obj, x;

      for (var i = 0, l = data.length; i < l; i++){
        record = this.getRecord(i, data);
        this.record_ids.push(record[this.id_field]);

        for (name in filter_criteria) {
          categories = eval('record.' + filter_criteria[name][2]);
          obj = this.categories_map[name];

          if (categories && categories.constructor == Array) {
            for (var j = 0, lj = categories.length; j < lj; j++){
              x = categories[j];
              obj[x] ? obj[x].push(record[this.id_field]) : obj[x] = [record[this.id_field]];
            }
          } else {
            obj[categories] ? obj[categories].push(record[this.id_field]) : obj[categories] = [record[this.id_field]];
          }
        }
      }
    },

    hideShow: function(ids) {
      var e_id = '#' + this.root + '_', i = 0, l = ids.length;

      $(this.container + ' > *[data-fjs]').hide();

      for (i; i < l; i++)
        $(e_id + ids[i]).show();
    },

    search: function (search_config, filter_result) {
  		var val = $.trim($(search_config.input).val());
	  	var search_in = search_config.search_in;
		  var min_length = $.isNumeric(search_config.min_length) ? search_config.min_length : 1;

		  if (val.length < min_length) return filter_result;

		  var id_prefix = '#' + this.root + '_';
		  val = val.toUpperCase();

		  return $.map(filter_result, function (id) {
			  var $ele = $(id_prefix + id);

			  if (search_in) $ele = $ele.find(search_in);
  
	  		if ($ele.text().toUpperCase().indexOf(val) >= 0) return id;
		  });
	  },

    execCallBack: function(type, result){
      if(this.options.callbacks[type]) 
        this.options.callbacks[type].call(this, result)
    },

    rangeFilter: function(category_value, v){
      var range = category_value.split('-');

      if (range.length == 2){
        if (range[0] == 'below') range[0] = -Infinity;
        if (range[1] == 'above') range[1] = Infinity;
        if (Number(v) >= range[0] && Number(v) <= range[1]){
          return true;
        }
      }
    },

    //Collect Records by id array
    getRecordsByIds: function(ids){
      var records = [], r, i = 0, l = this.data.length;

      for (i; i < l; i++){
        r = this.getRecord(i, this.data);
        if (ids.indexOf(r[this.id_field]) != -1) records.push(r)
      }

      return records; 
    },

    addData: function(data){
      if (data == undefined || data.length == 0 ) return;

      var i = 0, l = data.length, r, uniq_data = [], e_id = '#' + this.root + '_';

      this.execCallBack('before_add', data)

      //for (i, l; i < l; i++){
      //  r = this.getRecord(i, data);
      //  if ($(e_id + r.id).length == 0) uniq_data.push(data[i]);
      //}

      this.data = this.data.concat(data);
      this.render(data);
      this.buildCategoryMap(data);
      this.execCallBack('after_add', data)
      this.filter();
    },

    setStreamingTimer: function(){
      var self = this, 
          timer_func = this.options.streaming.batch_size ? setInterval : setTimeout;

      return timer_func(function(){
        self.streamData();
      }, this.options.streaming.stream_after);
    },

    clearStreamingTimer: function(){
      if (this.timer) clearTimeout(this.timer);
    },

    fetchData: function(){
      var self = this, 
          params = this.options.params || {},
          opts = this.options.streaming;

      params['offset'] = this.data.length;

      if (opts.batch_size) params['limit'] = opts.batch_size;
      if (this.options.search) params['q'] = $.trim($(this.options.search.input).val()); 

      $.getJSON(opts.data_url, params).done(function(data){

        if (params.limit != null && (!data || !data.length)){
          self.stopStreaming();
        }else{
          self.setStreamInterval();
          self.addData(data);
        }

      }).fail(function(e){
        self.stopStreaming();
      });
    },

    setStreamInterval: function(){
      var self = this;
      if(self.options.streaming.stop_streaming == true) return;

      self.timer = setTimeout(function(){
        self.fetchData();
      }, self.options.streaming.stream_after);
    },

    stopStreaming: function(){
      this.options.streaming.stop_streaming = true;
      if (this.timer) clearTimeout(this.timer);
    },

    resumeStreaming: function(){
      this.options.streaming.stop_streaming = false;
      this.streamData(this.options.streaming.stream_after);
    },

    streamData: function(time){
      this.setStreamInterval();
      if(!this.options.streaming.batch_size) this.stopStreaming();
    }

}


})(this);

/**
 * Recursive method to collect object from json object.
 * i.e. test =  [ {"deal": {"id": 1 }}, {"deal": {"id": 2}}]
 *  - to collect id from the json data
 *    test.filter_collect('deal').filter_collect('id')
 *    this will return [1,2]
 */
Array.prototype.filter_collect = function(field, arr) {
  var arr = arr || [];
  for (var i = 0, l = this.length; i < l; i++){
    var obj = this[i];
    if (obj.constructor == Array){
      obj.filter_collect(field, arr);
    }
    else {
      arr.push(obj[field]);
    }
  }

  return arr;
};

//In IE indexOf method not define.
if (!Array.prototype.indexOf) {
  Array.prototype.indexOf = function(obj, start) {
    for (var i = (start || 0), j = this.length; i < j; i++) {
      if (this[i] === obj) { return i; }
    }
    return -1;
  }
}

/*!
 * Isotope PACKAGED v2.1.0
 * Filter & sort magical layouts
 * http://isotope.metafizzy.co
 */

/**
 * Bridget makes jQuery widgets
 * v1.1.0
 * MIT license
 */

( function( window ) {



// -------------------------- utils -------------------------- //

var slice = Array.prototype.slice;

function noop() {}

// -------------------------- definition -------------------------- //

function defineBridget( $ ) {

// bail if no jQuery
if ( !$ ) {
  return;
}

// -------------------------- addOptionMethod -------------------------- //

/**
 * adds option method -> $().plugin('option', {...})
 * @param {Function} PluginClass - constructor class
 */
function addOptionMethod( PluginClass ) {
  // don't overwrite original option method
  if ( PluginClass.prototype.option ) {
    return;
  }

  // option setter
  PluginClass.prototype.option = function( opts ) {
    // bail out if not an object
    if ( !$.isPlainObject( opts ) ){
      return;
    }
    this.options = $.extend( true, this.options, opts );
  };
}

// -------------------------- plugin bridge -------------------------- //

// helper function for logging errors
// $.error breaks jQuery chaining
var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

/**
 * jQuery plugin bridge, access methods like $elem.plugin('method')
 * @param {String} namespace - plugin name
 * @param {Function} PluginClass - constructor class
 */
function bridge( namespace, PluginClass ) {
  // add to jQuery fn namespace
  $.fn[ namespace ] = function( options ) {
    if ( typeof options === 'string' ) {
      // call plugin method when first argument is a string
      // get arguments for method
      var args = slice.call( arguments, 1 );

      for ( var i=0, len = this.length; i < len; i++ ) {
        var elem = this[i];
        var instance = $.data( elem, namespace );
        if ( !instance ) {
          logError( "cannot call methods on " + namespace + " prior to initialization; " +
            "attempted to call '" + options + "'" );
          continue;
        }
        if ( !$.isFunction( instance[options] ) || options.charAt(0) === '_' ) {
          logError( "no such method '" + options + "' for " + namespace + " instance" );
          continue;
        }

        // trigger method with arguments
        var returnValue = instance[ options ].apply( instance, args );

        // break look and return first value if provided
        if ( returnValue !== undefined ) {
          return returnValue;
        }
      }
      // return this if no return value
      return this;
    } else {
      return this.each( function() {
        var instance = $.data( this, namespace );
        if ( instance ) {
          // apply options & init
          instance.option( options );
          instance._init();
        } else {
          // initialize new instance
          instance = new PluginClass( this, options );
          $.data( this, namespace, instance );
        }
      });
    }
  };

}

// -------------------------- bridget -------------------------- //

/**
 * converts a Prototypical class into a proper jQuery plugin
 *   the class must have a ._init method
 * @param {String} namespace - plugin name, used in $().pluginName
 * @param {Function} PluginClass - constructor class
 */
$.bridget = function( namespace, PluginClass ) {
  addOptionMethod( PluginClass );
  bridge( namespace, PluginClass );
};

return $.bridget;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'jquery-bridget/jquery.bridget',[ 'jquery' ], defineBridget );
} else if ( typeof exports === 'object' ) {
  defineBridget( require('jquery') );
} else {
  // get jquery from browser global
  defineBridget( window.jQuery );
}

})( window );

/*!
 * eventie v1.0.5
 * event binding helper
 *   eventie.bind( elem, 'click', myFn )
 *   eventie.unbind( elem, 'click', myFn )
 * MIT license
 */

/*jshint browser: true, undef: true, unused: true */
/*global define: false, module: false */

( function( window ) {



var docElem = document.documentElement;

var bind = function() {};

function getIEEvent( obj ) {
  var event = window.event;
  // add event.target
  event.target = event.target || event.srcElement || obj;
  return event;
}

if ( docElem.addEventListener ) {
  bind = function( obj, type, fn ) {
    obj.addEventListener( type, fn, false );
  };
} else if ( docElem.attachEvent ) {
  bind = function( obj, type, fn ) {
    obj[ type + fn ] = fn.handleEvent ?
      function() {
        var event = getIEEvent( obj );
        fn.handleEvent.call( fn, event );
      } :
      function() {
        var event = getIEEvent( obj );
        fn.call( obj, event );
      };
    obj.attachEvent( "on" + type, obj[ type + fn ] );
  };
}

var unbind = function() {};

if ( docElem.removeEventListener ) {
  unbind = function( obj, type, fn ) {
    obj.removeEventListener( type, fn, false );
  };
} else if ( docElem.detachEvent ) {
  unbind = function( obj, type, fn ) {
    obj.detachEvent( "on" + type, obj[ type + fn ] );
    try {
      delete obj[ type + fn ];
    } catch ( err ) {
      // can't delete window object properties
      obj[ type + fn ] = undefined;
    }
  };
}

var eventie = {
  bind: bind,
  unbind: unbind
};

// ----- module definition ----- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'eventie/eventie',eventie );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = eventie;
} else {
  // browser global
  window.eventie = eventie;
}

})( this );

/*!
 * docReady v1.0.4
 * Cross browser DOMContentLoaded event emitter
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true*/
/*global define: false, require: false, module: false */

( function( window ) {



var document = window.document;
// collection of functions to be triggered on ready
var queue = [];

function docReady( fn ) {
  // throw out non-functions
  if ( typeof fn !== 'function' ) {
    return;
  }

  if ( docReady.isReady ) {
    // ready now, hit it
    fn();
  } else {
    // queue function when ready
    queue.push( fn );
  }
}

docReady.isReady = false;

// triggered on various doc ready events
function onReady( event ) {
  // bail if already triggered or IE8 document is not ready just yet
  var isIE8NotReady = event.type === 'readystatechange' && document.readyState !== 'complete';
  if ( docReady.isReady || isIE8NotReady ) {
    return;
  }

  trigger();
}

function trigger() {
  docReady.isReady = true;
  // process queue
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var fn = queue[i];
    fn();
  }
}

function defineDocReady( eventie ) {
  // trigger ready if page is ready
  if ( document.readyState === 'complete' ) {
    trigger();
  } else {
    // listen for events
    eventie.bind( document, 'DOMContentLoaded', onReady );
    eventie.bind( document, 'readystatechange', onReady );
    eventie.bind( window, 'load', onReady );
  }

  return docReady;
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'doc-ready/doc-ready',[ 'eventie/eventie' ], defineDocReady );
} else if ( typeof exports === 'object' ) {
  module.exports = defineDocReady( require('eventie') );
} else {
  // browser global
  window.docReady = defineDocReady( window.eventie );
}

})( window );

/*!
 * EventEmitter v4.2.9 - git.io/ee
 * Oliver Caldwell
 * MIT license
 * @preserve
 */

(function () {
    

    /**
     * Class for managing events.
     * Can be extended to provide event functionality in other classes.
     *
     * @class EventEmitter Manages event registering and emitting.
     */
    function EventEmitter() {}

    // Shortcuts to improve speed and size
    var proto = EventEmitter.prototype;
    var exports = this;
    var originalGlobalValue = exports.EventEmitter;

    /**
     * Finds the index of the listener for the event in its storage array.
     *
     * @param {Function[]} listeners Array of listeners to search through.
     * @param {Function} listener Method to look for.
     * @return {Number} Index of the specified listener, -1 if not found
     * @api private
     */
    function indexOfListener(listeners, listener) {
        var i = listeners.length;
        while (i--) {
            if (listeners[i].listener === listener) {
                return i;
            }
        }

        return -1;
    }

    /**
     * Alias a method while keeping the context correct, to allow for overwriting of target method.
     *
     * @param {String} name The name of the target method.
     * @return {Function} The aliased method
     * @api private
     */
    function alias(name) {
        return function aliasClosure() {
            return this[name].apply(this, arguments);
        };
    }

    /**
     * Returns the listener array for the specified event.
     * Will initialise the event object and listener arrays if required.
     * Will return an object if you use a regex search. The object contains keys for each matched event. So /ba[rz]/ might return an object containing bar and baz. But only if you have either defined them with defineEvent or added some listeners to them.
     * Each property in the object response is an array of listener functions.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Function[]|Object} All listener functions for the event.
     */
    proto.getListeners = function getListeners(evt) {
        var events = this._getEvents();
        var response;
        var key;

        // Return a concatenated array of all matching events if
        // the selector is a regular expression.
        if (evt instanceof RegExp) {
            response = {};
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    response[key] = events[key];
                }
            }
        }
        else {
            response = events[evt] || (events[evt] = []);
        }

        return response;
    };

    /**
     * Takes a list of listener objects and flattens it into a list of listener functions.
     *
     * @param {Object[]} listeners Raw listener objects.
     * @return {Function[]} Just the listener functions.
     */
    proto.flattenListeners = function flattenListeners(listeners) {
        var flatListeners = [];
        var i;

        for (i = 0; i < listeners.length; i += 1) {
            flatListeners.push(listeners[i].listener);
        }

        return flatListeners;
    };

    /**
     * Fetches the requested listeners via getListeners but will always return the results inside an object. This is mainly for internal use but others may find it useful.
     *
     * @param {String|RegExp} evt Name of the event to return the listeners from.
     * @return {Object} All listener functions for an event in an object.
     */
    proto.getListenersAsObject = function getListenersAsObject(evt) {
        var listeners = this.getListeners(evt);
        var response;

        if (listeners instanceof Array) {
            response = {};
            response[evt] = listeners;
        }

        return response || listeners;
    };

    /**
     * Adds a listener function to the specified event.
     * The listener will not be added if it is a duplicate.
     * If the listener returns true then it will be removed after it is called.
     * If you pass a regular expression as the event name then the listener will be added to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListener = function addListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var listenerIsWrapped = typeof listener === 'object';
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key) && indexOfListener(listeners[key], listener) === -1) {
                listeners[key].push(listenerIsWrapped ? listener : {
                    listener: listener,
                    once: false
                });
            }
        }

        return this;
    };

    /**
     * Alias of addListener
     */
    proto.on = alias('addListener');

    /**
     * Semi-alias of addListener. It will add a listener that will be
     * automatically removed after its first execution.
     *
     * @param {String|RegExp} evt Name of the event to attach the listener to.
     * @param {Function} listener Method to be called when the event is emitted. If the function returns true then it will be removed after calling.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addOnceListener = function addOnceListener(evt, listener) {
        return this.addListener(evt, {
            listener: listener,
            once: true
        });
    };

    /**
     * Alias of addOnceListener.
     */
    proto.once = alias('addOnceListener');

    /**
     * Defines an event name. This is required if you want to use a regex to add a listener to multiple events at once. If you don't do this then how do you expect it to know what event to add to? Should it just add to every possible match for a regex? No. That is scary and bad.
     * You need to tell it what event names should be matched by a regex.
     *
     * @param {String} evt Name of the event to create.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvent = function defineEvent(evt) {
        this.getListeners(evt);
        return this;
    };

    /**
     * Uses defineEvent to define multiple events.
     *
     * @param {String[]} evts An array of event names to define.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.defineEvents = function defineEvents(evts) {
        for (var i = 0; i < evts.length; i += 1) {
            this.defineEvent(evts[i]);
        }
        return this;
    };

    /**
     * Removes a listener function from the specified event.
     * When passed a regular expression as the event name, it will remove the listener from all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to remove the listener from.
     * @param {Function} listener Method to remove from the event.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListener = function removeListener(evt, listener) {
        var listeners = this.getListenersAsObject(evt);
        var index;
        var key;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                index = indexOfListener(listeners[key], listener);

                if (index !== -1) {
                    listeners[key].splice(index, 1);
                }
            }
        }

        return this;
    };

    /**
     * Alias of removeListener
     */
    proto.off = alias('removeListener');

    /**
     * Adds listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can add to multiple events at once. The object should contain key value pairs of events and listeners or listener arrays. You can also pass it an event name and an array of listeners to be added.
     * You can also pass it a regular expression to add the array of listeners to all events that match it.
     * Yeah, this function does quite a bit. That's probably a bad thing.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add to multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.addListeners = function addListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(false, evt, listeners);
    };

    /**
     * Removes listeners in bulk using the manipulateListeners method.
     * If you pass an object as the second argument you can remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be removed.
     * You can also pass it a regular expression to remove the listeners from all events that match it.
     *
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeListeners = function removeListeners(evt, listeners) {
        // Pass through to manipulateListeners
        return this.manipulateListeners(true, evt, listeners);
    };

    /**
     * Edits listeners in bulk. The addListeners and removeListeners methods both use this to do their job. You should really use those instead, this is a little lower level.
     * The first argument will determine if the listeners are removed (true) or added (false).
     * If you pass an object as the second argument you can add/remove from multiple events at once. The object should contain key value pairs of events and listeners or listener arrays.
     * You can also pass it an event name and an array of listeners to be added/removed.
     * You can also pass it a regular expression to manipulate the listeners of all events that match it.
     *
     * @param {Boolean} remove True if you want to remove listeners, false if you want to add.
     * @param {String|Object|RegExp} evt An event name if you will pass an array of listeners next. An object if you wish to add/remove from multiple events at once.
     * @param {Function[]} [listeners] An optional array of listener functions to add/remove.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.manipulateListeners = function manipulateListeners(remove, evt, listeners) {
        var i;
        var value;
        var single = remove ? this.removeListener : this.addListener;
        var multiple = remove ? this.removeListeners : this.addListeners;

        // If evt is an object then pass each of its properties to this method
        if (typeof evt === 'object' && !(evt instanceof RegExp)) {
            for (i in evt) {
                if (evt.hasOwnProperty(i) && (value = evt[i])) {
                    // Pass the single listener straight through to the singular method
                    if (typeof value === 'function') {
                        single.call(this, i, value);
                    }
                    else {
                        // Otherwise pass back to the multiple function
                        multiple.call(this, i, value);
                    }
                }
            }
        }
        else {
            // So evt must be a string
            // And listeners must be an array of listeners
            // Loop over it and pass each one to the multiple method
            i = listeners.length;
            while (i--) {
                single.call(this, evt, listeners[i]);
            }
        }

        return this;
    };

    /**
     * Removes all listeners from a specified event.
     * If you do not specify an event then all listeners will be removed.
     * That means every event will be emptied.
     * You can also pass a regex to remove all events that match it.
     *
     * @param {String|RegExp} [evt] Optional name of the event to remove all listeners for. Will remove from every event if not passed.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.removeEvent = function removeEvent(evt) {
        var type = typeof evt;
        var events = this._getEvents();
        var key;

        // Remove different things depending on the state of evt
        if (type === 'string') {
            // Remove all listeners for the specified event
            delete events[evt];
        }
        else if (evt instanceof RegExp) {
            // Remove all events matching the regex.
            for (key in events) {
                if (events.hasOwnProperty(key) && evt.test(key)) {
                    delete events[key];
                }
            }
        }
        else {
            // Remove all listeners in all events
            delete this._events;
        }

        return this;
    };

    /**
     * Alias of removeEvent.
     *
     * Added to mirror the node API.
     */
    proto.removeAllListeners = alias('removeEvent');

    /**
     * Emits an event of your choice.
     * When emitted, every listener attached to that event will be executed.
     * If you pass the optional argument array then those arguments will be passed to every listener upon execution.
     * Because it uses `apply`, your array of arguments will be passed as if you wrote them out separately.
     * So they will not arrive within the array on the other side, they will be separate.
     * You can also pass a regular expression to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {Array} [args] Optional array of arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emitEvent = function emitEvent(evt, args) {
        var listeners = this.getListenersAsObject(evt);
        var listener;
        var i;
        var key;
        var response;

        for (key in listeners) {
            if (listeners.hasOwnProperty(key)) {
                i = listeners[key].length;

                while (i--) {
                    // If the listener returns true then it shall be removed from the event
                    // The function is executed either with a basic call or an apply if there is an args array
                    listener = listeners[key][i];

                    if (listener.once === true) {
                        this.removeListener(evt, listener.listener);
                    }

                    response = listener.listener.apply(this, args || []);

                    if (response === this._getOnceReturnValue()) {
                        this.removeListener(evt, listener.listener);
                    }
                }
            }
        }

        return this;
    };

    /**
     * Alias of emitEvent
     */
    proto.trigger = alias('emitEvent');

    /**
     * Subtly different from emitEvent in that it will pass its arguments on to the listeners, as opposed to taking a single array of arguments to pass on.
     * As with emitEvent, you can pass a regex in place of the event name to emit to all events that match it.
     *
     * @param {String|RegExp} evt Name of the event to emit and execute listeners for.
     * @param {...*} Optional additional arguments to be passed to each listener.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.emit = function emit(evt) {
        var args = Array.prototype.slice.call(arguments, 1);
        return this.emitEvent(evt, args);
    };

    /**
     * Sets the current value to check against when executing listeners. If a
     * listeners return value matches the one set here then it will be removed
     * after execution. This value defaults to true.
     *
     * @param {*} value The new value to check for when executing listeners.
     * @return {Object} Current instance of EventEmitter for chaining.
     */
    proto.setOnceReturnValue = function setOnceReturnValue(value) {
        this._onceReturnValue = value;
        return this;
    };

    /**
     * Fetches the current value to check against when executing listeners. If
     * the listeners return value matches this one then it should be removed
     * automatically. It will return true by default.
     *
     * @return {*|Boolean} The current value to check for or the default, true.
     * @api private
     */
    proto._getOnceReturnValue = function _getOnceReturnValue() {
        if (this.hasOwnProperty('_onceReturnValue')) {
            return this._onceReturnValue;
        }
        else {
            return true;
        }
    };

    /**
     * Fetches the events object and creates one if required.
     *
     * @return {Object} The events storage object.
     * @api private
     */
    proto._getEvents = function _getEvents() {
        return this._events || (this._events = {});
    };

    /**
     * Reverts the global {@link EventEmitter} to its previous value and returns a reference to this version.
     *
     * @return {Function} Non conflicting EventEmitter class.
     */
    EventEmitter.noConflict = function noConflict() {
        exports.EventEmitter = originalGlobalValue;
        return EventEmitter;
    };

    // Expose the class either via AMD, CommonJS or the global object
    if (typeof define === 'function' && define.amd) {
        define('eventEmitter/EventEmitter',[],function () {
            return EventEmitter;
        });
    }
    else if (typeof module === 'object' && module.exports){
        module.exports = EventEmitter;
    }
    else {
        exports.EventEmitter = EventEmitter;
    }
}.call(this));

/*!
 * getStyleProperty v1.0.4
 * original by kangax
 * http://perfectionkills.com/feature-testing-css-properties/
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true */
/*global define: false, exports: false, module: false */

( function( window ) {



var prefixes = 'Webkit Moz ms Ms O'.split(' ');
var docElemStyle = document.documentElement.style;

function getStyleProperty( propName ) {
  if ( !propName ) {
    return;
  }

  // test standard property first
  if ( typeof docElemStyle[ propName ] === 'string' ) {
    return propName;
  }

  // capitalize
  propName = propName.charAt(0).toUpperCase() + propName.slice(1);

  // test vendor specific properties
  var prefixed;
  for ( var i=0, len = prefixes.length; i < len; i++ ) {
    prefixed = prefixes[i] + propName;
    if ( typeof docElemStyle[ prefixed ] === 'string' ) {
      return prefixed;
    }
  }
}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'get-style-property/get-style-property',[],function() {
    return getStyleProperty;
  });
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = getStyleProperty;
} else {
  // browser global
  window.getStyleProperty = getStyleProperty;
}

})( window );

/*!
 * getSize v1.2.0
 * measure size of elements
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, exports: false, require: false, module: false */

( function( window, undefined ) {



// -------------------------- helpers -------------------------- //

// get a number from a string, not a percentage
function getStyleSize( value ) {
  var num = parseFloat( value );
  // not a percent like '100%', and a number
  var isValid = value.indexOf('%') === -1 && !isNaN( num );
  return isValid && num;
}

var logError = typeof console === 'undefined' ? noop :
  function( message ) {
    console.error( message );
  };

// -------------------------- measurements -------------------------- //

var measurements = [
  'paddingLeft',
  'paddingRight',
  'paddingTop',
  'paddingBottom',
  'marginLeft',
  'marginRight',
  'marginTop',
  'marginBottom',
  'borderLeftWidth',
  'borderRightWidth',
  'borderTopWidth',
  'borderBottomWidth'
];

function getZeroSize() {
  var size = {
    width: 0,
    height: 0,
    innerWidth: 0,
    innerHeight: 0,
    outerWidth: 0,
    outerHeight: 0
  };
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    size[ measurement ] = 0;
  }
  return size;
}



function defineGetSize( getStyleProperty ) {

// -------------------------- setup -------------------------- //

var isSetup = false;

var getStyle, boxSizingProp, isBoxSizeOuter;

/**
 * setup vars and functions
 * do it on initial getSize(), rather than on script load
 * For Firefox bug https://bugzilla.mozilla.org/show_bug.cgi?id=548397
 */
function setup() {
  // setup once
  if ( isSetup ) {
    return;
  }
  isSetup = true;

  var getComputedStyle = window.getComputedStyle;
  getStyle = ( function() {
    var getStyleFn = getComputedStyle ?
      function( elem ) {
        return getComputedStyle( elem, null );
      } :
      function( elem ) {
        return elem.currentStyle;
      };

      return function getStyle( elem ) {
        var style = getStyleFn( elem );
        if ( !style ) {
          logError( 'Style returned ' + style +
            '. Are you running this code in a hidden iframe on Firefox? ' +
            'See http://bit.ly/getsizeiframe' );
        }
        return style;
      }
  })();

  // -------------------------- box sizing -------------------------- //

  boxSizingProp = getStyleProperty('boxSizing');

  /**
   * WebKit measures the outer-width on style.width on border-box elems
   * IE & Firefox measures the inner-width
   */
  if ( boxSizingProp ) {
    var div = document.createElement('div');
    div.style.width = '200px';
    div.style.padding = '1px 2px 3px 4px';
    div.style.borderStyle = 'solid';
    div.style.borderWidth = '1px 2px 3px 4px';
    div.style[ boxSizingProp ] = 'border-box';

    var body = document.body || document.documentElement;
    body.appendChild( div );
    var style = getStyle( div );

    isBoxSizeOuter = getStyleSize( style.width ) === 200;
    body.removeChild( div );
  }

}

// -------------------------- getSize -------------------------- //

function getSize( elem ) {
  setup();

  // use querySeletor if elem is string
  if ( typeof elem === 'string' ) {
    elem = document.querySelector( elem );
  }

  // do not proceed on non-objects
  if ( !elem || typeof elem !== 'object' || !elem.nodeType ) {
    return;
  }

  var style = getStyle( elem );

  // if hidden, everything is 0
  if ( style.display === 'none' ) {
    return getZeroSize();
  }

  var size = {};
  size.width = elem.offsetWidth;
  size.height = elem.offsetHeight;

  var isBorderBox = size.isBorderBox = !!( boxSizingProp &&
    style[ boxSizingProp ] && style[ boxSizingProp ] === 'border-box' );

  // get all measurements
  for ( var i=0, len = measurements.length; i < len; i++ ) {
    var measurement = measurements[i];
    var value = style[ measurement ];
    value = mungeNonPixel( elem, value );
    var num = parseFloat( value );
    // any 'auto', 'medium' value will be 0
    size[ measurement ] = !isNaN( num ) ? num : 0;
  }

  var paddingWidth = size.paddingLeft + size.paddingRight;
  var paddingHeight = size.paddingTop + size.paddingBottom;
  var marginWidth = size.marginLeft + size.marginRight;
  var marginHeight = size.marginTop + size.marginBottom;
  var borderWidth = size.borderLeftWidth + size.borderRightWidth;
  var borderHeight = size.borderTopWidth + size.borderBottomWidth;

  var isBorderBoxSizeOuter = isBorderBox && isBoxSizeOuter;

  // overwrite width and height if we can get it from style
  var styleWidth = getStyleSize( style.width );
  if ( styleWidth !== false ) {
    size.width = styleWidth +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingWidth + borderWidth );
  }

  var styleHeight = getStyleSize( style.height );
  if ( styleHeight !== false ) {
    size.height = styleHeight +
      // add padding and border unless it's already including it
      ( isBorderBoxSizeOuter ? 0 : paddingHeight + borderHeight );
  }

  size.innerWidth = size.width - ( paddingWidth + borderWidth );
  size.innerHeight = size.height - ( paddingHeight + borderHeight );

  size.outerWidth = size.width + marginWidth;
  size.outerHeight = size.height + marginHeight;

  return size;
}

// IE8 returns percent values, not pixels
// taken from jQuery's curCSS
function mungeNonPixel( elem, value ) {
  // IE8 and has percent value
  if ( getComputedStyle || value.indexOf('%') === -1 ) {
    return value;
  }
  var style = elem.style;
  // Remember the original values
  var left = style.left;
  var rs = elem.runtimeStyle;
  var rsLeft = rs && rs.left;

  // Put in the new values to get a computed value out
  if ( rsLeft ) {
    rs.left = elem.currentStyle.left;
  }
  style.left = value;
  value = style.pixelLeft;

  // Revert the changed values
  style.left = left;
  if ( rsLeft ) {
    rs.left = rsLeft;
  }

  return value;
}

return getSize;

}

// transport
if ( typeof define === 'function' && define.amd ) {
  // AMD for RequireJS
  define( 'get-size/get-size',[ 'get-style-property/get-style-property' ], defineGetSize );
} else if ( typeof exports === 'object' ) {
  // CommonJS for Component
  module.exports = defineGetSize( require('desandro-get-style-property') );
} else {
  // browser global
  window.getSize = defineGetSize( window.getStyleProperty );
}

})( window );

/**
 * matchesSelector v1.0.2
 * matchesSelector( element, '.selector' )
 * MIT license
 */

/*jshint browser: true, strict: true, undef: true, unused: true */
/*global define: false, module: false */

( function( ElemProto ) {

  

  var matchesMethod = ( function() {
    // check un-prefixed
    if ( ElemProto.matchesSelector ) {
      return 'matchesSelector';
    }
    // check vendor prefixes
    var prefixes = [ 'webkit', 'moz', 'ms', 'o' ];

    for ( var i=0, len = prefixes.length; i < len; i++ ) {
      var prefix = prefixes[i];
      var method = prefix + 'MatchesSelector';
      if ( ElemProto[ method ] ) {
        return method;
      }
    }
  })();

  // ----- match ----- //

  function match( elem, selector ) {
    return elem[ matchesMethod ]( selector );
  }

  // ----- appendToFragment ----- //

  function checkParent( elem ) {
    // not needed if already has parent
    if ( elem.parentNode ) {
      return;
    }
    var fragment = document.createDocumentFragment();
    fragment.appendChild( elem );
  }

  // ----- query ----- //

  // fall back to using QSA
  // thx @jonathantneal https://gist.github.com/3062955
  function query( elem, selector ) {
    // append to fragment if no parent
    checkParent( elem );

    // match elem with all selected elems of parent
    var elems = elem.parentNode.querySelectorAll( selector );
    for ( var i=0, len = elems.length; i < len; i++ ) {
      // return true if match
      if ( elems[i] === elem ) {
        return true;
      }
    }
    // otherwise return false
    return false;
  }

  // ----- matchChild ----- //

  function matchChild( elem, selector ) {
    checkParent( elem );
    return match( elem, selector );
  }

  // ----- matchesSelector ----- //

  var matchesSelector;

  if ( matchesMethod ) {
    // IE9 supports matchesSelector, but doesn't work on orphaned elems
    // check for that
    var div = document.createElement('div');
    var supportsOrphans = match( div, 'div' );
    matchesSelector = supportsOrphans ? match : matchChild;
  } else {
    matchesSelector = query;
  }

  // transport
  if ( typeof define === 'function' && define.amd ) {
    // AMD
    define( 'matches-selector/matches-selector',[],function() {
      return matchesSelector;
    });
  } else if ( typeof exports === 'object' ) {
    module.exports = matchesSelector;
  }
  else {
    // browser global
    window.matchesSelector = matchesSelector;
  }

})( Element.prototype );

/**
 * Outlayer Item
 */

( function( window ) {



// ----- get style ----- //

var getComputedStyle = window.getComputedStyle;
var getStyle = getComputedStyle ?
  function( elem ) {
    return getComputedStyle( elem, null );
  } :
  function( elem ) {
    return elem.currentStyle;
  };


// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

function isEmptyObj( obj ) {
  for ( var prop in obj ) {
    return false;
  }
  prop = null;
  return true;
}

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
function toDash( str ) {
  return str.replace( /([A-Z])/g, function( $1 ){
    return '-' + $1.toLowerCase();
  });
}

// -------------------------- Outlayer definition -------------------------- //

function outlayerItemDefinition( EventEmitter, getSize, getStyleProperty ) {

// -------------------------- CSS3 support -------------------------- //

var transitionProperty = getStyleProperty('transition');
var transformProperty = getStyleProperty('transform');
var supportsCSS3 = transitionProperty && transformProperty;
var is3d = !!getStyleProperty('perspective');

var transitionEndEvent = {
  WebkitTransition: 'webkitTransitionEnd',
  MozTransition: 'transitionend',
  OTransition: 'otransitionend',
  transition: 'transitionend'
}[ transitionProperty ];

// properties that could have vendor prefix
var prefixableProperties = [
  'transform',
  'transition',
  'transitionDuration',
  'transitionProperty'
];

// cache all vendor properties
var vendorProperties = ( function() {
  var cache = {};
  for ( var i=0, len = prefixableProperties.length; i < len; i++ ) {
    var prop = prefixableProperties[i];
    var supportedProp = getStyleProperty( prop );
    if ( supportedProp && supportedProp !== prop ) {
      cache[ prop ] = supportedProp;
    }
  }
  return cache;
})();

// -------------------------- Item -------------------------- //

function Item( element, layout ) {
  if ( !element ) {
    return;
  }

  this.element = element;
  // parent layout class, i.e. Masonry, Isotope, or Packery
  this.layout = layout;
  this.position = {
    x: 0,
    y: 0
  };

  this._create();
}

// inherit EventEmitter
extend( Item.prototype, EventEmitter.prototype );

Item.prototype._create = function() {
  // transition objects
  this._transn = {
    ingProperties: {},
    clean: {},
    onEnd: {}
  };

  this.css({
    position: 'absolute'
  });
};

// trigger specified handler for event type
Item.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

Item.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * apply CSS styles to element
 * @param {Object} style
 */
Item.prototype.css = function( style ) {
  var elemStyle = this.element.style;

  for ( var prop in style ) {
    // use vendor property if available
    var supportedProp = vendorProperties[ prop ] || prop;
    elemStyle[ supportedProp ] = style[ prop ];
  }
};

 // measure position, and sets it
Item.prototype.getPosition = function() {
  var style = getStyle( this.element );
  var layoutOptions = this.layout.options;
  var isOriginLeft = layoutOptions.isOriginLeft;
  var isOriginTop = layoutOptions.isOriginTop;
  var x = parseInt( style[ isOriginLeft ? 'left' : 'right' ], 10 );
  var y = parseInt( style[ isOriginTop ? 'top' : 'bottom' ], 10 );

  // clean up 'auto' or other non-integer values
  x = isNaN( x ) ? 0 : x;
  y = isNaN( y ) ? 0 : y;
  // remove padding from measurement
  var layoutSize = this.layout.size;
  x -= isOriginLeft ? layoutSize.paddingLeft : layoutSize.paddingRight;
  y -= isOriginTop ? layoutSize.paddingTop : layoutSize.paddingBottom;

  this.position.x = x;
  this.position.y = y;
};

// set settled position, apply padding
Item.prototype.layoutPosition = function() {
  var layoutSize = this.layout.size;
  var layoutOptions = this.layout.options;
  var style = {};

  if ( layoutOptions.isOriginLeft ) {
    style.left = ( this.position.x + layoutSize.paddingLeft ) + 'px';
    // reset other property
    style.right = '';
  } else {
    style.right = ( this.position.x + layoutSize.paddingRight ) + 'px';
    style.left = '';
  }

  if ( layoutOptions.isOriginTop ) {
    style.top = ( this.position.y + layoutSize.paddingTop ) + 'px';
    style.bottom = '';
  } else {
    style.bottom = ( this.position.y + layoutSize.paddingBottom ) + 'px';
    style.top = '';
  }

  this.css( style );
  this.emitEvent( 'layout', [ this ] );
};


// transform translate function
var translate = is3d ?
  function( x, y ) {
    return 'translate3d(' + x + 'px, ' + y + 'px, 0)';
  } :
  function( x, y ) {
    return 'translate(' + x + 'px, ' + y + 'px)';
  };


Item.prototype._transitionTo = function( x, y ) {
  this.getPosition();
  // get current x & y from top/left
  var curX = this.position.x;
  var curY = this.position.y;

  var compareX = parseInt( x, 10 );
  var compareY = parseInt( y, 10 );
  var didNotMove = compareX === this.position.x && compareY === this.position.y;

  // save end position
  this.setPosition( x, y );

  // if did not move and not transitioning, just go to layout
  if ( didNotMove && !this.isTransitioning ) {
    this.layoutPosition();
    return;
  }

  var transX = x - curX;
  var transY = y - curY;
  var transitionStyle = {};
  // flip cooridinates if origin on right or bottom
  var layoutOptions = this.layout.options;
  transX = layoutOptions.isOriginLeft ? transX : -transX;
  transY = layoutOptions.isOriginTop ? transY : -transY;
  transitionStyle.transform = translate( transX, transY );

  this.transition({
    to: transitionStyle,
    onTransitionEnd: {
      transform: this.layoutPosition
    },
    isCleaning: true
  });
};

// non transition + transform support
Item.prototype.goTo = function( x, y ) {
  this.setPosition( x, y );
  this.layoutPosition();
};

// use transition and transforms if supported
Item.prototype.moveTo = supportsCSS3 ?
  Item.prototype._transitionTo : Item.prototype.goTo;

Item.prototype.setPosition = function( x, y ) {
  this.position.x = parseInt( x, 10 );
  this.position.y = parseInt( y, 10 );
};

// ----- transition ----- //

/**
 * @param {Object} style - CSS
 * @param {Function} onTransitionEnd
 */

// non transition, just trigger callback
Item.prototype._nonTransition = function( args ) {
  this.css( args.to );
  if ( args.isCleaning ) {
    this._removeStyles( args.to );
  }
  for ( var prop in args.onTransitionEnd ) {
    args.onTransitionEnd[ prop ].call( this );
  }
};

/**
 * proper transition
 * @param {Object} args - arguments
 *   @param {Object} to - style to transition to
 *   @param {Object} from - style to start transition from
 *   @param {Boolean} isCleaning - removes transition styles after transition
 *   @param {Function} onTransitionEnd - callback
 */
Item.prototype._transition = function( args ) {
  // redirect to nonTransition if no transition duration
  if ( !parseFloat( this.layout.options.transitionDuration ) ) {
    this._nonTransition( args );
    return;
  }

  var _transition = this._transn;
  // keep track of onTransitionEnd callback by css property
  for ( var prop in args.onTransitionEnd ) {
    _transition.onEnd[ prop ] = args.onTransitionEnd[ prop ];
  }
  // keep track of properties that are transitioning
  for ( prop in args.to ) {
    _transition.ingProperties[ prop ] = true;
    // keep track of properties to clean up when transition is done
    if ( args.isCleaning ) {
      _transition.clean[ prop ] = true;
    }
  }

  // set from styles
  if ( args.from ) {
    this.css( args.from );
    // force redraw. http://blog.alexmaccaw.com/css-transitions
    var h = this.element.offsetHeight;
    // hack for JSHint to hush about unused var
    h = null;
  }
  // enable transition
  this.enableTransition( args.to );
  // set styles that are transitioning
  this.css( args.to );

  this.isTransitioning = true;

};

var itemTransitionProperties = transformProperty && ( toDash( transformProperty ) +
  ',opacity' );

Item.prototype.enableTransition = function(/* style */) {
  // only enable if not already transitioning
  // bug in IE10 were re-setting transition style will prevent
  // transitionend event from triggering
  if ( this.isTransitioning ) {
    return;
  }

  // make transition: foo, bar, baz from style object
  // TODO uncomment this bit when IE10 bug is resolved
  // var transitionValue = [];
  // for ( var prop in style ) {
  //   // dash-ify camelCased properties like WebkitTransition
  //   transitionValue.push( toDash( prop ) );
  // }
  // enable transition styles
  // HACK always enable transform,opacity for IE10
  this.css({
    transitionProperty: itemTransitionProperties,
    transitionDuration: this.layout.options.transitionDuration
  });
  // listen for transition end event
  this.element.addEventListener( transitionEndEvent, this, false );
};

Item.prototype.transition = Item.prototype[ transitionProperty ? '_transition' : '_nonTransition' ];

// ----- events ----- //

Item.prototype.onwebkitTransitionEnd = function( event ) {
  this.ontransitionend( event );
};

Item.prototype.onotransitionend = function( event ) {
  this.ontransitionend( event );
};

// properties that I munge to make my life easier
var dashedVendorProperties = {
  '-webkit-transform': 'transform',
  '-moz-transform': 'transform',
  '-o-transform': 'transform'
};

Item.prototype.ontransitionend = function( event ) {
  // disregard bubbled events from children
  if ( event.target !== this.element ) {
    return;
  }
  var _transition = this._transn;
  // get property name of transitioned property, convert to prefix-free
  var propertyName = dashedVendorProperties[ event.propertyName ] || event.propertyName;

  // remove property that has completed transitioning
  delete _transition.ingProperties[ propertyName ];
  // check if any properties are still transitioning
  if ( isEmptyObj( _transition.ingProperties ) ) {
    // all properties have completed transitioning
    this.disableTransition();
  }
  // clean style
  if ( propertyName in _transition.clean ) {
    // clean up style
    this.element.style[ event.propertyName ] = '';
    delete _transition.clean[ propertyName ];
  }
  // trigger onTransitionEnd callback
  if ( propertyName in _transition.onEnd ) {
    var onTransitionEnd = _transition.onEnd[ propertyName ];
    onTransitionEnd.call( this );
    delete _transition.onEnd[ propertyName ];
  }

  this.emitEvent( 'transitionEnd', [ this ] );
};

Item.prototype.disableTransition = function() {
  this.removeTransitionStyles();
  this.element.removeEventListener( transitionEndEvent, this, false );
  this.isTransitioning = false;
};

/**
 * removes style property from element
 * @param {Object} style
**/
Item.prototype._removeStyles = function( style ) {
  // clean up transition styles
  var cleanStyle = {};
  for ( var prop in style ) {
    cleanStyle[ prop ] = '';
  }
  this.css( cleanStyle );
};

var cleanTransitionStyle = {
  transitionProperty: '',
  transitionDuration: ''
};

Item.prototype.removeTransitionStyles = function() {
  // remove transition
  this.css( cleanTransitionStyle );
};

// ----- show/hide/remove ----- //

// remove element from DOM
Item.prototype.removeElem = function() {
  this.element.parentNode.removeChild( this.element );
  this.emitEvent( 'remove', [ this ] );
};

Item.prototype.remove = function() {
  // just remove element if no transition support or no transition
  if ( !transitionProperty || !parseFloat( this.layout.options.transitionDuration ) ) {
    this.removeElem();
    return;
  }

  // start transition
  var _this = this;
  this.on( 'transitionEnd', function() {
    _this.removeElem();
    return true; // bind once
  });
  this.hide();
};

Item.prototype.reveal = function() {
  delete this.isHidden;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;
  this.transition({
    from: options.hiddenStyle,
    to: options.visibleStyle,
    isCleaning: true
  });
};

Item.prototype.hide = function() {
  // set flag
  this.isHidden = true;
  // remove display: none
  this.css({ display: '' });

  var options = this.layout.options;
  this.transition({
    from: options.visibleStyle,
    to: options.hiddenStyle,
    // keep hidden stuff hidden
    isCleaning: true,
    onTransitionEnd: {
      opacity: function() {
        // check if still hidden
        // during transition, item may have been un-hidden
        if ( this.isHidden ) {
          this.css({ display: 'none' });
        }
      }
    }
  });
};

Item.prototype.destroy = function() {
  this.css({
    position: '',
    left: '',
    right: '',
    top: '',
    bottom: '',
    transition: '',
    transform: ''
  });
};

return Item;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'outlayer/item',[
      'eventEmitter/EventEmitter',
      'get-size/get-size',
      'get-style-property/get-style-property'
    ],
    outlayerItemDefinition );
} else if (typeof exports === 'object') {
  // CommonJS
  module.exports = outlayerItemDefinition(
    require('wolfy87-eventemitter'),
    require('get-size'),
    require('desandro-get-style-property')
  );
} else {
  // browser global
  window.Outlayer = {};
  window.Outlayer.Item = outlayerItemDefinition(
    window.EventEmitter,
    window.getSize,
    window.getStyleProperty
  );
}

})( window );

/*!
 * Outlayer v1.3.0
 * the brains and guts of a layout library
 * MIT license
 */

( function( window ) {



// ----- vars ----- //

var document = window.document;
var console = window.console;
var jQuery = window.jQuery;
var noop = function() {};

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}


var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

// http://stackoverflow.com/a/384380/182183
var isElement = ( typeof HTMLElement === 'function' || typeof HTMLElement === 'object' ) ?
  function isElementDOM2( obj ) {
    return obj instanceof HTMLElement;
  } :
  function isElementQuirky( obj ) {
    return obj && typeof obj === 'object' &&
      obj.nodeType === 1 && typeof obj.nodeName === 'string';
  };

// index of helper cause IE8
var indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };

function removeFrom( obj, ary ) {
  var index = indexOf( ary, obj );
  if ( index !== -1 ) {
    ary.splice( index, 1 );
  }
}

// http://jamesroberts.name/blog/2010/02/22/string-functions-for-javascript-trim-to-camel-case-to-dashed-and-to-underscore/
function toDashed( str ) {
  return str.replace( /(.)([A-Z])/g, function( match, $1, $2 ) {
    return $1 + '-' + $2;
  }).toLowerCase();
}


function outlayerDefinition( eventie, docReady, EventEmitter, getSize, matchesSelector, Item ) {

// -------------------------- Outlayer -------------------------- //

// globally unique identifiers
var GUID = 0;
// internal store of all Outlayer intances
var instances = {};


/**
 * @param {Element, String} element
 * @param {Object} options
 * @constructor
 */
function Outlayer( element, options ) {
  // use element as selector string
  if ( typeof element === 'string' ) {
    element = document.querySelector( element );
  }

  // bail out if not proper element
  if ( !element || !isElement( element ) ) {
    if ( console ) {
      console.error( 'Bad ' + this.constructor.namespace + ' element: ' + element );
    }
    return;
  }

  this.element = element;

  // options
  this.options = extend( {}, this.constructor.defaults );
  this.option( options );

  // add id for Outlayer.getFromElement
  var id = ++GUID;
  this.element.outlayerGUID = id; // expando
  instances[ id ] = this; // associate via id

  // kick it off
  this._create();

  if ( this.options.isInitLayout ) {
    this.layout();
  }
}

// settings are for internal use only
Outlayer.namespace = 'outlayer';
Outlayer.Item = Item;

// default options
Outlayer.defaults = {
  containerStyle: {
    position: 'relative'
  },
  isInitLayout: true,
  isOriginLeft: true,
  isOriginTop: true,
  isResizeBound: true,
  isResizingContainer: true,
  // item options
  transitionDuration: '0.4s',
  hiddenStyle: {
    opacity: 0,
    transform: 'scale(0.001)'
  },
  visibleStyle: {
    opacity: 1,
    transform: 'scale(1)'
  }
};

// inherit EventEmitter
extend( Outlayer.prototype, EventEmitter.prototype );

/**
 * set options
 * @param {Object} opts
 */
Outlayer.prototype.option = function( opts ) {
  extend( this.options, opts );
};

Outlayer.prototype._create = function() {
  // get items from children
  this.reloadItems();
  // elements that affect layout, but are not laid out
  this.stamps = [];
  this.stamp( this.options.stamp );
  // set container style
  extend( this.element.style, this.options.containerStyle );

  // bind resize method
  if ( this.options.isResizeBound ) {
    this.bindResize();
  }
};

// goes through all children again and gets bricks in proper order
Outlayer.prototype.reloadItems = function() {
  // collection of item elements
  this.items = this._itemize( this.element.children );
};


/**
 * turn elements into Outlayer.Items to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - collection of new Outlayer Items
 */
Outlayer.prototype._itemize = function( elems ) {

  var itemElems = this._filterFindItemElements( elems );
  var Item = this.constructor.Item;

  // create new Outlayer Items for collection
  var items = [];
  for ( var i=0, len = itemElems.length; i < len; i++ ) {
    var elem = itemElems[i];
    var item = new Item( elem, this );
    items.push( item );
  }

  return items;
};

/**
 * get item elements to be used in layout
 * @param {Array or NodeList or HTMLElement} elems
 * @returns {Array} items - item elements
 */
Outlayer.prototype._filterFindItemElements = function( elems ) {
  // make array of elems
  elems = makeArray( elems );
  var itemSelector = this.options.itemSelector;
  var itemElems = [];

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // check that elem is an actual element
    if ( !isElement( elem ) ) {
      continue;
    }
    // filter & find items if we have an item selector
    if ( itemSelector ) {
      // filter siblings
      if ( matchesSelector( elem, itemSelector ) ) {
        itemElems.push( elem );
      }
      // find children
      var childElems = elem.querySelectorAll( itemSelector );
      // concat childElems to filterFound array
      for ( var j=0, jLen = childElems.length; j < jLen; j++ ) {
        itemElems.push( childElems[j] );
      }
    } else {
      itemElems.push( elem );
    }
  }

  return itemElems;
};

/**
 * getter method for getting item elements
 * @returns {Array} elems - collection of item elements
 */
Outlayer.prototype.getItemElements = function() {
  var elems = [];
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    elems.push( this.items[i].element );
  }
  return elems;
};

// ----- init & layout ----- //

/**
 * lays out all items
 */
Outlayer.prototype.layout = function() {
  this._resetLayout();
  this._manageStamps();

  // don't animate first layout
  var isInstant = this.options.isLayoutInstant !== undefined ?
    this.options.isLayoutInstant : !this._isLayoutInited;
  this.layoutItems( this.items, isInstant );

  // flag for initalized
  this._isLayoutInited = true;
};

// _init is alias for layout
Outlayer.prototype._init = Outlayer.prototype.layout;

/**
 * logic before any new layout
 */
Outlayer.prototype._resetLayout = function() {
  this.getSize();
};


Outlayer.prototype.getSize = function() {
  this.size = getSize( this.element );
};

/**
 * get measurement from option, for columnWidth, rowHeight, gutter
 * if option is String -> get element from selector string, & get size of element
 * if option is Element -> get size of element
 * else use option as a number
 *
 * @param {String} measurement
 * @param {String} size - width or height
 * @private
 */
Outlayer.prototype._getMeasurement = function( measurement, size ) {
  var option = this.options[ measurement ];
  var elem;
  if ( !option ) {
    // default to 0
    this[ measurement ] = 0;
  } else {
    // use option as an element
    if ( typeof option === 'string' ) {
      elem = this.element.querySelector( option );
    } else if ( isElement( option ) ) {
      elem = option;
    }
    // use size of element, if element
    this[ measurement ] = elem ? getSize( elem )[ size ] : option;
  }
};

/**
 * layout a collection of item elements
 * @api public
 */
Outlayer.prototype.layoutItems = function( items, isInstant ) {
  items = this._getItemsForLayout( items );

  this._layoutItems( items, isInstant );

  this._postLayout();
};

/**
 * get the items to be laid out
 * you may want to skip over some items
 * @param {Array} items
 * @returns {Array} items
 */
Outlayer.prototype._getItemsForLayout = function( items ) {
  var layoutItems = [];
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    if ( !item.isIgnored ) {
      layoutItems.push( item );
    }
  }
  return layoutItems;
};

/**
 * layout items
 * @param {Array} items
 * @param {Boolean} isInstant
 */
Outlayer.prototype._layoutItems = function( items, isInstant ) {
  var _this = this;
  function onItemsLayout() {
    _this.emitEvent( 'layoutComplete', [ _this, items ] );
  }

  if ( !items || !items.length ) {
    // no items, emit event with empty array
    onItemsLayout();
    return;
  }

  // emit layoutComplete when done
  this._itemsOn( items, 'layout', onItemsLayout );

  var queue = [];

  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    // get x/y object from method
    var position = this._getItemLayoutPosition( item );
    // enqueue
    position.item = item;
    position.isInstant = isInstant || item.isLayoutInstant;
    queue.push( position );
  }

  this._processLayoutQueue( queue );
};

/**
 * get item layout position
 * @param {Outlayer.Item} item
 * @returns {Object} x and y position
 */
Outlayer.prototype._getItemLayoutPosition = function( /* item */ ) {
  return {
    x: 0,
    y: 0
  };
};

/**
 * iterate over array and position each item
 * Reason being - separating this logic prevents 'layout invalidation'
 * thx @paul_irish
 * @param {Array} queue
 */
Outlayer.prototype._processLayoutQueue = function( queue ) {
  for ( var i=0, len = queue.length; i < len; i++ ) {
    var obj = queue[i];
    this._positionItem( obj.item, obj.x, obj.y, obj.isInstant );
  }
};

/**
 * Sets position of item in DOM
 * @param {Outlayer.Item} item
 * @param {Number} x - horizontal position
 * @param {Number} y - vertical position
 * @param {Boolean} isInstant - disables transitions
 */
Outlayer.prototype._positionItem = function( item, x, y, isInstant ) {
  if ( isInstant ) {
    // if not transition, just set CSS
    item.goTo( x, y );
  } else {
    item.moveTo( x, y );
  }
};

/**
 * Any logic you want to do after each layout,
 * i.e. size the container
 */
Outlayer.prototype._postLayout = function() {
  this.resizeContainer();
};

Outlayer.prototype.resizeContainer = function() {
  if ( !this.options.isResizingContainer ) {
    return;
  }
  var size = this._getContainerSize();
  if ( size ) {
    this._setContainerMeasure( size.width, true );
    this._setContainerMeasure( size.height, false );
  }
};

/**
 * Sets width or height of container if returned
 * @returns {Object} size
 *   @param {Number} width
 *   @param {Number} height
 */
Outlayer.prototype._getContainerSize = noop;

/**
 * @param {Number} measure - size of width or height
 * @param {Boolean} isWidth
 */
Outlayer.prototype._setContainerMeasure = function( measure, isWidth ) {
  if ( measure === undefined ) {
    return;
  }

  var elemSize = this.size;
  // add padding and border width if border box
  if ( elemSize.isBorderBox ) {
    measure += isWidth ? elemSize.paddingLeft + elemSize.paddingRight +
      elemSize.borderLeftWidth + elemSize.borderRightWidth :
      elemSize.paddingBottom + elemSize.paddingTop +
      elemSize.borderTopWidth + elemSize.borderBottomWidth;
  }

  measure = Math.max( measure, 0 );
  this.element.style[ isWidth ? 'width' : 'height' ] = measure + 'px';
};

/**
 * trigger a callback for a collection of items events
 * @param {Array} items - Outlayer.Items
 * @param {String} eventName
 * @param {Function} callback
 */
Outlayer.prototype._itemsOn = function( items, eventName, callback ) {
  var doneCount = 0;
  var count = items.length;
  // event callback
  var _this = this;
  function tick() {
    doneCount++;
    if ( doneCount === count ) {
      callback.call( _this );
    }
    return true; // bind once
  }
  // bind callback
  for ( var i=0, len = items.length; i < len; i++ ) {
    var item = items[i];
    item.on( eventName, tick );
  }
};

// -------------------------- ignore & stamps -------------------------- //


/**
 * keep item in collection, but do not lay it out
 * ignored items do not get skipped in layout
 * @param {Element} elem
 */
Outlayer.prototype.ignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    item.isIgnored = true;
  }
};

/**
 * return item to layout collection
 * @param {Element} elem
 */
Outlayer.prototype.unignore = function( elem ) {
  var item = this.getItem( elem );
  if ( item ) {
    delete item.isIgnored;
  }
};

/**
 * adds elements to stamps
 * @param {NodeList, Array, Element, or String} elems
 */
Outlayer.prototype.stamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ) {
    return;
  }

  this.stamps = this.stamps.concat( elems );
  // ignore
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    this.ignore( elem );
  }
};

/**
 * removes elements to stamps
 * @param {NodeList, Array, or Element} elems
 */
Outlayer.prototype.unstamp = function( elems ) {
  elems = this._find( elems );
  if ( !elems ){
    return;
  }

  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    // filter out removed stamp elements
    removeFrom( elem, this.stamps );
    this.unignore( elem );
  }

};

/**
 * finds child elements
 * @param {NodeList, Array, Element, or String} elems
 * @returns {Array} elems
 */
Outlayer.prototype._find = function( elems ) {
  if ( !elems ) {
    return;
  }
  // if string, use argument as selector string
  if ( typeof elems === 'string' ) {
    elems = this.element.querySelectorAll( elems );
  }
  elems = makeArray( elems );
  return elems;
};

Outlayer.prototype._manageStamps = function() {
  if ( !this.stamps || !this.stamps.length ) {
    return;
  }

  this._getBoundingRect();

  for ( var i=0, len = this.stamps.length; i < len; i++ ) {
    var stamp = this.stamps[i];
    this._manageStamp( stamp );
  }
};

// update boundingLeft / Top
Outlayer.prototype._getBoundingRect = function() {
  // get bounding rect for container element
  var boundingRect = this.element.getBoundingClientRect();
  var size = this.size;
  this._boundingRect = {
    left: boundingRect.left + size.paddingLeft + size.borderLeftWidth,
    top: boundingRect.top + size.paddingTop + size.borderTopWidth,
    right: boundingRect.right - ( size.paddingRight + size.borderRightWidth ),
    bottom: boundingRect.bottom - ( size.paddingBottom + size.borderBottomWidth )
  };
};

/**
 * @param {Element} stamp
**/
Outlayer.prototype._manageStamp = noop;

/**
 * get x/y position of element relative to container element
 * @param {Element} elem
 * @returns {Object} offset - has left, top, right, bottom
 */
Outlayer.prototype._getElementOffset = function( elem ) {
  var boundingRect = elem.getBoundingClientRect();
  var thisRect = this._boundingRect;
  var size = getSize( elem );
  var offset = {
    left: boundingRect.left - thisRect.left - size.marginLeft,
    top: boundingRect.top - thisRect.top - size.marginTop,
    right: thisRect.right - boundingRect.right - size.marginRight,
    bottom: thisRect.bottom - boundingRect.bottom - size.marginBottom
  };
  return offset;
};

// -------------------------- resize -------------------------- //

// enable event handlers for listeners
// i.e. resize -> onresize
Outlayer.prototype.handleEvent = function( event ) {
  var method = 'on' + event.type;
  if ( this[ method ] ) {
    this[ method ]( event );
  }
};

/**
 * Bind layout to window resizing
 */
Outlayer.prototype.bindResize = function() {
  // bind just one listener
  if ( this.isResizeBound ) {
    return;
  }
  eventie.bind( window, 'resize', this );
  this.isResizeBound = true;
};

/**
 * Unbind layout to window resizing
 */
Outlayer.prototype.unbindResize = function() {
  if ( this.isResizeBound ) {
    eventie.unbind( window, 'resize', this );
  }
  this.isResizeBound = false;
};

// original debounce by John Hann
// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/

// this fires every resize
Outlayer.prototype.onresize = function() {
  if ( this.resizeTimeout ) {
    clearTimeout( this.resizeTimeout );
  }

  var _this = this;
  function delayed() {
    _this.resize();
    delete _this.resizeTimeout;
  }

  this.resizeTimeout = setTimeout( delayed, 100 );
};

// debounced, layout on resize
Outlayer.prototype.resize = function() {
  // don't trigger if size did not change
  // or if resize was unbound. See #9
  if ( !this.isResizeBound || !this.needsResizeLayout() ) {
    return;
  }

  this.layout();
};

/**
 * check if layout is needed post layout
 * @returns Boolean
 */
Outlayer.prototype.needsResizeLayout = function() {
  var size = getSize( this.element );
  // check that this.size and size are there
  // IE8 triggers resize on body size change, so they might not be
  var hasSizes = this.size && size;
  return hasSizes && size.innerWidth !== this.size.innerWidth;
};

// -------------------------- methods -------------------------- //

/**
 * add items to Outlayer instance
 * @param {Array or NodeList or Element} elems
 * @returns {Array} items - Outlayer.Items
**/
Outlayer.prototype.addItems = function( elems ) {
  var items = this._itemize( elems );
  // add items to collection
  if ( items.length ) {
    this.items = this.items.concat( items );
  }
  return items;
};

/**
 * Layout newly-appended item elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.appended = function( elems ) {
  var items = this.addItems( elems );
  if ( !items.length ) {
    return;
  }
  // layout and reveal just the new items
  this.layoutItems( items, true );
  this.reveal( items );
};

/**
 * Layout prepended elements
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.prepended = function( elems ) {
  var items = this._itemize( elems );
  if ( !items.length ) {
    return;
  }
  // add items to beginning of collection
  var previousItems = this.items.slice(0);
  this.items = items.concat( previousItems );
  // start new layout
  this._resetLayout();
  this._manageStamps();
  // layout new stuff without transition
  this.layoutItems( items, true );
  this.reveal( items );
  // layout previous items
  this.layoutItems( previousItems );
};

/**
 * reveal a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.reveal = function( items ) {
  var len = items && items.length;
  if ( !len ) {
    return;
  }
  for ( var i=0; i < len; i++ ) {
    var item = items[i];
    item.reveal();
  }
};

/**
 * hide a collection of items
 * @param {Array of Outlayer.Items} items
 */
Outlayer.prototype.hide = function( items ) {
  var len = items && items.length;
  if ( !len ) {
    return;
  }
  for ( var i=0; i < len; i++ ) {
    var item = items[i];
    item.hide();
  }
};

/**
 * get Outlayer.Item, given an Element
 * @param {Element} elem
 * @param {Function} callback
 * @returns {Outlayer.Item} item
 */
Outlayer.prototype.getItem = function( elem ) {
  // loop through items to get the one that matches
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    if ( item.element === elem ) {
      // return item
      return item;
    }
  }
};

/**
 * get collection of Outlayer.Items, given Elements
 * @param {Array} elems
 * @returns {Array} items - Outlayer.Items
 */
Outlayer.prototype.getItems = function( elems ) {
  if ( !elems || !elems.length ) {
    return;
  }
  var items = [];
  for ( var i=0, len = elems.length; i < len; i++ ) {
    var elem = elems[i];
    var item = this.getItem( elem );
    if ( item ) {
      items.push( item );
    }
  }

  return items;
};

/**
 * remove element(s) from instance and DOM
 * @param {Array or NodeList or Element} elems
 */
Outlayer.prototype.remove = function( elems ) {
  elems = makeArray( elems );

  var removeItems = this.getItems( elems );
  // bail if no items to remove
  if ( !removeItems || !removeItems.length ) {
    return;
  }

  this._itemsOn( removeItems, 'remove', function() {
    this.emitEvent( 'removeComplete', [ this, removeItems ] );
  });

  for ( var i=0, len = removeItems.length; i < len; i++ ) {
    var item = removeItems[i];
    item.remove();
    // remove item from collection
    removeFrom( item, this.items );
  }
};

// ----- destroy ----- //

// remove and disable Outlayer instance
Outlayer.prototype.destroy = function() {
  // clean up dynamic styles
  var style = this.element.style;
  style.height = '';
  style.position = '';
  style.width = '';
  // destroy items
  for ( var i=0, len = this.items.length; i < len; i++ ) {
    var item = this.items[i];
    item.destroy();
  }

  this.unbindResize();

  var id = this.element.outlayerGUID;
  delete instances[ id ]; // remove reference to instance by id
  delete this.element.outlayerGUID;
  // remove data for jQuery
  if ( jQuery ) {
    jQuery.removeData( this.element, this.constructor.namespace );
  }

};

// -------------------------- data -------------------------- //

/**
 * get Outlayer instance from element
 * @param {Element} elem
 * @returns {Outlayer}
 */
Outlayer.data = function( elem ) {
  var id = elem && elem.outlayerGUID;
  return id && instances[ id ];
};


// -------------------------- create Outlayer class -------------------------- //

/**
 * create a layout class
 * @param {String} namespace
 */
Outlayer.create = function( namespace, options ) {
  // sub-class Outlayer
  function Layout() {
    Outlayer.apply( this, arguments );
  }
  // inherit Outlayer prototype, use Object.create if there
  if ( Object.create ) {
    Layout.prototype = Object.create( Outlayer.prototype );
  } else {
    extend( Layout.prototype, Outlayer.prototype );
  }
  // set contructor, used for namespace and Item
  Layout.prototype.constructor = Layout;

  Layout.defaults = extend( {}, Outlayer.defaults );
  // apply new options
  extend( Layout.defaults, options );
  // keep prototype.settings for backwards compatibility (Packery v1.2.0)
  Layout.prototype.settings = {};

  Layout.namespace = namespace;

  Layout.data = Outlayer.data;

  // sub-class Item
  Layout.Item = function LayoutItem() {
    Item.apply( this, arguments );
  };

  Layout.Item.prototype = new Item();

  // -------------------------- declarative -------------------------- //

  /**
   * allow user to initialize Outlayer via .js-namespace class
   * options are parsed from data-namespace-option attribute
   */
  docReady( function() {
    var dashedNamespace = toDashed( namespace );
    var elems = document.querySelectorAll( '.js-' + dashedNamespace );
    var dataAttr = 'data-' + dashedNamespace + '-options';

    for ( var i=0, len = elems.length; i < len; i++ ) {
      var elem = elems[i];
      var attr = elem.getAttribute( dataAttr );
      var options;
      try {
        options = attr && JSON.parse( attr );
      } catch ( error ) {
        // log error, do not initialize
        if ( console ) {
          console.error( 'Error parsing ' + dataAttr + ' on ' +
            elem.nodeName.toLowerCase() + ( elem.id ? '#' + elem.id : '' ) + ': ' +
            error );
        }
        continue;
      }
      // initialize
      var instance = new Layout( elem, options );
      // make available via $().data('layoutname')
      if ( jQuery ) {
        jQuery.data( elem, namespace, instance );
      }
    }
  });

  // -------------------------- jQuery bridge -------------------------- //

  // make into jQuery plugin
  if ( jQuery && jQuery.bridget ) {
    jQuery.bridget( namespace, Layout );
  }

  return Layout;
};

// ----- fin ----- //

// back in global
Outlayer.Item = Item;

return Outlayer;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'outlayer/outlayer',[
      'eventie/eventie',
      'doc-ready/doc-ready',
      'eventEmitter/EventEmitter',
      'get-size/get-size',
      'matches-selector/matches-selector',
      './item'
    ],
    outlayerDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = outlayerDefinition(
    require('eventie'),
    require('doc-ready'),
    require('wolfy87-eventemitter'),
    require('get-size'),
    require('desandro-matches-selector'),
    require('./item')
  );
} else {
  // browser global
  window.Outlayer = outlayerDefinition(
    window.eventie,
    window.docReady,
    window.EventEmitter,
    window.getSize,
    window.matchesSelector,
    window.Outlayer.Item
  );
}

})( window );

/**
 * Isotope Item
**/

( function( window ) {



// -------------------------- Item -------------------------- //

function itemDefinition( Outlayer ) {

// sub-class Outlayer Item
function Item() {
  Outlayer.Item.apply( this, arguments );
}

Item.prototype = new Outlayer.Item();

Item.prototype._create = function() {
  // assign id, used for original-order sorting
  this.id = this.layout.itemGUID++;
  Outlayer.Item.prototype._create.call( this );
  this.sortData = {};
};

Item.prototype.updateSortData = function() {
  if ( this.isIgnored ) {
    return;
  }
  // default sorters
  this.sortData.id = this.id;
  // for backward compatibility
  this.sortData['original-order'] = this.id;
  this.sortData.random = Math.random();
  // go thru getSortData obj and apply the sorters
  var getSortData = this.layout.options.getSortData;
  var sorters = this.layout._sorters;
  for ( var key in getSortData ) {
    var sorter = sorters[ key ];
    this.sortData[ key ] = sorter( this.element, this );
  }
};

var _destroy = Item.prototype.destroy;
Item.prototype.destroy = function() {
  // call super
  _destroy.apply( this, arguments );
  // reset display, #741
  this.css({
    display: ''
  });
};

return Item;

}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'isotope/js/item',[
      'outlayer/outlayer'
    ],
    itemDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = itemDefinition(
    require('outlayer')
  );
} else {
  // browser global
  window.Isotope = window.Isotope || {};
  window.Isotope.Item = itemDefinition(
    window.Outlayer
  );
}

})( window );

( function( window ) {



// --------------------------  -------------------------- //

function layoutModeDefinition( getSize, Outlayer ) {

  // layout mode class
  function LayoutMode( isotope ) {
    this.isotope = isotope;
    // link properties
    if ( isotope ) {
      this.options = isotope.options[ this.namespace ];
      this.element = isotope.element;
      this.items = isotope.filteredItems;
      this.size = isotope.size;
    }
  }

  /**
   * some methods should just defer to default Outlayer method
   * and reference the Isotope instance as `this`
  **/
  ( function() {
    var facadeMethods = [
      '_resetLayout',
      '_getItemLayoutPosition',
      '_manageStamp',
      '_getContainerSize',
      '_getElementOffset',
      'needsResizeLayout'
    ];

    for ( var i=0, len = facadeMethods.length; i < len; i++ ) {
      var methodName = facadeMethods[i];
      LayoutMode.prototype[ methodName ] = getOutlayerMethod( methodName );
    }

    function getOutlayerMethod( methodName ) {
      return function() {
        return Outlayer.prototype[ methodName ].apply( this.isotope, arguments );
      };
    }
  })();

  // -----  ----- //

  // for horizontal layout modes, check vertical size
  LayoutMode.prototype.needsVerticalResizeLayout = function() {
    // don't trigger if size did not change
    var size = getSize( this.isotope.element );
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var hasSizes = this.isotope.size && size;
    return hasSizes && size.innerHeight !== this.isotope.size.innerHeight;
  };

  // ----- measurements ----- //

  LayoutMode.prototype._getMeasurement = function() {
    this.isotope._getMeasurement.apply( this, arguments );
  };

  LayoutMode.prototype.getColumnWidth = function() {
    this.getSegmentSize( 'column', 'Width' );
  };

  LayoutMode.prototype.getRowHeight = function() {
    this.getSegmentSize( 'row', 'Height' );
  };

  /**
   * get columnWidth or rowHeight
   * segment: 'column' or 'row'
   * size 'Width' or 'Height'
  **/
  LayoutMode.prototype.getSegmentSize = function( segment, size ) {
    var segmentName = segment + size;
    var outerSize = 'outer' + size;
    // columnWidth / outerWidth // rowHeight / outerHeight
    this._getMeasurement( segmentName, outerSize );
    // got rowHeight or columnWidth, we can chill
    if ( this[ segmentName ] ) {
      return;
    }
    // fall back to item of first element
    var firstItemSize = this.getFirstItemSize();
    this[ segmentName ] = firstItemSize && firstItemSize[ outerSize ] ||
      // or size of container
      this.isotope.size[ 'inner' + size ];
  };

  LayoutMode.prototype.getFirstItemSize = function() {
    var firstItem = this.isotope.filteredItems[0];
    return firstItem && firstItem.element && getSize( firstItem.element );
  };

  // ----- methods that should reference isotope ----- //

  LayoutMode.prototype.layout = function() {
    this.isotope.layout.apply( this.isotope, arguments );
  };

  LayoutMode.prototype.getSize = function() {
    this.isotope.getSize();
    this.size = this.isotope.size;
  };

  // -------------------------- create -------------------------- //

  LayoutMode.modes = {};

  LayoutMode.create = function( namespace, options ) {

    function Mode() {
      LayoutMode.apply( this, arguments );
    }

    Mode.prototype = new LayoutMode();

    // default options
    if ( options ) {
      Mode.options = options;
    }

    Mode.prototype.namespace = namespace;
    // register in Isotope
    LayoutMode.modes[ namespace ] = Mode;

    return Mode;
  };


  return LayoutMode;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'isotope/js/layout-mode',[
      'get-size/get-size',
      'outlayer/outlayer'
    ],
    layoutModeDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = layoutModeDefinition(
    require('get-size'),
    require('outlayer')
  );
} else {
  // browser global
  window.Isotope = window.Isotope || {};
  window.Isotope.LayoutMode = layoutModeDefinition(
    window.getSize,
    window.Outlayer
  );
}


})( window );

/*!
 * Masonry v3.2.1
 * Cascading grid layout library
 * http://masonry.desandro.com
 * MIT License
 * by David DeSandro
 */

( function( window ) {



// -------------------------- helpers -------------------------- //

var indexOf = Array.prototype.indexOf ?
  function( items, value ) {
    return items.indexOf( value );
  } :
  function ( items, value ) {
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      if ( item === value ) {
        return i;
      }
    }
    return -1;
  };

// -------------------------- masonryDefinition -------------------------- //

// used for AMD definition and requires
function masonryDefinition( Outlayer, getSize ) {
  // create an Outlayer layout class
  var Masonry = Outlayer.create('masonry');

  Masonry.prototype._resetLayout = function() {
    this.getSize();
    this._getMeasurement( 'columnWidth', 'outerWidth' );
    this._getMeasurement( 'gutter', 'outerWidth' );
    this.measureColumns();

    // reset column Y
    var i = this.cols;
    this.colYs = [];
    while (i--) {
      this.colYs.push( 0 );
    }

    this.maxY = 0;
  };

  Masonry.prototype.measureColumns = function() {
    this.getContainerWidth();
    // if columnWidth is 0, default to outerWidth of first item
    if ( !this.columnWidth ) {
      var firstItem = this.items[0];
      var firstItemElem = firstItem && firstItem.element;
      // columnWidth fall back to item of first element
      this.columnWidth = firstItemElem && getSize( firstItemElem ).outerWidth ||
        // if first elem has no width, default to size of container
        this.containerWidth;
    }

    this.columnWidth += this.gutter;

    this.cols = Math.floor( ( this.containerWidth + this.gutter ) / this.columnWidth );
    this.cols = Math.max( this.cols, 1 );
  };

  Masonry.prototype.getContainerWidth = function() {
    // container is parent if fit width
    var container = this.options.isFitWidth ? this.element.parentNode : this.element;
    // check that this.size and size are there
    // IE8 triggers resize on body size change, so they might not be
    var size = getSize( container );
    this.containerWidth = size && size.innerWidth;
  };

  Masonry.prototype._getItemLayoutPosition = function( item ) {
    item.getSize();
    // how many columns does this brick span
    var remainder = item.size.outerWidth % this.columnWidth;
    var mathMethod = remainder && remainder < 1 ? 'round' : 'ceil';
    // round if off by 1 pixel, otherwise use ceil
    var colSpan = Math[ mathMethod ]( item.size.outerWidth / this.columnWidth );
    colSpan = Math.min( colSpan, this.cols );

    var colGroup = this._getColGroup( colSpan );
    // get the minimum Y value from the columns
    var minimumY = Math.min.apply( Math, colGroup );
    var shortColIndex = indexOf( colGroup, minimumY );

    // position the brick
    var position = {
      x: this.columnWidth * shortColIndex,
      y: minimumY
    };

    // apply setHeight to necessary columns
    var setHeight = minimumY + item.size.outerHeight;
    var setSpan = this.cols + 1 - colGroup.length;
    for ( var i = 0; i < setSpan; i++ ) {
      this.colYs[ shortColIndex + i ] = setHeight;
    }

    return position;
  };

  /**
   * @param {Number} colSpan - number of columns the element spans
   * @returns {Array} colGroup
   */
  Masonry.prototype._getColGroup = function( colSpan ) {
    if ( colSpan < 2 ) {
      // if brick spans only one column, use all the column Ys
      return this.colYs;
    }

    var colGroup = [];
    // how many different places could this brick fit horizontally
    var groupCount = this.cols + 1 - colSpan;
    // for each group potential horizontal position
    for ( var i = 0; i < groupCount; i++ ) {
      // make an array of colY values for that one group
      var groupColYs = this.colYs.slice( i, i + colSpan );
      // and get the max value of the array
      colGroup[i] = Math.max.apply( Math, groupColYs );
    }
    return colGroup;
  };

  Masonry.prototype._manageStamp = function( stamp ) {
    var stampSize = getSize( stamp );
    var offset = this._getElementOffset( stamp );
    // get the columns that this stamp affects
    var firstX = this.options.isOriginLeft ? offset.left : offset.right;
    var lastX = firstX + stampSize.outerWidth;
    var firstCol = Math.floor( firstX / this.columnWidth );
    firstCol = Math.max( 0, firstCol );
    var lastCol = Math.floor( lastX / this.columnWidth );
    // lastCol should not go over if multiple of columnWidth #425
    lastCol -= lastX % this.columnWidth ? 0 : 1;
    lastCol = Math.min( this.cols - 1, lastCol );
    // set colYs to bottom of the stamp
    var stampMaxY = ( this.options.isOriginTop ? offset.top : offset.bottom ) +
      stampSize.outerHeight;
    for ( var i = firstCol; i <= lastCol; i++ ) {
      this.colYs[i] = Math.max( stampMaxY, this.colYs[i] );
    }
  };

  Masonry.prototype._getContainerSize = function() {
    this.maxY = Math.max.apply( Math, this.colYs );
    var size = {
      height: this.maxY
    };

    if ( this.options.isFitWidth ) {
      size.width = this._getContainerFitWidth();
    }

    return size;
  };

  Masonry.prototype._getContainerFitWidth = function() {
    var unusedCols = 0;
    // count unused columns
    var i = this.cols;
    while ( --i ) {
      if ( this.colYs[i] !== 0 ) {
        break;
      }
      unusedCols++;
    }
    // fit container to columns that have been used
    return ( this.cols - unusedCols ) * this.columnWidth - this.gutter;
  };

  Masonry.prototype.needsResizeLayout = function() {
    var previousWidth = this.containerWidth;
    this.getContainerWidth();
    return previousWidth !== this.containerWidth;
  };

  return Masonry;
}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'masonry/masonry',[
      'outlayer/outlayer',
      'get-size/get-size'
    ],
    masonryDefinition );
} else if (typeof exports === 'object') {
  module.exports = masonryDefinition(
    require('outlayer'),
    require('get-size')
  );
} else {
  // browser global
  window.Masonry = masonryDefinition(
    window.Outlayer,
    window.getSize
  );
}

})( window );

/*!
 * Masonry layout mode
 * sub-classes Masonry
 * http://masonry.desandro.com
 */

( function( window ) {



// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

// -------------------------- masonryDefinition -------------------------- //

// used for AMD definition and requires
function masonryDefinition( LayoutMode, Masonry ) {
  // create an Outlayer layout class
  var MasonryMode = LayoutMode.create('masonry');

  // save on to these methods
  var _getElementOffset = MasonryMode.prototype._getElementOffset;
  var layout = MasonryMode.prototype.layout;
  var _getMeasurement = MasonryMode.prototype._getMeasurement;

  // sub-class Masonry
  extend( MasonryMode.prototype, Masonry.prototype );

  // set back, as it was overwritten by Masonry
  MasonryMode.prototype._getElementOffset = _getElementOffset;
  MasonryMode.prototype.layout = layout;
  MasonryMode.prototype._getMeasurement = _getMeasurement;

  var measureColumns = MasonryMode.prototype.measureColumns;
  MasonryMode.prototype.measureColumns = function() {
    // set items, used if measuring first item
    this.items = this.isotope.filteredItems;
    measureColumns.call( this );
  };

  // HACK copy over isOriginLeft/Top options
  var _manageStamp = MasonryMode.prototype._manageStamp;
  MasonryMode.prototype._manageStamp = function() {
    this.options.isOriginLeft = this.isotope.options.isOriginLeft;
    this.options.isOriginTop = this.isotope.options.isOriginTop;
    _manageStamp.apply( this, arguments );
  };

  return MasonryMode;
}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'isotope/js/layout-modes/masonry',[
      '../layout-mode',
      'masonry/masonry'
    ],
    masonryDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = masonryDefinition(
    require('../layout-mode'),
    require('masonry-layout')
  );
} else {
  // browser global
  masonryDefinition(
    window.Isotope.LayoutMode,
    window.Masonry
  );
}

})( window );

( function( window ) {



function fitRowsDefinition( LayoutMode ) {

var FitRows = LayoutMode.create('fitRows');

FitRows.prototype._resetLayout = function() {
  this.x = 0;
  this.y = 0;
  this.maxY = 0;
  this._getMeasurement( 'gutter', 'outerWidth' );
};

FitRows.prototype._getItemLayoutPosition = function( item ) {
  item.getSize();

  var itemWidth = item.size.outerWidth + this.gutter;
  // if this element cannot fit in the current row
  var containerWidth = this.isotope.size.innerWidth + this.gutter;
  if ( this.x !== 0 && itemWidth + this.x > containerWidth ) {
    this.x = 0;
    this.y = this.maxY;
  }

  var position = {
    x: this.x,
    y: this.y
  };

  this.maxY = Math.max( this.maxY, this.y + item.size.outerHeight );
  this.x += itemWidth;

  return position;
};

FitRows.prototype._getContainerSize = function() {
  return { height: this.maxY };
};

return FitRows;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'isotope/js/layout-modes/fit-rows',[
      '../layout-mode'
    ],
    fitRowsDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = fitRowsDefinition(
    require('../layout-mode')
  );
} else {
  // browser global
  fitRowsDefinition(
    window.Isotope.LayoutMode
  );
}

})( window );

( function( window ) {



function verticalDefinition( LayoutMode ) {

var Vertical = LayoutMode.create( 'vertical', {
  horizontalAlignment: 0
});

Vertical.prototype._resetLayout = function() {
  this.y = 0;
};

Vertical.prototype._getItemLayoutPosition = function( item ) {
  item.getSize();
  var x = ( this.isotope.size.innerWidth - item.size.outerWidth ) *
    this.options.horizontalAlignment;
  var y = this.y;
  this.y += item.size.outerHeight;
  return { x: x, y: y };
};

Vertical.prototype._getContainerSize = function() {
  return { height: this.y };
};

return Vertical;

}

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( 'isotope/js/layout-modes/vertical',[
      '../layout-mode'
    ],
    verticalDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = verticalDefinition(
    require('../layout-mode')
  );
} else {
  // browser global
  verticalDefinition(
    window.Isotope.LayoutMode
  );
}

})( window );

/*!
 * Isotope v2.1.0
 * Filter & sort magical layouts
 * http://isotope.metafizzy.co
 */

( function( window ) {



// -------------------------- vars -------------------------- //

var jQuery = window.jQuery;

// -------------------------- helpers -------------------------- //

// extend objects
function extend( a, b ) {
  for ( var prop in b ) {
    a[ prop ] = b[ prop ];
  }
  return a;
}

var trim = String.prototype.trim ?
  function( str ) {
    return str.trim();
  } :
  function( str ) {
    return str.replace( /^\s+|\s+$/g, '' );
  };

var docElem = document.documentElement;

var getText = docElem.textContent ?
  function( elem ) {
    return elem.textContent;
  } :
  function( elem ) {
    return elem.innerText;
  };

var objToString = Object.prototype.toString;
function isArray( obj ) {
  return objToString.call( obj ) === '[object Array]';
}

// index of helper cause IE8
var indexOf = Array.prototype.indexOf ? function( ary, obj ) {
    return ary.indexOf( obj );
  } : function( ary, obj ) {
    for ( var i=0, len = ary.length; i < len; i++ ) {
      if ( ary[i] === obj ) {
        return i;
      }
    }
    return -1;
  };

// turn element or nodeList into an array
function makeArray( obj ) {
  var ary = [];
  if ( isArray( obj ) ) {
    // use object if already an array
    ary = obj;
  } else if ( obj && typeof obj.length === 'number' ) {
    // convert nodeList to array
    for ( var i=0, len = obj.length; i < len; i++ ) {
      ary.push( obj[i] );
    }
  } else {
    // array of single index
    ary.push( obj );
  }
  return ary;
}

function removeFrom( obj, ary ) {
  var index = indexOf( ary, obj );
  if ( index !== -1 ) {
    ary.splice( index, 1 );
  }
}

// -------------------------- isotopeDefinition -------------------------- //

// used for AMD definition and requires
function isotopeDefinition( Outlayer, getSize, matchesSelector, Item, LayoutMode ) {
  // create an Outlayer layout class
  var Isotope = Outlayer.create( 'isotope', {
    layoutMode: "masonry",
    isJQueryFiltering: true,
    sortAscending: true
  });

  Isotope.Item = Item;
  Isotope.LayoutMode = LayoutMode;

  Isotope.prototype._create = function() {
    this.itemGUID = 0;
    // functions that sort items
    this._sorters = {};
    this._getSorters();
    // call super
    Outlayer.prototype._create.call( this );

    // create layout modes
    this.modes = {};
    // start filteredItems with all items
    this.filteredItems = this.items;
    // keep of track of sortBys
    this.sortHistory = [ 'original-order' ];
    // create from registered layout modes
    for ( var name in LayoutMode.modes ) {
      this._initLayoutMode( name );
    }
  };

  Isotope.prototype.reloadItems = function() {
    // reset item ID counter
    this.itemGUID = 0;
    // call super
    Outlayer.prototype.reloadItems.call( this );
  };

  Isotope.prototype._itemize = function() {
    var items = Outlayer.prototype._itemize.apply( this, arguments );
    // assign ID for original-order
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      item.id = this.itemGUID++;
    }
    this._updateItemsSortData( items );
    return items;
  };


  // -------------------------- layout -------------------------- //

  Isotope.prototype._initLayoutMode = function( name ) {
    var Mode = LayoutMode.modes[ name ];
    // set mode options
    // HACK extend initial options, back-fill in default options
    var initialOpts = this.options[ name ] || {};
    this.options[ name ] = Mode.options ?
      extend( Mode.options, initialOpts ) : initialOpts;
    // init layout mode instance
    this.modes[ name ] = new Mode( this );
  };


  Isotope.prototype.layout = function() {
    // if first time doing layout, do all magic
    if ( !this._isLayoutInited && this.options.isInitLayout ) {
      this.arrange();
      return;
    }
    this._layout();
  };

  // private method to be used in layout() & magic()
  Isotope.prototype._layout = function() {
    // don't animate first layout
    var isInstant = this._getIsInstant();
    // layout flow
    this._resetLayout();
    this._manageStamps();
    this.layoutItems( this.filteredItems, isInstant );

    // flag for initalized
    this._isLayoutInited = true;
  };

  // filter + sort + layout
  Isotope.prototype.arrange = function( opts ) {
    // set any options pass
    this.option( opts );
    this._getIsInstant();
    // filter, sort, and layout
    this.filteredItems = this._filter( this.items );
    this._sort();
    this._layout();
  };
  // alias to _init for main plugin method
  Isotope.prototype._init = Isotope.prototype.arrange;

  // HACK
  // Don't animate/transition first layout
  // Or don't animate/transition other layouts
  Isotope.prototype._getIsInstant = function() {
    var isInstant = this.options.isLayoutInstant !== undefined ?
      this.options.isLayoutInstant : !this._isLayoutInited;
    this._isInstant = isInstant;
    return isInstant;
  };

  // -------------------------- filter -------------------------- //

  Isotope.prototype._filter = function( items ) {
    var filter = this.options.filter;
    filter = filter || '*';
    var matches = [];
    var hiddenMatched = [];
    var visibleUnmatched = [];

    var test = this._getFilterTest( filter );

    // test each item
    for ( var i=0, len = items.length; i < len; i++ ) {
      var item = items[i];
      if ( item.isIgnored ) {
        continue;
      }
      // add item to either matched or unmatched group
      var isMatched = test( item );
      // item.isFilterMatched = isMatched;
      // add to matches if its a match
      if ( isMatched ) {
        matches.push( item );
      }
      // add to additional group if item needs to be hidden or revealed
      if ( isMatched && item.isHidden ) {
        hiddenMatched.push( item );
      } else if ( !isMatched && !item.isHidden ) {
        visibleUnmatched.push( item );
      }
    }

    var _this = this;
    function hideReveal() {
      _this.reveal( hiddenMatched );
      _this.hide( visibleUnmatched );
    }

    if ( this._isInstant ) {
      this._noTransition( hideReveal );
    } else {
      hideReveal();
    }

    return matches;
  };

  // get a jQuery, function, or a matchesSelector test given the filter
  Isotope.prototype._getFilterTest = function( filter ) {
    if ( jQuery && this.options.isJQueryFiltering ) {
      // use jQuery
      return function( item ) {
        return jQuery( item.element ).is( filter );
      };
    }
    if ( typeof filter === 'function' ) {
      // use filter as function
      return function( item ) {
        return filter( item.element );
      };
    }
    // default, use filter as selector string
    return function( item ) {
      return matchesSelector( item.element, filter );
    };
  };

  // -------------------------- sorting -------------------------- //

  /**
   * @params {Array} elems
   * @public
   */
  Isotope.prototype.updateSortData = function( elems ) {
    // get items
    var items;
    if ( elems ) {
      elems = makeArray( elems );
      items = this.getItems( elems );
    } else {
      // update all items if no elems provided
      items = this.items;
    }

    this._getSorters();
    this._updateItemsSortData( items );
  };

  Isotope.prototype._getSorters = function() {
    var getSortData = this.options.getSortData;
    for ( var key in getSortData ) {
      var sorter = getSortData[ key ];
      this._sorters[ key ] = mungeSorter( sorter );
    }
  };

  /**
   * @params {Array} items - of Isotope.Items
   * @private
   */
  Isotope.prototype._updateItemsSortData = function( items ) {
    // do not update if no items
    var len = items && items.length;

    for ( var i=0; len && i < len; i++ ) {
      var item = items[i];
      item.updateSortData();
    }
  };

  // ----- munge sorter ----- //

  // encapsulate this, as we just need mungeSorter
  // other functions in here are just for munging
  var mungeSorter = ( function() {
    // add a magic layer to sorters for convienent shorthands
    // `.foo-bar` will use the text of .foo-bar querySelector
    // `[foo-bar]` will use attribute
    // you can also add parser
    // `.foo-bar parseInt` will parse that as a number
    function mungeSorter( sorter ) {
      // if not a string, return function or whatever it is
      if ( typeof sorter !== 'string' ) {
        return sorter;
      }
      // parse the sorter string
      var args = trim( sorter ).split(' ');
      var query = args[0];
      // check if query looks like [an-attribute]
      var attrMatch = query.match( /^\[(.+)\]$/ );
      var attr = attrMatch && attrMatch[1];
      var getValue = getValueGetter( attr, query );
      // use second argument as a parser
      var parser = Isotope.sortDataParsers[ args[1] ];
      // parse the value, if there was a parser
      sorter = parser ? function( elem ) {
        return elem && parser( getValue( elem ) );
      } :
      // otherwise just return value
      function( elem ) {
        return elem && getValue( elem );
      };

      return sorter;
    }

    // get an attribute getter, or get text of the querySelector
    function getValueGetter( attr, query ) {
      var getValue;
      // if query looks like [foo-bar], get attribute
      if ( attr ) {
        getValue = function( elem ) {
          return elem.getAttribute( attr );
        };
      } else {
        // otherwise, assume its a querySelector, and get its text
        getValue = function( elem ) {
          var child = elem.querySelector( query );
          return child && getText( child );
        };
      }
      return getValue;
    }

    return mungeSorter;
  })();

  // parsers used in getSortData shortcut strings
  Isotope.sortDataParsers = {
    'parseInt': function( val ) {
      return parseInt( val, 10 );
    },
    'parseFloat': function( val ) {
      return parseFloat( val );
    }
  };

  // ----- sort method ----- //

  // sort filteredItem order
  Isotope.prototype._sort = function() {
    var sortByOpt = this.options.sortBy;
    if ( !sortByOpt ) {
      return;
    }
    // concat all sortBy and sortHistory
    var sortBys = [].concat.apply( sortByOpt, this.sortHistory );
    // sort magic
    var itemSorter = getItemSorter( sortBys, this.options.sortAscending );
    this.filteredItems.sort( itemSorter );
    // keep track of sortBy History
    if ( sortByOpt !== this.sortHistory[0] ) {
      // add to front, oldest goes in last
      this.sortHistory.unshift( sortByOpt );
    }
  };

  // returns a function used for sorting
  function getItemSorter( sortBys, sortAsc ) {
    return function sorter( itemA, itemB ) {
      // cycle through all sortKeys
      for ( var i = 0, len = sortBys.length; i < len; i++ ) {
        var sortBy = sortBys[i];
        var a = itemA.sortData[ sortBy ];
        var b = itemB.sortData[ sortBy ];
        if ( a > b || a < b ) {
          // if sortAsc is an object, use the value given the sortBy key
          var isAscending = sortAsc[ sortBy ] !== undefined ? sortAsc[ sortBy ] : sortAsc;
          var direction = isAscending ? 1 : -1;
          return ( a > b ? 1 : -1 ) * direction;
        }
      }
      return 0;
    };
  }

  // -------------------------- methods -------------------------- //

  // get layout mode
  Isotope.prototype._mode = function() {
    var layoutMode = this.options.layoutMode;
    var mode = this.modes[ layoutMode ];
    if ( !mode ) {
      // TODO console.error
      throw new Error( 'No layout mode: ' + layoutMode );
    }
    // HACK sync mode's options
    // any options set after init for layout mode need to be synced
    mode.options = this.options[ layoutMode ];
    return mode;
  };

  Isotope.prototype._resetLayout = function() {
    // trigger original reset layout
    Outlayer.prototype._resetLayout.call( this );
    this._mode()._resetLayout();
  };

  Isotope.prototype._getItemLayoutPosition = function( item  ) {
    return this._mode()._getItemLayoutPosition( item );
  };

  Isotope.prototype._manageStamp = function( stamp ) {
    this._mode()._manageStamp( stamp );
  };

  Isotope.prototype._getContainerSize = function() {
    return this._mode()._getContainerSize();
  };

  Isotope.prototype.needsResizeLayout = function() {
    return this._mode().needsResizeLayout();
  };

  // -------------------------- adding & removing -------------------------- //

  // HEADS UP overwrites default Outlayer appended
  Isotope.prototype.appended = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    var filteredItems = this._filterRevealAdded( items );
    // add to filteredItems
    this.filteredItems = this.filteredItems.concat( filteredItems );
  };

  // HEADS UP overwrites default Outlayer prepended
  Isotope.prototype.prepended = function( elems ) {
    var items = this._itemize( elems );
    if ( !items.length ) {
      return;
    }
    // add items to beginning of collection
    var previousItems = this.items.slice(0);
    this.items = items.concat( previousItems );
    // start new layout
    this._resetLayout();
    this._manageStamps();
    // layout new stuff without transition
    var filteredItems = this._filterRevealAdded( items );
    // layout previous items
    this.layoutItems( previousItems );
    // add to filteredItems
    this.filteredItems = filteredItems.concat( this.filteredItems );
  };

  Isotope.prototype._filterRevealAdded = function( items ) {
    var filteredItems = this._noTransition( function() {
      return this._filter( items );
    });
    // layout and reveal just the new items
    this.layoutItems( filteredItems, true );
    this.reveal( filteredItems );
    return items;
  };

  /**
   * Filter, sort, and layout newly-appended item elements
   * @param {Array or NodeList or Element} elems
   */
  Isotope.prototype.insert = function( elems ) {
    var items = this.addItems( elems );
    if ( !items.length ) {
      return;
    }
    // append item elements
    var i, item;
    var len = items.length;
    for ( i=0; i < len; i++ ) {
      item = items[i];
      this.element.appendChild( item.element );
    }
    // filter new stuff
    /*
    // this way adds hides new filtered items with NO transition
    // so user can't see if new hidden items have been inserted
    var filteredInsertItems;
    this._noTransition( function() {
      filteredInsertItems = this._filter( items );
      // hide all new items
      this.hide( filteredInsertItems );
    });
    // */
    // this way hides new filtered items with transition
    // so user at least sees that something has been added
    var filteredInsertItems = this._filter( items );
    // hide all newitems
    this._noTransition( function() {
      this.hide( filteredInsertItems );
    });
    // */
    // set flag
    for ( i=0; i < len; i++ ) {
      items[i].isLayoutInstant = true;
    }
    this.arrange();
    // reset flag
    for ( i=0; i < len; i++ ) {
      delete items[i].isLayoutInstant;
    }
    this.reveal( filteredInsertItems );
  };

  var _remove = Isotope.prototype.remove;
  Isotope.prototype.remove = function( elems ) {
    elems = makeArray( elems );
    var removeItems = this.getItems( elems );
    // do regular thing
    _remove.call( this, elems );
    // bail if no items to remove
    if ( !removeItems || !removeItems.length ) {
      return;
    }
    // remove elems from filteredItems
    for ( var i=0, len = removeItems.length; i < len; i++ ) {
      var item = removeItems[i];
      // remove item from collection
      removeFrom( item, this.filteredItems );
    }
  };

  Isotope.prototype.shuffle = function() {
    // update random sortData
    for ( var i=0, len = this.items.length; i < len; i++ ) {
      var item = this.items[i];
      item.sortData.random = Math.random();
    }
    this.options.sortBy = 'random';
    this._sort();
    this._layout();
  };

  /**
   * trigger fn without transition
   * kind of hacky to have this in the first place
   * @param {Function} fn
   * @returns ret
   * @private
   */
  Isotope.prototype._noTransition = function( fn ) {
    // save transitionDuration before disabling
    var transitionDuration = this.options.transitionDuration;
    // disable transition
    this.options.transitionDuration = 0;
    // do it
    var returnValue = fn.call( this );
    // re-enable transition for reveal
    this.options.transitionDuration = transitionDuration;
    return returnValue;
  };

  // ----- helper methods ----- //

  /**
   * getter method for getting filtered item elements
   * @returns {Array} elems - collection of item elements
   */
  Isotope.prototype.getFilteredItemElements = function() {
    var elems = [];
    for ( var i=0, len = this.filteredItems.length; i < len; i++ ) {
      elems.push( this.filteredItems[i].element );
    }
    return elems;
  };

  // -----  ----- //

  return Isotope;
}

// -------------------------- transport -------------------------- //

if ( typeof define === 'function' && define.amd ) {
  // AMD
  define( [
      'outlayer/outlayer',
      'get-size/get-size',
      'matches-selector/matches-selector',
      'isotope/js/item',
      'isotope/js/layout-mode',
      // include default layout modes
      'isotope/js/layout-modes/masonry',
      'isotope/js/layout-modes/fit-rows',
      'isotope/js/layout-modes/vertical'
    ],
    isotopeDefinition );
} else if ( typeof exports === 'object' ) {
  // CommonJS
  module.exports = isotopeDefinition(
    require('outlayer'),
    require('get-size'),
    require('desandro-matches-selector'),
    require('./item'),
    require('./layout-mode'),
    // include default layout modes
    require('./layout-modes/masonry'),
    require('./layout-modes/fit-rows'),
    require('./layout-modes/vertical')
  );
} else {
  // browser global
  window.Isotope = isotopeDefinition(
    window.Outlayer,
    window.getSize,
    window.matchesSelector,
    window.Isotope.Item,
    window.Isotope.LayoutMode
  );
}

})( window );


// This is the annotated source code for
// [VisualSearch.js](http://documentcloud.github.com/visualsearch/),
// a rich search box for real data.
// 
// The annotated source HTML is generated by
// [Docco](http://jashkenas.github.com/docco/).

/** @license VisualSearch.js 0.4.0
 *  (c) 2011 Samuel Clay, @samuelclay, DocumentCloud Inc.
 *  VisualSearch.js may be freely distributed under the MIT license.
 *  For all details and documentation:
 *  http://documentcloud.github.com/visualsearch
 */

(function() {

  var $ = jQuery; // Handle namespaced jQuery

  // Setting up VisualSearch globals. These will eventually be made instance-based.
  if (!window.VS) window.VS = {};
  if (!VS.app)    VS.app    = {};
  if (!VS.ui)     VS.ui     = {};
  if (!VS.model)  VS.model  = {};
  if (!VS.utils)  VS.utils  = {};

  // Sets the version for VisualSearch to be used programatically elsewhere.
  VS.VERSION = '0.4.0';

  VS.VisualSearch = function(options) {
    var defaults = {
      container   : '',
      query       : '',
      autosearch  : true,
      unquotable  : [],
      remainder   : 'text',
      showFacets  : true,
      callbacks   : {
        search          : $.noop,
        focus           : $.noop,
        blur            : $.noop,
        facetMatches    : $.noop,
        valueMatches    : $.noop
      }
    };
    this.options           = _.extend({}, defaults, options);
    this.options.callbacks = _.extend({}, defaults.callbacks, options.callbacks);
    
    VS.app.hotkeys.initialize();
    this.searchQuery   = new VS.model.SearchQuery();
    this.searchBox     = new VS.ui.SearchBox({
        app: this, 
        showFacets: this.options.showFacets
    });

    if (options.container) {
      var searchBox = this.searchBox.render().el;
      $(this.options.container).html(searchBox);
    }
    this.searchBox.value(this.options.query || '');

    // Disable page caching for browsers that incorrectly cache the visual search inputs.
    // This is forced the browser to re-render the page when it is retrieved in its history.
    $(window).bind('unload', function(e) {});

    // Gives the user back a reference to the `searchBox` so they
    // can use public methods.
    return this;
  };

  // Entry-point used to tie all parts of VisualSearch together. It will either attach
  // itself to `options.container`, or pass back the `searchBox` so it can be rendered
  // at will.
  VS.init = function(options) {
    return new VS.VisualSearch(options);
  };

})();

(function() {

var $ = jQuery; // Handle namespaced jQuery

// The search box is responsible for managing the many facet views and input views.
VS.ui.SearchBox = Backbone.View.extend({

  id  : 'search',

  events : {
    'click .VS-cancel-search-box' : 'clearSearch',
    'mousedown .VS-search-box'    : 'maybeFocusSearch',
    'dblclick .VS-search-box'     : 'highlightSearch',
    'click .VS-search-box'        : 'maybeTripleClick'
  },

  // Creating a new SearchBox registers handlers for re-rendering facets when necessary,
  // as well as handling typing when a facet is selected.
  initialize : function() {
    this.app = this.options.app;
    this.flags = {
      allSelected : false
    };
    this.facetViews = [];
    this.inputViews = [];
    _.bindAll(this, 'renderFacets', '_maybeDisableFacets', 'disableFacets',
              'deselectAllFacets', 'addedFacet', 'removedFacet', 'changedFacet');
    this.app.searchQuery
            .bind('reset', this.renderFacets)
            .bind('add', this.addedFacet)
            .bind('remove', this.removedFacet)
            .bind('change', this.changedFacet);
    $(document).bind('keydown', this._maybeDisableFacets);
  },

  // Renders the search box, but requires placement on the page through `this.el`.
  render : function() {
    $(this.el).append(JST['search_box']({}));
    $(document.body).setMode('no', 'search');

    return this;
  },

  // # Querying Facets #

  // Either gets a serialized query string or sets the faceted query from a query string.
  value : function(query) {
    if (query == null) return this.serialize();
    return this.setQuery(query);
  },

  // Uses the VS.app.searchQuery collection to serialize the current query from the various
  // facets that are in the search box.
  serialize : function() {
    var query           = [];
    var inputViewsCount = this.inputViews.length;

    this.app.searchQuery.each(_.bind(function(facet, i) {
      query.push(this.inputViews[i].value());
      query.push(facet.serialize());
    }, this));

    if (inputViewsCount) {
      query.push(this.inputViews[inputViewsCount-1].value());
    }

    return _.compact(query).join(' ');
  },
  
  // Returns any facet views that are currently selected. Useful for changing the value
  // callbacks based on what else is in the search box and which facet is being edited.
  selected: function() {
    return _.select(this.facetViews, function(view) { 
      return view.modes.editing == 'is' || view.modes.selected == 'is';
    });
  },
  
  // Similar to `this.selected`, returns any facet models that are currently selected.
  selectedModels: function() {
    return _.pluck(this.selected(), 'model');
  },

  // Takes a query string and uses the SearchParser to parse and render it. Note that
  // `VS.app.SearchParser` refreshes the `VS.app.searchQuery` collection, which is bound
  // here to call `this.renderFacets`.
  setQuery : function(query) {
    this.currentQuery = query;
    VS.app.SearchParser.parse(this.app, query);
  },

  // Returns the position of a facet/input view. Useful when moving between facets.
  viewPosition : function(view) {
    var views    = view.type == 'facet' ? this.facetViews : this.inputViews;
    var position = _.indexOf(views, view);
    if (position == -1) position = 0;
    return position;
  },

  // Used to launch a search. Hitting enter or clicking the search button.
  searchEvent : function(e) {
    var query = this.value();
    this.focusSearch(e);
    this.value(query);
    this.app.options.callbacks.search(query, this.app.searchQuery);
  },

  // # Rendering Facets #

  // Add a new facet. Facet will be focused and ready to accept a value. Can also
  // specify position, in the case of adding facets from an inbetween input.
  addFacet : function(category, initialQuery, position) {
    category     = VS.utils.inflector.trim(category);
    initialQuery = VS.utils.inflector.trim(initialQuery || '');
    if (!category) return;
    
    var model = new VS.model.SearchFacet({
      category : category,
      value    : initialQuery || '',
      app      : this.app
    });
    this.app.searchQuery.add(model, {at: position});
  },

  // Renders a newly added facet, and selects it.
  addedFacet : function (model) {
    this.renderFacets();
    var facetView = _.detect(this.facetViews, function(view) {
      if (view.model == model) return true;
    });

    _.defer(function() {
      facetView.enableEdit();
    });
  },

  // Changing a facet programmatically re-renders it.
  changedFacet: function () {
    this.renderFacets();
  },

  // When removing a facet, potentially do something. For now, the adjacent
  // remaining facet is selected, but this is handled by the facet's view,
  // since its position is unknown by the time the collection triggers this
  // remove callback.
  removedFacet : function (facet, query, options) {},

  // Renders each facet as a searchFacet view.
  renderFacets : function() {
    this.facetViews = [];
    this.inputViews = [];

    this.$('.VS-search-inner').empty();

    this.app.searchQuery.each(_.bind(this.renderFacet, this));

    // Add on an n+1 empty search input on the very end.
    this.renderSearchInput();
    this.renderPlaceholder();
  },

  // Render a single facet, using its category and query value.
  renderFacet : function(facet, position) {
    var view = new VS.ui.SearchFacet({
      app   : this.app,
      model : facet,
      order : position
    });

    // Input first, facet second.
    this.renderSearchInput();
    this.facetViews.push(view);
    this.$('.VS-search-inner').children().eq(position*2).after(view.render().el);

    view.calculateSize();
    _.defer(_.bind(view.calculateSize, view));

    return view;
  },

  // Render a single input, used to create and autocomplete facets
  renderSearchInput : function() {
    var input = new VS.ui.SearchInput({
      position: this.inputViews.length, 
      app: this.app,
      showFacets: this.options.showFacets
    });
    this.$('.VS-search-inner').append(input.render().el);
    this.inputViews.push(input);
  },
  
  // Handles showing/hiding the placeholder text
  renderPlaceholder : function() {
    var $placeholder = this.$('.VS-placeholder');
    if (this.app.searchQuery.length) {
      $placeholder.addClass("VS-hidden");
    } else {
      $placeholder.removeClass("VS-hidden")
                  .text(this.app.options.placeholder);
    }
  },

  // # Modifying Facets #

  // Clears out the search box. Command+A + delete can trigger this, as can a cancel button.
  //
  // If a `clearSearch` callback was provided, the callback is invoked and
  // provided with a function performs the actual removal of the data.  This
  // allows third-party developers to either clear data asynchronously, or
  // prior to performing their custom "clear" logic.
  clearSearch : function(e) {
    var actualClearSearch = _.bind(function() {
      this.disableFacets();
      this.value('');
      this.flags.allSelected = false;
      this.searchEvent(e);
      this.focusSearch(e);
    }, this);

    if (this.app.options.callbacks.clearSearch) {
      this.app.options.callbacks.clearSearch(actualClearSearch);
    } else {
      actualClearSearch();
    }
  },

  // Command+A selects all facets.
  selectAllFacets : function() {
    this.flags.allSelected = true;

    $(document).one('click.selectAllFacets', this.deselectAllFacets);

    _.each(this.facetViews, function(facetView, i) {
      facetView.selectFacet();
    });
    _.each(this.inputViews, function(inputView, i) {
      inputView.selectText();
    });
  },

  // Used by facets and input to see if all facets are currently selected.
  allSelected : function(deselect) {
    if (deselect) this.flags.allSelected = false;
    return this.flags.allSelected;
  },

  // After `selectAllFacets` is engaged, this method is bound to the entire document.
  // This immediate disables and deselects all facets, but it also checks if the user
  // has clicked on either a facet or an input, and properly selects the view.
  deselectAllFacets : function(e) {
    this.disableFacets();

    if (this.$(e.target).is('.category,input')) {
      var el   = $(e.target).closest('.search_facet,.search_input');
      var view = _.detect(this.facetViews.concat(this.inputViews), function(v) {
        return v.el == el[0];
      });
      if (view.type == 'facet') {
        view.selectFacet();
      } else if (view.type == 'input') {
        _.defer(function() {
          view.enableEdit(true);
        });
      }
    }
  },

  // Disables all facets except for the passed in view. Used when switching between
  // facets, so as not to have to keep state of active facets.
  disableFacets : function(keepView) {
    _.each(this.inputViews, function(view) {
      if (view && view != keepView &&
          (view.modes.editing == 'is' || view.modes.selected == 'is')) {
        view.disableEdit();
      }
    });
    _.each(this.facetViews, function(view) {
      if (view && view != keepView &&
          (view.modes.editing == 'is' || view.modes.selected == 'is')) {
        view.disableEdit();
        view.deselectFacet();
      }
    });

    this.flags.allSelected = false;
    this.removeFocus();
    $(document).unbind('click.selectAllFacets');
  },

  // Resize all inputs to account for extra keystrokes which may be changing the facet
  // width incorrectly. This is a safety check to ensure inputs are correctly sized.
  resizeFacets : function(view) {
    _.each(this.facetViews, function(facetView, i) {
      if (!view || facetView == view) {
        facetView.resize();
      }
    });
  },

  // Handles keydown events on the document. Used to complete the Cmd+A deletion, and
  // blurring focus.
  _maybeDisableFacets : function(e) {
    if (this.flags.allSelected && VS.app.hotkeys.key(e) == 'backspace') {
      e.preventDefault();
      this.clearSearch(e);
      return false;
    } else if (this.flags.allSelected && VS.app.hotkeys.printable(e)) {
      this.clearSearch(e);
    }
  },

  // # Focusing Facets #

  // Move focus between facets and inputs. Takes a direction as well as many options
  // for skipping over inputs and only to facets, placement of cursor position in facet
  // (i.e. at the end), and selecting the text in the input/facet.
  focusNextFacet : function(currentView, direction, options) {
    options = options || {};
    var viewCount    = this.facetViews.length;
    var viewPosition = options.viewPosition || this.viewPosition(currentView);

    if (!options.skipToFacet) {
      // Correct for bouncing between matching text and facet arrays.
      if (currentView.type == 'text'  && direction > 0) direction -= 1;
      if (currentView.type == 'facet' && direction < 0) direction += 1;
    } else if (options.skipToFacet && currentView.type == 'text' &&
               viewCount == viewPosition && direction >= 0) {
      // Special case of looping around to a facet from the last search input box.
      return false;
    }
    var view, next = Math.min(viewCount, viewPosition + direction);

    if (currentView.type == 'text') {
      if (next >= 0 && next < viewCount) {
        view = this.facetViews[next];
      } else if (next == viewCount) {
        view = this.inputViews[this.inputViews.length-1];
      }
      if (view && options.selectFacet && view.type == 'facet') {
        view.selectFacet();
      } else if (view) {
        view.enableEdit();
        view.setCursorAtEnd(direction || options.startAtEnd);
      }
    } else if (currentView.type == 'facet') {
      if (options.skipToFacet) {
        if (next >= viewCount || next < 0) {
          view = _.last(this.inputViews);
          view.enableEdit();
        } else {
          view = this.facetViews[next];
          view.enableEdit();
          view.setCursorAtEnd(direction || options.startAtEnd);
        }
      } else {
        view = this.inputViews[next];
        view.enableEdit();
      }
    }
    if (options.selectText) view.selectText();
    this.resizeFacets();
    
    return true;
  },

  maybeFocusSearch : function(e) {
    if ($(e.target).is('.VS-search-box') ||
        $(e.target).is('.VS-search-inner') ||
        e.type == 'keydown') {
      this.focusSearch(e);
    }
  },

  // Bring focus to last input field.
  focusSearch : function(e, selectText) {
    var view = this.inputViews[this.inputViews.length-1];
    view.enableEdit(selectText);
    if (!selectText) view.setCursorAtEnd(-1);
    if (e.type == 'keydown') {
      view.keydown(e);
      view.box.trigger('keydown');
    }
    _.defer(_.bind(function() {
      if (!this.$('input:focus').length) {
        view.enableEdit(selectText);
      }
    }, this));
  },

  // Double-clicking on the search wrapper should select the existing text in
  // the last search input. Also start the triple-click timer.
  highlightSearch : function(e) {
    if ($(e.target).is('.VS-search-box') ||
        $(e.target).is('.VS-search-inner') ||
        e.type == 'keydown') {
      var lastinput = this.inputViews[this.inputViews.length-1];
      lastinput.startTripleClickTimer();
      this.focusSearch(e, true);
    }
  },

  maybeTripleClick : function(e) {
    var lastinput = this.inputViews[this.inputViews.length-1];
    return lastinput.maybeTripleClick(e);
  },

  // Used to show the user is focused on some input inside the search box.
  addFocus : function() {
    this.app.options.callbacks.focus();
    this.$('.VS-search-box').addClass('VS-focus');
  },

  // User is no longer focused on anything in the search box.
  removeFocus : function() {
    this.app.options.callbacks.blur();
    var focus = _.any(this.facetViews.concat(this.inputViews), function(view) {
      return view.isFocused();
    });
    if (!focus) this.$('.VS-search-box').removeClass('VS-focus');
  },

  // Show a menu which adds pre-defined facets to the search box. This is unused for now.
  showFacetCategoryMenu : function(e) {
    e.preventDefault();
    e.stopPropagation();
    if (this.facetCategoryMenu && this.facetCategoryMenu.modes.open == 'is') {
      return this.facetCategoryMenu.close();
    }

    var items = [
      {title: 'Account', onClick: _.bind(this.addFacet, this, 'account', '')},
      {title: 'Project', onClick: _.bind(this.addFacet, this, 'project', '')},
      {title: 'Filter', onClick: _.bind(this.addFacet, this, 'filter', '')},
      {title: 'Access', onClick: _.bind(this.addFacet, this, 'access', '')}
    ];

    var menu = this.facetCategoryMenu || (this.facetCategoryMenu = new dc.ui.Menu({
      items       : items,
      standalone  : true
    }));

    this.$('.VS-icon-search').after(menu.render().open().content);
    return false;
  }

});

})();

(function() {

var $ = jQuery; // Handle namespaced jQuery

// This is the visual search facet that holds the category and its autocompleted
// input field.
VS.ui.SearchFacet = Backbone.View.extend({

  type : 'facet',

  className : 'search_facet',

  events : {
    'click .category'           : 'selectFacet',
    'keydown input'             : 'keydown',
    'mousedown input'           : 'enableEdit',
    'mouseover .VS-icon-cancel' : 'showDelete',
    'mouseout .VS-icon-cancel'  : 'hideDelete',
    'click .VS-icon-cancel'     : 'remove'
  },

  initialize : function(options) {
    this.flags = {
      canClose : false
    };
    _.bindAll(this, 'set', 'keydown', 'deselectFacet', 'deferDisableEdit');
  },

  // Rendering the facet sets up autocompletion, events on blur, and populates
  // the facet's input with its starting value.
  render : function() {
    $(this.el).html(JST['search_facet']({
      model : this.model
    }));

    this.setMode('not', 'editing');
    this.setMode('not', 'selected');
    this.box = this.$('input');
    console.log(["model", this.model]);
    this.box.val(this.model.label());
    this.box.bind('blur', this.deferDisableEdit);
    // Handle paste events with `propertychange`
    this.box.bind('input propertychange', this.keydown);
    this.setupAutocomplete();

    return this;
  },

  // This method is used to setup the facet's input to auto-grow.
  // This is defered in the searchBox so it can be attached to the
  // DOM to get the correct font-size.
  calculateSize : function() {
    this.box.autoGrowInput();
    this.box.unbind('updated.autogrow');
    this.box.bind('updated.autogrow', _.bind(this.moveAutocomplete, this));
  },

  // Forces a recalculation of this facet's input field's value. Called when
  // the facet is focused, removed, or otherwise modified.
  resize : function(e) {
    this.box.trigger('resize.autogrow', e);
  },

  // Watches the facet's input field to see if it matches the beginnings of
  // words in `autocompleteValues`, which is different for every category.
  // If the value, when selected from the autocompletion menu, is different
  // than what it was, commit the facet and search for it.
  setupAutocomplete : function() {
    this.box.autocomplete({
      source    : _.bind(this.autocompleteValues, this),
      minLength : 0,
      delay     : 0,
      autoFocus : true,
      position  : {offset : "0 5"},
      create    : _.bind(function(e, ui) {
        $(this.el).find('.ui-autocomplete-input').css('z-index','auto');
      }, this),
      select    : _.bind(function(e, ui) {
        e.preventDefault();
        var originalValue = this.model.get('value');
        this.set(ui.item.value);
        if (originalValue != ui.item.value || this.box.val() != ui.item.value) {
          if (this.options.app.options.autosearch) {
            this.search(e);
          } else {
              this.options.app.searchBox.renderFacets();
              this.options.app.searchBox.focusNextFacet(this, 1, {viewPosition: this.options.order});
          }
        }
        return false;
      }, this),
      open      : _.bind(function(e, ui) {
        var box = this.box;
        this.box.autocomplete('widget').find('.ui-menu-item').each(function() {
          var $value = $(this),
              autoCompleteData = $value.data('item.autocomplete') || $value.data('ui-autocomplete-item');

          if (autoCompleteData['value'] == box.val() && box.data('uiAutocomplete').menu.activate) {
            box.data('uiAutocomplete').menu.activate(new $.Event("mouseover"), $value);
          }
        });
      }, this)
    });

    this.box.autocomplete('widget').addClass('VS-interface');
  },

  // As the facet's input field grows, it may move to the next line in the
  // search box. `autoGrowInput` triggers an `updated` event on the input
  // field, which is bound to this method to move the autocomplete menu.
  moveAutocomplete : function() {
    var autocomplete = this.box.data('uiAutocomplete');
    if (autocomplete) {
      autocomplete.menu.element.position({
        my        : "left top",
        at        : "left bottom",
        of        : this.box.data('uiAutocomplete').element,
        collision : "flip",
        offset    : "0 5"
      });
    }
  },

  // When a user enters a facet and it is being edited, immediately show
  // the autocomplete menu and size it to match the contents.
  searchAutocomplete : function(e) {
    var autocomplete = this.box.data('uiAutocomplete');
    if (autocomplete) {
      var menu = autocomplete.menu.element;
      autocomplete.search();

      // Resize the menu based on the correctly measured width of what's bigger:
      // the menu's original size or the menu items' new size.
      menu.outerWidth(Math.max(
        menu.width('').outerWidth(),
        autocomplete.element.outerWidth()
      ));
    }
  },

  // Closes the autocomplete menu. Called on disabling, selecting, deselecting,
  // and anything else that takes focus out of the facet's input field.
  closeAutocomplete : function() {
    var autocomplete = this.box.data('uiAutocomplete');
    if (autocomplete) autocomplete.close();
  },

  // Search terms used in the autocomplete menu. These are specific to the facet,
  // and only match for the facet's category. The values are then matched on the
  // first letter of any word in matches, and finally sorted according to the
  // value's own category. You can pass `preserveOrder` as an option in the 
  // `facetMatches` callback to skip any further ordering done client-side.
  autocompleteValues : function(req, resp) {
    var category = this.model.get('category');
    var value    = this.model.get('value');
    var searchTerm = req.term;

    this.options.app.options.callbacks.valueMatches(category, searchTerm, function(matches, options) {
      options = options || {};
      matches = matches || [];
      
      if (searchTerm && value != searchTerm) {
        if (options.preserveMatches) {
          resp(matches);
        } else {
          var re = VS.utils.inflector.escapeRegExp(searchTerm || '');
          var matcher = new RegExp('\\b' + re, 'i');
          matches = $.grep(matches, function(item) {
            return matcher.test(item) ||
                   matcher.test(item.value) ||
                   matcher.test(item.label);
        });
        }
      }
      
      if (options.preserveOrder) {
        resp(matches);
      } else {
        resp(_.sortBy(matches, function(match) {
          if (match == value || match.value == value) return '';
          else return match;
        }));
      }
    });

  },

  // Sets the facet's model's value.
  set : function(value) {
    if (!value) return;
    this.model.set({'value': value});
  },

  // Before the searchBox performs a search, we need to close the
  // autocomplete menu.
  search : function(e, direction) {
    if (!direction) direction = 1;
    this.closeAutocomplete();
    this.options.app.searchBox.searchEvent(e);
    _.defer(_.bind(function() {
      this.options.app.searchBox.focusNextFacet(this, direction, {viewPosition: this.options.order});
    }, this));
  },

  // Begin editing the facet's input. This is called when the user enters
  // the input either from another facet or directly clicking on it.
  //
  // This method tells all other facets and inputs to disable so it can have
  // the sole focus. It also prepares the autocompletion menu.
  enableEdit : function() {
    if (this.modes.editing != 'is') {
      this.setMode('is', 'editing');
      this.deselectFacet();
      if (this.box.val() == '') {
        this.box.val(this.model.get('value'));
      }
    }

    this.flags.canClose = false;
    this.options.app.searchBox.disableFacets(this);
    this.options.app.searchBox.addFocus();
    _.defer(_.bind(function() {
      this.options.app.searchBox.addFocus();
    }, this));
    this.resize();
    this.searchAutocomplete();
    this.box.focus();
  },

  // When the user blurs the input, they may either be going to another input
  // or off the search box entirely. If they go to another input, this facet
  // will be instantly disabled, and the canClose flag will be turned back off.
  //
  // However, if the user clicks elsewhere on the page, this method starts a timer
  // that checks if any of the other inputs are selected or are being edited. If
  // not, then it can finally close itself and its autocomplete menu.
  deferDisableEdit : function() {
    this.flags.canClose = true;
    _.delay(_.bind(function() {
      if (this.flags.canClose && !this.box.is(':focus') &&
          this.modes.editing == 'is' && this.modes.selected != 'is') {
        this.disableEdit();
      }
    }, this), 250);
  },

  // Called either by other facets receiving focus or by the timer in `deferDisableEdit`,
  // this method will turn off the facet, remove any text selection, and close
  // the autocomplete menu.
  disableEdit : function() {
    var newFacetQuery = VS.utils.inflector.trim(this.box.val());
    if (newFacetQuery != this.model.get('value')) {
      this.set(newFacetQuery);
    }
    this.flags.canClose = false;
    this.box.selectRange(0, 0);
    this.box.blur();
    this.setMode('not', 'editing');
    this.closeAutocomplete();
    this.options.app.searchBox.removeFocus();
  },

  // Selects the facet, which blurs the facet's input and highlights the facet.
  // If this is the only facet being selected (and not part of a select all event),
  // we attach a mouse/keyboard watcher to check if the next action by the user
  // should delete this facet or just deselect it.
  selectFacet : function(e) {
    if (e) e.preventDefault();
    var allSelected = this.options.app.searchBox.allSelected();
    if (this.modes.selected == 'is') return;

    if (this.box.is(':focus')) {
      this.box.setCursorPosition(0);
      this.box.blur();
    }

    this.flags.canClose = false;
    this.closeAutocomplete();
    this.setMode('is', 'selected');
    this.setMode('not', 'editing');
    if (!allSelected || e) {
      $(document).unbind('keydown.facet', this.keydown);
      $(document).unbind('click.facet', this.deselectFacet);
      _.defer(_.bind(function() {
        $(document).unbind('keydown.facet').bind('keydown.facet', this.keydown);
        $(document).unbind('click.facet').one('click.facet', this.deselectFacet);
      }, this));
      this.options.app.searchBox.disableFacets(this);
      this.options.app.searchBox.addFocus();
    }
    return false;
  },

  // Turns off highlighting on the facet. Called in a variety of ways, this
  // only deselects the facet if it is selected, and then cleans up the
  // keyboard/mouse watchers that were created when the facet was first
  // selected.
  deselectFacet : function(e) {
    if (e) e.preventDefault();
    if (this.modes.selected == 'is') {
      this.setMode('not', 'selected');
      this.closeAutocomplete();
      this.options.app.searchBox.removeFocus();
    }
    $(document).unbind('keydown.facet', this.keydown);
    $(document).unbind('click.facet', this.deselectFacet);
    return false;
  },

  // Is the user currently focused in this facet's input field?
  isFocused : function() {
    return this.box.is(':focus');
  },

  // Hovering over the delete button styles the facet so the user knows that
  // the delete button will kill the entire facet.
  showDelete : function() {
    $(this.el).addClass('search_facet_maybe_delete');
  },

  // On `mouseout`, the user is no longer hovering on the delete button.
  hideDelete : function() {
    $(this.el).removeClass('search_facet_maybe_delete');
  },

  // When switching between facets, depending on the direction the cursor is
  // coming from, the cursor in this facet's input field should match the original
  // direction.
  setCursorAtEnd : function(direction) {
    if (direction == -1) {
      this.box.setCursorPosition(this.box.val().length);
    } else {
      this.box.setCursorPosition(0);
    }
  },

  // Deletes the facet and sends the cursor over to the nearest input field.
  remove : function(e) {
    var committed = this.model.get('value');
    this.deselectFacet();
    this.disableEdit();
    this.options.app.searchQuery.remove(this.model);
    if (committed && this.options.app.options.autosearch) {
      this.search(e, -1);
    } else {
      this.options.app.searchBox.renderFacets();
      this.options.app.searchBox.focusNextFacet(this, -1, {viewPosition: this.options.order});
    }
  },

  // Selects the text in the facet's input field. When the user tabs between
  // facets, convention is to highlight the entire field.
  selectText: function() {
    this.box.selectRange(0, this.box.val().length);
  },

  // Handles all keyboard inputs when in the facet's input field. This checks
  // for movement between facets and inputs, entering a new value that needs
  // to be autocompleted, as well as the removal of this facet.
  keydown : function(e) {
    var key = VS.app.hotkeys.key(e);

    if (key == 'enter' && this.box.val()) {
      this.disableEdit();
      this.search(e);
    } else if (key == 'left') {
      if (this.modes.selected == 'is') {
        this.deselectFacet();
        this.options.app.searchBox.focusNextFacet(this, -1, {startAtEnd: -1});
      } else if (this.box.getCursorPosition() == 0 && !this.box.getSelection().length) {
        this.selectFacet();
      }
    } else if (key == 'right') {
      if (this.modes.selected == 'is') {
        e.preventDefault();
        this.deselectFacet();
        this.setCursorAtEnd(0);
        this.enableEdit();
      } else if (this.box.getCursorPosition() == this.box.val().length) {
        e.preventDefault();
        this.disableEdit();
        this.options.app.searchBox.focusNextFacet(this, 1);
      }
    } else if (VS.app.hotkeys.shift && key == 'tab') {
      e.preventDefault();
      this.options.app.searchBox.focusNextFacet(this, -1, {
        startAtEnd  : -1,
        skipToFacet : true,
        selectText  : true
      });
    } else if (key == 'tab') {
      e.preventDefault();
      this.options.app.searchBox.focusNextFacet(this, 1, {
        skipToFacet : true,
        selectText  : true
      });
    } else if (VS.app.hotkeys.command && (e.which == 97 || e.which == 65)) {
      e.preventDefault();
      this.options.app.searchBox.selectAllFacets();
      return false;
    } else if (VS.app.hotkeys.printable(e) && this.modes.selected == 'is') {
      this.options.app.searchBox.focusNextFacet(this, -1, {startAtEnd: -1});
      this.remove(e);
    } else if (key == 'backspace') {
      if (this.modes.selected == 'is') {
        e.preventDefault();
        this.remove(e);
      } else if (this.box.getCursorPosition() == 0 &&
                 !this.box.getSelection().length) {
        e.preventDefault();
        this.selectFacet();
      }
    }

    // Handle paste events
    if (e.which == null) {
        // this.searchAutocomplete(e);
        _.defer(_.bind(this.resize, this, e));
    } else {
      this.resize(e);
    }
  }

});

})();

(function() {

var $ = jQuery; // Handle namespaced jQuery

// This is the visual search input that is responsible for creating new facets.
// There is one input placed in between all facets.
VS.ui.SearchInput = Backbone.View.extend({

  type : 'text',

  className : 'search_input ui-menu',

  events : {
    'keypress input'  : 'keypress',
    'keydown input'   : 'keydown',
    'click input'     : 'maybeTripleClick',
    'dblclick input'  : 'startTripleClickTimer'
  },

  initialize : function() {
    this.app = this.options.app;
    this.flags = {
      canClose : false
    };
    _.bindAll(this, 'removeFocus', 'addFocus', 'moveAutocomplete', 'deferDisableEdit');
  },

  // Rendering the input sets up autocomplete, events on focusing and blurring
  // the input, and the auto-grow of the input.
  render : function() {
    $(this.el).html(JST['search_input']({}));

    this.setMode('not', 'editing');
    this.setMode('not', 'selected');
    this.box = this.$('input');
    this.box.autoGrowInput();
    this.box.bind('updated.autogrow', this.moveAutocomplete);
    this.box.bind('blur',  this.deferDisableEdit);
    this.box.bind('focus', this.addFocus);
    this.setupAutocomplete();

    return this;
  },

  // Watches the input and presents an autocompleted menu, taking the
  // remainder of the input field and adding a separate facet for it.
  //
  // See `addTextFacetRemainder` for explanation on how the remainder works.
  setupAutocomplete : function() {
    this.box.autocomplete({
      minLength : this.options.showFacets ? 0 : 1,
      delay     : 50,
      autoFocus : true,
      position  : {offset : "0 -1"},
      source    : _.bind(this.autocompleteValues, this),
      create    : _.bind(function(e, ui) {
        $(this.el).find('.ui-autocomplete-input').css('z-index','auto');
      }, this),
      select    : _.bind(function(e, ui) {
        e.preventDefault();
        // stopPropogation does weird things in jquery-ui 1.9
        // e.stopPropagation();
        var remainder = this.addTextFacetRemainder(ui.item.value);
        var position  = this.options.position + (remainder ? 1 : 0);
        this.app.searchBox.addFacet(ui.item instanceof String ? ui.item : ui.item.value, '', position);
        return false;
      }, this)
    });

    // Renders the results grouped by the categories they belong to.
    this.box.data('uiAutocomplete')._renderMenu = function(ul, items) {
      var category = '';
      _.each(items, _.bind(function(item, i) {
        if (item.category && item.category != category) {
          ul.append('<li class="ui-autocomplete-category">'+item.category+'</li>');
          category = item.category;
        }
        
        if(this._renderItemData) {
          this._renderItemData(ul, item);
        } else {
          this._renderItem(ul, item);
        }
        
      }, this));
    };

    this.box.autocomplete('widget').addClass('VS-interface');
  },

  // Search terms used in the autocomplete menu. The values are matched on the
  // first letter of any word in matches, and finally sorted according to the
  // value's own category. You can pass `preserveOrder` as an option in the
  // `facetMatches` callback to skip any further ordering done client-side.
  autocompleteValues : function(req, resp) {
    var searchTerm = req.term;
    var lastWord   = searchTerm.match(/\w+\*?$/); // Autocomplete only last word.
    var re         = VS.utils.inflector.escapeRegExp(lastWord && lastWord[0] || '');
    this.app.options.callbacks.facetMatches(function(prefixes, options) {
      options = options || {};
      prefixes = prefixes || [];

      // Only match from the beginning of the word.
      var matcher    = new RegExp('^' + re, 'i');
      var matches    = $.grep(prefixes, function(item) {
        return item && matcher.test(item.label || item);
      });

      if (options.preserveOrder) {
        resp(matches);
      } else {
        resp(_.sortBy(matches, function(match) {
          if (match.label) return match.category + '-' + match.label;
          else             return match;
        }));
      }
    });

  },

  // Closes the autocomplete menu. Called on disabling, selecting, deselecting,
  // and anything else that takes focus out of the facet's input field.
  closeAutocomplete : function() {
    var autocomplete = this.box.data('uiAutocomplete');
    if (autocomplete) autocomplete.close();
  },

  // As the input field grows, it may move to the next line in the
  // search box. `autoGrowInput` triggers an `updated` event on the input
  // field, which is bound to this method to move the autocomplete menu.
  moveAutocomplete : function() {
    var autocomplete = this.box.data('uiAutocomplete');
    if (autocomplete) {
      autocomplete.menu.element.position({
        my        : "left top",
        at        : "left bottom",
        of        : this.box.data('uiAutocomplete').element,
        collision : "none",
        offset    : '0 -1'
      });
    }
  },

  // When a user enters a facet and it is being edited, immediately show
  // the autocomplete menu and size it to match the contents.
  searchAutocomplete : function(e) {
    var autocomplete = this.box.data('uiAutocomplete');
    if (autocomplete) {
      var menu = autocomplete.menu.element;
      autocomplete.search();

      // Resize the menu based on the correctly measured width of what's bigger:
      // the menu's original size or the menu items' new size.
      menu.outerWidth(Math.max(
        menu.width('').outerWidth(),
        autocomplete.element.outerWidth()
      ));
    }
  },

  // If a user searches for "word word category", the category would be
  // matched and autocompleted, and when selected, the "word word" would
  // also be caught as the remainder and then added in its own facet.
  addTextFacetRemainder : function(facetValue) {
    var boxValue = this.box.val();
    var lastWord = boxValue.match(/\b(\w+)$/);
    
    if (!lastWord) {
      return '';
    }

    var matcher = new RegExp(lastWord[0], "i");
    if (facetValue.search(matcher) == 0) {
      boxValue = boxValue.replace(/\b(\w+)$/, '');
    }
    boxValue = boxValue.replace('^\s+|\s+$', '');
    
    if (boxValue) {
      this.app.searchBox.addFacet(this.app.options.remainder, boxValue, this.options.position);
    }
    
    return boxValue;
  },

  // Directly called to focus the input. This is different from `addFocus`
  // because this is not called by a focus event. This instead calls a
  // focus event causing the input to become focused.
  enableEdit : function(selectText) {
    this.addFocus();
    if (selectText) {
      this.selectText();
    }
    this.box.focus();
  },

  // Event called on user focus on the input. Tells all other input and facets
  // to give up focus, and starts revving the autocomplete.
  addFocus : function() {
    this.flags.canClose = false;
    if (!this.app.searchBox.allSelected()) {
      this.app.searchBox.disableFacets(this);
    }
    this.app.searchBox.addFocus();
    this.setMode('is', 'editing');
    this.setMode('not', 'selected');
    if (!this.app.searchBox.allSelected()) {
        this.searchAutocomplete();
    }
  },

  // Directly called to blur the input. This is different from `removeFocus`
  // because this is not called by a blur event.
  disableEdit : function() {
    this.box.blur();
    this.removeFocus();
  },

  // Event called when user blur's the input, either through the keyboard tabbing
  // away or the mouse clicking off. Cleans up
  removeFocus : function() {
    this.flags.canClose = false;
    this.app.searchBox.removeFocus();
    this.setMode('not', 'editing');
    this.setMode('not', 'selected');
    this.closeAutocomplete();
  },

  // When the user blurs the input, they may either be going to another input
  // or off the search box entirely. If they go to another input, this facet
  // will be instantly disabled, and the canClose flag will be turned back off.
  //
  // However, if the user clicks elsewhere on the page, this method starts a timer
  // that checks if any of the other inputs are selected or are being edited. If
  // not, then it can finally close itself and its autocomplete menu.
  deferDisableEdit : function() {
    this.flags.canClose = true;
    _.delay(_.bind(function() {
      if (this.flags.canClose &&
          !this.box.is(':focus') &&
          this.modes.editing == 'is') {
        this.disableEdit();
      }
    }, this), 250);
  },

  // Starts a timer that will cause a triple-click, which highlights all facets.
  startTripleClickTimer : function() {
    this.tripleClickTimer = setTimeout(_.bind(function() {
      this.tripleClickTimer = null;
    }, this), 500);
  },

  // Event on click that checks if a triple click is in play. The
  // `tripleClickTimer` is counting down, ready to be engaged and intercept
  // the click event to force a select all instead.
  maybeTripleClick : function(e) {
    if (!!this.tripleClickTimer) {
      e.preventDefault();
      this.app.searchBox.selectAllFacets();
      return false;
    }
  },

  // Is the user currently focused in the input field?
  isFocused : function() {
    return this.box.is(':focus');
  },

  // When serializing the facets, the inputs need to also have their values represented,
  // in case they contain text that is not yet faceted (but will be once the search is
  // completed).
  value : function() {
    return this.box.val();
  },

  // When switching between facets and inputs, depending on the direction the cursor
  // is coming from, the cursor in this facet's input field should match the original
  // direction.
  setCursorAtEnd : function(direction) {
    if (direction == -1) {
      this.box.setCursorPosition(this.box.val().length);
    } else {
      this.box.setCursorPosition(0);
    }
  },

  // Selects the entire range of text in the input. Useful when tabbing between inputs
  // and facets.
  selectText : function() {
    this.box.selectRange(0, this.box.val().length);
    if (!this.app.searchBox.allSelected()) {
      this.box.focus();
    } else {
      this.setMode('is', 'selected');
    }
  },

  // Before the searchBox performs a search, we need to close the
  // autocomplete menu.
  search : function(e, direction) {
    if (!direction) direction = 0;
    this.closeAutocomplete();
    this.app.searchBox.searchEvent(e);
    _.defer(_.bind(function() {
      this.app.searchBox.focusNextFacet(this, direction);
    }, this));
  },

  // Callback fired on key press in the search box. We search when they hit return.
  keypress : function(e) {
    var key = VS.app.hotkeys.key(e);

    if (key == 'enter') {
      return this.search(e, 100);
    } else if (VS.app.hotkeys.colon(e)) {
      this.box.trigger('resize.autogrow', e);
      var query    = this.box.val();
      var prefixes = [];
      if (this.app.options.callbacks.facetMatches) {
          this.app.options.callbacks.facetMatches(function(p) {
              prefixes = p;
          });
      }
      var labels   = _.map(prefixes, function(prefix) {
        if (prefix.label) return prefix.label;
        else              return prefix;
      });
      if (_.contains(labels, query)) {
        e.preventDefault();
        var remainder = this.addTextFacetRemainder(query);
        var position  = this.options.position + (remainder?1:0);
        this.app.searchBox.addFacet(query, '', position);
        return false;
      }
    } else if (key == 'backspace') {
      if (this.box.getCursorPosition() == 0 && !this.box.getSelection().length) {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        this.app.searchBox.resizeFacets();
        return false;
      }
    }
  },

  // Handles all keyboard inputs when in the input field. This checks
  // for movement between facets and inputs, entering a new value that needs
  // to be autocompleted, as well as stepping between facets with backspace.
  keydown : function(e) {
    var key = VS.app.hotkeys.key(e);

    if (key == 'left') {
      if (this.box.getCursorPosition() == 0) {
        e.preventDefault();
        this.app.searchBox.focusNextFacet(this, -1, {startAtEnd: -1});
      }
    } else if (key == 'right') {
      if (this.box.getCursorPosition() == this.box.val().length) {
        e.preventDefault();
        this.app.searchBox.focusNextFacet(this, 1, {selectFacet: true});
      }
    } else if (VS.app.hotkeys.shift && key == 'tab') {
      e.preventDefault();
      this.app.searchBox.focusNextFacet(this, -1, {selectText: true});
    } else if (key == 'tab') {
      var value = this.box.val();
      if (value.length) {
        e.preventDefault();
        var remainder = this.addTextFacetRemainder(value);
        var position  = this.options.position + (remainder?1:0);
        if (value != remainder) {
            this.app.searchBox.addFacet(value, '', position);
        }
      } else {
        var foundFacet = this.app.searchBox.focusNextFacet(this, 0, {
          skipToFacet: true,
          selectText: true
        });
        if (foundFacet) {
          e.preventDefault();
        }
      }
    } else if (VS.app.hotkeys.command &&
               String.fromCharCode(e.which).toLowerCase() == 'a') {
      e.preventDefault();
      this.app.searchBox.selectAllFacets();
      return false;
    } else if (key == 'backspace' && !this.app.searchBox.allSelected()) {
      if (this.box.getCursorPosition() == 0 && !this.box.getSelection().length) {
        e.preventDefault();
        this.app.searchBox.focusNextFacet(this, -1, {backspace: true});
        return false;
      }
    } else if (key == 'end') {
      var view = this.app.searchBox.inputViews[this.app.searchBox.inputViews.length-1];
      view.setCursorAtEnd(-1);
    } else if (key == 'home') {
      var view = this.app.searchBox.inputViews[0];
      view.setCursorAtEnd(-1);
    }

    this.box.trigger('resize.autogrow', e);
  }

});

})();

(function(){

  var $ = jQuery; // Handle namespaced jQuery

  // Makes the view enter a mode. Modes have both a 'mode' and a 'group',
  // and are mutually exclusive with any other modes in the same group.
  // Setting will update the view's modes hash, as well as set an HTML class
  // of *[mode]_[group]* on the view's element. Convenient way to swap styles
  // and behavior.
  Backbone.View.prototype.setMode = function(mode, group) {
    this.modes || (this.modes = {});
    if (this.modes[group] === mode) return;
    $(this.el).setMode(mode, group);
    this.modes[group] = mode;
  };

})();
(function() {

var $ = jQuery; // Handle namespaced jQuery

// DocumentCloud workspace hotkeys. To tell if a key is currently being pressed,
// just ask `VS.app.hotkeys.[key]` on `keypress`, or ask `VS.app.hotkeys.key(e)`
// on `keydown`.
//
// For the most headache-free way to use this utility, check modifier keys,
// like shift and command, with `VS.app.hotkeys.shift`, and check every other
// key with `VS.app.hotkeys.key(e) == 'key_name'`.
VS.app.hotkeys = {

  // Keys that will be mapped to the `hotkeys` namespace.
  KEYS: {
    '16':  'shift',
    '17':  'command',
    '91':  'command',
    '93':  'command',
    '224': 'command',
    '13':  'enter',
    '37':  'left',
    '38':  'upArrow',
    '39':  'right',
    '40':  'downArrow',
    '46':  'delete',
    '8':   'backspace',
    '35':  'end',
    '36':  'home',
    '9':   'tab',
    '188': 'comma'
  },

  // Binds global keydown and keyup events to listen for keys that match `this.KEYS`.
  initialize : function() {
    _.bindAll(this, 'down', 'up', 'blur');
    $(document).bind('keydown', this.down);
    $(document).bind('keyup', this.up);
    $(window).bind('blur', this.blur);
  },

  // On `keydown`, turn on all keys that match.
  down : function(e) {
    var key = this.KEYS[e.which];
    if (key) this[key] = true;
  },

  // On `keyup`, turn off all keys that match.
  up : function(e) {
    var key = this.KEYS[e.which];
    if (key) this[key] = false;
  },

  // If an input is blurred, all keys need to be turned off, since they are no longer
  // able to modify the document.
  blur : function(e) {
    for (var key in this.KEYS) this[this.KEYS[key]] = false;
  },

  // Check a key from an event and return the common english name.
  key : function(e) {
    return this.KEYS[e.which];
  },

  // Colon is special, since the value is different between browsers.
  colon : function(e) {
    var charCode = e.which;
    return charCode && String.fromCharCode(charCode) == ":";
  },

  // Check a key from an event and match it against any known characters.
  // The `keyCode` is different depending on the event type: `keydown` vs. `keypress`.
  //
  // These were determined by looping through every `keyCode` and `charCode` that
  // resulted from `keydown` and `keypress` events and counting what was printable.
  printable : function(e) {
    var code = e.which;
    if (e.type == 'keydown') {
      if (code == 32 ||                      // space
          (code >= 48 && code <= 90) ||      // 0-1a-z
          (code >= 96 && code <= 111) ||     // 0-9+-/*.
          (code >= 186 && code <= 192) ||    // ;=,-./^
          (code >= 219 && code <= 222)) {    // (\)'
        return true;
      }
    } else {
      // [space]!"#$%&'()*+,-.0-9:;<=>?@A-Z[\]^_`a-z{|} and unicode characters
      if ((code >= 32 && code <= 126)  ||
          (code >= 160 && code <= 500) ||
          (String.fromCharCode(code) == ":")) {
        return true;
      }
    }
    return false;
  }

};

})();
(function() {

var $ = jQuery; // Handle namespaced jQuery

// Naive English transformations on words. Only used for a few transformations 
// in VisualSearch.js.
VS.utils.inflector = {

  // Delegate to the ECMA5 String.prototype.trim function, if available.
  trim : function(s) {
    return s.trim ? s.trim() : s.replace(/^\s+|\s+$/g, '');
  },
  
  // Escape strings that are going to be used in a regex. Escapes punctuation
  // that would be incorrect in a regex.
  escapeRegExp : function(s) {
    return s.replace(/([.*+?^${}()|[\]\/\\])/g, '\\$1');
  }
};

})();
(function() {

var $ = jQuery; // Handle namespaced jQuery

$.fn.extend({

  // Makes the selector enter a mode. Modes have both a 'mode' and a 'group',
  // and are mutually exclusive with any other modes in the same group.
  // Setting will update the view's modes hash, as well as set an HTML class
  // of *[mode]_[group]* on the view's element. Convenient way to swap styles
  // and behavior.
  setMode : function(state, group) {
    group    = group || 'mode';
    var re   = new RegExp("\\w+_" + group + "(\\s|$)", 'g');
    var mode = (state === null) ? "" : state + "_" + group;
    this.each(function() {
      this.className = (this.className.replace(re, '')+' '+mode)
                       .replace(/\s\s/g, ' ');
    });
    return mode;
  },

  // When attached to an input element, this will cause the width of the input
  // to match its contents. This calculates the width of the contents of the input
  // by measuring a hidden shadow div that should match the styling of the input.
  autoGrowInput: function() {
    return this.each(function() {
      var $input  = $(this);
      var $tester = $('<div />').css({
        opacity     : 0,
        top         : -9999,
        left        : -9999,
        position    : 'absolute',
        whiteSpace  : 'nowrap'
      }).addClass('VS-input-width-tester').addClass('VS-interface');

      // Watch for input value changes on all of these events. `resize`
      // event is called explicitly when the input has been changed without
      // a single keypress.
      var events = 'keydown.autogrow keypress.autogrow ' +
                   'resize.autogrow change.autogrow';
      $input.next('.VS-input-width-tester').remove();
      $input.after($tester);
      $input.unbind(events).bind(events, function(e, realEvent) {
        if (realEvent) e = realEvent;
        var value = $input.val();

        // Watching for the backspace key is tricky because it may not
        // actually be deleting the character, but instead the key gets
        // redirected to move the cursor from facet to facet.
        if (VS.app.hotkeys.key(e) == 'backspace') {
          var position = $input.getCursorPosition();
          if (position > 0) value = value.slice(0, position-1) +
                                    value.slice(position, value.length);
        } else if (VS.app.hotkeys.printable(e) &&
                   !VS.app.hotkeys.command) {
          value += String.fromCharCode(e.which);
        }
        value = value.replace(/&/g, '&amp;')
                     .replace(/\s/g,'&nbsp;')
                     .replace(/</g, '&lt;')
                     .replace(/>/g, '&gt;');

        $tester.html(value);

        $input.width($tester.width() + 3 + parseInt($input.css('min-width')));
        $input.trigger('updated.autogrow');
      });

      // Sets the width of the input on initialization.
      $input.trigger('resize.autogrow');
    });
  },


  // Cross-browser method used for calculating where the cursor is in an
  // input field.
  getCursorPosition: function() {
    var position = 0;
    var input    = this.get(0);

    if (document.selection) { // IE
      input.focus();
      var sel    = document.selection.createRange();
      var selLen = document.selection.createRange().text.length;
      sel.moveStart('character', -input.value.length);
      position   = sel.text.length - selLen;
    } else if (input && $(input).is(':visible') &&
               input.selectionStart != null) { // Firefox/Safari
      position = input.selectionStart;
    }

    return position;
  },

  // A simple proxy for `selectRange` that sets the cursor position in an
  // input field.
  setCursorPosition: function(position) {
    return this.each(function() {
      return $(this).selectRange(position, position);
    });
  },

  // Cross-browser way to select text in an input field.
  selectRange: function(start, end) {
    return this.filter(':visible').each(function() {
      if (this.setSelectionRange) { // FF/Webkit
        this.focus();
        this.setSelectionRange(start, end);
      } else if (this.createTextRange) { // IE
        var range = this.createTextRange();
        range.collapse(true);
        range.moveEnd('character', end);
        range.moveStart('character', start);
        if (end - start >= 0) range.select();
      }
    });
  },

  // Returns an object that contains the text selection range values for
  // an input field.
  getSelection: function() {
    var input = this[0];

    if (input.selectionStart != null) { // FF/Webkit
      var start = input.selectionStart;
      var end   = input.selectionEnd;
      return {
        start   : start,
        end     : end,
        length  : end-start,
        text    : input.value.substr(start, end-start)
      };
    } else if (document.selection) { // IE
      var range = document.selection.createRange();
      if (range) {
        var textRange = input.createTextRange();
        var copyRange = textRange.duplicate();
        textRange.moveToBookmark(range.getBookmark());
        copyRange.setEndPoint('EndToStart', textRange);
        var start = copyRange.text.length;
        var end   = start + range.text.length;
        return {
          start   : start,
          end     : end,
          length  : end-start,
          text    : range.text
        };
      }
    }
    return {start: 0, end: 0, length: 0};
  }

});

// Debugging in Internet Explorer. This allows you to use 
// `console.log(['message', var1, var2, ...])`. Just remove the `false` and
// add your console.logs. This will automatically stringify objects using
// `JSON.stringify', so you can read what's going out. Think of this as a
// *Diet Firebug Lite Zero with Lemon*.
if (false) {
  window.console = {};
  var _$ied;
  window.console.log = function(msg) {
    if (_.isArray(msg)) {
      var message = msg[0];
      var vars = _.map(msg.slice(1), function(arg) {
        return JSON.stringify(arg);
      }).join(' - ');
    }
    if(!_$ied){
      _$ied = $('<div><ol></ol></div>').css({
        'position': 'fixed',
        'bottom': 10,
        'left': 10,
        'zIndex': 20000,
        'width': $('body').width() - 80,
        'border': '1px solid #000',
        'padding': '10px',
        'backgroundColor': '#fff',
        'fontFamily': 'arial,helvetica,sans-serif',
        'fontSize': '11px'
      });
      $('body').append(_$ied);
    }
    var $message = $('<li>'+message+' - '+vars+'</li>').css({
      'borderBottom': '1px solid #999999'
    });
    _$ied.find('ol').append($message);
    _.delay(function() {
      $message.fadeOut(500);
    }, 5000);
  };

}

})();

(function() {

var $ = jQuery; // Handle namespaced jQuery

// Used to extract keywords and facets from the free text search.
var QUOTES_RE   = "('[^']+'|\"[^\"]+\")";
var FREETEXT_RE = "('[^']+'|\"[^\"]+\"|[^'\"\\s]\\S*)";
var CATEGORY_RE = FREETEXT_RE +                     ':\\s*';
VS.app.SearchParser = {

  // Matches `category: "free text"`, with and without quotes.
  ALL_FIELDS : new RegExp(CATEGORY_RE + FREETEXT_RE, 'g'),

  // Matches a single category without the text. Used to correctly extract facets.
  CATEGORY   : new RegExp(CATEGORY_RE),

  // Called to parse a query into a collection of `SearchFacet` models.
  parse : function(instance, query) {
    var searchFacets = this._extractAllFacets(instance, query);
    instance.searchQuery.reset(searchFacets);
    return searchFacets;
  },

  // Walks the query and extracts facets, categories, and free text.
  _extractAllFacets : function(instance, query) {
    var facets = [];
    var originalQuery = query;
    while (query) {
      var category, value;
      originalQuery = query;
      var field = this._extractNextField(query);
      if (!field) {
        category = instance.options.remainder;
        value    = this._extractSearchText(query);
        query    = VS.utils.inflector.trim(query.replace(value, ''));
      } else if (field.indexOf(':') != -1) {
        category = field.match(this.CATEGORY)[1].replace(/(^['"]|['"]$)/g, '');
        value    = field.replace(this.CATEGORY, '').replace(/(^['"]|['"]$)/g, '');
        query    = VS.utils.inflector.trim(query.replace(field, ''));
      } else if (field.indexOf(':') == -1) {
        category = instance.options.remainder;
        value    = field;
        query    = VS.utils.inflector.trim(query.replace(value, ''));
      }

      if (category && value) {
          var searchFacet = new VS.model.SearchFacet({
            category : category,
            value    : VS.utils.inflector.trim(value),
            app      : instance
          });
          facets.push(searchFacet);
      }
      if (originalQuery == query) break;
    }

    return facets;
  },

  // Extracts the first field found, capturing any free text that comes
  // before the category.
  _extractNextField : function(query) {
    var textRe = new RegExp('^\\s*(\\S+)\\s+(?=' + QUOTES_RE + FREETEXT_RE + ')');
    var textMatch = query.match(textRe);
    if (textMatch && textMatch.length >= 1) {
      return textMatch[1];
    } else {
      return this._extractFirstField(query);
    }
  },

  // If there is no free text before the facet, extract the category and value.
  _extractFirstField : function(query) {
    var fields = query.match(this.ALL_FIELDS);
    return fields && fields.length && fields[0];
  },

  // If the found match is not a category and facet, extract the trimmed free text.
  _extractSearchText : function(query) {
    query = query || '';
    var text = VS.utils.inflector.trim(query.replace(this.ALL_FIELDS, ''));
    return text;
  }

};

})();

(function() {

var $ = jQuery; // Handle namespaced jQuery

// The model that holds individual search facets and their categories.
// Held in a collection by `VS.app.searchQuery`.
VS.model.SearchFacet = Backbone.Model.extend({

  // Extract the category and value and serialize it in preparation for
  // turning the entire searchBox into a search query that can be sent
  // to the server for parsing and searching.
  serialize : function() {
    var category = this.quoteCategory(this.get('category'));
    var value    = VS.utils.inflector.trim(this.get('value'));
    var remainder = this.get("app").options.remainder;

    if (!value) return '';

    if (!_.contains(this.get("app").options.unquotable || [], category) && category != remainder) {
      value = this.quoteValue(value);
    }

    if (category != remainder) {
      category = category + ': ';
    } else {
      category = "";
    }
    return category + value;
  },
  
  // Wrap categories that have spaces or any kind of quote with opposite matching
  // quotes to preserve the complex category during serialization.
  quoteCategory : function(category) {
    var hasDoubleQuote = (/"/).test(category);
    var hasSingleQuote = (/'/).test(category);
    var hasSpace       = (/\s/).test(category);
    
    if (hasDoubleQuote && !hasSingleQuote) {
      return "'" + category + "'";
    } else if (hasSpace || (hasSingleQuote && !hasDoubleQuote)) {
      return '"' + category + '"';
    } else {
      return category;
    }
  },
  
  // Wrap values that have quotes in opposite matching quotes. If a value has
  // both single and double quotes, just use the double quotes.
  quoteValue : function(value) {
    var hasDoubleQuote = (/"/).test(value);
    var hasSingleQuote = (/'/).test(value);
    
    if (hasDoubleQuote && !hasSingleQuote) {
      return "'" + value + "'";
    } else {
      return '"' + value + '"';
    }
  },
  
  // If provided, use a custom label instead of the raw value.
  label : function() {
      return this.get('label') || this.get('value');
  }

});

})();
(function() {

var $ = jQuery; // Handle namespaced jQuery

// Collection which holds all of the individual facets (category: value).
// Used for finding and removing specific facets.
VS.model.SearchQuery = Backbone.Collection.extend({

  // Model holds the category and value of the facet.
  model : VS.model.SearchFacet,
  
  // Turns all of the facets into a single serialized string.
  serialize : function() {
    return this.map(function(facet){ return facet.serialize(); }).join(' ');
  },
  
  facets : function() {
    return this.map(function(facet) {
      var value = {};
      value[facet.get('category')] = facet.get('value');
      return value;
    });
  },

  // Find a facet by its category. Multiple facets with the same category
  // is fine, but only the first is returned.
  find : function(category) {
    var facet = this.detect(function(facet) {
      return facet.get('category').toLowerCase() == category.toLowerCase();
    });
    return facet && facet.get('value');
  },

  // Counts the number of times a specific category is in the search query.
  count : function(category) {
    return this.select(function(facet) {
      return facet.get('category').toLowerCase() == category.toLowerCase();
    }).length;
  },

  // Returns an array of extracted values from each facet in a category.
  values : function(category) {
    var facets = this.select(function(facet) {
      return facet.get('category').toLowerCase() == category.toLowerCase();
    });
    return _.map(facets, function(facet) { return facet.get('value'); });
  },

  // Checks all facets for matches of either a category or both category and value.
  has : function(category, value) {
    return this.any(function(facet) {
      var categoryMatched = facet.get('category').toLowerCase() == category.toLowerCase();
      if (!value) return categoryMatched;
      return categoryMatched && facet.get('value') == value;
    });
  },

  // Used to temporarily hide specific categories and serialize the search query.
  withoutCategory : function() {
    var categories = _.map(_.toArray(arguments), function(cat) { return cat.toLowerCase(); });
    return this.map(function(facet) {
      if (!_.include(categories, facet.get('category').toLowerCase())) { 
        return facet.serialize();
      };
    }).join(' ');
  }

});

})();
(function(){
window.JST = window.JST || {};

window.JST['search_box'] = _.template('<div class="VS-search">\n  <div class="VS-search-box-wrapper VS-search-box">\n    <div class="VS-icon VS-icon-search"></div>\n    <div class="VS-placeholder"></div>\n    <div class="VS-search-inner"></div>\n    <div class="VS-icon VS-icon-cancel VS-cancel-search-box" title="clear search"></div>\n  </div>\n</div>');
window.JST['search_facet'] = _.template('<% if (model.has(\'category\')) { %>\n  <div class="category"><%= model.get(\'category\') %>:</div>\n<% } %>\n\n<div class="search_facet_input_container">\n  <input type="text" class="search_facet_input ui-menu VS-interface" value="" />\n</div>\n\n<div class="search_facet_remove VS-icon VS-icon-cancel"></div>');
window.JST['search_input'] = _.template('<input type="text" class="ui-menu" />');
})();
/*!
 * numeral.js
 * version : 1.5.3
 * author : Adam Draper
 * license : MIT
 * http://adamwdraper.github.com/Numeral-js/
 */

(function () {

    /************************************
        Constants
    ************************************/

    var numeral,
        VERSION = '1.5.3',
        // internal storage for language config files
        languages = {},
        currentLanguage = 'en',
        zeroFormat = null,
        defaultFormat = '0,0',
        // check for nodeJS
        hasModule = (typeof module !== 'undefined' && module.exports);


    /************************************
        Constructors
    ************************************/


    // Numeral prototype object
    function Numeral (number) {
        this._value = number;
    }

    /**
     * Implementation of toFixed() that treats floats more like decimals
     *
     * Fixes binary rounding issues (eg. (0.615).toFixed(2) === '0.61') that present
     * problems for accounting- and finance-related software.
     */
    function toFixed (value, precision, roundingFunction, optionals) {
        var power = Math.pow(10, precision),
            optionalsRegExp,
            output;
            
        //roundingFunction = (roundingFunction !== undefined ? roundingFunction : Math.round);
        // Multiply up by precision, round accurately, then divide and use native toFixed():
        output = (roundingFunction(value * power) / power).toFixed(precision);

        if (optionals) {
            optionalsRegExp = new RegExp('0{1,' + optionals + '}$');
            output = output.replace(optionalsRegExp, '');
        }

        return output;
    }

    /************************************
        Formatting
    ************************************/

    // determine what type of formatting we need to do
    function formatNumeral (n, format, roundingFunction) {
        var output;

        // figure out what kind of format we are dealing with
        if (format.indexOf('$') > -1) { // currency!!!!!
            output = formatCurrency(n, format, roundingFunction);
        } else if (format.indexOf('%') > -1) { // percentage
            output = formatPercentage(n, format, roundingFunction);
        } else if (format.indexOf(':') > -1) { // time
            output = formatTime(n, format);
        } else { // plain ol' numbers or bytes
            output = formatNumber(n._value, format, roundingFunction);
        }

        // return string
        return output;
    }

    // revert to number
    function unformatNumeral (n, string) {
        var stringOriginal = string,
            thousandRegExp,
            millionRegExp,
            billionRegExp,
            trillionRegExp,
            suffixes = ['KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            bytesMultiplier = false,
            power;

        if (string.indexOf(':') > -1) {
            n._value = unformatTime(string);
        } else {
            if (string === zeroFormat) {
                n._value = 0;
            } else {
                if (languages[currentLanguage].delimiters.decimal !== '.') {
                    string = string.replace(/\./g,'').replace(languages[currentLanguage].delimiters.decimal, '.');
                }

                // see if abbreviations are there so that we can multiply to the correct number
                thousandRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.thousand + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                millionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.million + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                billionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.billion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');
                trillionRegExp = new RegExp('[^a-zA-Z]' + languages[currentLanguage].abbreviations.trillion + '(?:\\)|(\\' + languages[currentLanguage].currency.symbol + ')?(?:\\))?)?$');

                // see if bytes are there so that we can multiply to the correct number
                for (power = 0; power <= suffixes.length; power++) {
                    bytesMultiplier = (string.indexOf(suffixes[power]) > -1) ? Math.pow(1024, power + 1) : false;

                    if (bytesMultiplier) {
                        break;
                    }
                }

                // do some math to create our number
                n._value = ((bytesMultiplier) ? bytesMultiplier : 1) * ((stringOriginal.match(thousandRegExp)) ? Math.pow(10, 3) : 1) * ((stringOriginal.match(millionRegExp)) ? Math.pow(10, 6) : 1) * ((stringOriginal.match(billionRegExp)) ? Math.pow(10, 9) : 1) * ((stringOriginal.match(trillionRegExp)) ? Math.pow(10, 12) : 1) * ((string.indexOf('%') > -1) ? 0.01 : 1) * (((string.split('-').length + Math.min(string.split('(').length-1, string.split(')').length-1)) % 2)? 1: -1) * Number(string.replace(/[^0-9\.]+/g, ''));

                // round if we are talking about bytes
                n._value = (bytesMultiplier) ? Math.ceil(n._value) : n._value;
            }
        }
        return n._value;
    }

    function formatCurrency (n, format, roundingFunction) {
        var symbolIndex = format.indexOf('$'),
            openParenIndex = format.indexOf('('),
            minusSignIndex = format.indexOf('-'),
            space = '',
            spliceIndex,
            output;

        // check for space before or after currency
        if (format.indexOf(' $') > -1) {
            space = ' ';
            format = format.replace(' $', '');
        } else if (format.indexOf('$ ') > -1) {
            space = ' ';
            format = format.replace('$ ', '');
        } else {
            format = format.replace('$', '');
        }

        // format the number
        output = formatNumber(n._value, format, roundingFunction);

        // position the symbol
        if (symbolIndex <= 1) {
            if (output.indexOf('(') > -1 || output.indexOf('-') > -1) {
                output = output.split('');
                spliceIndex = 1;
                if (symbolIndex < openParenIndex || symbolIndex < minusSignIndex){
                    // the symbol appears before the "(" or "-"
                    spliceIndex = 0;
                }
                output.splice(spliceIndex, 0, languages[currentLanguage].currency.symbol + space);
                output = output.join('');
            } else {
                output = languages[currentLanguage].currency.symbol + space + output;
            }
        } else {
            if (output.indexOf(')') > -1) {
                output = output.split('');
                output.splice(-1, 0, space + languages[currentLanguage].currency.symbol);
                output = output.join('');
            } else {
                output = output + space + languages[currentLanguage].currency.symbol;
            }
        }

        return output;
    }

    function formatPercentage (n, format, roundingFunction) {
        var space = '',
            output,
            value = n._value * 100;

        // check for space before %
        if (format.indexOf(' %') > -1) {
            space = ' ';
            format = format.replace(' %', '');
        } else {
            format = format.replace('%', '');
        }

        output = formatNumber(value, format, roundingFunction);
        
        if (output.indexOf(')') > -1 ) {
            output = output.split('');
            output.splice(-1, 0, space + '%');
            output = output.join('');
        } else {
            output = output + space + '%';
        }

        return output;
    }

    function formatTime (n) {
        var hours = Math.floor(n._value/60/60),
            minutes = Math.floor((n._value - (hours * 60 * 60))/60),
            seconds = Math.round(n._value - (hours * 60 * 60) - (minutes * 60));
        return hours + ':' + ((minutes < 10) ? '0' + minutes : minutes) + ':' + ((seconds < 10) ? '0' + seconds : seconds);
    }

    function unformatTime (string) {
        var timeArray = string.split(':'),
            seconds = 0;
        // turn hours and minutes into seconds and add them all up
        if (timeArray.length === 3) {
            // hours
            seconds = seconds + (Number(timeArray[0]) * 60 * 60);
            // minutes
            seconds = seconds + (Number(timeArray[1]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[2]);
        } else if (timeArray.length === 2) {
            // minutes
            seconds = seconds + (Number(timeArray[0]) * 60);
            // seconds
            seconds = seconds + Number(timeArray[1]);
        }
        return Number(seconds);
    }

    function formatNumber (value, format, roundingFunction) {
        var negP = false,
            signed = false,
            optDec = false,
            abbr = '',
            abbrK = false, // force abbreviation to thousands
            abbrM = false, // force abbreviation to millions
            abbrB = false, // force abbreviation to billions
            abbrT = false, // force abbreviation to trillions
            abbrForce = false, // force abbreviation
            bytes = '',
            ord = '',
            abs = Math.abs(value),
            suffixes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
            min,
            max,
            power,
            w,
            precision,
            thousands,
            d = '',
            neg = false;

        // check if number is zero and a custom zero format has been set
        if (value === 0 && zeroFormat !== null) {
            return zeroFormat;
        } else {
            // see if we should use parentheses for negative number or if we should prefix with a sign
            // if both are present we default to parentheses
            if (format.indexOf('(') > -1) {
                negP = true;
                format = format.slice(1, -1);
            } else if (format.indexOf('+') > -1) {
                signed = true;
                format = format.replace(/\+/g, '');
            }

            // see if abbreviation is wanted
            if (format.indexOf('a') > -1) {
                // check if abbreviation is specified
                abbrK = format.indexOf('aK') >= 0;
                abbrM = format.indexOf('aM') >= 0;
                abbrB = format.indexOf('aB') >= 0;
                abbrT = format.indexOf('aT') >= 0;
                abbrForce = abbrK || abbrM || abbrB || abbrT;

                // check for space before abbreviation
                if (format.indexOf(' a') > -1) {
                    abbr = ' ';
                    format = format.replace(' a', '');
                } else {
                    format = format.replace('a', '');
                }

                if (abs >= Math.pow(10, 12) && !abbrForce || abbrT) {
                    // trillion
                    abbr = abbr + languages[currentLanguage].abbreviations.trillion;
                    value = value / Math.pow(10, 12);
                } else if (abs < Math.pow(10, 12) && abs >= Math.pow(10, 9) && !abbrForce || abbrB) {
                    // billion
                    abbr = abbr + languages[currentLanguage].abbreviations.billion;
                    value = value / Math.pow(10, 9);
                } else if (abs < Math.pow(10, 9) && abs >= Math.pow(10, 6) && !abbrForce || abbrM) {
                    // million
                    abbr = abbr + languages[currentLanguage].abbreviations.million;
                    value = value / Math.pow(10, 6);
                } else if (abs < Math.pow(10, 6) && abs >= Math.pow(10, 3) && !abbrForce || abbrK) {
                    // thousand
                    abbr = abbr + languages[currentLanguage].abbreviations.thousand;
                    value = value / Math.pow(10, 3);
                }
            }

            // see if we are formatting bytes
            if (format.indexOf('b') > -1) {
                // check for space before
                if (format.indexOf(' b') > -1) {
                    bytes = ' ';
                    format = format.replace(' b', '');
                } else {
                    format = format.replace('b', '');
                }

                for (power = 0; power <= suffixes.length; power++) {
                    min = Math.pow(1024, power);
                    max = Math.pow(1024, power+1);

                    if (value >= min && value < max) {
                        bytes = bytes + suffixes[power];
                        if (min > 0) {
                            value = value / min;
                        }
                        break;
                    }
                }
            }

            // see if ordinal is wanted
            if (format.indexOf('o') > -1) {
                // check for space before
                if (format.indexOf(' o') > -1) {
                    ord = ' ';
                    format = format.replace(' o', '');
                } else {
                    format = format.replace('o', '');
                }

                ord = ord + languages[currentLanguage].ordinal(value);
            }

            if (format.indexOf('[.]') > -1) {
                optDec = true;
                format = format.replace('[.]', '.');
            }

            w = value.toString().split('.')[0];
            precision = format.split('.')[1];
            thousands = format.indexOf(',');

            if (precision) {
                if (precision.indexOf('[') > -1) {
                    precision = precision.replace(']', '');
                    precision = precision.split('[');
                    d = toFixed(value, (precision[0].length + precision[1].length), roundingFunction, precision[1].length);
                } else {
                    d = toFixed(value, precision.length, roundingFunction);
                }

                w = d.split('.')[0];

                if (d.split('.')[1].length) {
                    d = languages[currentLanguage].delimiters.decimal + d.split('.')[1];
                } else {
                    d = '';
                }

                if (optDec && Number(d.slice(1)) === 0) {
                    d = '';
                }
            } else {
                w = toFixed(value, null, roundingFunction);
            }

            // format number
            if (w.indexOf('-') > -1) {
                w = w.slice(1);
                neg = true;
            }

            if (thousands > -1) {
                w = w.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1' + languages[currentLanguage].delimiters.thousands);
            }

            if (format.indexOf('.') === 0) {
                w = '';
            }

            return ((negP && neg) ? '(' : '') + ((!negP && neg) ? '-' : '') + ((!neg && signed) ? '+' : '') + w + d + ((ord) ? ord : '') + ((abbr) ? abbr : '') + ((bytes) ? bytes : '') + ((negP && neg) ? ')' : '');
        }
    }

    /************************************
        Top Level Functions
    ************************************/

    numeral = function (input) {
        if (numeral.isNumeral(input)) {
            input = input.value();
        } else if (input === 0 || typeof input === 'undefined') {
            input = 0;
        } else if (!Number(input)) {
            input = numeral.fn.unformat(input);
        }

        return new Numeral(Number(input));
    };

    // version number
    numeral.version = VERSION;

    // compare numeral object
    numeral.isNumeral = function (obj) {
        return obj instanceof Numeral;
    };

    // This function will load languages and then set the global language.  If
    // no arguments are passed in, it will simply return the current global
    // language key.
    numeral.language = function (key, values) {
        if (!key) {
            return currentLanguage;
        }

        if (key && !values) {
            if(!languages[key]) {
                throw new Error('Unknown language : ' + key);
            }
            currentLanguage = key;
        }

        if (values || !languages[key]) {
            loadLanguage(key, values);
        }

        return numeral;
    };
    
    // This function provides access to the loaded language data.  If
    // no arguments are passed in, it will simply return the current
    // global language object.
    numeral.languageData = function (key) {
        if (!key) {
            return languages[currentLanguage];
        }
        
        if (!languages[key]) {
            throw new Error('Unknown language : ' + key);
        }
        
        return languages[key];
    };

    numeral.language('en', {
        delimiters: {
            thousands: ',',
            decimal: '.'
        },
        abbreviations: {
            thousand: 'k',
            million: 'm',
            billion: 'b',
            trillion: 't'
        },
        ordinal: function (number) {
            var b = number % 10;
            return (~~ (number % 100 / 10) === 1) ? 'th' :
                (b === 1) ? 'st' :
                (b === 2) ? 'nd' :
                (b === 3) ? 'rd' : 'th';
        },
        currency: {
            symbol: '$'
        }
    });

    numeral.zeroFormat = function (format) {
        zeroFormat = typeof(format) === 'string' ? format : null;
    };

    numeral.defaultFormat = function (format) {
        defaultFormat = typeof(format) === 'string' ? format : '0.0';
    };

    /************************************
        Helpers
    ************************************/

    function loadLanguage(key, values) {
        languages[key] = values;
    }

    /************************************
        Floating-point helpers
    ************************************/

    // The floating-point helper functions and implementation
    // borrows heavily from sinful.js: http://guipn.github.io/sinful.js/

    /**
     * Array.prototype.reduce for browsers that don't support it
     * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/Reduce#Compatibility
     */
    if ('function' !== typeof Array.prototype.reduce) {
        Array.prototype.reduce = function (callback, opt_initialValue) {
            'use strict';
            
            if (null === this || 'undefined' === typeof this) {
                // At the moment all modern browsers, that support strict mode, have
                // native implementation of Array.prototype.reduce. For instance, IE8
                // does not support strict mode, so this check is actually useless.
                throw new TypeError('Array.prototype.reduce called on null or undefined');
            }
            
            if ('function' !== typeof callback) {
                throw new TypeError(callback + ' is not a function');
            }

            var index,
                value,
                length = this.length >>> 0,
                isValueSet = false;

            if (1 < arguments.length) {
                value = opt_initialValue;
                isValueSet = true;
            }

            for (index = 0; length > index; ++index) {
                if (this.hasOwnProperty(index)) {
                    if (isValueSet) {
                        value = callback(value, this[index], index, this);
                    } else {
                        value = this[index];
                        isValueSet = true;
                    }
                }
            }

            if (!isValueSet) {
                throw new TypeError('Reduce of empty array with no initial value');
            }

            return value;
        };
    }

    
    /**
     * Computes the multiplier necessary to make x >= 1,
     * effectively eliminating miscalculations caused by
     * finite precision.
     */
    function multiplier(x) {
        var parts = x.toString().split('.');
        if (parts.length < 2) {
            return 1;
        }
        return Math.pow(10, parts[1].length);
    }

    /**
     * Given a variable number of arguments, returns the maximum
     * multiplier that must be used to normalize an operation involving
     * all of them.
     */
    function correctionFactor() {
        var args = Array.prototype.slice.call(arguments);
        return args.reduce(function (prev, next) {
            var mp = multiplier(prev),
                mn = multiplier(next);
        return mp > mn ? mp : mn;
        }, -Infinity);
    }        


    /************************************
        Numeral Prototype
    ************************************/


    numeral.fn = Numeral.prototype = {

        clone : function () {
            return numeral(this);
        },

        format : function (inputString, roundingFunction) {
            return formatNumeral(this, 
                  inputString ? inputString : defaultFormat, 
                  (roundingFunction !== undefined) ? roundingFunction : Math.round
              );
        },

        unformat : function (inputString) {
            if (Object.prototype.toString.call(inputString) === '[object Number]') { 
                return inputString; 
            }
            return unformatNumeral(this, inputString ? inputString : defaultFormat);
        },

        value : function () {
            return this._value;
        },

        valueOf : function () {
            return this._value;
        },

        set : function (value) {
            this._value = Number(value);
            return this;
        },

        add : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum + corrFactor * curr;
            }
            this._value = [this._value, value].reduce(cback, 0) / corrFactor;
            return this;
        },

        subtract : function (value) {
            var corrFactor = correctionFactor.call(null, this._value, value);
            function cback(accum, curr, currI, O) {
                return accum - corrFactor * curr;
            }
            this._value = [value].reduce(cback, this._value * corrFactor) / corrFactor;            
            return this;
        },

        multiply : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) * (curr * corrFactor) /
                    (corrFactor * corrFactor);
            }
            this._value = [this._value, value].reduce(cback, 1);
            return this;
        },

        divide : function (value) {
            function cback(accum, curr, currI, O) {
                var corrFactor = correctionFactor(accum, curr);
                return (accum * corrFactor) / (curr * corrFactor);
            }
            this._value = [this._value, value].reduce(cback);            
            return this;
        },

        difference : function (value) {
            return Math.abs(numeral(this._value).subtract(value).value());
        }

    };

    /************************************
        Exposing Numeral
    ************************************/

    // CommonJS module is defined
    if (hasModule) {
        module.exports = numeral;
    }

    /*global ender:false */
    if (typeof ender === 'undefined') {
        // here, `this` means `window` in the browser, or `global` on the server
        // add `numeral` as a global object via a string identifier,
        // for Closure Compiler 'advanced' mode
        this['numeral'] = numeral;
    }

    /*global define:false */
    if (typeof define === 'function' && define.amd) {
        define([], function () {
            return numeral;
        });
    }
}).call(this);

+function($){

	var _DataTables = [];

	var DataTable = function(_table) {
		var $table = $(_table),
			_tools = $table.attr('am-Tools').split(' '),
			self = this;

		if (_tools.indexOf('select-all') > -1 || _tools.indexOf('select-multi') > -1) {
			var _select = function(e){
				var em = (e.target.nodeName == 'INPUT') ? $(e.target).parent().parent() : $(e.target).parent();
				var val = (em.attr('am-Selected') == '') ? 'false' : em.attr('am-Selected');
				em.attr('am-Selected', (val === 'true')? 'false':'true');
				em.find('td:first-child input[type=checkbox]').prop('checked',(val === 'true')? false:true);
				
				if (_tools.indexOf('select-all') > -1) {
					if (val === 'true') $table.find('thead tr th:first-child input[type=checkbox]').prop('checked',false);
				}

			};

			var _selectAll = function(e){
				var em = $(e.target);
				$table.find('tbody tr').attr('am-Selected',em.prop('checked').toString()).
				find('td:first-child input[type=checkbox]').prop('checked',em.prop('checked'))
			};

			this.selected = function(){
				return $table.find('tbody tr[am-Selected=true]');
			}


			if (_tools.indexOf('select-all') > -1) {
				$table.on('click','tbody tr td',_select);
				$table.find('thead tr th:first-child input[type=checkbox]').click(_selectAll);
			}
		}

		if (_tools.indexOf('drag-sort') > -1) {

			$table.tableDnD({
				dragHandle: '.dragHandle'
			});
			$table.observe('childlist', 'tbody tr', function(){
				$table.tableDnDUpdate();
			});
		}

		if (_tools.indexOf('edit-row') > -1 || _tools.indexOf('edit-cell') > -1) {

			if (_tools.indexOf('edit-row') > -1) {
				this.editRow = function(row) {
					$('td:not(.table-control)',row).attr('contenteditable', true);
				};
			}

			if (_tools.indexOf('edit-cell') > -1) {
				$table.observe('childlist', 'tbody tr', function(e){
					if (e.addedNodes.length) $(e.addedNodes[0]).find('td:not(.table-control)').attr('contenteditable', true);
				});
			}
		}
	};

	$.fn.DataTable = DataTable;

	$(document).ready(function(){
		$('[am-DataTable][am-Tools~=drag-sort]').tableDnD();

		$('[am-DataTable]').each(function(index,table){
			_DataTables.push(new DataTable(table));
		});
	});
}(jQuery);