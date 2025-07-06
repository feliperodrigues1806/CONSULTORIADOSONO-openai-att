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
  age: z.coerce.number(),
  routineDescription: z.string(),
  bedtime: z.string(),
  sleepDifficulties: z.string(),
  previousMethods: z.string().optional(),
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

const generateSleepReportFlow = ai.defineFlow(
  {
    name: 'generateSleepReportFlow',
    inputSchema: GenerateSleepReportInputSchema,
    outputSchema: GenerateSleepReportOutputSchema,
  },
  async (input) => {
    console.log(`[generateSleepReportFlow] Iniciando para: ${input.name}`);
    
    const prompt = `Você é um consultor de sono de IA. Seu objetivo é gerar um relatório de sono personalizado com conselhos adaptados com base nas informações do usuário.

O relatório deve se dirigir ao usuário pelo nome e fornecer recomendações específicas com base em sua rotina, dificuldades e expectativas.

Nome do Usuário: ${input.name}
Idade do Usuário: ${input.age}
Descrição da Rotina: ${input.routineDescription}
Horário de Dormir: ${input.bedtime}
Dificuldades para Dormir: ${input.sleepDifficulties}
Métodos Anteriores: ${input.previousMethods || 'Não informado'}
Expectativas: ${input.expectations}

Gere um relatório de sono detalhado e prático, citando o nome do usuário e adaptando o conteúdo à sua situação pessoal.`;

    try {
      console.log('[generateSleepReportFlow] Enviando requisição para a API Gemini...');
      const result = await ai.generate({
        model: 'googleai/gemini-1.5-flash-latest',
        prompt: prompt,
        config: {
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
      
      const reportText = result.text;
      console.log('[generateSleepReportFlow] Resposta da API Gemini recebida.');

      if (!reportText) {
        console.error(
          '[generateSleepReportFlow] A resposta de texto da IA estava vazia. Resposta completa:',
          JSON.stringify(result, null, 2)
        );
        throw new Error('A IA não retornou conteúdo de texto no relatório.');
      }

      console.log('[generateSleepReportFlow] Relatório gerado com sucesso.');
      return { report: reportText };

    } catch (error) {
      console.error('[generateSleepReportFlow] Erro detalhado ao chamar a API Gemini:', error);
      if (error instanceof Error) {
        // Propaga o erro com uma mensagem mais clara, que será capturada pela action.
        throw new Error(`Falha na comunicação com a IA: ${error.message}`);
      }
      throw new Error('Ocorreu um erro desconhecido ao se comunicar com a IA.');
    }
  }
);