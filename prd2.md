# AnyDayCard: Claude Code Project Execution Guide
## Quality-Optimized Stack | Launch: Monday, January 19, 2026, 6:00 PM CST

---

# MISSION BRIEF

**You are Claude Code, the project manager and lead developer for AnyDayCard.**

Your mission: Ship a working MVP that allows users to create AI-personalized greeting cards, pay $12, and have a physical card mailed to their recipient.

**Launch deadline:** Monday, January 19, 2026 at 6:00 PM CST
**Time remaining:** ~72 hours from Friday morning

**Optimization priority:** QUALITY. We want the best possible card messages and artwork. Cost optimization comes later.

**Platform:** Base44 (no-code app builder with AI scaffolding)

---

# SECTION 1: FINAL TECHNOLOGY DECISIONS

## 1.1 The Stack (Quality-Optimized)

| Function | Service | Why This Choice | Cost |
|----------|---------|-----------------|------|
| **App Builder** | Base44 | Fastest path to MVP, Gift My Book precedent | $0 (free tier) |
| **Text Generation** | Claude 3.5 Sonnet | Best at emotional, nuanced personal writing | ~$0.002/card |
| **Image Generation** | FAL AI (Flux) | Native Base44 integration + good quality | ~$0.01-0.02/image |
| **Payments** | Stripe | Native Base44 integration, zero friction | 2.9% + $0.30 |
| **Print Fulfillment** | Lob | Best API documentation, fastest integration | ~$0.92/postcard |
| **Hosting** | Base44 | Automatic, included | $0 |

## 1.2 Unit Economics

| Component | Cost per Card |
|-----------|---------------|
| Claude 3.5 Sonnet (message) | $0.002 |
| FAL AI Flux (art) | $0.015 |
| Lob (6x9 postcard + postage) | $0.92 |
| Stripe (on $12) | $0.65 |
| **Total COGS** | **$1.59** |
| **Card Price** | **$12.00** |
| **Gross Margin** | **$10.41 (87%)** |

## 1.3 API Keys Required

You will need to obtain and configure:

```
ANTHROPIC_API_KEY=sk-ant-xxx        # Claude 3.5 Sonnet
FAL_API_KEY=xxx                      # FAL AI image generation
STRIPE_SECRET_KEY=sk_live_xxx        # Stripe payments
STRIPE_PUBLISHABLE_KEY=pk_live_xxx   # Stripe frontend
STRIPE_WEBHOOK_SECRET=whsec_xxx      # Stripe webhooks
LOB_API_KEY=live_xxx                 # Lob print fulfillment
```

---

# SECTION 2: INVERSE TIMELINE — WORKING BACKWARD FROM LAUNCH

## Launch State (Monday 6:00 PM)

At launch, the following MUST be true:

```
✅ anydaycard.com resolves to live app
✅ User can complete wizard and see generated card
✅ User can pay $12 via Stripe (live mode)
✅ Successful payment triggers Lob postcard creation
✅ User sees confirmation with expected delivery
✅ At least one real test order has been placed and verified
✅ Terms of Service and Privacy Policy pages exist
✅ Mobile experience is functional (not perfect, but usable)
```

## Working Backward: What Must Happen When

### T-0: Monday 6:00 PM — LAUNCH
```
State: Live, accepting real orders
Actions: 
- Share with friends for soft launch
- Monitor for errors
- Be ready to hotfix
```

### T-3 hours: Monday 3:00 PM — Final Verification
```
State: All systems live, tested
Actions needed before this point:
- [ ] Place real test order with real credit card
- [ ] Verify payment appears in Stripe dashboard
- [ ] Verify postcard created in Lob dashboard
- [ ] Verify confirmation page shows correctly
- [ ] Test on mobile device
- [ ] Verify all environment variables are production
```

### T-6 hours: Monday 12:00 PM — Production Deploy
```
State: Code complete, deploying to production
Actions needed before this point:
- [ ] All features working in test/staging
- [ ] Switch Stripe to live mode
- [ ] Switch Lob to live mode  
- [ ] Verify domain SSL certificate
- [ ] Final deploy to production
```

### T-12 hours: Monday 6:00 AM — Code Complete
```
State: All features implemented and tested
Actions needed before this point:
- [ ] End-to-end flow works in test mode
- [ ] Stripe webhook handles payment correctly
- [ ] Lob integration creates postcards
- [ ] Success page displays correctly
- [ ] All edge cases handled (empty fields, errors)
```

