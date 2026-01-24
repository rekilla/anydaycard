import { Question, RelationshipType } from './types';

export const UNIVERSAL_QUESTIONS: Question[] = [
  {
    id: 'cardType',
    text: 'What kind of card are you making?',
    eyebrow: "Let's start with what brings you here.",
    type: 'grid',
    required: true,
    options: [
      { label: 'A Special Day', value: 'special_day', icon: '📅' },
      { label: 'A Life Event', value: 'life_event', icon: '🎉' },
      { label: 'Just Because', value: 'just_because', icon: '💝' },
      { label: 'Something Else', value: 'other', icon: '✨' },
    ],
  },
  {
    id: 'specialDay',
    text: 'Which special day?',
    eyebrow: 'Pick the day.',
    type: 'grid',
    required: true,
    options: [
      { label: "Valentine's Day", value: "Valentine's Day", icon: '💕' },
      { label: "Mother's Day", value: "Mother's Day", icon: '👩' },
      { label: "Father's Day", value: "Father's Day", icon: '👨' },
      { label: 'Christmas', value: 'Christmas', icon: '🎄' },
      { label: 'Hanukkah', value: 'Hanukkah', icon: '🕎' },
      { label: 'New Year', value: 'New Year', icon: '🎆' },
      { label: 'Thanksgiving', value: 'Thanksgiving', icon: '🦃' },
      { label: 'Easter', value: 'Easter', icon: '🐣' },
      { label: 'Other Holiday', value: 'Other Holiday', icon: '🎁' },
    ],
    condition: (answers) => answers.cardType === 'special_day',
  },
  {
    id: 'lifeEvent',
    text: 'What kind of event?',
    eyebrow: 'Tell me more.',
    type: 'grid',
    required: true,
    options: [
      { label: 'Birthday', value: 'Birthday', icon: '🎂' },
      { label: 'Anniversary', value: 'Anniversary', icon: '💞' },
      { label: 'Graduation', value: 'Graduation', icon: '🎓' },
      { label: 'Wedding', value: 'Wedding', icon: '💒' },
      { label: 'New Baby', value: 'New Baby', icon: '👶' },
      { label: 'New Job', value: 'New Job', icon: '💼' },
      { label: 'New Home', value: 'New Home', icon: '🏠' },
      { label: 'Retirement', value: 'Retirement', icon: '🌴' },
      { label: 'Other Event', value: 'Other Event', icon: '🎉' },
    ],
    condition: (answers) => answers.cardType === 'life_event',
  },
  {
    id: 'name',
    text: 'Who are you thinking about right now?',
    eyebrow: "Let's make something that actually sounds like you.",
    type: 'text',
    placeholder: 'Their name',
    required: true,
  },
  // Valentine's Day - specific relationship options
  {
    id: 'relationshipType',
    text: 'Who is this Valentine for?',
    eyebrow: 'Love comes in many forms.',
    type: 'grid',
    required: true,
    options: [
      { label: 'Wife', value: 'Wife', icon: '💍' },
      { label: 'Husband', value: 'Husband', icon: '💍' },
      { label: 'Girlfriend', value: 'Girlfriend', icon: '💕' },
      { label: 'Boyfriend', value: 'Boyfriend', icon: '💕' },
      { label: 'Partner', value: 'Partner', icon: '💑' },
      { label: 'Crush', value: 'Crush', icon: '🌹' },
      { label: 'Friend', value: 'Friend', icon: '💝' },
      { label: 'Family', value: 'Family', icon: '❤️' },
    ],
    condition: (answers) => answers.specialDay === "Valentine's Day",
  },
  // Mother's Day - specific relationship options
  {
    id: 'relationshipType',
    text: "Who's the special mom?",
    eyebrow: 'Celebrating motherhood.',
    type: 'grid',
    required: true,
    options: [
      { label: 'My Mom', value: 'Mom', icon: '👩' },
      { label: 'My Wife (as a mom)', value: 'Wife-Mom', icon: '💑' },
      { label: 'Grandmother', value: 'Grandmother', icon: '👵' },
      { label: 'Mother-in-law', value: 'Mother-in-law', icon: '👩‍👦' },
      { label: 'Stepmom', value: 'Stepmom', icon: '💕' },
      { label: 'Aunt', value: 'Aunt', icon: '👩‍👧' },
      { label: 'Friend (who is a mom)', value: 'Friend-Mom', icon: '👯' },
    ],
    condition: (answers) => answers.specialDay === "Mother's Day",
  },
  // Father's Day - specific relationship options
  {
    id: 'relationshipType',
    text: "Who's the special dad?",
    eyebrow: 'Celebrating fatherhood.',
    type: 'grid',
    required: true,
    options: [
      { label: 'My Dad', value: 'Dad', icon: '👨' },
      { label: 'My Husband (as a dad)', value: 'Husband-Dad', icon: '💑' },
      { label: 'Grandfather', value: 'Grandfather', icon: '👴' },
      { label: 'Father-in-law', value: 'Father-in-law', icon: '👨‍👦' },
      { label: 'Stepdad', value: 'Stepdad', icon: '💕' },
      { label: 'Uncle', value: 'Uncle', icon: '👨‍👧' },
      { label: 'Friend (who is a dad)', value: 'Friend-Dad', icon: '👯' },
    ],
    condition: (answers) => answers.specialDay === "Father's Day",
  },
  // Birthday - specific relationship options
  {
    id: 'relationshipType',
    text: 'Whose birthday is it?',
    eyebrow: "Let's celebrate them.",
    type: 'grid',
    required: true,
    options: [
      { label: 'Partner/Spouse', value: 'Partner', icon: '💑' },
      { label: 'Mom', value: 'Mom', icon: '👩' },
      { label: 'Dad', value: 'Dad', icon: '👨' },
      { label: 'Child', value: 'Child', icon: '👶' },
      { label: 'Friend', value: 'Friend', icon: '👯' },
      { label: 'Sibling', value: 'Sibling', icon: '👫' },
      { label: 'Grandparent', value: 'Grandparent', icon: '👴' },
      { label: 'Coworker', value: 'Coworker', icon: '💼' },
      { label: 'Someone else', value: 'Other', icon: '✨' },
    ],
    condition: (answers) => answers.lifeEvent === 'Birthday',
  },
  // Anniversary - specific relationship options
  {
    id: 'relationshipType',
    text: 'What kind of anniversary?',
    eyebrow: 'Marking the milestone.',
    type: 'grid',
    required: true,
    options: [
      { label: 'Our Anniversary (spouse)', value: 'Spouse-Anniversary', icon: '💍' },
      { label: 'Our Anniversary (partner)', value: 'Partner-Anniversary', icon: '💕' },
      { label: "Parents' Anniversary", value: 'Parents-Anniversary', icon: '👨‍👩‍👧' },
      { label: "Grandparents' Anniversary", value: 'Grandparents-Anniversary', icon: '👴' },
      { label: "Friends' Anniversary", value: 'Friends-Anniversary', icon: '👯' },
      { label: 'Work Anniversary', value: 'Work-Anniversary', icon: '💼' },
    ],
    condition: (answers) => answers.lifeEvent === 'Anniversary',
  },
  // Generic relationship for other holidays and events
  {
    id: 'relationshipType',
    text: 'Who is [Name] to you?',
    eyebrow: 'Nice. Tell me more.',
    type: 'grid',
    required: true,
    options: [
      { label: 'Partner/Spouse', value: RelationshipType.Partner, icon: '💑' },
      { label: 'A friend', value: RelationshipType.Friend, icon: '👯' },
      { label: 'My parent', value: RelationshipType.Parent, icon: '👨‍👩‍👧' },
      { label: 'My child', value: RelationshipType.Child, icon: '👶' },
      { label: 'Sibling', value: RelationshipType.Sibling, icon: '👫' },
      { label: 'Coworker/Professional', value: RelationshipType.Professional, icon: '💼' },
      { label: "Someone I'm dating", value: RelationshipType.Dating, icon: '🌱' },
      { label: 'Grandparent', value: RelationshipType.Grandparent, icon: '👴' },
      { label: 'Someone else', value: RelationshipType.Other, icon: '✨' },
    ],
    condition: (answers) => {
      // Show generic for: just_because, other, or non-key holidays/events
      const isKeyHoliday = ["Valentine's Day", "Mother's Day", "Father's Day"].includes(answers.specialDay);
      const isKeyEvent = ["Birthday", "Anniversary"].includes(answers.lifeEvent);
      return !isKeyHoliday && !isKeyEvent;
    },
  },
  {
    id: 'occasion',
    text: 'Pick the occasion',
    eyebrow: "What's prompting this card?",
    type: 'grid',
    required: true,
    options: [
      { label: "They're going through something", value: "They're going through something", icon: '🤍' },
      { label: 'They achieved something', value: 'They achieved something', icon: '🏆' },
      { label: 'I miss them', value: 'I miss them', icon: '🥺' },
      { label: 'No reason - just because', value: 'No reason - just because', icon: '✨' },
      { label: 'I messed up', value: 'I messed up', icon: '🙈' },
      { label: 'To say thank you', value: 'To say thank you', icon: '🙏' },
      { label: 'Congratulations', value: 'Congratulations', icon: '🎉' },
      { label: 'Something else', value: 'Something else', icon: '💭' },
    ],
    condition: (answers) => answers.cardType === 'just_because' || answers.cardType === 'other',
  },
  {
    id: 'vibe',
    text: "What's the energy?",
    eyebrow: 'Now for the fun part.',
    type: 'multiselect',
    required: true,
    maxSelections: 2,
    options: [
      { label: 'Funny', value: 'Funny', icon: '😂' },
      { label: 'Heartfelt', value: 'Heartfelt', icon: '❤️' },
      { label: 'Spicy', value: 'Spicy', icon: '🌶️' },
      { label: 'Weird', value: 'Weird', icon: '👽' },
      { label: 'Grateful', value: 'Grateful', icon: '🙏' },
      { label: 'Nostalgic', value: 'Nostalgic', icon: '📼' },
      { label: 'Encouraging', value: 'Encouraging', icon: '🌟' },
      { label: 'Apologetic', value: 'Apologetic', icon: '😔' },
      { label: 'Proud', value: 'Proud', icon: '🏅' },
      { label: 'Playful', value: 'Playful', icon: '😜' },
    ],
  },
  {
    id: 'humorType',
    text: 'What kind of funny?',
    eyebrow: 'Funny - love that.',
    type: 'list',
    required: true,
    options: [
      { label: "Inside jokes only we'd get", value: "Inside jokes only we'd get" },
      { label: 'Playful teasing / light roast', value: 'Playful teasing / light roast' },
      { label: 'Absurdist / weird humor', value: 'Absurdist / weird humor' },
      { label: 'Dry / deadpan', value: 'Dry / deadpan' },
      { label: 'Self-deprecating', value: 'Self-deprecating' },
      { label: 'Wholesome / silly', value: 'Wholesome / silly' },
    ],
    condition: (answers) => Array.isArray(answers.vibe) && answers.vibe.includes('Funny'),
  },
  {
    id: 'heartfeltDepth',
    text: 'How deep are we going?',
    eyebrow: 'Heartfelt it is.',
    type: 'list',
    required: true,
    options: [
      { label: 'Keep it warm but light', value: 'Keep it warm but light' },
      { label: 'I want them to feel seen', value: 'I want them to feel seen' },
      { label: "I might cry writing this and that's okay", value: "I might cry writing this and that's okay" },
    ],
    condition: (answers) =>
      Array.isArray(answers.vibe) &&
      answers.vibe.includes('Heartfelt') &&
      !answers.vibe.includes('Funny'),
  },
  {
    id: 'quickTraits',
    text: "What's [Name] like?",
    eyebrow: 'Quick hits - tap any that apply.',
    type: 'multiselect',
    required: false,
    options: [
      { label: 'Dog person', value: 'Dog person', icon: '🐶' },
      { label: 'Cat person', value: 'Cat person', icon: '🐱' },
      { label: 'Coffee addict', value: 'Coffee addict', icon: '☕' },
      { label: 'Tea drinker', value: 'Tea drinker', icon: '🍵' },
      { label: 'Gym rat', value: 'Gym rat', icon: '💪' },
      { label: 'Hates mornings', value: 'Hates mornings', icon: '😴' },
      { label: 'Always late', value: 'Always late', icon: '⏰' },
      { label: 'Plant parent', value: 'Plant parent', icon: '🌿' },
      { label: 'Gamer', value: 'Gamer', icon: '🎮' },
      { label: 'Bookworm', value: 'Bookworm', icon: '📚' },
      { label: 'Foodie', value: 'Foodie', icon: '🍜' },
      { label: 'Homebody', value: 'Homebody', icon: '🏠' },
      { label: 'Overthinker', value: 'Overthinker', icon: '🤔' },
      { label: 'Crier at movies', value: 'Crier at movies', icon: '😭' },
      { label: 'Neat freak', value: 'Neat freak', icon: '🧼' },
      { label: 'Creative mess', value: 'Creative mess', icon: '🎨' },
      { label: 'Workaholic', value: 'Workaholic', icon: '💼' },
      { label: 'Adventure seeker', value: 'Adventure seeker', icon: '🧭' },
      { label: 'Introvert', value: 'Introvert', icon: '🌙' },
      { label: 'Life of the party', value: 'Life of the party', icon: '🥳' },
    ],
  },
];

