
AnyDayCard
Product Requirements Document
AI-Personalized Greeting Cards for Any Occasion

Version 1.0
January 2026
Prepared by: Liban Kano

Table of Contents

1. Executive Summary
2. Product Vision & Positioning
3. Market Context & Opportunity
4. User Personas
5. Core User Flows
6. The Wizard: Complete Specification
7. Data Models
8. AI Generation Specification
9. Technical Architecture
10. MVP Scope & Roadmap
11. Success Metrics
12. Open Questions & Decisions
Appendix A: Complete Question Bank
Appendix B: Sample Generated Cards

1. Executive Summary
1.1 The Problem
Greeting cards haven't evolved. The choice is between generic Hallmark sentiments that feel impersonal, or the paralysis of a blank card where people struggle to articulate what they feel. Most cards end up saying nothing meaningful because the sender doesn't know how to translate their feelings into words.
Meanwhile, the moments worth celebrating aren't just birthdays and holidays. People want to express appreciation, love, and connection on any day—but the friction of finding, writing, and sending a card stops them.
1.2 The Solution
AnyDayCard is an AI-powered personalized card platform that transforms the way people create and send greeting cards. Through a guided conversational wizard, we extract the specific details, memories, and inside jokes that make relationships unique—then generate cards that feel impossibly personal.
The sender doesn't write the card. They answer questions about the person they love. The AI does the rest.
1.3 Key Differentiators
Wizard-driven extraction: Guided questions that pull specific memories and details, not form fields
AI-generated content and art: Both the message and the visual are personalized
"Any day" positioning: Not just holidays—cards for thinking of you, just because, I messed up
Physical artifact: Print-on-demand fulfillment, real cards in mailboxes
Relationship intelligence: Profiles that remember, enabling subscriptions and repeat purchases
1.4 Business Model
Single card purchase: $9-15 per card
Subscription: $20-30/month for regular card sending to saved contacts
B2B tier: Volume pricing for professionals (realtors, salespeople, therapists)
1.5 Validation Approach
Following the Gift My Book playbook: build MVP in 1-2 weeks using AI app builders, validate with $100-500 in Meta ads, target Valentine's Day 2026 as first seasonal moment.

2. Product Vision & Positioning
2.1 Vision Statement
AnyDayCard makes it effortless to send cards that actually sound like you—cards that make the recipient feel truly seen.
2.2 Positioning
For people who want to express love and appreciation but struggle with what to say,
Who are frustrated by generic cards that don't capture what makes their relationships special,
AnyDayCard is an AI-powered personalized card platform
That transforms your memories and inside jokes into beautiful, physical cards
Unlike Hallmark (generic), Moonpig (photo upload), or DIY (requires writing skill),
We use guided conversation to extract what makes your relationship unique, then generate both the words and the art.
2.3 The "Any Day" Insight
Traditional card companies are organized around occasions: birthday, anniversary, Mother's Day. This creates two problems:
It limits the market to calendar moments
It creates urgency anxiety ("I need a birthday card by Saturday")
AnyDayCard inverts this. Our positioning says: you don't need a reason to tell someone you love them. The best cards aren't for occasions—they're for "I saw this and thought of you" moments.
This expands the addressable market and creates a new category of impulse/subscription gifting.
2.4 The Core Insight: Extraction > Expression
Most people know their loved ones deeply but can't articulate it on demand. When you hand someone a blank card and say "write something meaningful," they freeze.
But when you ask them questions—"What's something only you two would understand?" or "What's a recent moment that made you smile?"—the stories pour out.
The wizard isn't just UX. It's extraction infrastructure. We're mining for the specific, the weird, the real. The AI's job is synthesis; the human's job is remembering.

