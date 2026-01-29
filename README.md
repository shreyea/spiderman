# 💕 Scrollytelling Love Website

A high-end, cinematic romantic scrollytelling website experience featuring a cute superhero love story theme.

## ✨ Features

- **6 Cinematic Scenes**: Each scene tells a part of your love story
- **Smooth Animations**: Framer Motion powered scroll-based animations
- **Mobile-First Design**: Optimized for one-hand scrolling
- **Fully Customizable**: All content editable via JSON
- **Handcrafted Aesthetics**: Scrapbook, comic-style, and soft pastel design
- **Interactive Elements**: Envelope opening, polaroid gallery, love meter, and celebration finale

## 🎬 Scenes Overview

1. **Arrival** - Night city skyline with floating hero silhouette
2. **Confession** - Interactive envelope with handwritten love letter
3. **Memories** - Polaroid gallery hanging on spider webs
4. **Reasons I Love You** - Comic-style panels with speech bubbles
5. **Love Meter** - Animated heart that fills up to 100%
6. **Final Moment** - Web heart with YES/ALWAYS buttons and celebration

## 🚀 Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
npm run build
npm start
```

## 🎨 Customization

### Edit Content

All customizable content is in `content/siteContent.json`:

```json
{
  "hero": {
    "heading": "Every hero has a story…",
    "subheading": "And mine began with you ❤️"
  },
  "letter": {
    "recipient": "My Dearest Love",
    "content": "Your love letter text here...",
    "signature": "— Yours, Forever ❤️"
  },
  "memories": [
    {
      "id": 1,
      "image": "/images/memory-1.jpg",
      "caption": "Our first adventure together",
      "rotation": -5
    }
  ],
  "reasons": [
    {
      "id": 1,
      "title": "Your Smile",
      "description": "It lights up my entire universe",
      "effect": "POW!"
    }
  ],
  "finalMessage": {
    "question": "Will you be my forever hero?",
    "yesButton": "YES ❤️",
    "alwaysButton": "ALWAYS 💍"
  }
}
```

### Add Your Photos

1. Place your photos in the `public/images/` folder
2. Name them `memory-1.jpg`, `memory-2.jpg`, etc.
3. Update the image paths in `siteContent.json`

### Color Customization

Edit the CSS variables in `app/globals.css`:

```css
:root {
  --color-primary: #e63946;    /* Red */
  --color-secondary: #457b9d;  /* Blue */
  --color-pink: #ffb4b4;       /* Pink */
  --color-cream: #fef5e7;      /* Cream */
  --color-purple: #2d1b4e;     /* Purple */
  --color-gold: #ffd700;       /* Gold */
}
```

## 📁 Project Structure

```
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Main page
│   └── loading.tsx          # Loading screen
├── components/
│   ├── Scene1Arrival/       # Night city scene
│   ├── Scene2Confession/    # Love letter scene
│   ├── Scene3Memories/      # Polaroid gallery
│   ├── Scene4Reasons/       # Comic panels
│   ├── Scene5LoveMeter/     # Heart meter
│   ├── Scene6Final/         # Final celebration
│   └── SceneTransition/     # Scene transitions
├── content/
│   └── siteContent.json     # All customizable content
└── public/
    └── images/              # Your photos go here
```

## 🛠 Tech Stack

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Framer Motion** - Animations
- **React Intersection Observer** - Scroll triggers
- **CSS Modules** - Scoped styling

## 💡 Tips for Best Experience

1. **Photos**: Use high-quality, square or portrait images for polaroids
2. **Letter**: Keep the love letter personal and heartfelt
3. **Reasons**: Make them specific to your relationship
4. **Hosting**: Deploy on Vercel for best performance

## 📱 Mobile Optimization

- Touch-friendly interactions
- One-hand scroll friendly
- No horizontal scrolling
- Optimized font sizes
- Reduced motion support

## 🎁 Making It Special

- Share the link with a custom message
- Set up a surprise reveal moment
- Pair with real-world elements (flowers, gift)
- Print the QR code as a card

## ❤️ Made with Love

This template is designed to help you express your feelings in a unique, memorable way. Customize it, make it yours, and create something beautiful!

---

*"Every hero has a story... and mine began with you."*