export const PARTNER_QUESTIONS: Question[] = [
  {
    id: 'partnerSubtype',
    text: 'What do you call [Name]?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Partner', value: 'Partner' },
      { label: 'Spouse', value: 'Spouse' },
      { label: 'Husband', value: 'Husband' },
      { label: 'Wife', value: 'Wife' },
      { label: 'Boyfriend', value: 'Boyfriend' },
      { label: 'Girlfriend', value: 'Girlfriend' },
      { label: 'My person', value: 'My person' },
    ],
  },
  {
    id: 'duration',
    text: 'How long have you been together?',
    type: 'list',
    required: true,
    options: [
      { label: 'Under a year (still in the magic phase)', value: 'Under a year (still in the magic phase)' },
      { label: '1-2 years (past the butterflies, into the real stuff)', value: '1-2 years (past the butterflies, into the real stuff)' },
      { label: "3-5 years (you've seen some things together)", value: "3-5 years (you've seen some things together)" },
      { label: '5-10 years (a whole chapter of life)', value: '5-10 years (a whole chapter of life)' },
      { label: "10+ years (you're basically the same person now)", value: "10+ years (you're basically the same person now)" },
    ],
  },
  {
    id: 'recentMoment',
    text: "What's a recent moment with [Name] that stuck with you?",
    type: 'textarea',
    placeholder: 'Last week we were cooking dinner and...',
    required: true,
  },
  {
    id: 'theirThing',
    text: 'Does [Name] have a thing?',
    type: 'textarea',
    placeholder: "They're really into...",
    required: false,
  },
  {
    id: 'insideJoke',
    text: "What's something only you two would understand?",
    type: 'textarea',
    placeholder: 'We always say...',
    required: false,
  },
  {
    id: 'loveLanguage',
    text: 'How does [Name] show love?',
    type: 'pills',
    required: false,
    options: [
      { label: 'Acts of service', value: 'Acts of service' },
      { label: 'Words of affirmation', value: 'Words of affirmation' },
      { label: 'Quality time', value: 'Quality time' },
      { label: 'Gifts', value: 'Gifts' },
      { label: 'Physical touch', value: 'Physical touch' },
    ],
  },
];

