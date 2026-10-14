// src/lib/data/colorMap.js
//
// ONE place for color name -> hex. Both the product page and CartModal
// import this. Never paste a second copy into a component: copies drift,
// and a color missing from one copy shows up as an empty circle.
// When a seller uses a new color name, add it here once.

const colorMap = {
  white: "#FFFFFF",
  black: "#000000",
  blue: "#2E2B77",
  brown: "#8B4513",
  red: "#2e0b12",
  green: "#008000",
  silver: "#C0C0C0",
  maroon: "#5C2B2E",
  blush: "#ecb6b4",
  gold: "#D4AF37",
  yellow: "#d5ce98",
  mint: "#d4dbd7",
  terracotta: "#dc8866",
  gray: "#a8a9a1",
  steel: "#3F7895",
  cream: "#e5dccb",
  teal: "#031D1A",
  "cadet blue": "#99AFBA",
  peach: "#dfa790",
  "tale blue": "#052635",
   "sky blue": "#87CEEB",
  purple: "#3D1C2E",
  ash: "#8A847B",
  "ash gray": "#bbb6b2",
  "army green": "#485744",
  beige: "#D3C1A9",
  khaki: "#817658",
  "off white": "#D4CFC9",
  milk: "#F5F1E8",
  "man u": "#c41e22",
  "man city": "#73a3d3",
  arsenal: "#d82b27",
  barca: "#567efa",
  "real madrid": "#d0beb2",
  "real madrid (third)": "#801132"
}

export default colorMap;