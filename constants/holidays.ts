export interface Holiday {
  name: string;
  monthDay: string; // Format: "MM-DD" (e.g., "02-14")
  icon: string; // Emoji
  category: 'love' | 'family' | 'celebration' | 'religious';
}

export const POPULAR_HOLIDAYS: Holiday[] = [
  { name: "New Year's Day", monthDay: "01-01", icon: "🎊", category: 'celebration' },
  { name: "Valentine's Day", monthDay: "02-14", icon: "❤️", category: 'love' },
  { name: "Easter", monthDay: "04-20", icon: "🐰", category: 'religious' },
  { name: "Mother's Day", monthDay: "05-11", icon: "🌸", category: 'family' },
  { name: "Father's Day", monthDay: "06-15", icon: "👔", category: 'family' },
  { name: "Halloween", monthDay: "10-31", icon: "🎃", category: 'celebration' },
  { name: "Thanksgiving", monthDay: "11-27", icon: "🦃", category: 'family' },
  { name: "Christmas", monthDay: "12-25", icon: "🎄", category: 'religious' },
];
