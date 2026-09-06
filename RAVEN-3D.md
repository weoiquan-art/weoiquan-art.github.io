# Raven 3D motion study

Review page: `/raven-3d.html`. The approved homepage and entrance remain independent.

Native Three.js 0.185.1 geometry with named torso, neck, head, wings, tail and feet. The model has layered instanced feathers, a white J ribbon and a fixed charcoal perch. Three.js is vendored with its MIT license and has no runtime CDN dependency.

Pointer gaze recruits head and neck first, then torso and tail. Large direction changes alternate a single stepping foot: shift torso over the support foot, open toes, lift, reposition and regrip. A two-segment inverse-kinematics calculation connects each hip to its moving ankle. This is a constrained procedural animation study, not a rigid-body physics simulation or a finished photoreal asset. Toe contact uses authored curves; collision and force balance are not simulated.

Reduced-motion users get immediate button-controlled poses without stepping or blinking. Touch users can use the three direction buttons. Rendering pauses offscreen or in a hidden tab; settled poses render only for occasional blinks. Initialization and context-loss failures show the original ink raven.

Validation: JavaScript syntax checks; six extreme torso/support poses retained leg-segment lengths of 0.34 model units; local browser verified front/left transitions, alternating supporting feet, and return to both-gripped state; no console errors in the inspected desktop session. At 375 × 812, all direction controls remain visible and document scroll width equals viewport width. Reduced-motion and WebGL-loss handling were source-reviewed, not exercised through a native browser preference or GPU-loss event. Feather appearance and the J's dry-brush texture still need art direction before homepage integration.

The GLB deliverable contains the rest-pose geometry and named groups. Interactive movement lives in `raven-3d.js`; the GLB has no baked animation clips.
