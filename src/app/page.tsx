'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Moon, Loader2, User } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { generateReportAction } from './actions';
import AuthGuard from '@/components/auth-guard';
import AppShell from '@/components/app-shell';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useReports } from '@/hooks/use-reports';
import { MarkdownContent } from '@/components/markdown-content';

const formSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  age: z.coerce.number().min(1, 'Por favor, insira sua idade.').max(120),
  routineDescription: z.string().min(10, 'Por favor, descreva sua rotina.'),
  bedtime: z.string().min(1, 'Por favor, insira seu horário de dormir.'),
  sleepDifficulties: z
    .string()
    .min(10, 'Por favor, descreva suas dificuldades para dormir.'),
  previousMethods: z.string().optional(),
  expectations: z.string().min(10, 'Por favor, descreva suas expectativas.'),
});

type FormValues = z.infer<typeof formSchema>;

export default function ConsultationPage() {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { addReport } = useReports();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      age: '' as any,
      routineDescription: '',
      bedtime: '23:00',
      sleepDifficulties: '',
      previousMethods: '',
      expectations: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setReport(null);
    try {
      // A action agora retorna um objeto com 'report' ou 'error'
      const result = await generateReportAction(values);

      if (result.report) {
        // Sucesso: exibe e salva o relatório
        setReport(result.report);
        addReport(result.report);
      } else {
        // Erro: exibe o erro detalhado no toast
        toast({
          variant: 'destructive',
          title: 'Erro ao Gerar Relatório',
          // A mensagem de erro agora vem detalhada do backend
          description: result.error || 'A IA não conseguiu gerar um relatório. Por favor, tente novamente.',
        });
      }
    } catch (error) {
      // Este bloco captura erros de rede ou falhas inesperadas na action
      toast({
        variant: 'destructive',
        title: 'Ocorreu um erro de comunicação',
        description:
          'Algo deu errado ao gerar seu relatório. Verifique sua conexão e tente novamente mais tarde.',
      });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthGuard>
      <AppShell>
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">
              Consulta de Sono com IA
            </h1>
          </div>
          <p className="text-muted-foreground">
            Preencha o formulário abaixo para receber um relatório de sono personalizado do
            nosso consultor de IA.
          </p>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Seu Perfil de Sono</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nome</FormLabel>
                            <FormControl>
                              <Input placeholder="ex: Joana Silva" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="age"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Idade</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="ex: 30" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                     <FormField
                        control={form.control}
                        name="bedtime"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Horário de Dormir Típico</FormLabel>
                            <FormControl>
                              <Input placeholder="ex: 23:00" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    <FormField
                      control={form.control}
                      name="routineDescription"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Rotina Diária</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Descreva um dia típico para você..."
                              className="resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="sleepDifficulties"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Dificuldades para Dormir</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Quais problemas você tem para dormir?"
                              className="resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                     <FormField
                      control={form.control}
                      name="previousMethods"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Métodos Anteriores (Opcional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Você já tentou algo para melhorar seu sono?"
                              className="resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="expectations"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expectativas</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="O que você espera alcançar?"
                              className="resize-y"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Gerando Relatório...
                        </>
                      ) : (
                        'Gerar Meu Relatório'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Seu Relatório Personalizado</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                {isLoading ? (
                  <div className="text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4">Nossa IA está analisando seu perfil...</p>
                  </div>
                ) : report ? (
                  <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none w-full rounded-md bg-muted p-4 font-sans text-sm">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-8 w-8 border">
                         <AvatarFallback className="bg-primary text-primary-foreground"><Moon className="h-5 w-5"/></AvatarFallback>
                      </Avatar>
                       <div className="flex-1 pt-0.5">
                        <MarkdownContent text={report} />
                      </div>
                    </div>
                  </div>
                ) : (
                   <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                    <Moon className="mx-auto h-12 w-12" />
                    <p className="mt-4">Seu relatório aparecerá aqui.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
