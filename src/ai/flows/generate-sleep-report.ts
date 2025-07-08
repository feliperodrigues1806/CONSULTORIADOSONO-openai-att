'use server';

/**
 * @fileOverview Gera um relatório de sono personalizado usando a API da OpenAI.
 *
 * - generateSleepReport - Uma função que lida com a geração do relatório de sono.
 * - GenerateSleepReportInput - O tipo de entrada para a função generateSleepReport.
 * - GenerateSleepReportOutput - O tipo de retorno para a função generateSleepReport.
 */

import OpenAI from 'openai';
import { z } from 'zod';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY not found. Please add it to your .env file.');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const GenerateSleepReportInputSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  age: z.coerce.number().min(1, 'Por favor, insira sua idade.').max(120),
  routineDescription: z.string().min(1, 'Por favor, descreva sua rotina.'),
  bedtime: z.string().min(1, 'Por favor, insira seu horário de dormir.'),
  sleepDifficulties: z
    .string()
    .min(1, 'Por favor, descreva suas dificuldades para dormir.'),
  previousMethods: z.string().optional(),
  expectations: z.string().min(1, 'Por favor, descreva suas expectativas.'),
});
export type GenerateSleepReportInput = z.infer<
  typeof GenerateSleepReportInputSchema
>;

const GenerateSleepReportOutputSchema = z.object({
  report: z.string(),
});
export type GenerateSleepReportOutput = z.infer<
  typeof GenerateSleepReportOutputSchema
>;

export async function generateSleepReport(
  input: GenerateSleepReportInput
): Promise<GenerateSleepReportOutput> {
  const validatedInput = GenerateSleepReportInputSchema.parse(input);

  const currentDate = new Date().toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const prompt = `
Você é um consultor de sono da plataforma Consultoria do Sono. Seu objetivo é gerar um relatório de sono personalizado, estruturado e motivacional em Markdown.

**Instruções Gerais:**
- Use um tom amigável, profissional e encorajador.
- Siga ESTRITAMENTE o formato Markdown fornecido abaixo. Não adicione ou remova seções.
- Personalize as seções "Resumo Rápido", "Pontos de Atenção" e "Recomendações Personalizadas" com base nos dados do usuário.
- A seção "Checklist para os Próximos Dias" deve ser INCLUÍDA EXATAMENTE como está, sem nenhuma alteração.

**Dados do Usuário:**
- **Nome:** ${validatedInput.name}
- **Idade:** ${validatedInput.age}
- **Rotina Diária:** ${validatedInput.routineDescription}
- **Horário de Dormir Típico:** ${validatedInput.bedtime}
- **Dificuldades para Dormir:** ${validatedInput.sleepDifficulties}
- **O que já tentou:** ${validatedInput.previousMethods || 'Não informado'}
- **Expectativas:** ${validatedInput.expectations}

---

**Formato do Relatório (Use este template):**

#### Relatório de Sono Personalizado – ${validatedInput.name}
**Data:** ${currentDate}
**Para:** ${validatedInput.name}, ${validatedInput.age} anos

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
[Escreva aqui uma frase motivacional curta, citando o nome do usuário. Exemplo: "Lembre-se que a consistência é o segredo para um sono reparador. Estamos juntos nessa jornada, ${
    validatedInput.name
  }!"]
`;

  try {
    console.log('[generateSleepReport] Enviando requisição para a API OpenAI...');

    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            'Você é um consultor de sono especialista em criar relatórios em formato Markdown. Siga estritamente o template fornecido.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 1000,
    });

    const reportText = response.choices[0]?.message?.content;
    console.log('[generateSleepReport] Resposta da API OpenAI recebida.');

    if (!reportText) {
      console.error(
        '[generateSleepReport] A resposta de texto estava vazia. Resposta completa:',
        JSON.stringify(response, null, 2)
      );
      throw new Error('O sistema não retornou conteúdo de texto no relatório.');
    }

    console.log('[generateSleepReport] Relatório gerado com sucesso.');
    return { report: reportText.trim() };
  } catch (error) {
    console.error(
      '[generateSleepReport] Erro detalhado ao chamar a API OpenAI:',
      error
    );
    if (error instanceof OpenAI.APIError) {
      throw new Error(
        `Falha na comunicação com nosso sistema: ${error.name} - ${error.message}`
      );
    }
    if (error instanceof Error) {
      throw new Error(
        `Falha na comunicação com nosso sistema: ${error.message}`
      );
    }
    throw new Error(
      'Ocorreu um erro desconhecido ao se comunicar com nosso sistema.'
    );
  }
}