export const FRIEND_QUESTIONS: Question[] = [
  {
    id: 'friendTexture',
    text: 'How would you describe this friendship?',
    type: 'list',
    required: true,
    options: [
      { label: 'Easy and effortless', value: 'Easy and effortless' },
      { label: 'Deep and loyal', value: 'Deep and loyal' },
      { label: 'Playful and chaotic', value: 'Playful and chaotic' },
      { label: 'Low-key but steady', value: 'Low-key but steady' },
      { label: 'Long-distance but close', value: 'Long-distance but close' },
    ],
  },
  {
    id: 'howMet',
    text: 'How did you meet [Name]?',
    type: 'textarea',
    placeholder: 'Random roommates freshman year...',
    required: false,
  },
  {
    id: 'sharedMemory',
    text: "What's a memory that always makes you smile?",
    type: 'textarea',
    placeholder: 'That road trip where the car broke down...',
    required: true,
  },
  {
    id: 'theyreTheOneWho',
    text: '[Name] is the one who...',
    type: 'textarea',
    placeholder: 'Always shows up, even when it is inconvenient...',
    required: false,
  },
  {
    id: 'friendInsideJoke',
    text: "What's an inside joke between you?",
    type: 'textarea',
    placeholder: 'We always say...',
    required: false,
  },
  {
    id: 'whatYouAdmire',
    text: 'What do you admire about [Name]?',
    type: 'textarea',
    placeholder: 'They are the kind of person who...',
    required: false,
  },
];

