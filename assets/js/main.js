/*
	Hielo by TEMPLATED
	templated.co @templatedco
	Released for free under the Creative Commons Attribution 3.0 license (templated.co/license)
*/

var settings = {

	banner: {

		// Indicators (= the clickable dots at the bottom).
			indicators: true,

		// Transition speed (in ms)
		// For timing purposes only. It *must* match the transition speed of "#banner > article".
			speed: 1500,

		// Transition delay (in ms)
			delay: 5000,

		// Parallax intensity (between 0 and 1; higher = more intense, lower = less intense; 0 = off)
			parallax: 0.25

	}

};

(function($) {

	skel.breakpoints({
		xlarge:	'(max-width: 1680px)',
		large:	'(max-width: 1280px)',
		medium:	'(max-width: 980px)',
		small:	'(max-width: 736px)',
		xsmall:	'(max-width: 480px)'
	});

	/**
	 * Applies parallax scrolling to an element's background image.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._parallax = (skel.vars.browser == 'ie' || skel.vars.mobile) ? function() { return $(this) } : function(intensity) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0 || intensity === 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._parallax(intensity);

			return $this;

		}

		if (!intensity)
			intensity = 0.25;

		$this.each(function() {

			var $t = $(this),
				on, off;

			on = function() {

				$t.css('background-position', 'center 100%, center 100%, center 0px');

				$window
					.on('scroll._parallax', function() {

						var pos = parseInt($window.scrollTop()) - parseInt($t.position().top);

						$t.css('background-position', 'center ' + (pos * (-1 * intensity)) + 'px');

					});

			};

			off = function() {

				$t
					.css('background-position', '');

				$window
					.off('scroll._parallax');

			};

			skel.on('change', function() {

				if (skel.breakpoint('medium').active)
					(off)();
				else
					(on)();

			});

		});

		$window
			.off('load._parallax resize._parallax')
			.on('load._parallax resize._parallax', function() {
				$window.trigger('scroll');
			});

		return $(this);

	};

	/**
	 * Custom banner slider for Slate.
	 * @return {jQuery} jQuery object.
	 */
	$.fn._slider = function(options) {

		var	$window = $(window),
			$this = $(this);

		if (this.length == 0)
			return $this;

		if (this.length > 1) {

			for (var i=0; i < this.length; i++)
				$(this[i])._slider(options);

			return $this;

		}

		// Vars.
			var	current = 0, pos = 0, lastPos = 0,
				slides = [], indicators = [],
				$indicators,
				$slides = $this.children('article'),
				intervalId,
				isLocked = false,
				i = 0;

		// Turn off indicators if we only have one slide.
			if ($slides.length == 1)
				options.indicators = false;

		// Functions.
			$this._switchTo = function(x, stop) {

				if (isLocked || pos == x)
					return;

				isLocked = true;

				if (stop)
					window.clearInterval(intervalId);

				// Update positions.
					lastPos = pos;
					pos = x;

				// Hide last slide.
					slides[lastPos].removeClass('top');

					if (options.indicators)
						indicators[lastPos].removeClass('visible');

				// Show new slide.
					slides[pos].addClass('visible').addClass('top');

					if (options.indicators)
						indicators[pos].addClass('visible');

				// Finish hiding last slide after a short delay.
					window.setTimeout(function() {

						slides[lastPos].addClass('instant').removeClass('visible');

						window.setTimeout(function() {

							slides[lastPos].removeClass('instant');
							isLocked = false;

						}, 100);

					}, options.speed);

			};

		// Indicators.
			if (options.indicators)
				$indicators = $('<ul class="indicators"></ul>').appendTo($this);

		// Slides.
			$slides
				.each(function() {

					var $slide = $(this),
						$img = $slide.find('img');

					// Slide.
						$slide
							.css('background-image', 'url("' + $img.attr('src') + '")')
							.css('background-position', ($slide.data('position') ? $slide.data('position') : 'center'));

					// Add to slides.
						slides.push($slide);

					// Indicators.
						if (options.indicators) {

							var $indicator_li = $('<li>' + i + '</li>').appendTo($indicators);

							// Indicator.
								$indicator_li
									.data('index', i)
									.on('click', function() {
										$this._switchTo($(this).data('index'), true);
									});

							// Add to indicators.
								indicators.push($indicator_li);

						}

					i++;

				})
				._parallax(options.parallax);

		// Initial slide.
			slides[pos].addClass('visible').addClass('top');

			if (options.indicators)
				indicators[pos].addClass('visible');

		// Bail if we only have a single slide.
			if (slides.length == 1)
				return;

		// Main loop.
			intervalId = window.setInterval(function() {

				current++;

				if (current >= slides.length)
					current = 0;

				$this._switchTo(current);

			}, options.delay);

	};

	$(function() {

		var	$window 	= $(window),
			$body 		= $('body'),
			$header 	= $('#header'),
			$banner 	= $('.banner');

		// Disable animations/transitions until the page has loaded.
			$body.addClass('is-loading');

			$window.on('load', function() {
				window.setTimeout(function() {
					$body.removeClass('is-loading');
				}, 100);
			});

		// Prioritize "important" elements on medium.
			skel.on('+medium -medium', function() {
				$.prioritize(
					'.important\\28 medium\\29',
					skel.breakpoint('medium').active
				);
			});

		// Banner.
			$banner._slider(settings.banner);

		// Menu.
			$('#menu')
				.append('<a href="#menu" class="close"></a>')
				.appendTo($body)
				.panel({
					delay: 500,
					hideOnClick: true,
					hideOnSwipe: true,
					resetScroll: true,
					resetForms: true,
					side: 'right'
				});

		// Header.
			if (skel.vars.IEVersion < 9)
				$header.removeClass('alt');

			if ($banner.length > 0
			&&	$header.hasClass('alt')) {

				$window.on('resize', function() { $window.trigger('scroll'); });

				$banner.scrollex({
					bottom:		$header.outerHeight(),
					terminate:	function() { $header.removeClass('alt'); },
					enter:		function() { $header.addClass('alt'); },
					leave:		function() { $header.removeClass('alt'); $header.addClass('reveal'); }
				});

			}

	});

})(jQuery);

