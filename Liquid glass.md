# Liquid glass
## Component TypeScript
Generates a unique filter id per instance so multiple cards don’t conflict.
```ts
import { Component, Input } from '@angular/core';

@Component({
  selector: 'ui-liquid-card',
  templateUrl: './liquid-card.component.html',
  styleUrls: ['./liquid-card.component.scss'],
})
export class LiquidCardComponent {
  // unique id for the svg filter so multiple cards don't clash
  filterId = 'liquid-distort-' + Math.random().toString(36).slice(2, 9);

  @Input() title = 'Card title';
  @Input() body = 'This is a short description explaining the card content.';
  @Input() cta = 'Action';
  @Input() ariaLabel = 'Liquid glass card';
}
```

---

## Template
We render the SVG `filter` defs inline and use layered `.glass` elements. The base glass gets the displacement filter via binding.
```html
<div class="liquid-card" role="group" [attr.aria-label]="ariaLabel">
  <!-- SVG defs for distortion filter (unique id per component) -->
  <svg aria-hidden="true" class="svg-defs" focusable="false">
    <defs>
      <!-- Turbulence + displacement for gentle lens edge distortion -->
      <filter [attr.id]="filterId" x="-20%" y="-20%" width="140%" height="140%">
        <!-- a low-frequency turbulence creates organic ripples -->
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="1" result="noise"/>
        <!-- reduce / soften the noise so displacement isn't too strong -->
        <feGaussianBlur in="noise" stdDeviation="2" result="noiseBlur"/>
        <!-- displacement map — scale controls strength -->
        <feDisplacementMap in="SourceGraphic" in2="noiseBlur" scale="6" xChannelSelector="R" yChannelSelector="G"/>
      </filter>
    </defs>
  </svg>

  <!-- layered glass surfaces -->
  <!-- base: actual glass with blur + distortion -->
  <div class="glass base"
       [style.filter]="'url(#' + filterId + ')'">
  </div>

  <!-- chromatic layers: slightly offset and tinted to simulate CA -->
  <div class="glass chroma chroma-r" aria-hidden="true"></div>
  <div class="glass chroma chroma-g" aria-hidden="true"></div>
  <div class="glass chroma chroma-b" aria-hidden="true"></div>

  <!-- content sits above the glass layers -->
  <div class="content">
    <h3 class="title">{{ title }}</h3>
    <p class="body">{{ body }}</p>

    <button class="cta" type="button" aria-label="{{cta}}">
      {{ cta }}
    </button>
  </div>
</div>
```

---

## Styles (SCSS)
Explained inline with comments. These styles use CSS variables so you can adapt theme tokens.

```scss
:host { display: block; }

/* tokens — tweak to match your theme */
:root {
  --glass-radius: 16px;
  --glass-bg: rgba(255,255,255,0.06);     /* base translucent sheet */
  --glass-border: rgba(255,255,255,0.12);
  --accent-r: 88; --accent-g: 115; --accent-b: 255;
  --glass-blur: 18px;
  --glass-saturation: 1.25;
  --card-padding: 24px;
  --card-width: 360px;
  --shadow-elevation: 0 14px 40px rgba(8, 10, 30, 0.45);
}

/* container */
.liquid-card {
  position: relative;
  width: var(--card-width);
  min-height: 160px;
  padding: var(--card-padding);
  border-radius: var(--glass-radius);
  overflow: visible; /* we purposely let glows extend */
  isolation: isolate; /* keep blend modes local */
  -webkit-tap-highlight-color: transparent;
  box-sizing: border-box;

  /* fallback if no backdrop-filter: use solid translucent panel + stronger shadow */
  background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01));
  box-shadow: var(--shadow-elevation);
}

/* place the SVG defs out of flow */
.svg-defs {
  position: absolute;
  width: 0;
  height: 0;
  overflow: hidden;
}

/* glass layers share base positioning */
.glass {
  position: absolute;
  inset: 0; /* cover the card */
  border-radius: inherit;
  pointer-events: none;
}

/* base glass uses actual backdrop-filter and subtle fill */
.glass.base {
  background: linear-gradient(180deg, rgba(255,255,255,0.06), rgba(255,255,255,0.03));
  border: 1px solid var(--glass-border);
  /* key lens effect: blur/backdrop-filter */
  backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  -webkit-backdrop-filter: blur(var(--glass-blur)) saturate(var(--glass-saturation));
  mix-blend-mode: normal;
  box-shadow: 0 1px 0 rgba(255,255,255,0.04) inset;
  transition: transform 240ms cubic-bezier(.4,0,.2,1), box-shadow 240ms;
  transform-origin: center;
}

/* chromatic aberration layers: small tinted offsets + blur + blend to simulate fringing */
.glass.chroma {
  background: rgba(255,255,255,0.02); /* translucent base so backdrop still shows */
  backdrop-filter: blur(calc(var(--glass-blur) * 0.9)) saturate(calc(var(--glass-saturation) * 0.9));
  -webkit-backdrop-filter: blur(calc(var(--glass-blur) * 0.9)) saturate(calc(var(--glass-saturation) * 0.9));
  mix-blend-mode: screen; /* overlay tint nicely */
  opacity: 0.85;
  transition: transform 320ms cubic-bezier(.4,0,.2,1), opacity 320ms;
  will-change: transform, opacity;
}

/* per-channel color tints and offsets */
.glass.chroma-r {
  filter: blur(2px) saturate(1.2);
  background: rgba(var(--accent-r), var(--accent-g), var(--accent-b), 0.04);
  transform: translateX(6px) translateY(2px) scale(1.01);
  mix-blend-mode: screen;
  border-radius: inherit;
  mask-image: radial-gradient(closest-side, transparent 60%, black 100%); /* keep tint to edges */
}

.glass.chroma-g {
  filter: blur(2px) saturate(1.05);
  background: rgba(120, 255, 180, 0.03);
  transform: translateX(-4px) translateY(1px) scale(1.01);
  mask-image: radial-gradient(closest-side, transparent 65%, black 100%);
}

.glass.chroma-b {
  filter: blur(3px) saturate(1.4);
  background: rgba(88, 115, 255, 0.05);
  transform: translateX(2px) translateY(-3px) scale(1.02);
  mask-image: radial-gradient(closest-side, transparent 55%, black 100%);
}

/* content above the glass */
.content {
  position: relative; /* above glass */
  z-index: 3;
  color: rgba(255,255,255,0.95);
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  margin: 0;
  font-size: 20px;
  font-weight: 600;
  letter-spacing: -0.02em;
}

.body {
  margin: 0;
  color: rgba(255,255,255,0.86);
  line-height: 1.4;
  font-size: 14px;
}

/* CTA button: colored glow and micro-interaction */
.cta {
  margin-top: 8px;
  width: fit-content;
  padding: 10px 16px;
  border-radius: 10px;
  background: linear-gradient(180deg, rgba(var(--accent-r),var(--accent-g),var(--accent-b),1) 0%, rgba(60,90,255,1) 100%);
  color: white;
  border: none;
  cursor: pointer;
  box-shadow: 0 8px 26px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.18);
  transition: transform 160ms cubic-bezier(.4,0,.2,1), box-shadow 160ms;
  font-weight: 600;
}

/* micro interaction: press */
.cta:active { transform: translateY(1px) scale(0.995); box-shadow: 0 6px 20px rgba(var(--accent-r),var(--accent-g),var(--accent-b),0.14); }

/* hover lift for card */
.liquid-card:hover .glass.base {
  transform: translateY(-6px) scale(1.005);
  box-shadow: 0 20px 54px rgba(8,10,30,0.55);
}

/* accessibility: respect reduced motion */
@media (prefers-reduced-motion: reduce) {
  .glass, .glass.chroma, .cta, .liquid-card { transition: none !important; animation: none !important; }
}

/* fallback: browsers without backdrop-filter */
@supports not ((-webkit-backdrop-filter: blur(1px)) or (backdrop-filter: blur(1px))) {
  .glass.base, .glass.chroma { backdrop-filter: none; -webkit-backdrop-filter: none; }
  .glass.base { background: rgba(255,255,255,0.06); }
  /* slightly stronger background + border to mimic separation */
  .liquid-card { background: linear-gradient(180deg, rgba(255,255,255,0.035), rgba(255,255,255,0.015)); }
}
```