### T-24 hours: Sunday 6:00 PM — Integration Complete
```
State: All external services connected and working
Actions needed before this point:
- [ ] Stripe Checkout integration complete
- [ ] Stripe webhook receiving events
- [ ] Lob API creating test postcards
- [ ] Address form with validation
- [ ] Payment → Fulfillment pipeline tested
```

### T-36 hours: Sunday 6:00 AM — Generation Complete
```
State: AI generation working reliably
Actions needed before this point:
- [ ] Claude 3.5 Sonnet generating quality messages
- [ ] FAL AI generating card art
- [ ] Card preview showing both front and back
- [ ] Regenerate button working
- [ ] Message editing working
- [ ] 10+ test generations verified for quality
```

### T-48 hours: Saturday 6:00 PM — Wizard Complete
```
State: Full wizard flow capturing all data
Actions needed before this point:
- [ ] All wizard screens built
- [ ] Partner relationship branch complete
- [ ] Conditional logic working (humor type, heartfelt depth)
- [ ] Skip buttons on optional questions
- [ ] Progress indicator working
- [ ] Answer summary building correctly
- [ ] Data persisting through flow
```

### T-60 hours: Saturday 6:00 AM — Foundation Complete
```
State: Base app scaffolded, basic navigation working
Actions needed before this point:
- [ ] Base44 project created
- [ ] Landing page with "Make a Card" CTA
- [ ] Basic wizard container/navigation
- [ ] First 3-4 wizard screens working
- [ ] Routing between pages
- [ ] Basic styling applied
```

### T-72 hours: Friday 6:00 PM — Infrastructure Complete
```
State: All accounts created, APIs accessible
Actions needed before this point:
- [ ] Domain pointing to hosting
- [ ] Anthropic API key obtained
- [ ] FAL AI API key obtained
- [ ] Stripe account ready (test + live keys)
- [ ] Lob account ready (test + live keys)
- [ ] Base44 project initialized
```

---

# SECTION 3: COMPLETE TASK BREAKDOWN

## Phase 1: Infrastructure (Friday Morning — 3 hours)

### 1.1 Account Setup

```
□ Anthropic API
  └─ Go to: console.anthropic.com
  └─ Create account or log in
  └─ Generate API key
  └─ Note: Claude 3.5 Sonnet model string is "claude-3-5-sonnet-20241022"
  └─ Store key securely

□ FAL AI
  └─ Go to: fal.ai
  └─ Create account
  └─ Generate API key
  └─ Note: Flux model for image generation
  └─ Store key securely

□ Stripe
  └─ Go to: dashboard.stripe.com
  └─ Create account or log in
  └─ Get test API keys (pk_test_xxx, sk_test_xxx)
  └─ Get live API keys (pk_live_xxx, sk_live_xxx)
  └─ Set up webhook endpoint (do after app exists)
  └─ Create product: "AnyDayCard" at $12.00

□ Lob
  └─ Go to: dashboard.lob.com
  └─ Create account
  └─ Get test API key
  └─ Get live API key
  └─ Review postcard specs: 6x9, 300 DPI
  └─ Note: Test mode sends to Lob but doesn't print
```

### 1.2 Domain Configuration

```
□ GoDaddy DNS Settings
  └─ Log into GoDaddy
  └─ Go to DNS management for anydaycard.com
  └─ If using Vercel:
     └─ A Record: @ → 76.76.21.21
     └─ CNAME: www → cname.vercel-dns.com
  └─ If using Base44:
     └─ Follow Base44's custom domain instructions
  └─ Wait for propagation (can take up to 48 hours, usually faster)
```

### 1.3 Base44 Project Setup

```
□ Create Project
  └─ Go to: app.base44.com
  └─ Create new project: "AnyDayCard"
  └─ Select AI model for building: Gemini 2.5 Pro or Claude Sonnet 4.5
  
□ Configure Integrations
  └─ Go to Integrations settings
  └─ Add Anthropic API key (for Claude text generation)
  └─ Add FAL AI API key (for image generation)
  └─ Connect Stripe (native integration)
  └─ Note: Lob requires custom backend function (do later)

□ Enable Backend Functions
  └─ Go to App Settings
  └─ Enable "Backend Functions"
  └─ This allows custom API calls to Lob
```

---