3. Market Context & Opportunity
3.1 Market Size
The global greeting card market is approximately $7-8 billion annually. The US market alone is roughly $2.5 billion. However, this significantly underestimates the opportunity:
These figures represent purchased cards, not the latent demand from people who would send cards if it were easier
They don't account for the premium pricing personalization enables
They exclude the subscription/recurring revenue model we're introducing
3.2 Precedent: Gift My Book
Gift My Book reached $1M ARR in 3 months with a similar model:
AI-generated personalized content (comedy books)
Print-on-demand fulfillment
Built in 1 week on Base44
Validated with $100 in Meta ads
6-8% conversion rates
Key learning: There's proven demand for AI-personalized physical gifts, and the infrastructure exists to build and scale quickly.
3.3 Competitive Landscape

Competitor
Model
Gap
Hallmark
Generic pre-written cards
No personalization
Moonpig
Upload your photos
You still write the message
Felt
Handwritten by robot pen
You write it; they transcribe
Touchnote
Photo cards from phone
Templates, not AI-generated
Postable
Card sending service
You pick from catalog
Lovepop
Premium pop-up cards
Beautiful but generic


Gap in market: No one is doing AI-generated message + art with a guided extraction process. The closest comparison is Gift My Book, but for cards.
3.4 Timing
AI generation quality: GPT-4, Claude, and image models have reached the quality threshold for emotional content
Print-on-demand infrastructure: Lob, Stannp, and others offer API-first card printing
Consumer readiness: Gift My Book proved people will buy AI-personalized physical products
Seasonal timing: Valentine's Day 2026 is 4 weeks away—perfect for launch

4. User Personas
4.1 Primary Persona: "The Thoughtful One Who Freezes"
Demographics: 28-45, any gender, employed, in committed relationships and/or close friendships
Behavior: Wants to send meaningful cards but procrastinates because writing feels hard. Buys generic cards at the last minute and feels dissatisfied. Has attempted to write heartfelt messages but gets stuck.
Pain points: Blank page paralysis, time pressure, gap between feeling and expression
Jobs to be done: Express love without the labor of articulation. Feel like a thoughtful partner/friend/child without the cognitive load.
Willingness to pay: High—will pay premium for quality personalization
4.2 Secondary Persona: "The Long-Distance Lover"
Demographics: 22-40, in long-distance relationship or has close family/friends in other cities
Behavior: Seeks physical connection across distance. Values tangible expressions of love. Already sends care packages or small gifts.
Pain points: Can't be there in person. Digital communication feels insufficient. Wants something the recipient can hold.
Jobs to be done: Bridge physical distance with tangible affection. Surprise them with something in their mailbox.
Willingness to pay: Medium-high, especially for subscription
4.3 Tertiary Persona: "The Professional Relationship Builder"
Demographics: 30-55, sales, real estate, consulting, therapy, small business owners
Behavior: Knows personal touches matter for business relationships. Sends holiday cards to clients but they feel generic. Wants to stand out.
Pain points: Volume makes personalization hard. Generic cards don't differentiate. Handwriting each card is time-prohibitive.
Jobs to be done: Maintain warm professional relationships at scale. Be remembered as someone who pays attention.
Willingness to pay: High, especially for volume pricing. Often expensed.
4.4 Emerging Persona: "The Relationship Maintainer"
Demographics: 35-60, busy professional or parent, large extended family/friend network
Behavior: Genuinely wants to maintain relationships but life gets in the way. Feels guilty about friends they've lost touch with. Birthday reminders in calendar but often misses them.
Pain points: Too many relationships to maintain manually. Forgets important dates. Wants to be a good friend/family member but lacks bandwidth.
Jobs to be done: Automate thoughtfulness. Never miss a birthday. Stay connected without constant effort.
Willingness to pay: High for subscription that solves this problem