---

### How the effect works
1. **Backdrop blur**: `backdrop-filter: blur(...)` blurs whatever is behind the card to produce the “lens” look. That’s the core of the liquid glass feel.
2. **Distortion**: the SVG `feTurbulence` + `feDisplacementMap` filter is applied to the `.glass.base` layer so its painted result is subtly warped — edges appear distorted like a lens. The `scale` parameter controls intensity.
3. **Chromatic aberration**: true optical chromatic aberration is done by splitting RGB channels; here we approximate it with three tinted, slightly offset translucent layers (`.chroma-r/.chroma-g/.chroma-b`) using `mix-blend-mode` and masks so tint appears strongest near edges. This is cheap and cross-browser friendly relative to full channel-splitting in shaders.
4. **Micro-interactions**: small translate/scale on hover for lift, compressed on button press, all bounded by `prefers-reduced-motion`.


### Performance & compatibility
* `backdrop-filter` and `filter` (SVG displacement) can be GPU- and CPU-intensive on low-end devices. Use sparingly for hero UI pieces, top navs, modals, or a small number of cards per screen.
* Provide the `@supports not (backdrop-filter)` fallback (above). On older browsers you’ll get a translucent panel + shadow instead of the full lens.
* Test on Safari (good `backdrop-filter` support) and Chrome/Edge (supported, prefixed in some cases). Mobile: iOS Safari supports `-webkit-backdrop-filter`. Android Chrome supports `backdrop-filter` behind a flag on some older versions.


### Accessibility
* Ensure text has sufficient contrast against the resulting surface. When backdrop is highly varied, consider a slightly more opaque fill or an overlay gradient behind text to guarantee legibility.
* Respect `prefers-reduced-motion`: we disable transitions/animations if user prefers reduced motion.
* Do not rely on the visual effects to convey meaning — icons or text should be used for status/meaning.


### Tuning tips
* **Stronger lens**: increase `--glass-blur` and `feDisplacementMap` `scale`.
* **Gentler distortion**: reduce `baseFrequency` in `feTurbulence` (e.g., `0.6` → `0.4`) and reduce `scale`.
* **More color fringing**: bump chroma layer translations (translateX/Y) and tint alpha. Or create SVG feColorMatrix-based channel split — more accurate but more complex and heavier.
* **Edge-only distortion**: use mask (radial gradient) on the base glass to limit distortion to edges.


## Advanced: true RGB channel split (optional)
If you want a more physically accurate chromatic aberration and are comfortable with heavier filters, you can:
* Render three copies of the blurred backdrop into separate SVG `feColorMatrix` channels and offset each, then composite. This requires a more complex SVG pipeline and may be slower. The layered pseudo-element approach above is a good pragmatic compromise.


## Usage
Import `LiquidCardComponent` into your module and use in templates:
```html
<ui-liquid-card
  [title]="'Frosted Lens'"
  [body]="'This uses backdrop-filter + an SVG displacement map and layer tints for chromatic edge effects.'"
  [cta]="'Try it'">
</ui-liquid-card>
```