## Phase 2: Landing Page & Wizard Foundation (Friday Afternoon — 4 hours)

### 2.1 Landing Page

```
□ Prompt Base44:
  "Create a landing page for AnyDayCard with:
   - Hero section: headline 'Cards that actually sound like you'
   - Subheadline: 'Answer a few questions. We'll write it. They'll love it.'
   - Large CTA button: 'Make a Card' that navigates to /wizard
   - 3-step explanation: 'Answer questions → We create → They receive'
   - Color scheme: Primary #1e3a5f (deep blue), Accent #48bfe3 (teal)
   - Clean, modern, warm aesthetic"

□ Verify:
  └─ Page renders correctly
  └─ CTA button navigates to wizard
  └─ Mobile responsive
```

### 2.2 Wizard Container

```
□ Prompt Base44:
  "Create a multi-step wizard component for the /wizard page with:
   - State management to track current step and all answers
   - Back and Continue navigation buttons
   - Progress bar showing completion percentage
   - Ability to render different question types per step
   - Store all answers in a wizardAnswers object
   - Two-panel layout on desktop: questions left, preview right
   - Full-screen on mobile with collapsible preview"

□ Verify:
  └─ Can navigate forward and back
  └─ Progress bar updates
  └─ State persists between steps
```

### 2.3 First Wizard Screens (Universal Questions)

```
□ Screen 1: Name Entry
  └─ Eyebrow: "Let's make something that actually sounds like you."
  └─ Question: "Who are you thinking about right now?"
  └─ Input: Single text field
  └─ Placeholder: "Their name"
  └─ Required: Yes
  └─ On continue: Store as wizardAnswers.name

□ Screen 2: Relationship Type
  └─ Eyebrow: "Nice. Tell me more."
  └─ Question: "Who is {name} to you?"
  └─ Input: Grid of 9 options with emojis
  └─ Options:
     - Partner/Spouse 💑
     - A friend 👯
     - My parent 👨‍👩‍👧
     - My child 👶
     - Sibling 👫
     - Coworker/Professional 💼
     - Someone I'm dating 🌱
     - Grandparent 👴
     - Someone else ✨
  └─ Required: Yes
  └─ On select: Store as wizardAnswers.relationshipType, advance to next

□ Screen 3: Occasion
  └─ Eyebrow: "What's prompting this card?"
  └─ Question: "Pick the occasion"
  └─ Input: Grid of 10 options with emojis
  └─ Options:
     - Their birthday 🎂
     - Our anniversary 💑
     - A holiday 🎄
     - They're going through something 🫂
     - They achieved something 🏆
     - I miss them 💭
     - No reason — just because 💫
     - I messed up 😬
     - To say thank you 🙏
     - Congratulations 🎉
  └─ Required: Yes
  └─ On select: Store as wizardAnswers.occasion, advance

□ Screen 4: Vibe Selection
  └─ Eyebrow: "Now for the fun part."
  └─ Question: "What's the energy?"
  └─ Hint: "Pick one or two"
  └─ Input: Multi-select grid (max 2)
  └─ Options:
     - Funny 😄
     - Heartfelt 💝
     - Spicy 🌶️
     - Weird 🦑
     - Grateful 🙏
     - Nostalgic 📷
     - Encouraging ✨
     - Apologetic 🥺
     - Proud 🌟
     - Playful 🎈
  └─ Required: Yes (at least 1)
  └─ On continue: Store as wizardAnswers.vibe (array)
```

---

## Phase 3: Complete Wizard Flow (Friday Evening + Saturday Morning — 6 hours)

### 3.1 Conditional Questions

```
□ Screen 5: Humor Type (CONDITIONAL)
  └─ Only show if wizardAnswers.vibe includes "Funny"
  └─ Eyebrow: "Funny — love that."
  └─ Question: "What kind of funny?"
  └─ Input: List selection (single choice)
  └─ Options:
     - Inside jokes only we'd get
     - Playful teasing / light roast
     - Absurdist / weird humor
     - Dry / deadpan
     - Self-deprecating
     - Wholesome / silly
  └─ Required: Yes (when shown)
  └─ On select: Store as wizardAnswers.humorType, advance

□ Screen 6: Heartfelt Depth (CONDITIONAL)
  └─ Only show if wizardAnswers.vibe includes "Heartfelt" AND NOT "Funny"
  └─ Eyebrow: "Heartfelt it is."
  └─ Question: "How deep are we going?"
  └─ Input: List selection
  └─ Options:
     - Keep it warm but light
     - I want them to feel seen
     - I might cry writing this and that's okay
  └─ Required: Yes (when shown)
  └─ On select: Store as wizardAnswers.heartfeltDepth, advance
```

