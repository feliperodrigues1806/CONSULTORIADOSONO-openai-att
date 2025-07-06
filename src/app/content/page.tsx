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
            Explore este recurso para aprimorar sua jornada de sono.
          </p>

          <div className="mx-auto max-w-md pt-6">
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
