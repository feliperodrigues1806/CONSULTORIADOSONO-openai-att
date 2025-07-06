'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useEffect, useRef, type ChangeEvent } from 'react';
import { Loader2 } from 'lucide-react';
import Link from 'next/link';

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
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import AuthGuard from '@/components/auth-guard';
import AppShell from '@/components/app-shell';
import { useAuth } from '@/hooks/use-auth';
import { useToast } from '@/hooks/use-toast';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const profileSchema = z.object({
  name: z.string().min(2, 'O nome deve ter pelo menos 2 caracteres.'),
  email: z.string().email(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
  newPassword: z.string().min(8, 'A senha deve ter pelo menos 8 caracteres.'),
});

export default function SettingsPage() {
  const { user, logout, updateProfilePicture } = useAuth();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Joana Silva',
      email: '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  useEffect(() => {
    if (user) {
      profileForm.reset({
        name: 'Joana Silva',
        email: user.email,
      });
    }
  }, [user, profileForm]);

  function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    toast({ title: 'Perfil Atualizado', description: 'Seu perfil foi atualizado com sucesso.' });
  }

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    toast({ title: 'Senha Atualizada', description: 'Sua senha foi atualizada com sucesso.' });
    passwordForm.reset();
  }

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && updateProfilePicture) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const dataUrl = reader.result as string;
        updateProfilePicture(dataUrl);
        toast({ title: 'Foto de Perfil Atualizada', description: 'Sua nova foto foi salva.' });
      };
      reader.readAsDataURL(file);
    }
  };


  return (
    <AuthGuard>
      <AppShell>
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Perfil</CardTitle>
                <CardDescription>Gerencie suas informações pessoais.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={user?.photoURL || 'https://placehold.co/100x100.png'} alt="@user" data-ai-hint="profile avatar" />
                        <AvatarFallback>JS</AvatarFallback>
                      </Avatar>
                       <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        className="hidden"
                        accept="image/*"
                      />
                      <Button type="button" variant="outline" onClick={() => fileInputRef.current?.click()}>Alterar Foto</Button>
                    </div>
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Nome</FormLabel>
                          <FormControl>
                            <Input placeholder="Seu nome" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={profileForm.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-mail</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Seu e-mail" {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Salvar Alterações</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Alterar Senha</CardTitle>
                  <CardDescription>Atualize a senha da sua conta.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Senha Atual</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={passwordForm.control}
                        name="newPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nova Senha</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Atualizar Senha</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                  <CardTitle>Suporte & Sair</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <Button variant="outline" className="w-full" asChild>
                     <Link href="https://wa.me/11975933070" target="_blank">
                       Contatar Suporte no WhatsApp
                     </Link>
                   </Button>
                   <Button variant="destructive" className="w-full" onClick={logout}>
                    Sair
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </AppShell>
    </AuthGuard>
  );
}
