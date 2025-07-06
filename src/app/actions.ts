'use server';

import {
  generateSleepReport,
  GenerateSleepReportInput,
  GenerateSleepReportOutput,
} from '@/ai/flows/generate-sleep-report';

export async function generateReportAction(
  input: GenerateSleepReportInput
): Promise<GenerateSleepReportOutput> {
  try {
    const output = await generateSleepReport(input);
    return output;
  } catch (error) {
    console.error('Error in generateReportAction:', error);
    return {
      report: 'Desculpe, ocorreu um erro ao gerar seu relatório. Por favor, tente novamente mais tarde.',
    };
  }
}
