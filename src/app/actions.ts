'use server';

import {
  generateSleepReport,
  GenerateSleepReportInput,
} from '@/ai/flows/generate-sleep-report';

// O tipo de retorno da action agora é explícito para comportar sucesso e erro.
export async function generateReportAction(
  input: GenerateSleepReportInput
): Promise<{ report: string | null; error: string | null }> {
  try {
    console.log('[generateReportAction] Iniciada.');
    const output = await generateSleepReport(input);
    console.log('[generateReportAction] Concluída com sucesso.');
    return { report: output.report, error: null };
  } catch (error) {
    console.error('[generateReportAction] Erro capturado:', error);
    
    // Constrói uma mensagem de erro detalhada para o cliente.
    let errorMessage = 'Desculpe, ocorreu um erro desconhecido. Por favor, tente novamente mais tarde.';
    if (error instanceof Error) {
        // Usa a mensagem do erro capturado do fluxo da IA.
        errorMessage = error.message;
    }
    
    return {
      report: null,
      error: errorMessage,
    };
  }
}