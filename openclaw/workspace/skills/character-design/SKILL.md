---
name: character-design
description: Create 2D animated character designs with artistic flair. Activate when designing characters, mascots, avatars, or illustrated personas with personality and style.
metadata: { "openclaw": { "emoji": "✨" } }
---

# Character Design Skill

Create expressive, memorable 2D animated characters with personality, style, and soul.

## When to Activate

- User asks to design a character, mascot, avatar, or illustrated persona
- User wants character concepts for a brand, product, or game
- User says "draw me a character" or "what would this character look like?"
- User wants to iterate on a character's look, expression, or pose
- User needs character sheets, expression sets, or turnarounds

## Creative Philosophy

Characters are stories compressed into shapes. Every curve, color, and proportion communicates something before a single word is spoken. A great character makes someone feel something the moment they see it — curiosity, warmth, mischief, trust.

Fable approaches character design like a 90s animation director: bold silhouettes, expressive faces, and designs that look just as good on a sticker as they do on a billboard.

## Character Creation Process

### Phase 1: Character Brief
Before drawing anything, establish:

**Identity:**
- Who is this character? What is their role?
- What is their personality in 3 words? (e.g., "curious, brave, clumsy")
- What emotion should they evoke in the viewer?
- What world do they live in?

**Visual Anchors:**
- What animal, object, or archetype inspires their shape?
- What era or style should influence them? (90s cartoon, modern flat, manga-influenced, etc.)
- What is their signature element? (a hat, a scar, a color, a quirk)

### Phase 2: Shape Language
Every character starts with shapes. Shapes communicate personality before details do.

```
CIRCLES / ROUNDS  →  friendly, approachable, soft, trustworthy
                      Think: Kirby, Baymax, Bob-omb
                      
SQUARES / BLOCKS  →  strong, stable, reliable, grounded
                      Think: Frankenstein, SpongeBob, robots
                      
TRIANGLES / SHARP →  dynamic, cunning, dangerous, edgy
                      Think: Maleficent, Edna Mode, villains

MIXED SHAPES      →  Complex characters blend shapes.
                      Hero with a heart: square body + round head
                      Trickster: triangle body + round eyes
```

Start with a silhouette. If the character is not recognizable as a black silhouette, the design is not strong enough.

### Phase 3: Concept Variations (3 Directions)
Generate 3 distinct character concepts using SVG:

**Direction A — Classic/Warm:** 
Rounded forms, warm palette, approachable expression. Saturday morning cartoon energy.

**Direction B — Bold/Modern:**
Clean geometry, limited palette, confident pose. Behance-featured vibes.

**Direction C — Quirky/Unexpected:**
Something weird, surprising, or rule-breaking. The character nobody expected to love.

For each, provide:
- Full SVG character illustration
- Color palette (5-7 colors with hex values)
- Personality notes: "This version feels more playful because..."
- Pose rationale: "Standing with arms out suggests openness"

### Phase 4: Refinement
Once a direction is chosen:

**Expression Sheet** — Show the character expressing 6 emotions:
1. 😊 Happy/Default
2. 😢 Sad/Concerned
3. 😤 Angry/Frustrated
4. 😲 Surprised/Excited
5. 🤔 Thinking/Curious
6. 😏 Confident/Smug

**Pose Sheet** — Show the character in 4 key poses:
1. Standing/neutral (the "hero" pose)
2. Action pose (running, pointing, working)
3. Sitting/relaxed
4. Signature gesture (what makes them THEM)

### Phase 5: Character Sheet (Final Deliverable)

```
CHARACTER SHEET: [Name]

Identity:
- Full name / nickname
- Personality: [3 keywords]
- Signature color: [hex]
- Signature element: [their thing]

Proportions:
- Head-to-body ratio: [e.g., 1:3 for cute, 1:7 for realistic]
- Key measurements and guidelines

Color Palette:
- Primary: [hex] — used for [body/outfit]
- Secondary: [hex] — used for [accents]
- Skin/fur: [hex]
- Eyes: [hex]
- Highlight: [hex]
- Shadow: [hex]

Style Rules:
- Line weight: [e.g., 3px bold outlines]
- Corner radius on shapes: [e.g., always rounded]
- Shadow style: [flat, soft drop, hatching]
- Expression rules: [how eyes/mouth move]

Do's:
- [Keep proportions consistent]
- [Always include their signature element]

Don'ts:
- [Never make them look mean/scary]
- [Never change the core color palette]
```

## SVG Character Techniques

### Body Construction
Build characters from primitive shapes, then refine:
```svg
<!-- Start with basic shapes -->
<circle />   <!-- Head -->
<rect />     <!-- Body -->
<ellipse />  <!-- Limbs -->

<!-- Then refine with paths for organic curves -->
<path d="M... C... Q..." />  <!-- Smooth contours -->
```

### Expression System
Design eyes and mouths as swappable components:
- Eyes: dots, circles with pupils, half-closed, wide open, sparkle
- Mouths: smile curve, open oval, wavy line, teeth grin
- Eyebrows: angle communicates everything (up=surprised, down=angry, curved=worried)

### Color & Shading
- Use flat colors with one shadow tone per base color (15-20% darker)
- Add a subtle highlight on the top/left (the "animation highlight")
- Limit palette to 5-7 colors total for cohesion
- Black outlines give that classic 2D animated feel
- Colored outlines (darker shade of fill) give a modern/softer feel

### Animation-Ready Design
Even static designs should feel like they could move:
- Slight asymmetry in pose (not perfectly centered)
- Hair or clothing with implied motion direction
- Eyes looking slightly off-center (creates life)
- Weight distribution — characters should feel grounded, not floating

## Style References (by decade)

**90s Cartoon (Fable's sweet spot):**
- Dexter's Lab, Powerpuff Girls, Rugrats
- Bold outlines, bright colors, exaggerated proportions
- Personality-driven design over realism

**Modern 2D:**
- Adventure Time, Steven Universe, Hilda
- Simplified forms, expressive with minimal detail
- Inclusive, diverse character design

**Flat Illustration:**
- Headspace, Slack, Notion characters
- Geometric, minimal, brand-friendly
- Works at any size from favicon to billboard

**Retro Revival:**
- Cuphead, Hollow Knight, indie game aesthetic
- Hand-drawn feel with digital precision
- Nostalgic but contemporary

## Iteration Prompts

Help the user refine with specific questions:
- "Should they feel more like a Nickelodeon character or a Pixar character?"
- "Do you want them cute-round or cool-angular?"
- "What would this character's walk cycle feel like? Bouncy? Confident? Sneaky?"
- "If this character had a catchphrase, what would it be?" (This helps define personality)
- "What would they wear to a party?" (Reveals style and social energy)

---

_Every great character starts with a feeling. What do you want people to feel?_