5. Core User Flows
5.1 Flow Overview
The product has four main flows:
Discovery/Landing: User arrives, understands value prop, initiates wizard
Wizard: Guided extraction of relationship details and card parameters
Generation & Editing: AI creates card, user reviews/regenerates/edits
Checkout & Delivery: Payment, shipping details, confirmation
5.2 Flow 1: Discovery/Landing
Entry Points
Direct (anydaycard.com): Brand-aware traffic
Paid social (Meta/TikTok): "Send a card that actually sounds like you"
Organic social: Shared cards, viral moments
Referral: "[Name] sent you a card from AnyDayCard"
Landing Page Elements
Hero: "Cards that actually sound like you" + CTA "Make a card"
Social proof: Sample cards, testimonials
How it works: 3-step visual (Answer questions → We create → They receive)
Objection handling: Shipping times, quality, satisfaction guarantee
Success Metric
Landing → Wizard initiation rate: Target 25%+
5.3 Flow 2: The Wizard
See Section 6 for complete specification.
Key characteristics:
10-15 screens depending on relationship branch
Two-panel desktop layout: questions left, preview/progress right
Mobile: full-screen wizard with mini-preview
Mix of taps (low friction) and open-text (high signal)
Skip options on optional questions
Success Metrics
Wizard completion rate: Target 60%+
Average time in wizard: Target 3-5 minutes (too short = not enough signal, too long = drop-off)
Open-text completion rate: Target 70%+ on required fields
5.4 Flow 3: Generation & Editing
Generation Experience
Animated loading state (3-5 seconds)
Show user's inputs "floating" into the card
Build anticipation for reveal
Reveal
Two-panel view: card front + card inside
Message clearly visible and readable
Art style matches selected vibe
Editing Options
"Regenerate": Create new version with same inputs
"Edit message": Tweak AI-generated text
"Change vibe": Regenerate with different tone
"Start over": Return to wizard
Success Metrics
First-generation acceptance rate: Target 50%+
Regeneration rate: Track but no target (insight into AI quality)
Edit rate: Track (shows gap between AI output and user expectation)
5.5 Flow 4: Checkout & Delivery
Checkout Steps
Recipient address (with address validation)
Delivery timing preference (standard, expedited, arrive by date)
Optional add-ons (premium envelope, small gift)
Payment (Stripe)
Confirmation + order tracking
Post-Purchase
"Save [Name] for future cards?" → Profile creation
"Set a reminder for their birthday?" → Notification opt-in
"Send another card?" → Retention loop
Email: Order confirmation, shipped notification, delivery confirmation
Success Metrics
Cart completion rate: Target 70%+
Profile save rate: Target 40%+
Repeat purchase rate (30 days): Target 15%+

6. The Wizard: Complete Specification
6.1 Design Philosophy
The wizard is not a form. It's a guided conversation that extracts the raw material for personalization while creating emotional engagement for the sender.
Principles
Low friction, high signal: Mix quick taps with selective open-text moments
Progressive disclosure: Start easy, go deeper gradually
Emotional momentum: The sender should feel something while completing it
Graceful degradation: Skip options for those who can't answer; degrade AI quality gracefully
6.2 Two-Panel Layout
Left Panel (The Experience)
Full wizard flow
One question per screen
Playful, conversational copy
Navigation: Back / Continue
Right Panel (The Artifact)
Progress bar: "X% personalized"
Card silhouette/preview
Answer summary building in real-time
Creates "I'm building something" feeling
Mobile Adaptation
Full-screen wizard
Mini-preview accessible via gesture/button
Review step before generation
6.3 Universal Questions
These questions appear in all or most flows:

Question ID
Question
Type
Required
name
Who are you thinking about right now?
Text
Yes
relationshipType
Who is [Name] to you?
Grid (9 options)
Yes
occasion
What's prompting this card?
Grid (10 options)
Yes
vibe
What's the energy?
Multi-select (max 2)
Yes
humorType
What kind of funny?
List (6 options)
Conditional
heartfeltDepth
How deep are we going?
List (3 options)
Conditional
quickTraits
What's [Name] like?
Chips (20 options)
No

6.4 Relationship Branches
After relationship type is selected, the flow branches into relationship-specific questions.
Partner/Spouse Branch
Question ID
Question
Type
Required
partnerSubtype
What do you call [Name]?
Pills
Yes
duration
How long have you been together?
List
Yes
recentMoment
What's a recent moment with [Name] that stuck with you?
Textarea
Yes
theirThing
Does [Name] have a thing?
Textarea
No (skip)
insideJoke
What's something only you two would understand?
Textarea
No (skip)
loveLanguage
How does [Name] show love?
Pills
No

