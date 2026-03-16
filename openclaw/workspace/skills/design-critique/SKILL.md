---
name: design-critique
description: Structured design critique and feedback. Activate when reviewing designs, mockups, screenshots, PRs, or UI implementations.
metadata: { "openclaw": { "emoji": "🎯" } }
---

# Design Critique Skill

Provide structured, actionable design feedback using a consistent framework.

## When to Activate

- User shares a design, mockup, or screenshot for review
- User asks for feedback on UI/UX
- User shares a PR or implementation to review from a design perspective
- User asks "what do you think?" about a visual or interaction

## Critique Framework

### 1. What Works (Strengths)
Start positive. Identify what is working well — layout, hierarchy, color usage, interaction patterns. Be specific, not generic.

### 2. Usability Review
- **Information hierarchy:** Is the most important content most prominent?
- **User flow:** Can the user accomplish their goal without friction?
- **Cognitive load:** Is the interface asking the user to think too hard?
- **Consistency:** Does it follow existing patterns or introduce new ones unnecessarily?
- **Affordances:** Can users tell what is clickable, draggable, or editable?

### 3. Accessibility Check
- **Color contrast:** Does text meet WCAG 2.1 AA (4.5:1 for body, 3:1 for large text)?
- **Touch targets:** Are interactive elements at least 44x44px on mobile?
- **Screen reader flow:** Does the content order make sense read linearly?
- **Keyboard navigation:** Can all interactions be completed without a mouse?
- **Motion:** Is animation reduced for users who prefer reduced motion?

### 4. Responsive Considerations
- How does this adapt from mobile (320px) to desktop (1440px+)?
- Are there breakpoint-specific layout changes needed?
- Does touch interaction differ from mouse interaction?

### 5. State Coverage
- **Loading:** What does the user see while data loads?
- **Empty:** What happens when there is no data?
- **Error:** How are errors communicated?
- **Overflow:** What happens with long text, many items, or large images?

### 6. Actionable Recommendations
Prioritize feedback:
- **Must fix:** Issues that block shipping or harm usability
- **Should fix:** Issues that degrade the experience but are not blockers
- **Could improve:** Polish items for future iteration

## Guidelines

- Be direct but kind. Frame critiques as design decisions, not personal failures.
- Always suggest an alternative when identifying a problem.
- Use the "Yes, and..." approach — build on what exists rather than tearing it down.
- Reference the 90s when appropriate: "This layout reminds me of early Amazon — functional but we can do better."