// galery codes .
jQuery(document).ready(function($){
	var itemInfoWrapper = $('.cd-single-item');

	itemInfoWrapper.each(function(){
		var container = $(this),
			// create slider pagination
			sliderPagination = createSliderPagination(container);

		//update slider navigation visibility
		updateNavigation(container, container.find('.cd-slider li').eq(0));

		container.find('.cd-slider').on('click', function(event){
			//enlarge slider images
			if( !container.hasClass('cd-slider-active') && $(event.target).is('.cd-slider')) {
				itemInfoWrapper.removeClass('cd-slider-active');
				container.addClass('cd-slider-active').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(){
					$('body,html').animate({'scrollTop':container.offset().top}, 200);
				});
			}
		});

		container.find('.cd-close').on('click', function(){
			//shrink slider images
			container.removeClass('cd-slider-active');
		});

		//update visible slide
		container.find('.cd-next').on('click', function(){
			nextSlide(container, sliderPagination);
		});

		container.find('.cd-prev').on('click', function(){
			prevSlide(container, sliderPagination);
		});

		container.find('.cd-slider').on('swipeleft', function(){
			var wrapper = $(this),
				bool = enableSwipe(container);
			if(!wrapper.find('.selected').is(':last-child') && bool) {nextSlide(container, sliderPagination);}
		});

		container.find('.cd-slider').on('swiperight', function(){
			var wrapper = $(this),
				bool = enableSwipe(container);
			if(!wrapper.find('.selected').is(':first-child') && bool) {prevSlide(container, sliderPagination);}
		});

		sliderPagination.on('click', function(){
			var selectedDot = $(this);
			if(!selectedDot.hasClass('selected')) {
				var selectedPosition = selectedDot.index(),
					activePosition = container.find('.cd-slider .selected').index();
				if( activePosition < selectedPosition) {
					nextSlide(container, sliderPagination, selectedPosition);
				} else {
					prevSlide(container, sliderPagination, selectedPosition);
				}
			}
		});
	});

	//keyboard slider navigation
	$(document).keyup(function(event){
		if(event.which=='37' && $('.cd-slider-active').length > 0 && !$('.cd-slider-active .cd-slider .selected').is(':first-child')) {
			prevSlide($('.cd-slider-active'), $('.cd-slider-active').find('.cd-slider-pagination li'));
		} else if( event.which=='39' && $('.cd-slider-active').length && !$('.cd-slider-active .cd-slider .selected').is(':last-child')) {
			nextSlide($('.cd-slider-active'), $('.cd-slider-active').find('.cd-slider-pagination li'));
		} else if(event.which=='27') {
			itemInfoWrapper.removeClass('cd-slider-active');
		}
	});

	function createSliderPagination($container){
		var wrapper = $('<ul class="cd-slider-pagination"></ul>').insertAfter($container.find('.cd-slider-navigation'));
		$container.find('.cd-slider li').each(function(index){
			var dotWrapper = (index == 0) ? $('<li class="selected"></li>') : $('<li></li>'),
				dot = $('<a href="#0"></a>').appendTo(dotWrapper);
			dotWrapper.appendTo(wrapper);
			dot.text(index+1);
		});
		return wrapper.children('li');
	}

	function nextSlide($container, $pagination, $n){
		var visibleSlide = $container.find('.cd-slider .selected'),
			navigationDot = $container.find('.cd-slider-pagination .selected');
		if(typeof $n === 'undefined') $n = visibleSlide.index() + 1;
		visibleSlide.removeClass('selected');
		$container.find('.cd-slider li').eq($n).addClass('selected').prevAll().addClass('move-left');
		navigationDot.removeClass('selected')
		$pagination.eq($n).addClass('selected');
		updateNavigation($container, $container.find('.cd-slider li').eq($n));
	}

	function prevSlide($container, $pagination, $n){
		var visibleSlide = $container.find('.cd-slider .selected'),
			navigationDot = $container.find('.cd-slider-pagination .selected');
		if(typeof $n === 'undefined') $n = visibleSlide.index() - 1;
		visibleSlide.removeClass('selected')
		$container.find('.cd-slider li').eq($n).addClass('selected').removeClass('move-left').nextAll().removeClass('move-left');
		navigationDot.removeClass('selected');
		$pagination.eq($n).addClass('selected');
		updateNavigation($container, $container.find('.cd-slider li').eq($n));
	}

	function updateNavigation($container, $active) {
		$container.find('.cd-prev').toggleClass('inactive', $active.is(':first-child'));
		$container.find('.cd-next').toggleClass('inactive', $active.is(':last-child'));
	}

	function enableSwipe($container) {
		var mq = window.getComputedStyle(document.querySelector('.cd-slider'), '::before').getPropertyValue('content').replace(/"/g, "").replace(/'/g, "");
		return ( mq=='mobile' || $container.hasClass('cd-slider-active'));
	}
});