Friend Branch
Question ID
Question
Type
Required
friendTexture
How would you describe this friendship?
List
Yes
howMet
How did you meet [Name]?
Textarea
No (skip)
sharedMemory
What's a memory that always makes you smile?
Textarea
Yes
theyreTheOneWho
[Name] is the one who...
Textarea
No (skip)
friendInsideJoke
What's an inside joke between you?
Textarea
No (skip)
whatYouAdmire
What do you admire about [Name]?
Textarea
No (skip)

Parent Branch
Question ID
Question
Type
Required
whichParent
Which parent?
Pills
Yes
parentRelationshipVibe
How would you describe your relationship?
List
Yes
taughtYou
What did [Name] teach you that you still carry?
Textarea
Yes
alwaysSays
What's something [Name] always says?
Textarea
No (skip)
childhoodMemory
What's a childhood memory that stands out?
Textarea
No (skip)
remindsYouOf
What always reminds you of [Name]?
Textarea
No (skip)

Child Branch
Question ID
Question
Type
Required
childAge
How old is [Name]?
Pills
Yes
currentPhase
What phase is [Name] in right now?
Textarea
Yes
proudMoment
What's something they did that made you proud?
Textarea
Yes
theirPersonality
How would you describe their personality?
Textarea
No (skip)
sharedThing
What's something you do together?
Textarea
No (skip)
yourWish
What do you wish for [Name]?
Textarea
No (skip)

Sibling Branch
Question ID
Question
Type
Required
siblingType
Which sibling?
Pills
Yes
birthOrder
Where does [Name] fall?
Pills
Yes
dynamicNow
How would you describe your relationship now?
List
Yes
siblingChildhoodMemory
What's a childhood memory that stands out?
Textarea
Yes
siblingRole
Growing up, [Name] was the one who...
Textarea
No (skip)
siblingInsideJoke
What's something only you two would get?
Textarea
No (skip)

Professional Branch
Question ID
Question
Type
Required
professionalType
What's your relationship with [Name]?
List
Yes
workContext
How long have you worked together?
Pills
Yes
whatTheyDid
What did [Name] do that you want to acknowledge?
Textarea
Yes
theirStrength
What's something [Name] is great at?
Textarea
No (skip)
toneCheck
How formal should this be?
Pills
Yes

New Dating Branch
Question ID
Question
Type
Required
datingHowLong
How long have you been seeing [Name]?
Pills
Yes
datingHowMet
How did you meet?
Textarea
No (skip)
whatYouLike
What do you like about [Name] so far?
Textarea
Yes
bestDateSoFar
What's the best date or moment you've had?
Textarea
Yes
theirQuirk
What's an endearing quirk you've noticed?
Textarea
No (skip)
cardIntensity
How intense should this card be?
List
Yes

Grandparent Branch
Question ID
Question
Type
Required
whichGrandparent
Which grandparent?
Pills
Yes
grandparentRelationship
How close are you?
List
Yes
grandparentMemory
What's a favorite memory?
Textarea
Yes
theyAlways
[Name] always...
Textarea
No (skip)
wantThemToKnow
What do you want [Name] to know?
Textarea
No (skip)

Other Relationship Branch
Question ID
Question
Type
Required
otherDescribe
How would you describe your relationship?
Textarea
Yes
whyCard
Why do you want to send them a card?
Textarea
Yes
whatToSay
What do you want them to feel when they read this?
Textarea
Yes
anyDetails
Any specific details to include?
Textarea
No (skip)

