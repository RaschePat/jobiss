# Jobiss Functional Map — Design-Neutral Reference

This file preserves the product capabilities that existed in the earlier prototype without preserving its visual presentation.

Use it to understand what Jobiss can do. It is **not** a screen list, layout specification, mobile-app requirement, or instruction to reproduce the former interface.

## Core user state

Jobiss can maintain and use:
- basic profile information
- education / certifications
- projects and portfolio evidence
- GitHub or other work evidence
- activities and accumulated experience records
- observed or explicitly provided interest signals
- saved / passed / newly arrived job state

## Core product capabilities

Two things carry the product together. Capabilities 1–4 accumulate context so the user never re-explains themselves. Capabilities 5–7 replace the manual loop the user ran by hand — searching job sites, copying postings, asking "does this fit me?" one at a time. Neither half works alone.

### 1. Context collection
The user can begin with limited information and add more context over time.

Possible sources include profile facts, projects, portfolio, activities, GitHub, self-described interests, and other submitted materials.

### 2. Evidence construction
Jobiss can turn raw input into structured evidence: what the user did, what capability it is evidence of, and what it does not yet show.

Evidence must trace back to something the user actually provided. Inferred capability with no supporting input is not evidence.

### 3. Evidence accumulation
The profile is durable and grows. Jobiss can show:
- what has been filled in and what is still empty
- how the profile has thickened over time
- which additions would most strengthen a weak area

This is the reason a user returns when no new opportunity has arrived.

### 4. AI interpretation
Jobiss can analyze accumulated evidence and surface:
- recurring signals
- possible role directions / hypotheses
- connections between prior experience and those possibilities

These are possibilities, not deterministic labels.

### 5. Opportunity discovery and arrival
The product can surface relevant job opportunities and present them as opportunities that have "arrived" for the user.

A job can include a reason for arrival based on the user's evidence.

Arrival is not decoration. It replaces work the user actually performed by hand, so it is a core capability rather than a metaphor.

It runs in two layers, because job APIs return listing metadata but not the posting body. Daily arrival (layer 1) can only speak at the metadata level — role, location, experience bar, deadline — and must not imply knowledge of requirements it does not have. Requirement-level comparison (layer 2) happens when the user opens a posting and its body is obtained. See `product-plan.md` section 6.

### 6. Personalized fit explanation
For a selected opportunity, Jobiss can compare the posting with the user's accumulated evidence and explain:
- why the opportunity may connect
- supporting evidence from the user's experience
- strengths or already-met signals
- gaps / things to verify
- useful next preparation or action

The explanation itself is easily copied by any product with an LLM. Its value here comes from the evidence it draws on.

### 7. Feedback loop
The user can express interest, save, skip, or pass on an opportunity.

Those choices can be treated as additional feedback that feeds back into the profile rather than as one-off UI actions.

### 8. Lightweight onboarding
A user who is not ready to provide everything can start with a small set of signals or a short description and receive provisional possibilities before adding deeper evidence.

## Landing-page implication

A landing page does not need to demonstrate every capability or reproduce every former screen.

Select only the product moments that best explain Jobiss to a first-time visitor.

The moment most worth explaining is the one where scattered experience becomes evidence that accumulates. Arrival is a good way to make that legible, but a visitor who only understands "jobs come to me" has understood the surface and not the product.

Interactive web-native demonstrations, letters, reports, transitions, diagrams, or bespoke visual scenes may be more effective than device mockups.
