// List available Gemini models
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey });

console.log('📋 Fetching available models...\n');

try {
  const response = await ai.models.list();
  const models = response.models || [];

  console.log(`Found ${models.length} models\n`);
  console.log('Available Models:');
  console.log('=================');

  models.forEach(m => {
    console.log(`✓ ${m.name}`);
    if (m.displayName) console.log(`  Display: ${m.displayName}`);
    if (m.supportedGenerationMethods) console.log(`  Methods: ${m.supportedGenerationMethods.join(', ')}`);
    console.log('');
  });

} catch (error) {
  console.error('Error:', error.message);
  console.error('Full error:', error);
}