6.5 Conditional Logic
The wizard adapts based on previous answers:
humorType only appears if vibe includes "funny"
heartfeltDepth only appears if vibe includes "heartfelt" AND NOT "funny"
Branch-specific questions load after relationshipType is selected
Skipped questions don't appear in the answer summary
6.6 Question Copywriting Guidelines
Eyebrows: Conversational, acknowledge previous answer, create flow
Questions: Clear, specific, emotionally evocative
Hints: Give permission, provide examples, reduce blank-page anxiety
Placeholders: Concrete examples that unlock thinking
Skip text: Non-judgmental ("Skip if nothing comes to mind")

7. Data Models
7.1 Core Entities
User
Represents someone who creates cards (may be anonymous for first card).
id: UUID
email: string (optional until checkout)
created_at: timestamp
subscription_status: enum (none, active, cancelled)
subscription_tier: enum (null, monthly, annual)
Recipient Profile
Stored information about a card recipient for future use.
id: UUID
user_id: FK to User
name: string
relationship_type: enum
relationship_subtype: string (nullable)
address: Address object (nullable)
birthday: date (nullable)
wizard_answers: JSON (all captured data)
created_at: timestamp
updated_at: timestamp
Card
A single card creation instance.
id: UUID
user_id: FK to User (nullable for anonymous)
recipient_profile_id: FK to RecipientProfile (nullable)
status: enum (draft, generated, purchased, shipped, delivered)
wizard_answers: JSON
generated_content: JSON (message, art_url, etc.)
generation_attempts: integer
created_at: timestamp
updated_at: timestamp
Order
A purchase transaction.
id: UUID
user_id: FK to User
card_id: FK to Card
stripe_payment_intent_id: string
amount_cents: integer
shipping_address: Address object
shipping_method: enum (standard, expedited, by_date)
delivery_by_date: date (nullable)
fulfillment_status: enum (pending, sent_to_printer, printed, shipped, delivered)
fulfillment_provider_id: string (Lob order ID)
tracking_number: string (nullable)
created_at: timestamp
7.2 JSON Structures
wizard_answers
Stored as JSON to allow flexibility across relationship types:
name: string
relationshipType: string
occasion: string
vibe: array of strings
[branch-specific fields]: string or array
quickTraits: array of strings
generated_content
message: string (the card interior text)
art_prompt: string (prompt used for image generation)
art_url: string (URL to generated/stored image)
art_style: string (style parameter used)
generation_model: string (claude-3-opus, gpt-4, etc.)
generation_timestamp: timestamp

8. AI Generation Specification
8.1 Generation Pipeline
Card generation happens in two parallel tracks:
Message generation: Text content for inside of card
Art generation: Visual for card front
8.2 Message Generation
Input Assembly
Transform wizard answers into a structured prompt:
Relationship context (type, subtype, duration)
Occasion
Vibe(s) selected + any depth parameters
All open-text responses (memories, inside jokes, their "thing")
Quick traits if selected
Prompt Structure
The prompt should include:
Role: "You are writing a greeting card message..."
Relationship context: All structured data
Raw material: All open-text responses, quoted
Tone guidance: Based on vibe selection
Constraints: Length (50-150 words typical), no clichés, must reference specific details
Format: Just the message, no meta-commentary
Quality Criteria
References at least one specific detail from user input
Matches selected vibe/tone
Appropriate length for card format
No generic phrases ("wishing you all the best")
Feels like it could only be for this specific person
Model Selection
Primary: Claude 3.5 Sonnet (best balance of quality and cost)
Fallback: GPT-4 Turbo
Budget option for scale: Claude 3 Haiku with quality checks
8.3 Art Generation
Style Mapping
Map vibe selections to art direction:
Funny → Playful illustration, bright colors, whimsical
Heartfelt → Warm, soft, watercolor or gentle illustration
Spicy → Bold, dynamic, red accents
Weird → Surreal, unexpected, quirky illustration
Nostalgic → Vintage, film grain, muted tones
Professional → Clean, minimal, sophisticated
Personalization Elements
Art should incorporate (when available):
"Their thing" as visual element (sourdough starter, hiking, etc.)
Quick traits as visual hints
Relationship type appropriate imagery
Model Selection
Primary: DALL-E 3 or Midjourney API
Fallback: Stable Diffusion with fine-tuned style models
8.4 Regeneration Logic
When user requests regeneration:
First regeneration: Same prompt, different seed/temperature
Second regeneration: Slightly modified prompt (different angle on same material)
Third+ regeneration: Prompt user to add more detail or adjust vibe
8.5 Quality Assurance
Content filtering: Check for inappropriate content
Relevance check: Verify output references user inputs
Length check: Ensure appropriate for card format
Sentiment check: Verify matches selected vibe

