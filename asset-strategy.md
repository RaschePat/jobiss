# Visual Asset Strategy v0.1

## Principle
Do not generate images merely because image generation is available. Decide whether bespoke visual material is necessary to realize the Art Direction.

## Asset Decision
Before implementation, ask internally:
1. Can typography, layout, CSS, existing UI, and existing repository assets fully express the Visual Thesis?
2. Would a bespoke image, illustration, texture, object, collage, or graphic materially strengthen product meaning or visual distinctiveness?
3. Is the asset part of the composition, or would it only decorate empty space?

If bespoke assets do not materially improve the design, do not generate them.

## When Assets Are Justified
Examples include:
- a hero visual that embodies the product metaphor,
- a custom editorial image or collage,
- a coherent set of visual objects used across the page,
- texture/material imagery that establishes the visual world,
- a product-specific illustration that cannot be expressed convincingly with generic icons or CSS.

## Generation
When image-generation capability is available and an asset is justified:
- generate the asset from the established Art Direction and Visual Thesis,
- specify composition role, crop/aspect ratio, subject, visual language, background behavior, and integration needs,
- prefer a small coherent asset family over unrelated decorative images,
- save generated assets in an appropriate repository asset directory,
- integrate them into the actual page rather than presenting them separately.

## Asset Evaluation
For each generated asset that materially affects the design, judge:
- Art Direction Fit — does it belong to the same visual world?
- Product Meaning — does it strengthen Jobiss's meaning or metaphor?
- Composition Fit — does it work at the intended crop, scale, and location?
- Distinctiveness — does it avoid generic stock/AI-illustration character?
- Integration — does it feel structurally necessary rather than pasted on?

Reject, regenerate, crop, edit, or omit an asset when it fails these checks.

## Anti-patterns
- generic 3D mascot/character added by default,
- random gradient blobs or abstract shapes generated as filler,
- stock-photo-like imagery unrelated to the product thesis,
- multiple illustration styles on one page,
- an impressive standalone image that fights the interface,
- generating assets after the layout merely to fill blank space.

## User Friction
Do not ask the user to manually create visual materials that Codex can reasonably generate or derive itself. Keep asset orchestration behind the ordinary design request.