### 3.2 Partner Branch Questions (MVP Focus)

```
□ Screen: Partner Subtype
  └─ Only show if relationshipType is "Partner/Spouse"
  └─ Eyebrow: "The best kind of person to send a card to."
  └─ Question: "What do you call {name}?"
  └─ Input: Pill buttons
  └─ Options: Partner, Spouse, Husband, Wife, Boyfriend, Girlfriend, My person
  └─ On select: Store as wizardAnswers.partnerSubtype, advance

□ Screen: Duration
  └─ Eyebrow: "Time flies, doesn't it?"
  └─ Question: "How long have you been together?"
  └─ Input: List selection
  └─ Options:
     - Under a year (still in the magic phase)
     - 1-2 years (past the butterflies, into the real stuff)
     - 3-5 years (you've seen some things together)
     - 5-10 years (a whole chapter of life)
     - 10+ years (you're basically the same person now)
  └─ On select: Store as wizardAnswers.duration, advance
```

### 3.3 Memory Mining Questions

```
□ Screen: Recent Moment (REQUIRED)
  └─ Eyebrow: "Here's where the magic happens."
  └─ Question: "What's a recent moment with {name} that stuck with you?"
  └─ Hint: "It doesn't have to be big. Sometimes the small ones hit hardest."
  └─ Input: Textarea
  └─ Placeholder: "Last week we were cooking dinner and..."
  └─ Required: Yes
  └─ Character limit: 500
  └─ On continue: Store as wizardAnswers.recentMoment

□ Screen: Their Thing (SKIPPABLE)
  └─ Eyebrow: "Everyone has a thing."
  └─ Question: "Does {name} have a thing? A hobby, obsession, or weird habit?"
  └─ Hint: "The sourdough starter they named. The true crime podcasts. The plant collection that's taking over."
  └─ Input: Textarea
  └─ Placeholder: "They're really into..."
  └─ Required: No
  └─ Skip button: "Skip if nothing comes to mind"
  └─ On continue/skip: Store as wizardAnswers.theirThing or null

□ Screen: Inside Joke (SKIPPABLE)
  └─ Eyebrow: "Now we're getting personal."
  └─ Question: "What's something only you two would understand?"
  └─ Hint: "An inside joke, a phrase, a memory that makes zero sense to anyone else."
  └─ Input: Textarea
  └─ Placeholder: "We always say..."
  └─ Required: No
  └─ Skip button: "Skip if nothing comes to mind"
  └─ On continue/skip: Store as wizardAnswers.insideJoke or null
```

### 3.4 Quick Traits

```
□ Screen: Quick Traits (OPTIONAL)
  └─ Eyebrow: "Quick hits — tap any that apply."
  └─ Question: "What's {name} like?"
  └─ Input: Chip multi-select (no limit)
  └─ Options:
     - Dog person 🐕
     - Cat person 🐱
     - Coffee addict ☕
     - Tea drinker 🍵
     - Gym rat 💪
     - Hates mornings 😴
     - Always late ⏰
     - Plant parent 🌱
     - Gamer 🎮
     - Bookworm 📚
     - Foodie 🍕
     - Homebody 🏠
     - Overthinker 🧠
     - Crier at movies 😢
     - Neat freak 🧹
     - Creative mess 🎨
     - Workaholic 💼
     - Adventure seeker 🏔️
  └─ Required: No
  └─ On continue: Store as wizardAnswers.quickTraits (array)
```

### 3.5 Generate Trigger

```
□ Final Screen: Generate
  └─ Eyebrow: "You did it."
  └─ Message: "We've got everything we need to make something special for {name}."
  └─ CTA Button: "Generate My Card" (large, prominent)
  └─ On click: 
     - Show loading state
     - Call text generation API
     - Call image generation API
     - Navigate to /preview when both complete
```

---

## Phase 4: AI Generation (Saturday Afternoon — 4 hours)

### 4.1 Claude Text Generation

