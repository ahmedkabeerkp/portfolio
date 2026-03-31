# 📄 `portfolio_system_guidelines.md`

```markdown
# Portfolio System Guidelines (Strict Execution)

## 1. Core Philosophy
- Minimal but not boring
- Motion with purpose (not decoration)
- Content clarity > visual noise
- Every section must communicate value within 3 seconds

---

## 2. Design System (Strict)

### Colors
- Background: #F8FAFC
- Surface: #FFFFFF
- Primary Text: #111827
- Secondary Text: #6B7280
- Accent: #2563EB
- Accent Hover: #1D4ED8
- Secondary Accent: #06B6D4
- Borders: #E5E7EB

### Rules
- Accent usage < 10% of screen
- No random colors
- No gradients except very subtle (optional)

---

## 3. Typography
- Font: Inter (or system-ui fallback)
- Headings: bold, tight spacing
- Body: medium weight, high readability
- Line height: 1.5–1.7

---

## 4. Layout System
- Mobile-first (mandatory)
- Max width: 1100px
- Centered content
- Spacing scale: 8px system (8, 16, 24, 32, 48, 64)

---

## 5. Motion & Animation (IMPORTANT)

### Principles
- Smooth, fast, intentional
- No lag, no heavy libraries

### Required Animations
1. **Scroll Reveal**
   - Elements fade + slight translateY (20–40px)
   - Duration: 0.5–0.8s
   - Use Intersection Observer

2. **Hover Interactions**
   - Buttons: slight scale (1.03)
   - Cards: lift (translateY -4px)

3. **Navbar Behavior**
   - Slight blur or shadow on scroll

4. **Mouse Tracer (Desktop only)**
   - Lightweight canvas particles
   - Disabled on screens < 768px

---

## 6. Performance Constraints
- No heavy frameworks
- No GSAP unless optimized
- Use Vanilla JS + Tailwind CDN
- Keep JS under control (no bloated logic)

---

## 7. Sections (Mandatory Structure)

1. Navbar
2. Hero
3. Projects
4. Skills
5. Contact/Footer

---

## 8. Content Rules
- No generic phrases
- No filler text
- Each line must communicate value

---

## 9. Project Presentation
Each project must show:
- Problem
- What you built
- Tech used
- Status (Completed / Work in Progress)

---

## 10. Accessibility
- Proper contrast
- Semantic HTML
- Keyboard accessible

---

## 11. Final Quality Check
- No broken links
- No console errors
- Fully responsive
- Smooth animations (no jank)
```