export const PARENT_QUESTIONS: Question[] = [
  {
    id: 'whichParent',
    text: 'Which parent?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Mom', value: 'Mom' },
      { label: 'Dad', value: 'Dad' },
      { label: 'Parent', value: 'Parent' },
      { label: 'Guardian', value: 'Guardian' },
    ],
  },
  {
    id: 'parentRelationshipVibe',
    text: 'How would you describe your relationship?',
    type: 'list',
    required: true,
    options: [
      { label: 'Very close', value: 'Very close' },
      { label: 'Close but complicated', value: 'Close but complicated' },
      { label: 'Respectful and steady', value: 'Respectful and steady' },
      { label: 'A bit distant', value: 'A bit distant' },
      { label: "We're rebuilding", value: "We're rebuilding" },
    ],
  },
  {
    id: 'taughtYou',
    text: 'What did [Name] teach you that you still carry?',
    type: 'textarea',
    placeholder: 'Something they said that stuck with you...',
    required: true,
  },
  {
    id: 'alwaysSays',
    text: "What's something [Name] always says?",
    type: 'textarea',
    placeholder: 'A phrase or saying...',
    required: false,
  },
  {
    id: 'childhoodMemory',
    text: "What's a childhood memory that stands out?",
    type: 'textarea',
    placeholder: 'A moment you still remember clearly...',
    required: false,
  },
  {
    id: 'remindsYouOf',
    text: 'What always reminds you of [Name]?',
    type: 'textarea',
    placeholder: 'A smell, place, or ritual...',
    required: false,
  },
];

export const CHILD_QUESTIONS: Question[] = [
  {
    id: 'childAge',
    text: 'How old is [Name]?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Under 3', value: 'Under 3' },
      { label: '3-5', value: '3-5' },
      { label: '6-10', value: '6-10' },
      { label: '11-14', value: '11-14' },
      { label: '15-18', value: '15-18' },
      { label: '18+', value: '18+' },
    ],
  },
  {
    id: 'currentPhase',
    text: 'What phase is [Name] in right now?',
    type: 'textarea',
    placeholder: 'What are they into or working on?',
    required: true,
  },
  {
    id: 'proudMoment',
    text: "What's something they did that made you proud?",
    type: 'textarea',
    placeholder: 'A recent win or brave moment...',
    required: true,
  },
  {
    id: 'theirPersonality',
    text: 'How would you describe their personality?',
    type: 'textarea',
    placeholder: 'A few words that feel true...',
    required: false,
  },
  {
    id: 'sharedThing',
    text: "What's something you do together?",
    type: 'textarea',
    placeholder: 'A tradition, activity, or routine...',
    required: false,
  },
  {
    id: 'yourWish',
    text: 'What do you wish for [Name]?',
    type: 'textarea',
    placeholder: 'A hope you have for them...',
    required: false,
  },
];

export const SIBLING_QUESTIONS: Question[] = [
  {
    id: 'siblingType',
    text: 'Which sibling?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Brother', value: 'Brother' },
      { label: 'Sister', value: 'Sister' },
      { label: 'Sibling', value: 'Sibling' },
    ],
  },
  {
    id: 'birthOrder',
    text: 'Where does [Name] fall?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Older', value: 'Older' },
      { label: 'Younger', value: 'Younger' },
      { label: 'Twin', value: 'Twin' },
    ],
  },
  {
    id: 'dynamicNow',
    text: 'How would you describe your relationship now?',
    type: 'list',
    required: true,
    options: [
      { label: 'Very close', value: 'Very close' },
      { label: 'Playful and bickery', value: 'Playful and bickery' },
      { label: 'Supportive but independent', value: 'Supportive but independent' },
      { label: 'Long-distance but close', value: 'Long-distance but close' },
      { label: "It's complicated", value: "It's complicated" },
    ],
  },
  {
    id: 'siblingChildhoodMemory',
    text: "What's a childhood memory that stands out?",
    type: 'textarea',
    placeholder: 'A moment you still laugh about...',
    required: true,
  },
  {
    id: 'siblingRole',
    text: 'Growing up, [Name] was the one who...',
    type: 'textarea',
    placeholder: 'Always had a plan, always made you laugh...',
    required: false,
  },
  {
    id: 'siblingInsideJoke',
    text: "What's something only you two would get?",
    type: 'textarea',
    placeholder: 'A shared joke or phrase...',
    required: false,
  },
];

export const PROFESSIONAL_QUESTIONS: Question[] = [
  {
    id: 'professionalType',
    text: "What's your relationship with [Name]?",
    type: 'list',
    required: true,
    options: [
      { label: 'Coworker', value: 'Coworker' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Direct report', value: 'Direct report' },
      { label: 'Client', value: 'Client' },
      { label: 'Mentor', value: 'Mentor' },
    ],
  },
  {
    id: 'workContext',
    text: 'How long have you worked together?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Less than 6 months', value: 'Less than 6 months' },
      { label: '6-12 months', value: '6-12 months' },
      { label: '1-3 years', value: '1-3 years' },
      { label: '3-5 years', value: '3-5 years' },
      { label: '5+ years', value: '5+ years' },
    ],
  },
  {
    id: 'whatTheyDid',
    text: 'What did [Name] do that you want to acknowledge?',
    type: 'textarea',
    placeholder: 'A moment where they made an impact...',
    required: true,
  },
  {
    id: 'theirStrength',
    text: "What's something [Name] is great at?",
    type: 'textarea',
    placeholder: 'A strength you admire...',
    required: false,
  },
  {
    id: 'toneCheck',
    text: 'How formal should this be?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Formal', value: 'Formal' },
      { label: 'Friendly', value: 'Friendly' },
    ],
  },
];

