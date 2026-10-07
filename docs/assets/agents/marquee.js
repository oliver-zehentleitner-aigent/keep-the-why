/* Logo strips on the landing page (agents under the hero, Git hosts under
   the cards): drag to scroll with mouse or touch. Without this script a
   strip runs on the CSS animation alone; with it, the script drives the
   same motion so a drag can continue from where the hand let go. The CSS
   decides per strip whether it moves at all: --ktw-strip on the track is 1
   for a moving strip and 0 for a standing row (the host row where the
   width holds it); the script follows that on every resize. Reduced
   motion: the CSS shows the lists static, the script stays out. */
(function () {
  "use strict";
  var SPEED = 24; // px per second, roughly the CSS pace at the hero width
  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  function setup(viewport) {
    var track = viewport.querySelector(".ktw-agents__track");
    if (!track) return;

    var active = false, offset = 0, half = 0, hover = false, dragging = false, moved = false;
    var startX = 0, startOffset = 0, last = 0, pointerId = null;

    function isStrip() { return getComputedStyle(track).getPropertyValue("--ktw-strip").trim() !== "0"; }
    function measure() { half = track.scrollWidth / 2; }
    function wrap(x) { return half ? ((x % half) + half) % half - half : x; }
    function render() { track.style.transform = "translateX(" + offset + "px)"; }

    // Take the motion over from the CSS animation: freeze it at its current
    // position, then continue from there. Standing row: hand it back.
    function sync() {
      var strip = isStrip();
      if (strip && !active) {
        var computed = getComputedStyle(track).transform;
        if (computed && computed !== "none") {
          var m = computed.match(/matrix\(([^)]+)\)/);
          if (m) offset = parseFloat(m[1].split(",")[4]) || 0;
        }
        track.classList.add("ktw-agents__track--scripted");
      } else if (!strip && active) {
        track.classList.remove("ktw-agents__track--scripted");
        track.style.transform = "";
        offset = 0;
      }
      active = strip;
      if (active) { measure(); offset = wrap(offset); render(); }
    }
    sync();

    function frame(now) {
      var dt = last ? (now - last) / 1000 : 0;
      last = now;
      if (active && !hover && !dragging && !document.hidden) {
        offset = wrap(offset - SPEED * dt);
        render();
      }
      requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);

    viewport.addEventListener("mouseenter", function () { hover = true; });
    viewport.addEventListener("mouseleave", function () { hover = false; });

    // Capturing the pointer on pointerdown would steer the click away from
    // the logo under it, so the drag only starts once the pointer has moved.
    viewport.addEventListener("pointerdown", function (e) {
      if (!active) return;
      if (e.button !== 0 && e.pointerType === "mouse") return;
      dragging = true; moved = false; pointerId = e.pointerId;
      startX = e.clientX; startOffset = offset;
    });
    viewport.addEventListener("pointermove", function (e) {
      if (!dragging || e.pointerId !== pointerId) return;
      var dx = e.clientX - startX;
      if (!moved) {
        if (Math.abs(dx) <= 4) return;
        moved = true;
        viewport.setPointerCapture(pointerId);
        viewport.classList.add("ktw-agents__viewport--dragging");
      }
      offset = wrap(startOffset + dx);
      render();
    });
    function release(e) {
      if (!dragging || e.pointerId !== pointerId) return;
      dragging = false; pointerId = null;
      viewport.classList.remove("ktw-agents__viewport--dragging");
    }
    viewport.addEventListener("pointerup", release);
    viewport.addEventListener("pointercancel", release);
    // A drag is not a click on the logo under the pointer.
    viewport.addEventListener("click", function (e) {
      if (moved) { e.preventDefault(); e.stopPropagation(); moved = false; }
    }, true);
    viewport.addEventListener("dragstart", function (e) { e.preventDefault(); });

    // The width decides the mode; a container query answers to the box, not
    // the window, so watch the box where the browser allows.
    if (window.ResizeObserver) new ResizeObserver(sync).observe(viewport);
    else window.addEventListener("resize", sync);
  }

  var viewports = document.querySelectorAll(".ktw-agents__viewport");
  for (var i = 0; i < viewports.length; i++) setup(viewports[i]);
})();