9. Technical Architecture
9.1 Build Approach
Following the Gift My Book model: use AI app builders for rapid development.
Primary option: Base44 — proven for similar product, can generate full-stack from PRD
Alternative: Bolt.new, Lovable, or similar AI-first builders
Fallback: Next.js + Supabase + Vercel (if more control needed)
9.2 Core Stack (MVP)
Frontend: React (generated by builder or Next.js)
Backend: Serverless functions or builder-provided backend
Database: PostgreSQL (Supabase) or builder-provided
Auth: Magic link email (low friction) or builder-provided
Payments: Stripe
AI: Anthropic Claude API + OpenAI DALL-E API
Print fulfillment: Lob API
9.3 External Integrations
Stripe
Payment processing
Subscription management (future)
Webhook for order confirmation
Lob (Print Fulfillment)
Postcard/card printing API
Address verification
Tracking integration
Webhook for fulfillment status
Anthropic Claude API
Message generation
Content quality checks
OpenAI DALL-E API
Card art generation
Style variations
9.4 Infrastructure
Hosting: Vercel or builder-provided
CDN: Vercel Edge or Cloudflare
Image storage: S3 or Cloudflare R2
Monitoring: Vercel Analytics + Sentry
9.5 Security Considerations
PCI compliance via Stripe (no card data touches our servers)
Address data encryption at rest
Rate limiting on AI generation endpoints
Input sanitization for all user-provided content

10. MVP Scope & Roadmap
10.1 MVP (V1) — Valentine's Day Launch
Target: February 1, 2026
Timeline: 2-3 weeks
In Scope
Landing page with value prop
Full wizard flow (all 9 relationship branches)
AI message generation
AI art generation (1-2 style options per vibe)
Card preview and regeneration
Basic message editing
Stripe checkout
Lob print fulfillment integration
Order confirmation email
Single card purchase only ($12 price point)
Out of Scope (V1)
User accounts/login
Saved recipient profiles
Subscription model
Multiple card sizes/formats
Add-on gifts
Expedited shipping options
Mobile app
10.2 V1.5 — Post-Launch Iteration
Target: February-March 2026
Features
User accounts (magic link)
Save recipient profiles
Order history
"Send another card to [Name]" flow
Birthday reminders
Improved regeneration UX
Art style selection
10.3 V2 — Subscription & Scale
Target: Q2 2026
Features
Subscription tiers ($20/month, $30/month)
Scheduled card sending
Multiple card formats (postcard, folded, premium)
B2B tier with volume pricing
Team/family accounts
Mobile apps (iOS, Android)
International shipping
10.4 Future Considerations
Gift add-ons (chocolates, flowers, small items)
Corporate/enterprise tier
API for developers
White-label option
Integration with calendar apps
AI voice message option

11. Success Metrics
11.1 North Star Metric
Cards delivered that recipients loved — measured by: recipient engagement (QR code scan, reply), sender repeat rate, and NPS.
11.2 Funnel Metrics

Stage
Metric
Target (MVP)
Target (Mature)
Landing
Visitor → Wizard start
25%
35%
Wizard
Start → Complete
60%
75%
Generation
Complete → Accept card
70%
80%
Checkout
Accept → Purchase
70%
80%
Overall
Visitor → Purchase
7%
17%

