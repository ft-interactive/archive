(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
'use strict';

var _mobileNav = require('./mobile-nav');

var _mobileNav2 = _interopRequireDefault(_mobileNav);

var _stateEcvotesGraphic = require('./state-ecvotes-graphic');

var _stateEcvotesGraphic2 = _interopRequireDefault(_stateEcvotesGraphic);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Site main frontendian code entry point
 */

(function main() {
  (0, _mobileNav2.default)();
  (0, _stateEcvotesGraphic2.default)();
})();

},{"./mobile-nav":2,"./state-ecvotes-graphic":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setupMobileNav;
function setupMobileNav() {
  var overlay = document.createElement('div');
  var aside = document.querySelector('.article__aside');
  var backButton = document.querySelector('.nav___mobile-nav:not(.page__national) .nav___mobile-nav--back-to-overview');
  var chooseStateButton = document.querySelector('.nav___mobile-nav--choose-state');
  var closeMobileNavButton = document.querySelector('.rail__close-button--button');
  var threshold = 150; // required min distance traveled to be considered swipe
  var allowedTime = 200; // maximum time allowed to travel that distance
  var elapsedTime = void 0;
  var startTime = void 0;
  var startX = void 0;
  var startY = void 0;
  var dist = void 0;

  function toggleMenu() {
    aside.classList.toggle('opened');
    overlay.classList.toggle('opened');
  }

  function goHome() {
    window.location.href = 'polls';
  }

  function closeMenu() {
    aside.classList.remove('opened');
    overlay.classList.remove('opened');
  }

  function handleswipe(isrightswipe) {
    if (isrightswipe) closeMenu();
  }

  function menuSwipeStart(e) {
    var touchobj = e.changedTouches[0];
    dist = 0;
    startX = touchobj.pageX;
    startY = touchobj.pageY;
    startTime = new Date().getTime();
  }

  function menuSwipeEnd(e) {
    var touchobj = e.changedTouches[0];
    dist = touchobj.pageX - startX;
    elapsedTime = new Date().getTime() - startTime; // get time elapsed

    // check that elapsed time is within specified, horizontal dist traveled >= threshold, and vertical dist traveled <= 100
    var swiperightBol = elapsedTime <= allowedTime && dist >= threshold && Math.abs(touchobj.pageY - startY) <= 100;
    handleswipe(swiperightBol);
  }

  overlay.classList.add('rail__mobile-overlay');
  overlay.addEventListener('click', closeMenu);
  document.body.appendChild(overlay);

  try {
    aside.addEventListener('touchstart', menuSwipeStart, false);
    aside.addEventListener('touchend', menuSwipeEnd, false);
    chooseStateButton.addEventListener('click', toggleMenu);
    closeMobileNavButton.addEventListener('click', closeMenu);

    if (backButton) {
      backButton.addEventListener('click', goHome);
    }
  } catch (e) {
    console.error(e);
  }
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setupECVotes;

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function setupECVotes() {
  // Interactivity for EC votes chart (state page)
  var ecVotesTooltip = document.querySelector('.state-ecvotes-graphic__tooltip');
  var originalsquares = document.querySelectorAll('.state-ecvotes-graphic__squares > div.current-state');
  var currentState = void 0;

  [].concat(_toConsumableArray(originalsquares)).forEach(function (d) {
    return d.classList.add('state-ecvotes-graphic__square--ec-vote');
  });

  [].concat(_toConsumableArray(document.querySelectorAll('.state-ecvotes-graphic__squares > div'))).forEach(function (d) {
    function selectStateHandler(e) {
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
        return;
      }
      var parent = e.target.parentNode;
      var stateAbbr = parent.dataset.state || e.target.dataset.state;
      var stateName = parent.dataset.stateName || e.target.dataset.stateName;
      var states = document.querySelectorAll('[data-state="' + stateAbbr + '"]');

      [].concat(_toConsumableArray(document.querySelectorAll('.state-ecvotes-graphic__square--ec-vote'))).forEach(function (item) {
        return item.classList.remove('state-ecvotes-graphic__square--ec-vote');
      });
      [].concat(_toConsumableArray(states)).forEach(function (item) {
        return item.classList.add('state-ecvotes-graphic__square--ec-vote');
      });

      ecVotesTooltip.innerText = stateName + ': ' + states.length + ' vote' + (states.length ? 's' : '');
      ecVotesTooltip.style.top = e.target.offsetTop - 20 + 'px';
      ecVotesTooltip.style.left = e.target.offsetLeft + 20 + 'px';
      ecVotesTooltip.style.position = 'absolute';
      ecVotesTooltip.style.display = 'block';
    }

    d.addEventListener('mouseover', selectStateHandler);

    d.addEventListener('mouseout', function () {
      [].concat(_toConsumableArray(document.querySelectorAll('.state-ecvotes-graphic__square--ec-vote'))).forEach(function (item) {
        return item.classList.remove('state-ecvotes-graphic__square--ec-vote');
      });
      [].concat(_toConsumableArray(originalsquares)).forEach(function (item) {
        return item.classList.add('state-ecvotes-graphic__square--ec-vote');
      });

      ecVotesTooltip.innerText = '';
      ecVotesTooltip.style.display = 'none';
    });

    d.addEventListener('click', function (e) {
      var stateAbbr = e.target.parentNode.dataset.state || e.target.dataset.state;
      if ('ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0) {
        return;
      } else {
        window.location.href = stateAbbr + '-polls';
      }
    });
  });
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJjbGllbnQvbWFpbi5lbnRyeS5qcyIsImNsaWVudC9tb2JpbGUtbmF2LmpzIiwiY2xpZW50L3N0YXRlLWVjdm90ZXMtZ3JhcGhpYy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDSUE7Ozs7QUFDQTs7Ozs7O0FBTEE7Ozs7QUFPQyxVQUFTLElBQVQsR0FBZ0I7QUFDZjtBQUNBO0FBQ0QsQ0FIQSxHQUFEOzs7Ozs7OztrQkNQd0IsYztBQUFULFNBQVMsY0FBVCxHQUEwQjtBQUN2QyxNQUFNLFVBQVUsU0FBUyxhQUFULENBQXVCLEtBQXZCLENBQWhCO0FBQ0EsTUFBTSxRQUFRLFNBQVMsYUFBVCxDQUF1QixpQkFBdkIsQ0FBZDtBQUNBLE1BQU0sYUFBYSxTQUFTLGFBQVQsQ0FBdUIsNEVBQXZCLENBQW5CO0FBQ0EsTUFBTSxvQkFBb0IsU0FBUyxhQUFULENBQXVCLGlDQUF2QixDQUExQjtBQUNBLE1BQU0sdUJBQXVCLFNBQVMsYUFBVCxDQUF1Qiw2QkFBdkIsQ0FBN0I7QUFDQSxNQUFNLFlBQVksR0FBbEIsQ0FOdUMsQ0FNaEI7QUFDdkIsTUFBTSxjQUFjLEdBQXBCLENBUHVDLENBT2Q7QUFDekIsTUFBSSxvQkFBSjtBQUNBLE1BQUksa0JBQUo7QUFDQSxNQUFJLGVBQUo7QUFDQSxNQUFJLGVBQUo7QUFDQSxNQUFJLGFBQUo7O0FBRUEsV0FBUyxVQUFULEdBQXNCO0FBQ3BCLFVBQU0sU0FBTixDQUFnQixNQUFoQixDQUF1QixRQUF2QjtBQUNBLFlBQVEsU0FBUixDQUFrQixNQUFsQixDQUF5QixRQUF6QjtBQUNEOztBQUVELFdBQVMsTUFBVCxHQUFrQjtBQUNoQixXQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBdUIsT0FBdkI7QUFDRDs7QUFFRCxXQUFTLFNBQVQsR0FBcUI7QUFDbkIsVUFBTSxTQUFOLENBQWdCLE1BQWhCLENBQXVCLFFBQXZCO0FBQ0EsWUFBUSxTQUFS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QixNQUFuQixJQUNELFVBQVUsY0FBVixHQUEyQixDQUQxQixJQUVELFVBQVUsZ0JBQVYsR0FBNkIsQ0FGaEMsRUFFb0M7QUFDbEM7QUFDRCxPQUpELE1BSU87QUFDTCxlQUFPLFFBQVAsQ0FBZ0IsSUFBaEIsR0FBMEIsU0FBMUI7QUFDRDtBQUNGLEtBVEQ7QUFVRCxHQS9DSDtBQWdERCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uKCl7ZnVuY3Rpb24gcihlLG4sdCl7ZnVuY3Rpb24gbyhpLGYpe2lmKCFuW2ldKXtpZighZVtpXSl7dmFyIGM9XCJmdW5jdGlvblwiPT10eXBlb2YgcmVxdWlyZSYmcmVxdWlyZTtpZighZiYmYylyZXR1cm4gYyhpLCEwKTtpZih1KXJldHVybiB1KGksITApO3ZhciBhPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIraStcIidcIik7dGhyb3cgYS5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGF9dmFyIHA9bltpXT17ZXhwb3J0czp7fX07ZVtpXVswXS5jYWxsKHAuZXhwb3J0cyxmdW5jdGlvbihyKXt2YXIgbj1lW2ldWzFdW3JdO3JldHVybiBvKG58fHIpfSxwLHAuZXhwb3J0cyxyLGUsbix0KX1yZXR1cm4gbltpXS5leHBvcnRzfWZvcih2YXIgdT1cImZ1bmN0aW9uXCI9PXR5cGVvZiByZXF1aXJlJiZyZXF1aXJlLGk9MDtpPHQubGVuZ3RoO2krKylvKHRbaV0pO3JldHVybiBvfXJldHVybiByfSkoKSIsIi8qKlxuICogU2l0ZSBtYWluIGZyb250ZW5kaWFuIGNvZGUgZW50cnkgcG9pbnRcbiAqL1xuXG5pbXBvcnQgbW9iaWxlTmF2IGZyb20gJy4vbW9iaWxlLW5hdic7XG5pbXBvcnQgZWNWb3RlcyBmcm9tICcuL3N0YXRlLWVjdm90ZXMtZ3JhcGhpYyc7XG5cbihmdW5jdGlvbiBtYWluKCkge1xuICBtb2JpbGVOYXYoKTtcbiAgZWNWb3RlcygpO1xufSgpKTtcbiIsImV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHNldHVwTW9iaWxlTmF2KCkge1xuICBjb25zdCBvdmVybGF5ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudCgnZGl2Jyk7XG4gIGNvbnN0IGFzaWRlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmFydGljbGVfX2FzaWRlJyk7XG4gIGNvbnN0IGJhY2tCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcubmF2X19fbW9iaWxlLW5hdjpub3QoLnBhZ2VfX25hdGlvbmFsKSAubmF2X19fbW9iaWxlLW5hdi0tYmFjay10by1vdmVydmlldycpO1xuICBjb25zdCBjaG9vc2VTdGF0ZUJ1dHRvbiA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5uYXZfX19tb2JpbGUtbmF2LS1jaG9vc2Utc3RhdGUnKTtcbiAgY29uc3QgY2xvc2VNb2JpbGVOYXZCdXR0b24gPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcucmFpbF9fY2xvc2UtYnV0dG9uLS1idXR0b24nKTtcbiAgY29uc3QgdGhyZXNob2xkID0gMTUwOyAvLyByZXF1aXJlZCBtaW4gZGlzdGFuY2UgdHJhdmVsZWQgdG8gYmUgY29uc2lkZXJlZCBzd2lwZVxuICBjb25zdCBhbGxvd2VkVGltZSA9IDIwMDsgLy8gbWF4aW11bSB0aW1lIGFsbG93ZWQgdG8gdHJhdmVsIHRoYXQgZGlzdGFuY2VcbiAgbGV0IGVsYXBzZWRUaW1lO1xuICBsZXQgc3RhcnRUaW1lO1xuICBsZXQgc3RhcnRYO1xuICBsZXQgc3RhcnRZO1xuICBsZXQgZGlzdDtcblxuICBmdW5jdGlvbiB0b2dnbGVNZW51KCkge1xuICAgIGFzaWRlLmNsYXNzTGlzdC50b2dnbGUoJ29wZW5lZCcpO1xuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnRvZ2dsZSgnb3BlbmVkJyk7XG4gIH1cblxuICBmdW5jdGlvbiBnb0hvbWUoKSB7XG4gICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSAncG9sbHMnO1xuICB9XG5cbiAgZnVuY3Rpb24gY2xvc2VNZW51KCkge1xuICAgIGFzaWRlLmNsYXNzTGlzdC5yZW1vdmUoJ29wZW5lZCcpO1xuICAgIG92ZXJsYXkuY2xhc3NMaXN0LnJlbW92ZSgnb3BlbmVkJyk7XG4gIH1cblxuICBmdW5jdGlvbiBoYW5kbGVzd2lwZShpc3JpZ2h0c3dpcGUpIHtcbiAgICBpZiAoaXNyaWdodHN3aXBlKSBjbG9zZU1lbnUoKTtcbiAgfVxuXG4gIGZ1bmN0aW9uIG1lbnVTd2lwZVN0YXJ0KGUpIHtcbiAgICB2YXIgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgIGRpc3QgPSAwO1xuICAgIHN0YXJ0WCA9IHRvdWNob2JqLnBhZ2VYO1xuICAgIHN0YXJ0WSA9IHRvdWNob2JqLnBhZ2VZO1xuICAgIHN0YXJ0VGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuICB9XG5cbiAgZnVuY3Rpb24gbWVudVN3aXBlRW5kKGUpIHtcbiAgICB2YXIgdG91Y2hvYmogPSBlLmNoYW5nZWRUb3VjaGVzWzBdO1xuICAgIGRpc3QgPSB0b3VjaG9iai5wYWdlWCAtIHN0YXJ0WDtcbiAgICBlbGFwc2VkVGltZSA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpIC0gc3RhcnRUaW1lOyAvLyBnZXQgdGltZSBlbGFwc2VkXG5cbiAgICAvLyBjaGVjayB0aGF0IGVsYXBzZWQgdGltZSBpcyB3aXRoaW4gc3BlY2lmaWVkLCBob3Jpem9udGFsIGRpc3QgdHJhdmVsZWQgPj0gdGhyZXNob2xkLCBhbmQgdmVydGljYWwgZGlzdCB0cmF2ZWxlZCA8PSAxMDBcbiAgICB2YXIgc3dpcGVyaWdodEJvbCA9IChlbGFwc2VkVGltZSA8PSBhbGxvd2VkVGltZSAmJiBkaXN0ID49IHRocmVzaG9sZCAmJiBNYXRoLmFicyh0b3VjaG9iai5wYWdlWSAtIHN0YXJ0WSkgPD0gMTAwKTtcbiAgICBoYW5kbGVzd2lwZShzd2lwZXJpZ2h0Qm9sKTtcbiAgfVxuXG4gIG92ZXJsYXkuY2xhc3NMaXN0LmFkZCgncmFpbF9fbW9iaWxlLW92ZXJsYXknKTtcbiAgb3ZlcmxheS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGNsb3NlTWVudSk7XG4gIGRvY3VtZW50LmJvZHkuYXBwZW5kQ2hpbGQob3ZlcmxheSk7XG5cbiAgdHJ5IHtcbiAgICBhc2lkZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaHN0YXJ0JywgbWVudVN3aXBlU3RhcnQsIGZhbHNlKTtcbiAgICBhc2lkZS5hZGRFdmVudExpc3RlbmVyKCd0b3VjaGVuZCcsIG1lbnVTd2lwZUVuZCwgZmFsc2UpO1xuICAgIGNob29zZVN0YXRlQnV0dG9uLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgdG9nZ2xlTWVudSk7XG4gICAgY2xvc2VNb2JpbGVOYXZCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBjbG9zZU1lbnUpO1xuXG4gICAgaWYgKGJhY2tCdXR0b24pIHtcbiAgICAgIGJhY2tCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCBnb0hvbWUpO1xuICAgIH1cbiAgfSBjYXRjaChlKSB7XG4gICAgY29uc29sZS5lcnJvcihlKVxuICB9XG59XG4iLCJleHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzZXR1cEVDVm90ZXMoKSB7XG4gIC8vIEludGVyYWN0aXZpdHkgZm9yIEVDIHZvdGVzIGNoYXJ0IChzdGF0ZSBwYWdlKVxuICBjb25zdCBlY1ZvdGVzVG9vbHRpcCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5zdGF0ZS1lY3ZvdGVzLWdyYXBoaWNfX3Rvb2x0aXAnKTtcbiAgY29uc3Qgb3JpZ2luYWxzcXVhcmVzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnLnN0YXRlLWVjdm90ZXMtZ3JhcGhpY19fc3F1YXJlcyA+IGRpdi5jdXJyZW50LXN0YXRlJyk7XG4gIGxldCBjdXJyZW50U3RhdGU7XG5cbiAgWy4uLm9yaWdpbmFsc3F1YXJlc10uZm9yRWFjaChkID0+IGQuY2xhc3NMaXN0LmFkZCgnc3RhdGUtZWN2b3Rlcy1ncmFwaGljX19zcXVhcmUtLWVjLXZvdGUnKSk7XG5cbiAgWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGF0ZS1lY3ZvdGVzLWdyYXBoaWNfX3NxdWFyZXMgPiBkaXYnKV1cbiAgICAuZm9yRWFjaChkID0+IHtcbiAgICAgIGZ1bmN0aW9uIHNlbGVjdFN0YXRlSGFuZGxlcihlKSB7XG4gICAgICAgIGlmICgoJ29udG91Y2hzdGFydCcgaW4gd2luZG93KSB8fFxuICAgICAgICAgIChuYXZpZ2F0b3IubWF4VG91Y2hQb2ludHMgPiAwKSB8fFxuICAgICAgICAgIChuYXZpZ2F0b3IubXNNYXhUb3VjaFBvaW50cyA+IDApKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgY29uc3QgcGFyZW50ID0gZS50YXJnZXQucGFyZW50Tm9kZTtcbiAgICAgICAgY29uc3Qgc3RhdGVBYmJyID0gcGFyZW50LmRhdGFzZXQuc3RhdGUgfHwgZS50YXJnZXQuZGF0YXNldC5zdGF0ZTtcbiAgICAgICAgY29uc3Qgc3RhdGVOYW1lID0gcGFyZW50LmRhdGFzZXQuc3RhdGVOYW1lIHx8IGUudGFyZ2V0LmRhdGFzZXQuc3RhdGVOYW1lO1xuICAgICAgICBjb25zdCBzdGF0ZXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGBbZGF0YS1zdGF0ZT1cIiR7c3RhdGVBYmJyfVwiXWApO1xuXG4gICAgICAgIFsuLi5kb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCcuc3RhdGUtZWN2b3Rlcy1ncmFwaGljX19zcXVhcmUtLWVjLXZvdGUnKV1cbiAgICAgICAgICAuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LnJlbW92ZSgnc3RhdGUtZWN2b3Rlcy1ncmFwaGljX19zcXVhcmUtLWVjLXZvdGUnKSk7XG4gICAgICAgIFsuLi5zdGF0ZXNdXG4gICAgICAgICAgLmZvckVhY2goaXRlbSA9PiBpdGVtLmNsYXNzTGlzdC5hZGQoJ3N0YXRlLWVjdm90ZXMtZ3JhcGhpY19fc3F1YXJlLS1lYy12b3RlJykpO1xuXG4gICAgICAgIGVjVm90ZXNUb29sdGlwLmlubmVyVGV4dCA9IGAke3N0YXRlTmFtZX06ICR7c3RhdGVzLmxlbmd0aH0gdm90ZSR7c3RhdGVzLmxlbmd0aCA/ICdzJyA6ICcnfWA7XG4gICAgICAgIGVjVm90ZXNUb29sdGlwLnN0eWxlLnRvcCA9IGAke2UudGFyZ2V0Lm9mZnNldFRvcCAtIDIwfXB4YDtcbiAgICAgICAgZWNWb3Rlc1Rvb2x0aXAuc3R5bGUubGVmdCA9IGAke2UudGFyZ2V0Lm9mZnNldExlZnQgKyAyMH1weGA7XG4gICAgICAgIGVjVm90ZXNUb29sdGlwLnN0eWxlLnBvc2l0aW9uID0gJ2Fic29sdXRlJztcbiAgICAgICAgZWNWb3Rlc1Rvb2x0aXAuc3R5bGUuZGlzcGxheSA9ICdibG9jayc7XG4gICAgICB9XG5cbiAgICAgIGQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2VvdmVyJywgc2VsZWN0U3RhdGVIYW5kbGVyKTtcblxuICAgICAgZC5hZGRFdmVudExpc3RlbmVyKCdtb3VzZW91dCcsICgpID0+IHtcbiAgICAgICAgWy4uLmRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJy5zdGF0ZS1lY3ZvdGVzLWdyYXBoaWNfX3NxdWFyZS0tZWMtdm90ZScpXVxuICAgICAgICAgIC5mb3JFYWNoKGl0ZW0gPT4gaXRlbS5jbGFzc0xpc3QucmVtb3ZlKCdzdGF0ZS1lY3ZvdGVzLWdyYXBoaWNfX3NxdWFyZS0tZWMtdm90ZScpKTtcbiAgICAgICAgWy4uLm9yaWdpbmFsc3F1YXJlc11cbiAgICAgICAgICAuZm9yRWFjaChpdGVtID0+IGl0ZW0uY2xhc3NMaXN0LmFkZCgnc3RhdGUtZWN2b3Rlcy1ncmFwaGljX19zcXVhcmUtLWVjLXZvdGUnKSk7XG5cbiAgICAgICAgZWNWb3Rlc1Rvb2x0aXAuaW5uZXJUZXh0ID0gJyc7XG4gICAgICAgIGVjVm90ZXNUb29sdGlwLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gICAgICB9KTtcblxuICAgICAgZC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIGUgPT4ge1xuICAgICAgICBjb25zdCBzdGF0ZUFiYnIgPSBlLnRhcmdldC5wYXJlbnROb2RlLmRhdGFzZXQuc3RhdGUgfHwgZS50YXJnZXQuZGF0YXNldC5zdGF0ZTtcbiAgICAgICAgaWYgKCgnb250b3VjaHN0YXJ0JyBpbiB3aW5kb3cpIHx8XG4gICAgICAgICAgKG5hdmlnYXRvci5tYXhUb3VjaFBvaW50cyA+IDApIHx8XG4gICAgICAgICAgKG5hdmlnYXRvci5tc01heFRvdWNoUG9pbnRzID4gMCkpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgd2luZG93LmxvY2F0aW9uLmhyZWYgPSBgJHtzdGF0ZUFiYnJ9LXBvbGxzYDtcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG59XG4iXX0=