export const DATING_QUESTIONS: Question[] = [
  {
    id: 'datingHowLong',
    text: 'How long have you been seeing [Name]?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Just started', value: 'Just started' },
      { label: 'A few weeks', value: 'A few weeks' },
      { label: 'A few months', value: 'A few months' },
    ],
  },
  {
    id: 'datingHowMet',
    text: 'How did you meet?',
    type: 'textarea',
    placeholder: 'A short version of the story...',
    required: false,
  },
  {
    id: 'whatYouLike',
    text: 'What do you like about [Name] so far?',
    type: 'textarea',
    placeholder: 'Something you have noticed already...',
    required: true,
  },
  {
    id: 'bestDateSoFar',
    text: "What's the best date or moment you've had?",
    type: 'textarea',
    placeholder: 'A moment that stood out...',
    required: true,
  },
  {
    id: 'theirQuirk',
    text: "What's an endearing quirk you've noticed?",
    type: 'textarea',
    placeholder: 'Something small but memorable...',
    required: false,
  },
  {
    id: 'cardIntensity',
    text: 'How intense should this card be?',
    type: 'list',
    required: true,
    options: [
      { label: 'Keep it light', value: 'Keep it light' },
      { label: 'Warm but not too deep', value: 'Warm but not too deep' },
      { label: 'A little bold', value: 'A little bold' },
    ],
  },
];

export const GRANDPARENT_QUESTIONS: Question[] = [
  {
    id: 'whichGrandparent',
    text: 'Which grandparent?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Grandma', value: 'Grandma' },
      { label: 'Grandpa', value: 'Grandpa' },
      { label: 'Grandparent', value: 'Grandparent' },
    ],
  },
  {
    id: 'grandparentRelationship',
    text: 'How close are you?',
    type: 'list',
    required: true,
    options: [
      { label: 'Very close', value: 'Very close' },
      { label: 'Close but not daily', value: 'Close but not daily' },
      { label: "We don't see each other much", value: "We don't see each other much" },
      { label: "It's complicated", value: "It's complicated" },
    ],
  },
  {
    id: 'grandparentMemory',
    text: "What's a favorite memory?",
    type: 'textarea',
    placeholder: 'A moment you remember clearly...',
    required: true,
  },
  {
    id: 'theyAlways',
    text: '[Name] always...',
    type: 'textarea',
    placeholder: 'A habit or saying...',
    required: false,
  },
  {
    id: 'wantThemToKnow',
    text: 'What do you want [Name] to know?',
    type: 'textarea',
    placeholder: 'Something you want them to hear...',
    required: false,
  },
];

export const OTHER_QUESTIONS: Question[] = [
  {
    id: 'otherDescribe',
    text: 'How would you describe your relationship?',
    type: 'textarea',
    placeholder: 'A quick description...',
    required: true,
  },
  {
    id: 'whyCard',
    text: 'Why do you want to send them a card?',
    type: 'textarea',
    placeholder: 'What prompted this?',
    required: true,
  },
  {
    id: 'whatToSay',
    text: 'What do you want them to feel when they read this?',
    type: 'textarea',
    placeholder: 'Seen, loved, encouraged...',
    required: true,
  },
  {
    id: 'anyDetails',
    text: 'Any specific details to include?',
    type: 'textarea',
    placeholder: 'A memory, habit, or inside joke...',
    required: false,
  },
];

export const GENERIC_QUESTIONS: Question[] = [
  {
    id: 'whyCard',
    text: 'Why do you want to send them a card?',
    type: 'textarea',
    required: true,
  },
  {
    id: 'anyDetails',
    text: 'Any specific details to include?',
    type: 'textarea',
    required: false,
  },
];

// ============================================================
// COMBINATION-SPECIFIC QUESTIONS
// These are shown based on Card Type + Relationship combinations
// ============================================================

// VALENTINE'S DAY COMBINATIONS
export const VALENTINES_WIFE_QUESTIONS: Question[] = [
  {
    id: 'yearsMarried',
    text: 'How long have you been married?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Newlyweds (<1 year)', value: 'newlyweds' },
      { label: '1-5 years', value: '1-5' },
      { label: '5-10 years', value: '5-10' },
      { label: '10-20 years', value: '10-20' },
      { label: '20+ years', value: '20+' },
    ],
  },
  {
    id: 'romanticMemory',
    text: "What's a romantic memory you cherish?",
    type: 'textarea',
    placeholder: 'Our first dance, that trip to Paris, the way she laughs...',
    required: true,
  },
  {
    id: 'whatYouLoveMost',
    text: 'What do you love most about her?',
    type: 'textarea',
    placeholder: 'Her kindness, her strength, the way she...',
    required: true,
  },
  {
    id: 'petName',
    text: 'Do you have a pet name for her?',
    type: 'text',
    placeholder: 'Honey, babe, my love...',
    required: false,
  },
];