11.3 Business Metrics
Revenue: Track weekly, target $10K MRR by month 3
Average Order Value: Target $12-15 (single card), $25+ (with add-ons)
Customer Acquisition Cost: Target < $8 (paid) for positive unit economics
Repeat Purchase Rate (90 days): Target 25%+
Subscription Conversion (when launched): Target 10% of purchasers
11.4 Product Quality Metrics
First-generation acceptance rate: Target 50%+ (measures AI quality)
Regeneration rate: Track (lower is better, indicates AI hitting mark)
Message edit rate: Track (indicates gap between AI output and user expectation)
Time in wizard: Target 3-5 minutes (engagement without fatigue)
Open-text completion rate: Target 70%+ on required fields
11.5 Operational Metrics
Print fulfillment time: Track against Lob SLAs
Delivery success rate: Target 98%+
Customer support volume: Track, aim to minimize
Refund rate: Target < 5%

12. Open Questions & Decisions
12.1 Pricing
Decision needed: What's the right price point for MVP?
Option A: $9 (impulse-friendly, higher volume)
Option B: $12 (mid-range, balanced)
Option C: $15 (premium positioning, higher margin)
Recommendation: Start at $12, test elasticity
12.2 Card Format
Decision needed: What physical format for MVP?
Option A: Folded card (traditional, more space for message)
Option B: Postcard (simpler, cheaper, faster to ship)
Option C: Both (more complexity)
Recommendation: Folded card only for MVP (matches premium positioning)
12.3 Art Generation Approach
Decision needed: Full AI generation vs. templates + AI customization?
Option A: Full AI generation (DALL-E/Midjourney) — more unique, less predictable
Option B: Template library with AI-selected/customized elements — more consistent, less magical
Option C: Hybrid (templates for some vibes, full AI for others)
Recommendation: Full AI generation for MVP (differentiator), add templates if quality issues
12.4 User Accounts
Decision needed: Require account creation before checkout?
Option A: Anonymous checkout, optional account after (lowest friction)
Option B: Email capture before wizard, account created at checkout
Option C: Account required before wizard (highest friction, best data)
Recommendation: Option A for MVP, move to B once proven
12.5 Message Length
Decision needed: How long should generated messages be?
Option A: Short (30-50 words) — punchy, fits small cards
Option B: Medium (50-100 words) — balanced
Option C: Long (100-150 words) — more personal, requires larger card
Recommendation: Medium (50-100 words), let AI adapt based on content
12.6 Regeneration Limits
Decision needed: How many free regenerations?
Option A: Unlimited — best UX, highest AI cost
Option B: 3 free, then friction ("add more detail") — balanced
Option C: 3 free, then paywall — revenue opportunity, poor UX
Recommendation: Option B — 3 free regenerations, then prompt for more input
12.7 Print Partner
Decision needed: Which print-on-demand partner?
Lob: Best API, US-focused, proven reliability
Stannp: Good international coverage, UK-based
Gelato: Global network, more formats
Recommendation: Lob for MVP (best API, US focus for launch)

Appendix A: Complete Question Bank
This appendix contains the full text of all questions, options, and copy for implementation reference.

A.1 Universal Questions
Name Entry
Eyebrow: "Let's make something that actually sounds like you."
Question: "Who are you thinking about right now?"
Placeholder: "Their name"
Type: Text input
Required: Yes

Relationship Type
Eyebrow: "Nice. Tell me more."
Question: "Who is [Name] to you?"
Type: Grid selection
Options: Partner/Spouse 💑, A friend 👯, My parent 👨‍👩‍👧, My child 👶, Sibling 👫, Coworker/Professional 💼, Someone I'm dating (it's new) 🌱, Grandparent 👴, Someone else ✨
Required: Yes

Occasion
Eyebrow: "What's prompting this card?"
Question: "Pick the occasion"
Type: Grid selection
Options: Their birthday 🎂, Our anniversary 💑, A holiday 🎄, They're going through something 🫂, They achieved something 🏆, I miss them 💭, No reason — just because 💫, I messed up 😬, To say thank you 🙏, Congratulations 🎉
Required: Yes

