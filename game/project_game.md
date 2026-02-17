```md
# PROJECT_GAME.MD
## AI-Optimized Technical Specification
### Project: Flappy Bird Clone (Browser Game)

---

# 0. AI EXECUTION MODE (READ FIRST)

You are an expert senior JavaScript game developer and software architect.

Your goal is to generate a COMPLETE, READY-TO-RUN browser game project.

Key rules:

- Produce clean, modular, maintainable code.
- Avoid overengineering.
- Follow folder structure EXACTLY.
- Do not ask questions — make reasonable decisions.
- Generate missing assets as placeholders if needed.
- Ensure the game works immediately after opening index.html.

IMPORTANT:

- Game interface language MUST be Russian.
- Code comments MUST be English.
- Architecture stability is more important than visual complexity.

---

# 1. General Requirements

Create a complete browser-based clone of Flappy Bird.

Requirements:

- Runs entirely in browser.
- No backend.
- Launch by opening index.html.
- Works offline after loading.
- Desktop + mobile compatible.
- Smooth performance.

---

# 2. Technology Stack

Mandatory:

- HTML5
- CSS3
- JavaScript (ES6+)

Allowed libraries (use if helpful):

Game/Rendering:

- Phaser.js
- Three.js
- PixiJS
- Babylon.js
- Kontra.js

Animation:

- GSAP

Audio:

- Howler.js
- Tone.js

Utility:

- lodash
- anime.js

Physics (optional lightweight):

- matter.js
- planck.js

NOT allowed:

- React
- Next.js
- Angular
- Vue
- Svelte
- Full frontend SPA frameworks.

Reason:

Game must remain standalone and simple to run.

---

# 3. Rendering System

Choose ONE:

Option A (preferred simplicity):

- HTML5 Canvas.

Option B:

- Phaser.js.

Requirements:

- Single rendering context.
- Logical resolution (example: 360x640).
- Responsive scaling.

Game loop:

- requestAnimationFrame OR engine loop (Phaser).

Movement MUST be deltaTime-based.

---

# 4. Gameplay Mechanics

Player:

- Bird affected by gravity.
- Tap/click/space = flap impulse upward.
- Smooth physics response.

Pipes:

- Infinite generation.
- Random gap position.
- Move right → left.
- Destroy off-screen pipes.

Collision:

- Bounding box or engine collision system.
- Pipe or ground collision triggers game over.

Score:

- Increase when passing pipes.
- Visible during gameplay.

Game states:

- START
- PLAYING
- GAME_OVER

---

# 5. UI Requirements

Language: Russian (MANDATORY).

Examples:

- "Нажмите чтобы начать"
- "Счёт"
- "Игра окончена"
- "Рестарт"

UI style:

- Minimal arcade style.
- Clean readable font.

HUD:

- Score centered at top.

---

# 6. Controls

Support:

- Mouse click
- Touch input
- Spacebar

Rules:

- Single input = flap.
- Prevent multi-trigger spam.

---

# 7. Audio (Optional but Recommended)

Sounds:

- Flap
- Score
- Hit

Requirements:

- Preloaded.
- Non-blocking playback.

---

# 8. Performance Requirements

- Target 60 FPS.
- No memory leaks.
- Avoid DOM updates inside game loop.
- Rendering must occur inside game engine or canvas only.

---

# 9. Project Structure (MANDATORY)

```

/flappy-bird-clone
index.html
/css
styles.css
/js
main.js
game.js
player.js
pipes.js
collision.js
ui.js
input.js
config.js
/assets
/images
/sounds
/fonts

```

---

# 10. Architecture Guardrails (CRITICAL)

These rules MUST NOT be violated:

1. main.js

- Entry point.
- Initializes game.
- No gameplay logic.

2. game.js

- Game loop.
- Game state management.
- Scene coordination.

3. player.js

- Bird physics only.
- Movement logic only.

4. pipes.js

- Pipe generation.
- Pipe updates.

5. collision.js

- Collision detection isolated here.

6. ui.js

- All UI rendering.
- All Russian text.

7. input.js

- Centralized input system.

8. config.js

- Constants (gravity, speed, sizes).

DO NOT mix responsibilities between modules.

---

# 11. Physics Rules

Use velocity-based movement:

```

velocityY += gravity * deltaTime
positionY += velocityY * deltaTime

```

Constraints:

- Clamp velocity.
- Prevent infinite acceleration.

---

# 12. Visual Style

- Minimalist arcade aesthetic.
- Smooth animations.
- Optional scrolling background.

---

# 13. Responsive Behaviour

- Maintain aspect ratio.
- Fit mobile screen.
- Prevent distortion.

---

# 14. Deliverables

Must generate:

- Full folder structure.
- All required JS modules.
- Placeholder graphics if missing.
- Clean readable code.

---

# 15. Anti-Bug Constraints (AI Guardrails)

Avoid common AI mistakes:

- Do NOT use frame-based physics.
- Do NOT attach multiple input listeners.
- Do NOT re-create objects every frame.
- Do NOT mix UI rendering with physics logic.
- Do NOT mutate global state unpredictably.

---

# 16. Hidden Prompting Optimization (Internal AI Guidance)

Self-check before finishing:

1. Can index.html run immediately?
2. Is game loop stable?
3. Are modules independent?
4. Does UI display Russian text?
5. Is restart flow bug-free?
6. Are event listeners added only once?

If any answer = NO → fix before output.

---

# END OF SPECIFICATION
```
