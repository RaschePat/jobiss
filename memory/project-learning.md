# Jobiss — Project Learning v0.3

This file contains accumulated project learnings from prior Jobiss design work.

These are not mandatory layouts or fixed aesthetic rules. Treat them as evidence about the product and the user's judgments.

---

## 1. Core experience

Two things carry the product together: **context that accumulates**, so the user never has to re-explain themselves, and **opportunities that arrive** in place of the manual loop the user ran by hand (search job sites, copy a posting, ask an AI "does this fit me?", repeat). Neither works alone. See `experiment-context/product-plan.md`.

The experience is most clearly understood at the surface when it feels like:

**an opportunity that understands the user's context arrives to them, rather than the user endlessly searching for it.**

The letter / mailbox metaphor has repeatedly worked well because it makes this difference immediately understandable.

The mailbox is not decoration. It names a real, repeated manual task that the product replaces. See section 10.

The metaphor should support the product meaning, not become decorative stationery imagery.

---

## 2. Strong reusable product-explainer pattern

A previous design communicated the service especially well through a **separate interactive letter section**, not merely a small letter motif inside the hero.

The valuable pattern was:
- the left side showed different sources of connection such as `프로젝트에서 찾은 연결`, `관심사에서 찾은 연결`, `활동에서 찾은 연결`
- selecting a source changed the content shown on the right
- the right side felt like reading an actual personalized letter addressed to the user
- the letter showed the arrived opportunity and explained why it connected to the user
- the same experience could surface what is already strong, what still needs to be filled, and what to prepare next

This pattern worked because a visitor could understand what Jobiss actually does by interacting with one concrete product moment.

When a landing page needs to explain the core service, this interaction is a high-value pattern worth preserving or meaningfully evolving as its **own major section**.

Do not force it into the hero if doing so weakens either the hero composition or the letter-reading experience.

The underlying principle remains:

**prefer concrete personalized product moments over abstract descriptions of what the AI does.**

---

## 3. Product attitude

Jobiss should not behave like an AI that defines the user's identity or decides their career.

Prefer language and interactions that:
- present possibilities
- explain observed connections
- show evidence
- leave the final choice to the user

Avoid deterministic expressions such as:
- "This is the perfect job for you."
- "You are this type of person."
- "AI has decided your career."

The desired attitude is closer to:

**"We found this connection in what you have already done."**

---

## 4. Brand identity

Confirmed brand facts:
- Product name: Jobiss / 잡이쓰
- Primary color: `#ADD6FF`
- Korean-first product
- Letter / mail / arrival metaphors are compatible with the brand

### Preferred logo direction

The cleaner English wordmark **`jobiss.`** has generally felt more refined than a Korean wordmark combined with a separate decorative icon.

A subtle use of the primary color inside the wordmark can work well.

Do not treat this as an absolute prohibition on other logo solutions. The important learning is that the brand should feel simple, contemporary, and product-like rather than mascot-like or overly illustrative.

---

## 5. Visual preference learned so far

The user has responded positively to designs that:
- feel visually calm and intentional
- maintain clean spacing and typography
- have a clear visual hierarchy
- use product UI as part of the storytelling
- contain one strong product-specific idea rather than many decorative ideas
- feel polished without becoming generic corporate SaaS
- give the hero enough visual presence to feel memorable, not merely correct

The user has responded less positively when:
- visible text dominates the page
- the page mainly explains rather than demonstrates
- unrelated decorative elements appear in empty areas
- the design looks assembled from familiar SaaS sections
- brand metaphors become overly literal or cute
- repeated phone/device mockups are used without adding a distinct new product idea

These observations should inform judgment, not become rigid layout rules.

---

## 6. Visual assets and hero impact

Clean layout alone is not the target.

When bespoke imagery, illustration, composited product objects, or other generated visual assets would materially raise the quality of the landing page, the user prefers that they be created proactively and integrated into the real composition.

Use generated assets when they strengthen:
- the hero's first-glance impact
- the letter / arrival metaphor
- a product-specific visual world
- storytelling that UI components alone cannot express well

Avoid generic filler imagery or decorative assets with no product meaning.

---

## 7. Landing-page-specific learning

### Broader-than-a-resume context bar
A compact horizontal moment that shows Jobiss reading beyond a single resume has worked well.

For example, a concise band can communicate sources such as:
- 학력/교육
- 프로젝트
- 포트폴리오
- GitHub
- 자격증
- 관심사/활동

This is useful because it explains the breadth of context with very little copy.

### Mobile prototype reuse
The repository contains a detailed mobile prototype and multiple phone-framed screens.

These screens are useful evidence of real product functionality, but repeatedly placing the same phone or mobile-gallery mockups into the landing page has not added enough new value.

Use an existing mobile screen only when it communicates a **specific, distinct product moment** that is best shown that way.

Do not insert phone frames merely because ready-made mobile components exist in the repository.

---

## 8. Important distinction

Do not optimize merely for fewer elements.

A successful Jobiss design should balance:

**clarity + product specificity + emotional meaning + visual attraction + real product plausibility.**

A visually minimal result is not automatically better.

Likewise, a visually expressive result is useful only when the expression strengthens the product meaning.

---

## 9. Current design objective

When designing Jobiss, aim to make a first-time visitor understand through the interface itself:

1. Jobiss learns from more than a resume.
2. What the user has done becomes evidence, and that evidence keeps accumulating instead of being re-explained for every application.
3. It discovers connections between those accumulated experiences and possible work.
4. Relevant opportunities arrive rather than requiring endless searching.
5. Jobiss explains why an opportunity appeared.
6. It can show what is already strong, what may be missing, and what to prepare next.
7. The user remains the person who decides what to pursue.

Item 2 is the one most often lost. A design that communicates 1, 4, and 5 well but leaves a visitor thinking Jobiss is a smarter job alert has explained the surface and missed the product.

---

## 10. Strategic judgment — 2026-09-10, revised 2026-09-11

**Revision (2026-09-11):** the 09-10 conclusion below demoted the mailbox to a mere consumer of the profile. That was wrong. It read the mailbox as a metaphor, when it is the automation of a loop the founder actually ran by hand. The profile and the arriving postings are co-equal. The reasoning about cheap explanations and hallucination risk still holds; the demotion of delivery does not. The standing plan is `experiment-context/product-plan.md`.

Original 09-10 reasoning, kept for the record:

- The mailbox is the structurally weakest bet. "Opportunities arrive" only holds if supply exists, and the job data belongs to someone else — the APIs do not even return posting bodies. The product surface was still mailbox-centric while the strategy notes already said the mailbox is not the differentiator.
- Explanations became cheap. A paragraph on "why this posting fits you" is something any competitor with an LLM can ship tomorrow. What cannot be copied quickly is a user's evidence profile built up over time. The moat is only there.
- Centering on accumulated evidence also relieves the adjacent problems: it reduces dependence on job-supply data, and it creates a reason to return when nothing new has arrived.
- Hallucination risk is existential here. For a product whose promise is "we do not make things up," one fabricated report destroys the whole promise. Evidence must trace to real user input.

**What this does not decide:** narrowing the beta audience, the institutional (university career center / bootcamp) channel, and the Score vs Evidence question all remain open. See the Open Questions section in `experiment-context/jobiss-brief.md`.

**How to apply (as revised):** do not trade one half for the other. Keep the profile inspectable and correctable, keep delivery honest about what it actually knows, and never let a generated explanation claim more than the user's own input supports.
