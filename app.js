/**
 * Cosmic Journey // The Nebula Project
 * 100% Hardware-Accelerated, Zero-Lag, Cinematic Video Experience
 * 
 * - Plays instantly and automatically on load with GPU hardware decoding
 * - Frame-accurate caption synchronization: exactly at scene cut boundaries
 * - Snappy 0.15s caption crossfade eliminates delays
 * - The web page continuously scrolls by itself down the scroll track in an infinite loop
 * - Zero UI bars, zero end popups - only the pure cosmic video with cursive captions
 * - Automatic background soundtrack: "Someone You Loved.mp3" loops seamlessly forever
 */

(function () {
  'use strict';

  const video = document.getElementById('cosmic-video');
  const audio = document.getElementById('bg-music');
  let isProgrammaticScroll = false;
  let isManualScrubbing = false;
  let manualScrollTimeout = null;

  // Fast, dynamic pacing (~20-21s total journey)
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

  /**
   * Frame-Accurate Scene Timing (676 Total Frames):
   * 1. Glittering Dawn (134 frames): 0 -> 134/676 = 0.000 to 0.198
   * 2. Opening Observatory (60 frames): 134/676 -> 194/676 = 0.198 to 0.287
   * 3. Dreamy Nebula Flight (60 frames): 194/676 -> 254/676 = 0.287 to 0.376
   * 4. Planet Radiation (120 frames): 254/676 -> 374/676 = 0.376 to 0.553
   * 5. Black Hole Singularity (302 frames): 374/676 -> 676/676 = 0.553 to 1.000
   */
  function updateCaptions(progress) {
    let currentIdx = -1;

    if (progress < 0.198) {
      currentIdx = 0; // Scene 1: Dawn ("Under the quiet night...")
    } else if (progress < 0.287) {
      currentIdx = 1; // Scene 2: Observatory ("Where the galaxies begin...")
    } else if (progress < 0.376) {
      currentIdx = 2; // Scene 3: Nebula ("Drifting through luminous nebulae...")
    } else if (progress < 0.553) {
      currentIdx = 3; // Scene 4: Planet Radiation ("Witnessing the fiery birth...")
    } else {
      currentIdx = 4; // Scene 5: Black Hole ("At the edge of spacetime...")
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

  // --- Automatic Background Soundtrack (Someone You Loved.mp3) ---
  function initAudio() {
    if (!audio) return;
    audio.volume = 1.0;
    audio.loop = true;

    // Automatic seamless infinite loop when song reaches the end
    audio.addEventListener('ended', () => {
      audio.currentTime = 0;
      audio.play().catch(() => {});
    });

    // Attempt instant unmuted autoplay on load
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        // If the browser blocks unmuted audio on initial load before any user interaction,
        // start playback immediately on the very first gesture anywhere on the screen.
        const unlock = () => {
          if (audio.paused) {
            audio.play().catch(() => {});
          }
        };

        ['pointerdown', 'mousedown', 'click', 'keydown', 'touchstart'].forEach(type => {
          window.addEventListener(type, unlock, { once: true, capture: true, passive: true });
        });
      });
    }
  }

  // Ensure clicking anywhere on the screen starts/resumes audio without interrupting the video
  window.addEventListener('click', () => {
    if (audio && audio.paused) {
      audio.play().catch(() => {});
    }
  }, { passive: true });

  // --- Guaranteed Instant Video Autoplay ---
  function startPlayback() {
    video.playbackRate = currentSpeed;
    video.muted = true; // Guaranteed instant autoplay across all modern browsers
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise.catch(() => {
        const startOnGesture = () => {
          video.play();
          window.removeEventListener('pointerdown', startOnGesture);
          window.removeEventListener('keydown', startOnGesture);
        };
        window.addEventListener('pointerdown', startOnGesture, { once: true });
        window.addEventListener('keydown', startOnGesture, { once: true });
      });
    }
    initAudio();
  }

  // --- Autonomous Page Scrolling Engine ("Always automatically scrolls") ---
  function syncScrollWithVideo() {
    if (!video.paused && video.duration && !isManualScrubbing) {
      const progress = video.currentTime / video.duration;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;

      if (maxScroll > 0) {
        const targetScrollY = Math.round(progress * maxScroll);
        // Only trigger scroll when pixel difference is meaningful to prevent micro-stutter
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

  // --- Loop Reset: Smooth scroll back to top when video repeats ---
  video.addEventListener('seeked', () => {
    if (video.currentTime < 0.2) {
      isProgrammaticScroll = true;
      window.scrollTo(0, 0);
    }
  });

  // --- Invisible Background Keyboard Controls (Optional) ---
  window.addEventListener('keydown', (e) => {
    switch (e.key) {
      case ' ':
      case 'k':
      case 'K':
        e.preventDefault();
        if (video.paused) {
          video.play();
          if (audio && audio.paused) audio.play().catch(() => {});
        } else {
          video.pause();
          if (audio && !audio.paused) audio.pause();
        }
        break;

      case '1': // Standard 1.0x speed
        currentSpeed = 1.0;
        video.playbackRate = currentSpeed;
        break;

      case '2': // Fast speed (1.15x)
        currentSpeed = 1.15;
        video.playbackRate = currentSpeed;
        break;

      case '3': // Extra fast speed (1.35x)
        currentSpeed = 1.35;
        video.playbackRate = currentSpeed;
        break;

      case 's':
      case 'S': // Toggle between Normal and Fast
        currentSpeed = (currentSpeed === 1.0) ? 1.15 : 1.0;
        video.playbackRate = currentSpeed;
        break;

      case 'r':
      case 'R': // Restart video
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

  // Also trigger audio initialization directly if DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAudio);
  } else {
    initAudio();
  }

  // Start autonomous scrolling loop immediately
  requestAnimationFrame(syncScrollWithVideo);

})();
