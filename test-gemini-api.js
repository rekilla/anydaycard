// Quick test script to verify Gemini API and model names
import { GoogleGenAI } from "@google/genai";
import * as dotenv from 'dotenv';

// Load .env.local
dotenv.config({ path: '.env.local' });

const apiKey = process.env.VITE_GEMINI_API_KEY;
console.log('API Key found:', apiKey ? 'Yes ✓' : 'No ✗');

if (!apiKey) {
  console.error('VITE_GEMINI_API_KEY not found in .env.local');
  process.exit(1);
}

const ai = new GoogleGenAI({ apiKey });

// Test 1: Try text generation
console.log('\n📝 Testing text model: gemini-2.0-flash-exp');
try {
  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash-exp',
    contents: 'Say "Hello from Gemini!" in one sentence.',
  });
  console.log('✓ Text model works!');
  console.log('Response:', response.text);
} catch (error) {
  console.error('✗ Text model failed:', error.message);
  console.error('Full error:', error);
}

// Test 2: Try image generation
console.log('\n🖼️  Testing image model: imagen-3.0-generate-001');
try {
  const response = await ai.models.generateContent({
    model: 'imagen-3.0-generate-001',
    contents: {
      parts: [{ text: 'A simple red circle on white background' }],
    },
    config: {
      imageConfig: {
        aspectRatio: '1:1',
      },
    },
  });
  console.log('✓ Image model works!');
  console.log('Image generated successfully');
} catch (error) {
  console.error('✗ Image model failed:', error.message);
  console.error('Full error:', error);
}

console.log('\n✅ API test complete');
