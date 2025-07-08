import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';
import 'dotenv/config'; // Explicitly load .env file

const apiKey = process.env.GEMINI_API_KEY ?? process.env.GOOGLE_API_KEY;

if (!apiKey) {
  throw new Error(
    'GEMINI_API_KEY not found. Please add it to your .env file.'
  );
}

export const ai = genkit({
  plugins: [googleAI({apiKey})],
});