export const VALENTINES_HUSBAND_QUESTIONS: Question[] = [
  {
    id: 'yearsMarried',
    text: 'How long have you been married?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Newlyweds (<1 year)', value: 'newlyweds' },
      { label: '1-5 years', value: '1-5' },
      { label: '5-10 years', value: '5-10' },
      { label: '10-20 years', value: '10-20' },
      { label: '20+ years', value: '20+' },
    ],
  },
  {
    id: 'romanticMemory',
    text: "What's a romantic memory you cherish?",
    type: 'textarea',
    placeholder: 'Our first date, that surprise trip, the way he makes you laugh...',
    required: true,
  },
  {
    id: 'whatYouLoveMost',
    text: 'What do you love most about him?',
    type: 'textarea',
    placeholder: 'His humor, his support, the way he...',
    required: true,
  },
  {
    id: 'petName',
    text: 'Do you have a pet name for him?',
    type: 'text',
    placeholder: 'Babe, honey, handsome...',
    required: false,
  },
];

export const VALENTINES_GIRLFRIEND_QUESTIONS: Question[] = [
  {
    id: 'datingDuration',
    text: 'How long have you been together?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Just started', value: 'new' },
      { label: 'A few months', value: 'months' },
      { label: '6 months - 1 year', value: '6m-1y' },
      { label: '1-2 years', value: '1-2y' },
      { label: '2+ years', value: '2y+' },
    ],
  },
  {
    id: 'howYouMet',
    text: 'How did you two meet?',
    type: 'textarea',
    placeholder: 'Through friends, at a coffee shop, online...',
    required: false,
  },
  {
    id: 'favoriteThingAboutHer',
    text: 'What makes her special to you?',
    type: 'textarea',
    placeholder: 'Her smile, her sense of adventure...',
    required: true,
  },
  {
    id: 'bestMomentTogether',
    text: "What's been your best moment together?",
    type: 'textarea',
    placeholder: 'That time we...',
    required: true,
  },
];

export const VALENTINES_BOYFRIEND_QUESTIONS: Question[] = [
  {
    id: 'datingDuration',
    text: 'How long have you been together?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Just started', value: 'new' },
      { label: 'A few months', value: 'months' },
      { label: '6 months - 1 year', value: '6m-1y' },
      { label: '1-2 years', value: '1-2y' },
      { label: '2+ years', value: '2y+' },
    ],
  },
  {
    id: 'howYouMet',
    text: 'How did you two meet?',
    type: 'textarea',
    placeholder: 'Through friends, at a party, online...',
    required: false,
  },
  {
    id: 'favoriteThingAboutHim',
    text: 'What makes him special to you?',
    type: 'textarea',
    placeholder: 'His humor, his kindness...',
    required: true,
  },
  {
    id: 'bestMomentTogether',
    text: "What's been your best moment together?",
    type: 'textarea',
    placeholder: 'That time we...',
    required: true,
  },
];

export const VALENTINES_PARTNER_QUESTIONS: Question[] = [
  {
    id: 'relationshipDuration',
    text: 'How long have you been together?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Under 1 year', value: 'under-1' },
      { label: '1-3 years', value: '1-3' },
      { label: '3-5 years', value: '3-5' },
      { label: '5+ years', value: '5+' },
    ],
  },
  {
    id: 'romanticMemory',
    text: "What's a favorite memory together?",
    type: 'textarea',
    placeholder: 'A trip, a quiet moment, something that made you laugh...',
    required: true,
  },
  {
    id: 'whatYouLoveMost',
    text: 'What do you love most about them?',
    type: 'textarea',
    placeholder: 'Their laugh, their support, the way they...',
    required: true,
  },
];

export const VALENTINES_CRUSH_QUESTIONS: Question[] = [
  {
    id: 'howYouKnowThem',
    text: 'How do you know them?',
    type: 'pills',
    required: true,
    options: [
      { label: 'We work together', value: 'work' },
      { label: 'Through friends', value: 'friends' },
      { label: 'School/class', value: 'school' },
      { label: 'Online', value: 'online' },
      { label: 'Other', value: 'other' },
    ],
  },
  {
    id: 'whatAttractsYou',
    text: 'What draws you to them?',
    type: 'textarea',
    placeholder: 'Their smile, their energy, the way they...',
    required: true,
  },
  {
    id: 'cardIntensity',
    text: 'How bold should this card be?',
    type: 'list',
    required: true,
    options: [
      { label: 'Sweet and subtle', value: 'subtle' },
      { label: 'Warm and friendly', value: 'warm' },
      { label: 'Bold and direct', value: 'bold' },
    ],
  },
];

export const VALENTINES_FRIEND_QUESTIONS: Question[] = [
  {
    id: 'friendshipType',
    text: 'What kind of friendship is this?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Best friend', value: 'best' },
      { label: 'Close friend', value: 'close' },
      { label: 'Long-time friend', value: 'longtime' },
      { label: 'New friend', value: 'new' },
    ],
  },
  {
    id: 'whySendingValentine',
    text: 'Why send a Valentine to this friend?',
    type: 'textarea',
    placeholder: 'They deserve to know they are loved...',
    required: true,
  },
  {
    id: 'friendValentineTone',
    text: 'What tone should it have?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Heartfelt', value: 'heartfelt' },
      { label: 'Playful', value: 'playful' },
      { label: 'Funny', value: 'funny' },
    ],
  },
];

// MOTHER'S DAY COMBINATIONS
export const MOTHERS_DAY_MOM_QUESTIONS: Question[] = [
  {
    id: 'yourLifeStage',
    text: 'Where are you in life right now?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Still at home', value: 'home' },
      { label: 'College/young adult', value: 'young-adult' },
      { label: 'Starting my career', value: 'career' },
      { label: 'Have my own family', value: 'family' },
      { label: 'Middle of life', value: 'middle' },
    ],
  },
  {
    id: 'childhoodMemory',
    text: "What's a childhood memory with her that stands out?",
    type: 'textarea',
    placeholder: 'Baking cookies together, her driving me to practice...',
    required: true,
  },
  {
    id: 'whatSheTaughtYou',
    text: 'What did she teach you that you still carry?',
    type: 'textarea',
    placeholder: 'To be kind, to work hard, to always...',
    required: true,
  },
  {
    id: 'whatYouAdmire',
    text: 'What do you admire most about her?',
    type: 'textarea',
    placeholder: 'Her strength, her patience, her love...',
    required: false,
  },
];

