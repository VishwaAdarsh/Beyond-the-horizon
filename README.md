# Beyond the Horizon

Immersive parallax scrolling website: Night, Forest, Desert, Ocean, Aurora, Space.
Plain HTML, CSS and JavaScript. No build step and no dependencies.

## Run
Open `index.html` in a browser, or serve the folder:

    npx serve .

## Deploy
Drop the folder onto Netlify or Vercel as a static site (no build command, publish directory `.`).

## Structure
- `index.html` markup
- `css/styles.css` all styles (tokens, sections, responsive and reduced-motion rules)
- `js/main.js` parallax engine, progress bar, reveals, navigation, scene menu, sound
- `assets/` reserved for images, fonts and icons (the scenery is drawn with CSS and SVG)

## Controls
- Scroll, or use the nav, side dots and buttons for eased gliding
- `1`-`6` jump to a scene, `M` opens the scene menu
- Snap toggle: gentle section snapping (swipe paging on touch devices)
- Sound toggle: generated ambient audio, off by default

Respects `prefers-reduced-motion`. Fonts load from Google Fonts with system fallbacks.
