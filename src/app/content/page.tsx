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
import { ArrowRight, Video, Zap } from 'lucide-react';
import AuthGuard from '@/components/auth-guard';
import AppShell from '@/components/app-shell';
import Image from 'next/image';

const contentItems = [
  {
    title: 'Access the 7-Day Challenge',
    description: 'Join our full 7-day challenge to transform your sleep habits.',
    href: 'https://membros-durmaigualbebeem7dias.vercel.app/',
    icon: <Image data-ai-hint="challenge goal" src="https://placehold.co/600x400.png" alt="Challenge" width={600} height={400} className="w-full h-40 object-cover" />,
    cta: 'Start Challenge',
  },
  {
    title: 'Quick Sleep Tips',
    description: 'Discover quick, actionable tips for a better night\'s rest.',
    href: '#',
    icon: <Image data-ai-hint="tips idea" src="https://placehold.co/600x400.png" alt="Tips" width={600} height={400} className="w-full h-40 object-cover" />,
    cta: 'Read Tips',
  },
  {
    title: 'Related Videos & Articles',
    description: 'Explore our curated list of videos and articles on sleep science.',
    href: '#',
    icon: <Image data-ai-hint="videos learning" src="https://placehold.co/600x400.png" alt="Videos" width={600} height={400} className="w-full h-40 object-cover" />,
    cta: 'Explore More',
  },
];

export default function ContentPage() {
  return (
    <AuthGuard>
      <AppShell>
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">More Content</h1>
          </div>
          <p className="text-muted-foreground">
            Explore these additional resources to enhance your sleep journey.
          </p>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
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