```
□ Create Backend Function: generateCardMessage

□ Implementation:
  
  async function generateCardMessage(wizardAnswers) {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 300,
        messages: [{
          role: 'user',
          content: buildPrompt(wizardAnswers)
        }]
      })
    });
    
    const data = await response.json();
    return data.content[0].text;
  }

□ Prompt Template:

  function buildPrompt(answers) {
    return `You are a gifted writer creating a personalized greeting card message.

RELATIONSHIP CONTEXT:
- Recipient: ${answers.name}
- Relationship: ${answers.relationshipType}${answers.partnerSubtype ? ` (${answers.partnerSubtype})` : ''}
- Duration: ${answers.duration || 'not specified'}
- Occasion: ${answers.occasion}

TONE & STYLE:
- Vibes: ${answers.vibe.join(', ')}
${answers.humorType ? `- Humor style: ${answers.humorType}` : ''}
${answers.heartfeltDepth ? `- Emotional depth: ${answers.heartfeltDepth}` : ''}

PERSONAL DETAILS PROVIDED BY SENDER:
${answers.recentMoment ? `- Recent moment: "${answers.recentMoment}"` : ''}
${answers.theirThing ? `- Their "thing": "${answers.theirThing}"` : ''}
${answers.insideJoke ? `- Inside joke: "${answers.insideJoke}"` : ''}
${answers.quickTraits?.length ? `- Traits: ${answers.quickTraits.join(', ')}` : ''}

REQUIREMENTS:
1. Write a ${answers.vibe.join(' and ')} card message
2. MUST reference at least ONE specific detail from above
3. Length: 50-100 words (this is a card, not a letter)
4. NO generic phrases like "wishing you all the best" or "hope your day is special"
5. Make it feel like it could ONLY be written for ${answers.name}
6. Match the ${answers.vibe.join('/')} tone throughout
7. End naturally (no forced sign-offs unless it fits)

Write ONLY the card message. No preamble, no explanation, no quotation marks.`;
  }

□ Test with 10+ different wizard inputs
□ Verify messages reference specific details
□ Verify tone matches vibe selection
□ Verify no generic phrases appear
```

### 4.2 FAL AI Image Generation

```
□ Create Backend Function: generateCardArt

□ Implementation:

  async function generateCardArt(wizardAnswers) {
    const response = await fetch('https://fal.run/fal-ai/flux/dev', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${process.env.FAL_API_KEY}`
      },
      body: JSON.stringify({
        prompt: buildArtPrompt(wizardAnswers),
        image_size: 'square_hd', // 1024x1024
        num_images: 1
      })
    });
    
    const data = await response.json();
    return data.images[0].url;
  }

□ Art Prompt Template:

  function buildArtPrompt(answers) {
    const vibeStyles = {
      'Funny': 'playful, whimsical illustration with bright colors and cheerful energy',
      'Heartfelt': 'warm, soft watercolor style with gentle colors and emotional depth',
      'Spicy': 'bold, dynamic illustration with vibrant reds and passionate energy',
      'Weird': 'surreal, quirky illustration with unexpected elements and dreamlike quality',
      'Nostalgic': 'vintage-style illustration with muted sepia tones and retro aesthetic',
      'Grateful': 'warm, golden illustration with soft light and appreciative mood',
      'Encouraging': 'uplifting illustration with bright hopeful colors and forward energy',
      'Apologetic': 'soft, gentle illustration with calming blues and sincere mood',
      'Proud': 'celebratory illustration with rich colors and triumphant feeling',
      'Playful': 'fun, bouncy illustration with cheerful colors and lighthearted energy'
    };
    
    const styles = answers.vibe.map(v => vibeStyles[v]).join(', ');
    
    let subject = 'abstract greeting card design with emotional warmth';
    if (answers.theirThing) {
      subject = `illustration subtly featuring ${answers.theirThing}`;
    }
    
    return `Create a greeting card front illustration.

Style: ${styles}
Subject: ${subject}

Requirements:
- Greeting card aesthetic, professionally designed look
- Suitable for printing on a 6x9 postcard
- NO text, words, or letters in the image
- Clean composition with clear focal point
- Premium, gift-worthy quality
- NOT photorealistic — illustrated/artistic style

Create a beautiful, print-ready greeting card illustration.`;
  }

□ Test with various vibe combinations
□ Verify no text appears in images
□ Verify style matches selected vibes
□ Verify images are print-quality resolution
```

### 4.3 Loading & Preview

```
□ Loading State
  └─ Full-screen overlay with animation
  └─ Message: "Creating something special for {name}..."
  └─ Show wizard answers floating/animating in
  └─ Duration: Wait for both API calls to complete
  └─ Handle errors gracefully

