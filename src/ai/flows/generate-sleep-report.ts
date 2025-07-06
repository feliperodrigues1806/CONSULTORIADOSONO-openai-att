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
  name: z.string().describe("O nome do usuário."),
  age: z.number().describe("A idade do usuário."),
  routineDescription: z.string().describe("Uma descrição da rotina diária do usuário."),
  bedtime: z.string().describe("O horário de dormir típico do usuário."),
  sleepDifficulties: z.string().describe("Uma descrição das dificuldades de sono do usuário."),
  previousMethods: z.string().describe("Quaisquer métodos anteriores que o usuário tentou para melhorar o sono."),
  expectations: z.string().describe("As expectativas do usuário para melhorar o sono."),
});
export type GenerateSleepReportInput = z.infer<typeof GenerateSleepReportInputSchema>;

const GenerateSleepReportOutputSchema = z.object({
  report: z.string().describe("Um relatório de sono personalizado com conselhos adaptados."),
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