Vibe
Eyebrow: "Now for the fun part."
Question: "What's the energy?"
Hint: "Pick one or two"
Type: Multi-select (max 2)
Options: Funny 😄, Heartfelt 💝, Spicy 🌶️, Weird 🦑, Grateful 🙏, Nostalgic 📷, Encouraging ✨, Apologetic 🥺, Proud 🌟, Playful 🎈
Required: Yes

Humor Type (Conditional)
Condition: Only shows if "Funny" is selected
Eyebrow: "Funny — love that."
Question: "What kind of funny?"
Type: List selection
Options: Inside jokes only we'd get, Playful teasing / light roast, Absurdist / weird humor, Dry / deadpan, Self-deprecating, Wholesome / silly
Required: Yes (when shown)

Heartfelt Depth (Conditional)
Condition: Only shows if "Heartfelt" is selected AND "Funny" is NOT selected
Eyebrow: "Heartfelt it is."
Question: "How deep are we going?"
Type: List selection
Options: Keep it warm but light, I want them to feel seen, I might cry writing this and that's okay
Required: Yes (when shown)

Quick Traits
Eyebrow: "Quick hits — tap any that apply."
Question: "What's [Name] like?"
Type: Chip multi-select
Options: Dog person, Cat person, Coffee addict, Tea drinker, Gym rat, Hates mornings, Always late, Plant parent, Gamer, Bookworm, Foodie, Homebody, Overthinker, Crier at movies, Neat freak, Creative mess, Workaholic, Adventure seeker, Introvert, Life of the party
Required: No

A.2 Partner/Spouse Branch Questions
Full question copy for the partner relationship flow...

[Additional branches would continue with same level of detail]

Note: Complete question copy for all branches is available in the companion React prototype file (anydaycard-full-wizard.jsx).

Appendix B: Sample Generated Cards
These examples demonstrate the quality and personalization level we're targeting.

B.1 Partner Card — Funny Vibe
Input Summary
Recipient: Sarah (Partner, 3 years)
Occasion: Just because
Vibe: Funny + Heartfelt
Humor type: Inside jokes
Their thing: "She named her sourdough starter Gary and talks to it"
Recent moment: "We got lost in IKEA and ate four plates of meatballs"
Inside joke: "That's a you problem"
Generated Message
"To the only person who understands why I talk to Gary more than most humans.
Remember when we got lost in IKEA and you said 'this is fine' while eating your fourth plate of meatballs? That's when I knew.
You're my favorite weirdo. (That's a you problem now.)
— Me"

B.2 Parent Card — Heartfelt Vibe
Input Summary
Recipient: Mom
Occasion: Just because
Vibe: Heartfelt + Grateful
Depth: I want them to feel seen
What they taught: "That it's okay to rest. She always said 'you can't pour from an empty cup.'"
Always says: "Call me when you get there"
Reminds me of: "The smell of coffee and her perfume in the morning"
Generated Message
"I still hear your voice every time I get somewhere new: 'Call me when you get there.'
And I still think of you every morning when I smell coffee — that mix of your perfume and the kitchen when I was little, pretending to be asleep so I could listen to you get ready.
You taught me it's okay to rest. I'm still learning, but I hear you.
Thank you for everything you've poured into me.
Love always"

B.3 Friend Card — Nostalgic Vibe
Input Summary
Recipient: Jake (Friend, "we've been through some shit together")
Occasion: I miss them
Vibe: Nostalgic + Funny
How met: "College roommates, randomly assigned freshman year"
Shared memory: "Road trip to Vegas where the car broke down in the desert and we camped on the side of the road"
They're the one who: "Always has a plan, even when the plan is terrible"
Generated Message
"Remember when your 'plan' was to keep driving through the desert until the engine started smoking?
And then your backup plan was 'I guess we live here now.'
I think about that night on the side of the road more than I probably should. Stars you can only see when you're stranded. Your terrible ideas that somehow always work out.
Miss you, man. Let's make another terrible plan soon."


End of Document
AnyDayCard PRD v1.0
For questions: [contact]
