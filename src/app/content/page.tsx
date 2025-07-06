'use client';

import Link from 'next/link';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import AuthGuard from '@/components/auth-guard';
import AppShell from '@/components/app-shell';
import Image from 'next/image';

const contentItems = [
  {
    title: 'Acesse o Desafio de 7 Dias',
    description: 'Participe do nosso desafio completo de 7 dias para transformar seus hábitos de sono.',
    href: 'https://membros-durmaigualbebeem7dias.vercel.app/',
    icon: <Image data-ai-hint="challenge goal" src="https://i.imgur.com/SasjOKJ.png" alt="Desafio" width={600} height={400} className="w-full h-40 object-cover" />,
    cta: 'Iniciar Desafio',
  },
  {
    title: 'Eslen Delanogare: O Hábito que vai Mudar o Seu Sono',
    description: 'Aprenda como um simples hábito pode transformar suas noites e sua vida.',
    href: 'https://www.youtube.com/watch?v=Jc2-a_q1kSs',
    icon: <Image data-ai-hint="youtube video" src="https://placehold.co/600x400.png" alt="Vídeo sobre hábito de sono" width={600} height={400} className="w-full h-40 object-cover" />,
    cta: 'Assistir no YouTube',
  },
  {
    title: 'Eslen Delanogare: A Importância do Sono para a Saúde',
    description: 'Descubra a ciência por trás de uma boa noite de sono e seu impacto na saúde.',
    href: 'https://www.youtube.com/watch?v=o8Lz_j_i_pY',
    icon: <Image data-ai-hint="youtube play" src="https://placehold.co/600x400.png" alt="Vídeo sobre importância do sono" width={600} height={400} className="w-full h-40 object-cover" />,
    cta: 'Assistir no YouTube',
  },
  {
    title: 'Eslen Delanogare: Como Dormir Melhor',
    description: 'Dicas práticas para ter um sono de mais qualidade e acordar renovado.',
    href: 'https://www.youtube.com/watch?v=M5araL1vJ8Y',
    icon: <Image data-ai-hint="video learning" src="https://placehold.co/600x400.png" alt="Vídeo com dicas de sono" width={600} height={400} className="w-full h-40 object-cover" />,
    cta: 'Assistir no YouTube',
  },
];

export default function ContentPage() {
  return (
    <AuthGuard>
      <AppShell>
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Mais Conteúdo</h1>
          </div>
          <p className="text-muted-foreground">
            Explore estes recursos adicionais para aprimorar sua jornada de sono.
          </p>

          <div className="grid gap-6 md:grid-cols-2">
            {contentItems.map((item) => (
              <Card key={item.title} className="flex flex-col overflow-hidden">
                <div className="h-40 overflow-hidden">
                    {item.icon}
                </div>
                <CardHeader>
                  <CardTitle>{item.title}</CardTitle>
                  <CardDescription>{item.description}</CardDescription>
                </CardHeader>
                <CardFooter className="mt-auto">
                  <Button asChild className="w-full">
                    <Link href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.cta} <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
