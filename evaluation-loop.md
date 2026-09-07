# Mandatory Evaluation Loop v0.1

## Purpose
Test whether explicit post-render self-evaluation produces a better final result than the same capability and memory without a mandatory loop.

## Required Sequence
After the first complete implementation is rendered and the core flow works:

1. **Freeze First Draft**
   - Before making any quality-driven design revisions, create a git commit with message exactly: `exp04: first draft before evaluation`.
   - Record the commit SHA.
   - If the available browser tooling can save a full-page screenshot to the repository, also save it as `experiment-artifacts/before-evaluation.png`. If that is not supported, the git checkpoint is sufficient; do not fabricate a screenshot.

2. **Evaluate the Rendered Draft**
   Inspect the actual rendered desktop page and mobile view using `standards/design-quality.md`.

3. **Diagnose, Do Not Decorate**
   Identify the three highest-impact problems. For each problem state internally:
   - observable symptom,
   - likely cause,
   - quality dimension affected,
   - concrete revision with the highest expected benefit.

4. **Prioritize Revisions**
   Prefer structural changes to composition, typography, visual thesis, imagery, product-story sequencing, or asset integration. Do not add ornament merely to make the page feel more designed.

5. **Revise**
   Fix at least the single highest-impact problem, and up to three when the expected benefit is material. Regenerate/edit/reposition a bespoke asset if the diagnosis shows the asset is the problem.

6. **Re-render and Re-evaluate**
   Inspect the revised desktop and mobile result again. Check whether the diagnosed problems actually improved and whether any regression was introduced.

7. **Stop Condition**
   Stop after one mandatory revision cycle unless the revised page contains a clear functional breakage caused by the revision. Do not iterate indefinitely.

## Evidence
The final response should report the first-draft checkpoint SHA and briefly state which high-impact changes were made after evaluation. Do not expose hidden chain-of-thought; concise observable diagnoses and changes are sufficient.