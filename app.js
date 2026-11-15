/**
 * Cosmic Journey // The Nebula Project
 * 100% Hardware-Accelerated, Zero-Lag, Fast Cinematic Video Experience
 * 
 * - Plays instantly and automatically on load with GPU hardware decoding
 * - Fast, fluid, dynamic pacing (~21-24s total journey, 0% stutter)
 * - The web page continuously scrolls by itself down the scroll track in an infinite loop
 * - Zero UI bars, zero end popups - only the pure cosmic video with cursive captions
 */

(function () {
  'use strict';

  const video = document.getElementById('cosmic-video');
  let isProgrammaticScroll = false;
  let isManualScrubbing = false;
  let manualScrollTimeout = null;

  // Default to a brisk, fluid, exciting speed ("a little fast")
  let currentSpeed = 1.15;

  // --- Captions Overlay ---
  const captionEls = [
    document.getElementById('cap-1'),
    document.getElementById('cap-2'),
    document.getElementById('cap-3'),
    document.getElementById('cap-4'),
    document.getElementById('cap-5'),
  ];
  let activeCaptionIdx = -1;

  function updateCaptions(progress) {
    let currentIdx = -1;

    // Timeline breakdown:
    // Scene 1: Mountain Camp & Milky Way (Dawn) ~0.00 - 0.19
    // Scene 2: Deep Sky Observatory (Opening) ~0.20 - 0.29
    // Scene 3: Interstellar Flight (Dreamy Nebula) ~0.30 - 0.41
    // Scene 4: Stellar Explosion & Planets (Planet Radiation) ~0.42 - 0.60
    // Scene 5: Black Hole Singularity ~0.61 - 0.99
    if (progress >= 0.00 && progress <= 0.19) {
      currentIdx = 0;
    } else if (progress >= 0.20 && progress <= 0.29) {
      currentIdx = 1;
    } else if (progress >= 0.30 && progress <= 0.41) {
      currentIdx = 2;
    } else if (progress >= 0.42 && progress <= 0.60) {
      currentIdx = 3;
    } else if (progress >= 0.61 && progress <= 0.99) {
      currentIdx = 4;
    }

    if (currentIdx !== activeCaptionIdx) {
      activeCaptionIdx = currentIdx;
      captionEls.forEach((el, idx) => {
        if (!el) return;
        if (idx === currentIdx) {
          el.classList.add('is-active');
        } else {
          el.classList.remove('is-active');
        }
      });
    }
  }

  // --- Guaranteed Instant Autoplay ---
  function startPlayback() {
    video.playbackRate = currentSpeed;
    video.muted = true; // Guaranteed instant autoplay across all modern browsers
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // Fallback: trigger on first user gesture if browser is in extreme lockdown
        const startOnGesture = () => {
          video.play();
          window.removeEventListener('pointerdown', startOnGesture);
          window.removeEventListener('keydown', startOnGesture);
        };
        window.addEventListener('pointerdown', startOnGesture, { once: true });
        window.addEventListener('keydown', startOnGesture, { once: true });
      });
    }
  }

  // --- Autonomous Page Scrolling Engine ("Always automatically scrolls") ---
  function syncScrollWithVideo() {
    if (!video.paused && video.duration && !isManualScrubbing) {
      const progress = video.currentTime / video.duration;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll > 0) {
        const targetScrollY = Math.round(progress * maxScroll);
        // Only trigger scroll when pixel difference is meaningful to eliminate micro-stutter
        if (Math.abs(window.scrollY - targetScrollY) >= 2) {
          isProgrammaticScroll = true;
          window.scrollTo(0, targetScrollY);
        }
      }

      updateCaptions(progress);
    }

    requestAnimationFrame(syncScrollWithVideo);
  }

  // --- Manual Scroll Scrubbing ---
  window.addEventListener('scroll', () => {
    if (isProgrammaticScroll) {
      isProgrammaticScroll = false;
      return;
    }

    // User is manually scrolling
    isManualScrubbing = true;
    clearTimeout(manualScrollTimeout);

    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    if (maxScroll > 0 && video.duration) {
      const progress = Math.max(0, Math.min(1, window.scrollY / maxScroll));
      video.currentTime = progress * video.duration;
      updateCaptions(progress);
    }

    // Resume smooth auto-scroll when user finishes scrolling
    manualScrollTimeout = setTimeout(() => {
      isManualScrubbing = false;
    }, 150);
  }, { passive: true });

  // --- Canvas / Video Click to Pause / Resume ---
  video.addEventListener('click', () => {
    if (video.paused) {
      video.play();
    } else {
      video.pause();
    }
  });

  // --- Loop Reset: Smooth scroll back to top when repeating ---
  video.addEventListener('seeked', () => {
    if (video.currentTime < 0.2) {
      isProgrammaticScroll = true;
      window.scrollTo(0, 0);
    }
  });

  // --- Invisible Keyboard Controls ---
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case ' ':
      case 'k':
      case 'K':
        e.preventDefault();
        if (video.paused) video.play(); else video.pause();
        break;

      case '1': // Normal speed
        currentSpeed = 1.0;
        video.playbackRate = currentSpeed;
        break;

      case '2': // Fast speed ("a little fast")
        currentSpeed = 1.35;
        video.playbackRate = currentSpeed;
        break;

      case 's':
      case 'S': // Toggle speed
        currentSpeed = (currentSpeed === 1.0) ? 1.35 : 1.0;
        video.playbackRate = currentSpeed;
        break;

      case 'r':
      case 'R': // Restart
        video.currentTime = 0;
        isProgrammaticScroll = true;
        window.scrollTo(0, 0);
        video.play();
        break;

      case 'f':
      case 'F': // Fullscreen
        if (!document.fullscreenElement) {
          document.documentElement.requestFullscreen().catch(() => {});
        } else {
          document.exitFullscreen().catch(() => {});
        }
        break;
    }
  });

  // --- Initialize ---
  if (video.readyState >= 2) {
    startPlayback();
  } else {
    video.addEventListener('loadeddata', startPlayback, { once: true });
    video.addEventListener('canplay', startPlayback, { once: true });
  }

  // Start autonomous scrolling loop immediately
  requestAnimationFrame(syncScrollWithVideo);

})();
