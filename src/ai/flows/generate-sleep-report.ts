// src/ai/flows/generate-sleep-report.ts
'use server';

/**
 * @fileOverview Generates a personalized sleep report with tailored advice based on user input.
 *
 * - generateSleepReport - A function that handles the generation of the sleep report.
 * - GenerateSleepReportInput - The input type for the generateSleepReport function.
 * - GenerateSleepReportOutput - The return type for the generateSleepReport function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSleepReportInputSchema = z.object({
  name: z.string().describe('The user\'s name.'),
  age: z.number().describe('The user\'s age.'),
  routineDescription: z.string().describe('A description of the user\'s daily routine.'),
  bedtime: z.string().describe('The user\'s typical bedtime.'),
  sleepDifficulties: z.string().describe('A description of the user\'s sleep difficulties.'),
  previousMethods: z.string().describe('Any previous methods the user has tried to improve sleep.'),
  expectations: z.string().describe('The user\'s expectations for improving sleep.'),
});
export type GenerateSleepReportInput = z.infer<typeof GenerateSleepReportInputSchema>;

const GenerateSleepReportOutputSchema = z.object({
  report: z.string().describe('A personalized sleep report with tailored advice.'),
});
export type GenerateSleepReportOutput = z.infer<typeof GenerateSleepReportOutputSchema>;

export async function generateSleepReport(input: GenerateSleepReportInput): Promise<GenerateSleepReportOutput> {
  return generateSleepReportFlow(input);
}

const generateSleepReportPrompt = ai.definePrompt({
  name: 'generateSleepReportPrompt',
  input: {schema: GenerateSleepReportInputSchema},
  output: {schema: GenerateSleepReportOutputSchema},
  prompt: `You are an AI sleep consultant. Your goal is to generate a personalized sleep report with tailored advice based on the user's input.

  The report should address the user by name and provide specific recommendations based on their routine, difficulties, and expectations.

  User Name: {{name}}
  User Age: {{age}}
  Routine Description: {{routineDescription}}
  Bedtime: {{bedtime}}
  Sleep Difficulties: {{sleepDifficulties}}
  Previous Methods: {{previousMethods}}
  Expectations: {{expectations}}

  Generate a detailed and actionable sleep report, citing the user's name and adapting the content to their personal situation.
`,
});

const generateSleepReportFlow = ai.defineFlow(
  {
    name: 'generateSleepReportFlow',
    inputSchema: GenerateSleepReportInputSchema,
    outputSchema: GenerateSleepReportOutputSchema,
  },
  async input => {
    const {output} = await generateSleepReportPrompt(input);
    return output!;
  }
);