□ Preview Page (/preview)
  └─ Two-panel layout: Card preview + Actions
  └─ Card Preview:
     - Front: Generated art image
     - Back/Inside: Generated message text
     - Card proportions (5:7 aspect ratio)
     - Shadow/depth to look like real card
  └─ Actions:
     - "Send This Card" → Navigate to /checkout
     - "Regenerate" → Call generation again
     - "Edit Message" → Open text editor
  └─ Store generated content in state/database
```

### 4.4 Regeneration Logic

```
□ Regenerate Button
  └─ On click: Call both generation APIs again
  └─ Show loading state
  └─ Replace preview with new content
  └─ Track regeneration count (for analytics)

□ Edit Message
  └─ On click: Show textarea with current message
  └─ Allow user to modify
  └─ Save button updates the message
  └─ Cancel button reverts to generated
```

---

## Phase 5: Checkout & Payment (Sunday Morning — 4 hours)

### 5.1 Address Form

```
□ Checkout Page (/checkout)
  └─ Header: "Where should we send {name}'s card?"
  └─ Form Fields:
     - Recipient Name (pre-filled from wizard)
     - Address Line 1 (required)
     - Address Line 2 (optional)
     - City (required)
     - State (dropdown, required)
     - ZIP Code (required, validate format)
     - Country (US only for MVP, hardcoded)
  └─ Address validation (basic format checking)
  └─ Continue button → Trigger Stripe Checkout
```

### 5.2 Stripe Integration

```
□ Create Backend Function: createCheckoutSession

□ Implementation:

  async function createCheckoutSession(cardData, recipientAddress) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: 'AnyDayCard',
            description: `Personalized card for ${cardData.recipientName}`,
            images: [cardData.frontImageUrl],
          },
          unit_amount: 1200, // $12.00 in cents
        },
        quantity: 1,
      }],
      mode: 'payment',
      success_url: `https://anydaycard.com/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `https://anydaycard.com/checkout`,
      metadata: {
        cardId: cardData.id,
        recipientName: recipientAddress.name,
        recipientAddress: JSON.stringify(recipientAddress),
        generatedMessage: cardData.message,
        frontImageUrl: cardData.frontImageUrl,
      },
    });
    
    return session.url;
  }

□ Frontend: Redirect to session.url on form submit
```

### 5.3 Stripe Webhook

```
□ Create Webhook Endpoint: /api/webhooks/stripe

□ Configure in Stripe Dashboard:
  └─ Endpoint URL: https://anydaycard.com/api/webhooks/stripe
  └─ Events to listen for: checkout.session.completed

