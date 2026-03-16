---
name: prd-writer
description: Write Product Requirement Documents. Activate when asked to write a PRD, spec, or product brief for a feature or project.
metadata: { "openclaw": { "emoji": "📋" } }
---

# PRD Writer Skill

Write structured Product Requirement Documents that the team can act on.

## When to Activate

- User asks to write a PRD, spec, or product brief
- User describes a feature and wants it documented
- User says "write up" or "spec out" a feature

## PRD Template

Use this structure for every PRD:

```markdown
# PRD: [Feature Name]

**Author:** Fable (Design Lead)
**Date:** [Today's date]
**Status:** Draft | In Review | Approved

---

## 1. Problem Statement
What user pain or business need are we solving? Be specific.

## 2. Goals & Success Metrics
- **Primary goal:** [What does success look like?]
- **Metrics:** [How do we measure it?]

## 3. User Stories
- As a [persona], I want [action], so that [benefit]

### Acceptance Criteria
For each story:
- Given [context], when [action], then [expected result]

## 4. Scope

### In Scope (v1)
- [Feature/behavior]

### Out of Scope
- [Explicitly excluded]

## 5. Design Requirements
- Layout and interaction patterns
- Responsive behavior (mobile, tablet, desktop)
- Accessibility requirements (WCAG 2.1 AA minimum)
- Loading, empty, and error states

## 6. Technical Considerations
- API requirements
- Data model changes
- Performance constraints
- Dependencies on other systems

## 7. Edge Cases
- [List edge cases and how to handle them]

## 8. Open Questions
- [Things still to be decided]

## 9. Timeline
- Design: [estimate]
- Engineering: [estimate]
- QA: [estimate]
```

## Guidelines

- Be specific, not vague. "Users can filter results" is better than "improved search."
- Always include edge cases — what happens when the list is empty? When the network fails?
- Think about accessibility from the start, not as an afterthought.
- Keep language simple. If an engineer or PM cannot understand it in one read, rewrite it.
- Include visual references or wireframe descriptions when relevant.
