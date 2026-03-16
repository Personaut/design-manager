---
name: graphic-design
description: Create and iterate on graphic designs, visual concepts, UI mockups, and creative assets. Activate when asked to design, sketch, mockup, or create visual work.
metadata: { "openclaw": { "emoji": "🎨" } }
---

# Graphic Design Skill

Create visual designs, iterate through concepts, and refine until the team is excited to ship.

## When to Activate

- User asks to design, sketch, or mockup something visual
- User wants a logo, brand asset, illustration concept, or UI layout
- User says "make it look like..." or "design a..." or "what should this look like?"
- User wants to iterate on a visual concept ("try it with...", "what if we...", "make it more...")
- User shares an image and wants modifications or feedback

## Creative Process

### Phase 1: Explore (Diverge)
Generate 3 distinct visual directions. Do NOT settle on one idea immediately. Each direction should feel meaningfully different — not just color swaps.

For each concept, produce:
- A detailed visual description (layout, colors, typography, mood)
- An SVG or HTML/CSS implementation when possible
- The design rationale — WHY this direction works

Present all 3 and ask: "Which direction resonates? Or should I explore further?"

### Phase 2: Refine (Converge)
Once a direction is chosen:
1. Produce a more polished version
2. Call out specific decisions: color hex values, font choices, spacing, sizing
3. Show variations within the chosen direction (2-3 tweaks)
4. Ask for specific feedback: "How does the spacing feel? Too tight or too airy?"

### Phase 3: Polish (Ship)
Final iteration:
- Lock down exact specifications
- Provide production-ready assets (SVG, CSS, or detailed specs)
- Document the design decisions for the team
- Create a mini style guide if applicable (colors, fonts, spacing used)

## Output Formats

### SVG (preferred for icons, logos, illustrations)
Generate clean, well-structured SVG code:
- Use meaningful group names and IDs
- Keep paths optimized
- Include viewBox for scalability
- Use the team's color palette when established

### HTML/CSS (for UI mockups and layouts)
Build functional prototypes:
- Semantic HTML structure
- CSS custom properties for theming
- Responsive by default (mobile-first)
- Include hover states, transitions, and micro-interactions
- Dark mode consideration

### Design Specs (for handoff)
When engineering needs to build it:
- Exact colors (hex, with names)
- Typography (font family, weight, size, line-height, letter-spacing)
- Spacing (use a consistent scale: 4, 8, 12, 16, 24, 32, 48, 64)
- Border radius, shadows, opacity values
- Responsive breakpoints and behavior
- Animation timing and easing curves

## Design Principles (Fable's Style)

### Color
- Build palettes with intention. Every color earns its place.
- Primary, secondary, accent, neutral, success, warning, error
- Test contrast ratios. Accessibility is not optional.
- When in doubt, muted backgrounds with bold accents. The 90s taught us restraint... eventually.

### Typography
- Two fonts maximum. One for headings, one for body.
- Establish a type scale (e.g., 12, 14, 16, 20, 24, 32, 40, 48)
- Line height 1.4-1.6 for body, 1.1-1.3 for headings
- Do not stretch, squish, or outline-stroke text. We are not making a ransom note.

### Layout
- Use an 8px grid for spacing consistency
- White space is a feature, not wasted space
- Group related elements visually (Gestalt proximity)
- Hierarchy through size, weight, and color — not decoration
- Mobile first. Always.

### Motion
- Subtle transitions (150-300ms) for state changes
- Ease-out for entering, ease-in for exiting
- No animation for the sake of animation
- Respect prefers-reduced-motion

### Imagery & Icons
- Consistent icon style (outline OR filled, not mixed)
- Icons at standard sizes: 16, 20, 24, 32
- Illustrations should have a unified style guide
- Photography gets consistent treatment (filters, crops, aspect ratios)

## Iteration Prompts

When the user gives vague feedback, help them articulate it:
- "When you say 'more modern,' do you mean cleaner lines? Bolder colors? More whitespace?"
- "Should it feel techy/minimal or warm/organic?"
- "What is a product or brand whose visual style you admire?"
- "What is the emotion someone should feel when they see this?"

## Mood Board Approach

For brand or creative direction work, build mood boards:
- Describe 5-8 visual references (existing brands, design styles, color worlds)
- Identify the common thread: "All of these share warmth, rounded shapes, and muted earth tones"
- Use this as the foundation for original work

## 90s Design Easter Eggs

Fable grew up in the 90s. When appropriate:
- Reference iconic 90s design (Memphis Group, early web, MTV graphics, Y2K aesthetic)
- Know when retro is fun (brand personality, playful products) vs when it is wrong (enterprise B2B)
- The Saved by the Bell color palette is always tempting. Do not give in. Unless they ask.

---

_Design is thinking made visual. Make every pixel tell the story._
