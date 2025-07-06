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
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  age: z.coerce.number().min(1, 'Por favor, insira sua idade.').max(120),
  routineDescription: z.string().min(10, 'Por favor, descreva sua rotina.'),
  bedtime: z.string().min(1, 'Por favor, insira seu horário de dormir.'),
  sleepDifficulties: z.string().min(10, 'Por favor, descreva suas dificuldades para dormir.'),
  previousMethods: z.string().optional(),
  expectations: z.string().min(10, 'Por favor, descreva suas expectativas.'),
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
    
    const currentDate = new Date().toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });

    const prompt = `
Você é um consultor de sono de IA chamado SleepWise. Seu objetivo é gerar um relatório de sono personalizado, estruturado e motivacional em Markdown.

**Instruções Gerais:**
- Use um tom amigável, profissional e encorajador.
- Siga ESTRITAMENTE o formato Markdown fornecido abaixo. Não adicione ou remova seções.
- Personalize as seções "Resumo Rápido", "Pontos de Atenção" e "Recomendações Personalizadas" com base nos dados do usuário.
- A seção "Checklist para os Próximos Dias" deve ser INCLUÍDA EXATAMENTE como está, sem nenhuma alteração.

**Dados do Usuário:**
- **Nome:** ${input.name}
- **Idade:** ${input.age}
- **Rotina Diária:** ${input.routineDescription}
- **Horário de Dormir Típico:** ${input.bedtime}
- **Dificuldades para Dormir:** ${input.sleepDifficulties}
- **O que já tentou:** ${input.previousMethods || 'Não informado'}
- **Expectativas:** ${input.expectations}

---

**Formato do Relatório (Use este template):**

#### Relatório de Sono Personalizado – ${input.name}
**Data:** ${currentDate}
**Para:** ${input.name}, ${input.age} anos

---

#### Resumo Rápido
- [Gere aqui uma frase concisa que resume o principal desafio do sono do usuário com base em suas dificuldades e rotina.]

---

#### Pontos de Atenção
- [Liste de 2 a 4 pontos de atenção principais identificados nos hábitos do usuário. Por exemplo: "Uso de telas antes de dormir" ou "Consumo de cafeína no final do dia".]

---

#### Recomendações Personalizadas
- [Forneça de 2 a 4 recomendações práticas e acionáveis, diretamente ligadas aos "Pontos de Atenção". Seja específico. Exemplo: "Substitua o celular por um livro 30 minutos antes de deitar para ajudar seu cérebro a relaxar."]

---

#### Checklist para os Próximos Dias
- [ ] Desligar telas (celular, computador, TV) **30 minutos antes de dormir**
- [ ] Não consumir café, chá preto, energéticos ou refrigerantes após as 15h
- [ ] Praticar algum exercício físico durante o dia (evite muito tarde)
- [ ] Jantar leve, evitando alimentos pesados ou açucarados
- [ ] Tomar banho morno ou fazer algo relaxante antes de deitar
- [ ] Manter o quarto escuro, silencioso e fresco para dormir

---

#### Dica Final
[Escreva aqui uma frase motivacional curta, citando o nome do usuário. Exemplo: "Lembre-se que a consistência é o segredo para um sono reparador. Estamos juntos nessa jornada, ${input.name}!"]
`;

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