□ Implementation:

  async function handleStripeWebhook(request) {
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers['stripe-signature'];
    
    const event = stripe.webhooks.constructEvent(
      request.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
    
    if (event.type === 'checkout.session.completed') {
      const session = event.data.object;
      
      // Extract data from metadata
      const cardId = session.metadata.cardId;
      const recipientAddress = JSON.parse(session.metadata.recipientAddress);
      const message = session.metadata.generatedMessage;
      const frontImageUrl = session.metadata.frontImageUrl;
      
      // Create order record
      await createOrder({
        stripeSessionId: session.id,
        cardId,
        amount: session.amount_total,
        recipientAddress,
        status: 'paid'
      });
      
      // Trigger Lob fulfillment
      await createLobPostcard({
        recipientAddress,
        message,
        frontImageUrl
      });
    }
    
    return { received: true };
  }
```

---

## Phase 6: Print Fulfillment (Sunday Afternoon — 3 hours)

### 6.1 Lob Integration

```
□ Create Backend Function: createLobPostcard

□ Implementation:

  async function createLobPostcard(orderData) {
    const Lob = require('lob')(process.env.LOB_API_KEY);
    
    // Your business return address
    const fromAddress = {
      name: 'AnyDayCard',
      address_line1: 'YOUR_ADDRESS_LINE_1',
      address_city: 'YOUR_CITY',
      address_state: 'MN',
      address_zip: 'YOUR_ZIP',
      address_country: 'US'
    };
    
    const postcard = await Lob.postcards.create({
      description: `Card for ${orderData.recipientAddress.name}`,
      to: {
        name: orderData.recipientAddress.name,
        address_line1: orderData.recipientAddress.line1,
        address_line2: orderData.recipientAddress.line2 || '',
        address_city: orderData.recipientAddress.city,
        address_state: orderData.recipientAddress.state,
        address_zip: orderData.recipientAddress.zip,
        address_country: 'US'
      },
      from: fromAddress,
      front: orderData.frontImageUrl,
      back: generateBackHtml(orderData.message),
      size: '6x9',
      mail_type: 'usps_first_class'
    });
    
    // Update order with Lob ID
    await updateOrder(orderData.orderId, {
      lobPostcardId: postcard.id,
      status: 'sent_to_printer',
      expectedDelivery: postcard.expected_delivery_date
    });
    
    return postcard;
  }

□ Back of Card HTML:

  function generateBackHtml(message) {
    return `
    <!DOCTYPE html>
    <html>
    <head>
      <link href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500&display=swap" rel="stylesheet">
      <style>
        body {
          font-family: 'Fraunces', Georgia, serif;
          margin: 0;
          padding: 0.5in;
          width: 6in;
          height: 9in;
          box-sizing: border-box;
          background: #fffef9;
        }
        .message {
          font-size: 14pt;
          line-height: 1.6;
          color: #1e3a5f;
          white-space: pre-wrap;
        }
        .branding {
          position: absolute;
          bottom: 0.5in;
          right: 0.5in;
          font-size: 8pt;
          color: #999;
        }
      </style>
    </head>
    <body>
      <div class="message">${message}</div>
      <div class="branding">anydaycard.com</div>
    </body>
    </html>
    `;
  }
```

### 6.2 Success Page

```
□ Success Page (/success)
  └─ Header: "Your card is on its way! 💌"
  └─ Message: "{Name}'s card will arrive in 5-7 business days"
  └─ Card preview (smaller, confirmation view)
  └─ Order details:
     - Order number
     - Recipient name
     - Expected delivery
  └─ CTA: "Send Another Card" → Navigate to /wizard
  └─ Footer: "Questions? support@anydaycard.com"
```

---

## Phase 7: Polish & Legal (Sunday Evening — 3 hours)

### 7.1 Legal Pages

```
□ Terms of Service (/terms)
  └─ Use template from Business Operations document
  └─ Key sections:
     - Service description
     - AI-generated content disclaimer
     - Payment terms
     - Refund policy
     - Limitation of liability

□ Privacy Policy (/privacy)
  └─ Use template from Business Operations document
  └─ Key sections:
     - Data we collect
     - How we use it
     - Third parties (Stripe, Lob, Anthropic, FAL AI)
     - User rights

□ Add footer links to all pages
  └─ Terms of Service
  └─ Privacy Policy
  └─ Support email
```

### 7.2 Mobile Optimization

```
□ Test all screens on mobile viewport
□ Fix any layout issues:
  └─ Wizard should be single-column
  └─ Buttons should be full-width
  └─ Text should be readable
  └─ Forms should be usable
□ Test touch interactions
□ Test on actual mobile device if possible
```

### 7.3 Error Handling

```
□ API Failures
  └─ If Claude fails: Show error, offer retry
  └─ If FAL AI fails: Show error, offer retry or use placeholder
  └─ If Stripe fails: Show payment error, let user retry
  └─ If Lob fails: Log error, alert founder, manual fulfillment backup

□ Validation Errors
  └─ Empty required fields: Show inline error
  └─ Invalid address format: Show specific error
  └─ Invalid email: Show format error

□ Network Errors
  └─ Timeout: Show retry button
  └─ Offline: Show offline message
```

---

## Phase 8: Launch (Monday — 6 hours)

### 8.1 Production Deployment (Morning)

```
□ Environment Variables
  └─ Verify all API keys are LIVE (not test)
  └─ ANTHROPIC_API_KEY: Production key
  └─ FAL_API_KEY: Production key
  └─ STRIPE_SECRET_KEY: sk_live_xxx (NOT sk_test_xxx)
  └─ STRIPE_PUBLISHABLE_KEY: pk_live_xxx
  └─ LOB_API_KEY: live_xxx (NOT test_xxx)

□ Domain Verification
  └─ https://anydaycard.com loads correctly
  └─ SSL certificate is valid (green lock)
  └─ www.anydaycard.com redirects to anydaycard.com

□ Deploy
  └─ Push final code to production
  └─ Verify deployment successful
  └─ Check all pages load
```

### 8.2 Final Testing (Afternoon)

```
□ Smoke Test (Don't Complete Payment)
  └─ Load landing page
  └─ Start wizard
  └─ Complete all steps
  └─ See generated card
  └─ Click "Send This Card"
  └─ See checkout form
  └─ Verify Stripe Checkout loads (but cancel)

□ Real Order Test
  └─ Complete entire flow
  └─ Use REAL credit card
  └─ Use YOUR address as recipient
  └─ Complete payment
  └─ Verify:
     - [ ] Payment appears in Stripe dashboard
     - [ ] Webhook fired successfully
     - [ ] Postcard created in Lob dashboard
     - [ ] Success page shows correctly
     - [ ] Expected delivery date is reasonable

□ Mobile Test
  └─ Complete flow on actual phone
  └─ Verify everything works
```

### 8.3 Launch (6:00 PM)

```
□ Soft Launch
  └─ Share with 5-10 friends/family
  └─ Ask them to try the flow
  └─ Ask for honest feedback
  └─ Monitor for errors

□ Monitor
  └─ Watch Stripe dashboard for payments
  └─ Watch Lob dashboard for postcards
  └─ Watch for any error logs
  └─ Be ready to hotfix

□ Celebrate 🎉
  └─ You shipped it
  └─ Take a breath
  └─ Tomorrow we optimize
```

---

# SECTION 4: QUICK REFERENCE

## API Endpoints Summary

| Function | Endpoint | Method |
|----------|----------|--------|
| Generate Message | /api/generate-message | POST |
| Generate Art | /api/generate-art | POST |
| Create Checkout | /api/create-checkout | POST |
| Stripe Webhook | /api/webhooks/stripe | POST |
| Lob Webhook | /api/webhooks/lob | POST |

## Database Schema (Minimal)

```
Orders {
  id: uuid
  stripeSessionId: string
  cardId: string
  recipientName: string
  recipientAddress: json
  generatedMessage: text
  frontImageUrl: string
  amount: integer (cents)
  status: enum (paid, sent_to_printer, shipped, delivered)
  lobPostcardId: string
  expectedDelivery: date
  createdAt: timestamp
}

Cards {
  id: uuid
  wizardAnswers: json
  generatedMessage: text
  frontImageUrl: string
  regenerationCount: integer
  createdAt: timestamp
}
```

## Key URLs

| Service | URL |
|---------|-----|
| Base44 Dashboard | https://app.base44.com |
| Anthropic Console | https://console.anthropic.com |
| FAL AI | https://fal.ai/dashboard |
| Stripe Dashboard | https://dashboard.stripe.com |
| Lob Dashboard | https://dashboard.lob.com |
| Your App | https://anydaycard.com |

## Support Contacts

| Issue | Action |
|-------|--------|
| Stripe payment issues | Check Stripe logs, contact support@stripe.com |
| Lob fulfillment issues | Check Lob dashboard, contact support@lob.com |
| Generation failures | Check API logs, verify API keys |
| Everything else | Founder: Liban |

---

# SECTION 5: DECISION AUTHORITY

## Claude Code Can Decide

- Implementation details (how to structure code)
- UI/UX micro-decisions (exact spacing, animations)
- Error message wording
- Component organization
- Database field names
- API response formats

## Escalate to Founder

- Changing the $12 price point
- Adding features not in this document
- Removing features from MVP
- Changing AI providers
- Significant UX flow changes
- Anything that delays launch past Monday 6 PM

---

# SECTION 6: SUCCESS CRITERIA

## Launch is successful if:

1. ✅ A stranger can visit anydaycard.com
2. ✅ Complete the wizard without errors
3. ✅ See a generated card that references their inputs
4. ✅ Pay $12 via Stripe
5. ✅ Have a postcard created in Lob
6. ✅ See a confirmation with expected delivery

## Launch is NOT successful if:

- ❌ Any critical flow is broken
- ❌ Payments don't process
- ❌ Cards don't reach Lob
- ❌ Site crashes under light load
- ❌ Mobile is completely unusable

---

# FINAL INSTRUCTION

**You have 72 hours. Ship it.**

Quality matters for the card content. Speed matters for everything else.

When in doubt:
- Ship the simpler version
- Note the improvement for v2
- Keep moving

The goal is a working product that makes money on Monday.

**Go build.**