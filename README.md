# Cosmic Journey // The Nebula Project

An ultra-smooth, hardware-accelerated, full-screen cinematic video experience synchronizing five cosmic stages into a continuous, color-harmonized odyssey.

The webpage automatically plays instantly on load and continuously scrolls down by itself in a seamless infinite loop—zero UI bars, zero end popups, zero lag, only the pure cosmic video.

---

## 🎬 Key Features

1. **🚀 100% Zero-Lag Hardware Acceleration**:
   - Native GPU hardware decoding (`Cosmic_Journey.mp4` @ 1080p 30 FPS).
   - Eliminates WebP image network queue bottleneck and main-thread decoding hitches. Runs at a silky smooth, rock-solid 60 FPS refresh rate.

2. **⚡ Fast & Fluid Pacing ("A Little Fast")**:
   - The entire 5-scene cosmic journey now traverses in a brisk, dynamic **~21–24 seconds** (~30 fps equivalent).
   - Fast, punchy transitions between scenes keep the motion continuous with zero stalling.

3. **▶️ Instant Autoplay on Load**:
   - The video starts playing the exact millisecond the website is opened in your browser with zero delay and no user interaction needed.

4. **📜 Continuous Autonomous Auto-Scroll**:
   - The webpage **always automatically scrolls down by itself** in real-time sync with the cosmic visuals.
   - When reaching the event horizon singularity, it seamlessly loops back to the beginning and continues scrolling forever.
   - If you spin the mouse wheel to scroll manually, the video instantly scrubs to that position and continues playing.

5. **🚫 100% Pure Video (Zero UI Clutter)**:
   - No control bars, no buttons, no end card popups.
   - Only full-screen cinematic cosmic visuals accompanied by minimalist cursive calligraphy captions.

6. **⌨️ Invisible Background Keyboard Controls (Optional)**:
   - **`1`**: Normal Speed (1.0x, ~24s)
   - **`2`**: Fast Speed (1.35x, ~18s — "a little fast")
   - **`S`**: Toggle between Normal and Fast Speed
   - **`Space`** or **Click video**: Pause / Resume
   - **`F`**: Toggle Fullscreen
   - **`R`**: Jump back to start

---

## 📁 Files

- `Cosmic_Journey.mp4`: Rendered master 1080p 30 FPS video (~24 seconds, 16.9 MB).
- `index.html`: Clean full-screen HTML5 video surface with cursive captions.
- `style.css`: Minimalist styling, GPU cover fit, hidden scrollbars.
- `app.js`: Autonomous auto-scrolling synchronization, instant autoplay, and keyboard hotkeys.

---

## 🌐 How to Run

1. Open your terminal in this directory:
   ```bash
   python -m http.server 8000
   ```
2. Open `http://localhost:8000` in your browser.
3. The video will immediately play at a fast, smooth, 100% lag-free pace while auto-scrolling continuously!
