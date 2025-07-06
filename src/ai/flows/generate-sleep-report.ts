// src/ai/flows/generate-sleep-report.ts
'use server';

/**
 * @fileOverview Gera um relatório de sono personalizado com conselhos adaptados com base na entrada do usuário.
 *
 * - generateSleepReport - Uma função que lida com a geração do relatório de sono.
 * - GenerateSleepReportInput - O tipo de entrada para a função generateSleepReport.
 * - GenerateSleepReportOutput - O tipo de retorno para a função generateSleepReport.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateSleepReportInputSchema = z.object({
  name: z.string(),
  age: z.number(),
  routineDescription: z.string(),
  bedtime: z.string(),
  sleepDifficulties: z.string(),
  previousMethods: z.string(),
  expectations: z.string(),
});
export type GenerateSleepReportInput = z.infer<typeof GenerateSleepReportInputSchema>;

const GenerateSleepReportOutputSchema = z.object({
  report: z.string(),
});
export type GenerateSleepReportOutput = z.infer<typeof GenerateSleepReportOutputSchema>;

export async function generateSleepReport(input: GenerateSleepReportInput): Promise<GenerateSleepReportOutput> {
  return generateSleepReportFlow(input);
}

const generateSleepReportPrompt = ai.definePrompt({
  name: 'generateSleepReportPrompt',
  input: {schema: GenerateSleepReportInputSchema},
  output: {schema: GenerateSleepReportOutputSchema},
  prompt: `Você é um consultor de sono de IA. Seu objetivo é gerar um relatório de sono personalizado com conselhos adaptados com base nas informações do usuário.

  O relatório deve se dirigir ao usuário pelo nome e fornecer recomendações específicas com base em sua rotina, dificuldades e expectativas.

  Nome do Usuário: {{name}}
  Idade do Usuário: {{age}}
  Descrição da Rotina: {{routineDescription}}
  Horário de Dormir: {{bedtime}}
  Dificuldades para Dormir: {{sleepDifficulties}}
  Métodos Anteriores: {{previousMethods}}
  Expectativas: {{expectations}}

  Gere um relatório de sono detalhado e prático, citando o nome do usuário e adaptando o conteúdo à sua situação pessoal.
`,
  config: {
    model: 'googleai/gemini-1.5-flash-latest',
    safetySettings: [
      {
        category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HATE_SPEECH',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_HARASSMENT',
        threshold: 'BLOCK_NONE',
      },
      {
        category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
        threshold: 'BLOCK_NONE',
      },
    ],
  },
});

const generateSleepReportFlow = ai.defineFlow(
  {
    name: 'generateSleepReportFlow',
    inputSchema: GenerateSleepReportInputSchema,
    outputSchema: GenerateSleepReportOutputSchema,
  },
  async input => {
    const result = await generateSleepReportPrompt(input);
    const output = result.output;
    if (!output) {
      console.error("AI response was empty or did not match the expected schema. Full response:", JSON.stringify(result));
      throw new Error("A resposta da IA falhou ou estava em um formato inesperado.");
    }
    return output;
  }
);