export const MOTHERS_DAY_WIFE_MOM_QUESTIONS: Question[] = [
  {
    id: 'kidsInfo',
    text: 'Tell me about your kids',
    type: 'textarea',
    placeholder: 'Names, ages, or just a quick description...',
    required: true,
  },
  {
    id: 'whatKindOfMom',
    text: 'What kind of mom is she?',
    type: 'textarea',
    placeholder: 'Patient, playful, the one who...',
    required: true,
  },
  {
    id: 'proudParentingMoment',
    text: "What's a parenting moment that made you proud of her?",
    type: 'textarea',
    placeholder: 'The way she handled..., when she...',
    required: true,
  },
  {
    id: 'whatYouLoveAboutHerAsMom',
    text: 'What do you love about her as a mom?',
    type: 'textarea',
    placeholder: 'Her patience, her creativity with the kids...',
    required: false,
  },
];

export const MOTHERS_DAY_GRANDMOTHER_QUESTIONS: Question[] = [
  {
    id: 'howCloseAreYou',
    text: 'How close are you?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Very close', value: 'very-close' },
      { label: 'Close but distant', value: 'distant' },
      { label: 'Getting closer', value: 'growing' },
    ],
  },
  {
    id: 'favoriteMemory',
    text: "What's a favorite memory with her?",
    type: 'textarea',
    placeholder: 'Visits to her house, her cooking, stories she told...',
    required: true,
  },
  {
    id: 'whatSheMeansToYou',
    text: 'What does she mean to you?',
    type: 'textarea',
    placeholder: 'She taught me..., she always...',
    required: true,
  },
];

export const MOTHERS_DAY_MOTHER_IN_LAW_QUESTIONS: Question[] = [
  {
    id: 'relationshipWarmth',
    text: 'How would you describe your relationship?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Very warm', value: 'warm' },
      { label: 'Friendly', value: 'friendly' },
      { label: 'Respectful', value: 'respectful' },
      { label: 'Growing closer', value: 'growing' },
    ],
  },
  {
    id: 'whatYouAppreciate',
    text: 'What do you appreciate about her?',
    type: 'textarea',
    placeholder: 'How she raised your partner, her hospitality...',
    required: true,
  },
  {
    id: 'sharedMoment',
    text: 'Is there a moment you shared that meant something?',
    type: 'textarea',
    placeholder: 'A conversation, something she did for you...',
    required: false,
  },
];

// FATHER'S DAY COMBINATIONS
export const FATHERS_DAY_DAD_QUESTIONS: Question[] = [
  {
    id: 'childhoodMemory',
    text: "What's a childhood memory with him that stands out?",
    type: 'textarea',
    placeholder: 'Teaching you to ride a bike, weekend trips...',
    required: true,
  },
  {
    id: 'whatHeTaughtYou',
    text: 'What did he teach you that you still carry?',
    type: 'textarea',
    placeholder: 'To work hard, to be honest, to always...',
    required: true,
  },
  {
    id: 'hisQuirks',
    text: 'Any dad quirks or sayings?',
    type: 'textarea',
    placeholder: 'His famous jokes, the way he always...',
    required: false,
  },
  {
    id: 'whatYouAdmire',
    text: 'What do you admire most about him?',
    type: 'textarea',
    placeholder: 'His dedication, his humor, his strength...',
    required: false,
  },
];

export const FATHERS_DAY_HUSBAND_DAD_QUESTIONS: Question[] = [
  {
    id: 'kidsInfo',
    text: 'Tell me about your kids',
    type: 'textarea',
    placeholder: 'Names, ages, or just a quick description...',
    required: true,
  },
  {
    id: 'whatKindOfDad',
    text: 'What kind of dad is he?',
    type: 'textarea',
    placeholder: 'Playful, patient, the coach, the storyteller...',
    required: true,
  },
  {
    id: 'proudParentingMoment',
    text: "What's a parenting moment that made you proud of him?",
    type: 'textarea',
    placeholder: 'The way he handled..., when he stayed up all night...',
    required: true,
  },
  {
    id: 'whatYouLoveAboutHimAsDad',
    text: 'What do you love about him as a dad?',
    type: 'textarea',
    placeholder: 'His patience, how the kids light up around him...',
    required: false,
  },
];

export const FATHERS_DAY_GRANDFATHER_QUESTIONS: Question[] = [
  {
    id: 'howCloseAreYou',
    text: 'How close are you?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Very close', value: 'very-close' },
      { label: 'Close but distant', value: 'distant' },
      { label: 'Getting closer', value: 'growing' },
    ],
  },
  {
    id: 'favoriteMemory',
    text: "What's a favorite memory with him?",
    type: 'textarea',
    placeholder: 'Fishing trips, his workshop, stories he told...',
    required: true,
  },
  {
    id: 'whatHeMeansToYou',
    text: 'What does he mean to you?',
    type: 'textarea',
    placeholder: 'He taught me..., he always...',
    required: true,
  },
];

export const FATHERS_DAY_FATHER_IN_LAW_QUESTIONS: Question[] = [
  {
    id: 'relationshipWarmth',
    text: 'How would you describe your relationship?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Very warm', value: 'warm' },
      { label: 'Friendly', value: 'friendly' },
      { label: 'Respectful', value: 'respectful' },
      { label: 'Growing closer', value: 'growing' },
    ],
  },
  {
    id: 'whatYouAppreciate',
    text: 'What do you appreciate about him?',
    type: 'textarea',
    placeholder: 'How he raised your partner, his advice...',
    required: true,
  },
  {
    id: 'sharedMoment',
    text: 'Is there a moment you shared that meant something?',
    type: 'textarea',
    placeholder: 'A conversation, something he did for you...',
    required: false,
  },
];

