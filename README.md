# Ember & Oak — coffee website

React + Vite + Tailwind v4 + GSAP + React Router.

## Run

```bash
npm install
npm run dev
```

## Put your frames here

Copy your frame folders into `public/` so the URLs match:

```
public/frames/   frame_0001.webp … frame_0150.webp
public/frames2/  frame_0001.webp … frame_0159.webp
public/frames3/  frame_0001.webp … frame_0144.webp
```

The first frame of each folder is also used as the hero background of
the Menu, Story and Visit pages.

## Structure

- `src/App.jsx`: loader, router, navbar/footer
- `src/pages/Home.jsx`: video, plain, video, plain, video, plain
- `src/pages/MenuPage.jsx`, `Story.jsx`, `Visit.jsx`
- `src/components/`: Loader, Navbar, Footer, ScrollFrames, Reveal, Counter, PageHero

## Change things

- Frame counts and scroll length: props on `<ScrollFrames />` in `Home.jsx`
- Loader length: `duration` prop on `<Loader />` in `App.jsx` (seconds)
- Colors: replace `amber-300` across the files