// BIRTHDAY COMBINATIONS
export const BIRTHDAY_PARTNER_QUESTIONS: Question[] = [
  {
    id: 'milestoneBirthday',
    text: 'Is this a milestone birthday?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Yes, a big one!', value: 'yes' },
      { label: 'No, just another year', value: 'no' },
    ],
  },
  {
    id: 'romanticMemory',
    text: "What's a favorite memory together?",
    type: 'textarea',
    placeholder: 'A trip, a quiet moment, something that made you laugh...',
    required: true,
  },
  {
    id: 'birthdayWish',
    text: 'What do you wish for them this year?',
    type: 'textarea',
    placeholder: 'Happiness, adventure, peace...',
    required: true,
  },
  {
    id: 'whatMakesThemSpecial',
    text: 'What makes them special to you?',
    type: 'textarea',
    placeholder: 'Their laugh, their support, the way they...',
    required: false,
  },
];

export const BIRTHDAY_CHILD_QUESTIONS: Question[] = [
  {
    id: 'childAge',
    text: 'How old are they turning?',
    type: 'pills',
    required: true,
    options: [
      { label: '1-3', value: '1-3' },
      { label: '4-6', value: '4-6' },
      { label: '7-10', value: '7-10' },
      { label: '11-14', value: '11-14' },
      { label: '15-18', value: '15-18' },
      { label: '18+', value: '18+' },
    ],
  },
  {
    id: 'theirCurrentObsession',
    text: "What are they really into right now?",
    type: 'textarea',
    placeholder: 'Dinosaurs, soccer, video games, art...',
    required: true,
  },
  {
    id: 'proudMoment',
    text: "What's something they did that made you proud?",
    type: 'textarea',
    placeholder: 'They helped a friend, learned something new...',
    required: true,
  },
  {
    id: 'yourWishForThem',
    text: 'What do you wish for them this year?',
    type: 'textarea',
    placeholder: 'Happiness, confidence, new adventures...',
    required: false,
  },
];

export const BIRTHDAY_FRIEND_QUESTIONS: Question[] = [
  {
    id: 'friendshipType',
    text: 'What kind of friendship is this?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Best friend', value: 'best' },
      { label: 'Close friend', value: 'close' },
      { label: 'Long-time friend', value: 'longtime' },
      { label: 'New friend', value: 'new' },
    ],
  },
  {
    id: 'insideJoke',
    text: 'Any inside jokes or shared memories?',
    type: 'textarea',
    placeholder: 'That time we..., we always say...',
    required: true,
  },
  {
    id: 'birthdayMemory',
    text: 'Any favorite birthday memories with them?',
    type: 'textarea',
    placeholder: 'That surprise party, the trip we took...',
    required: false,
  },
  {
    id: 'whatMakesThemGreat',
    text: 'What makes them a great friend?',
    type: 'textarea',
    placeholder: 'They always show up, their humor...',
    required: true,
  },
];

export const BIRTHDAY_SIBLING_QUESTIONS: Question[] = [
  {
    id: 'siblingType',
    text: 'Which sibling?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Brother', value: 'Brother' },
      { label: 'Sister', value: 'Sister' },
      { label: 'Sibling', value: 'Sibling' },
    ],
  },
  {
    id: 'birthOrder',
    text: 'Older or younger?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Older', value: 'older' },
      { label: 'Younger', value: 'younger' },
      { label: 'Twin', value: 'twin' },
    ],
  },
  {
    id: 'childhoodMemory',
    text: "What's a childhood memory that stands out?",
    type: 'textarea',
    placeholder: 'That time we..., we always used to...',
    required: true,
  },
  {
    id: 'siblingDynamic',
    text: 'How would you describe your dynamic now?',
    type: 'textarea',
    placeholder: 'Still bicker like kids, best friends, supportive...',
    required: false,
  },
];

export const BIRTHDAY_COWORKER_QUESTIONS: Question[] = [
  {
    id: 'workDuration',
    text: 'How long have you worked together?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Less than a year', value: 'under-1' },
      { label: '1-3 years', value: '1-3' },
      { label: '3+ years', value: '3+' },
    ],
  },
  {
    id: 'whatTheyreGreatAt',
    text: "What are they great at?",
    type: 'textarea',
    placeholder: 'Problem-solving, making meetings fun, their expertise...',
    required: true,
  },
  {
    id: 'workTone',
    text: 'How formal should this be?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Professional', value: 'professional' },
      { label: 'Friendly', value: 'friendly' },
      { label: 'We are work besties', value: 'besties' },
    ],
  },
];

export const BIRTHDAY_MOM_DAD_QUESTIONS: Question[] = [
  {
    id: 'milestoneBirthday',
    text: 'Is this a milestone birthday?',
    type: 'pills',
    required: true,
    options: [
      { label: 'Yes, a big one!', value: 'yes' },
      { label: 'No, just another year', value: 'no' },
    ],
  },
  {
    id: 'childhoodMemory',
    text: "What's a childhood memory with them?",
    type: 'textarea',
    placeholder: 'Birthday traditions, something they always did...',
    required: true,
  },
  {
    id: 'whatTheyMeanToYou',
    text: 'What do they mean to you?',
    type: 'textarea',
    placeholder: 'Always there for me, taught me everything...',
    required: true,
  },
];
