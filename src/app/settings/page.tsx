'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
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
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email(),
});

const passwordSchema = z.object({
  currentPassword: z.string().min(8, 'Password must be at least 8 characters.'),
  newPassword: z.string().min(8, 'Password must be at least 8 characters.'),
});

export default function SettingsPage() {
  const { user, logout } = useAuth();
  const { toast } = useToast();

  const profileForm = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      name: 'Jane Doe',
      email: user?.email || '',
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
    },
  });

  function onProfileSubmit(values: z.infer<typeof profileSchema>) {
    toast({ title: 'Profile Updated', description: 'Your profile has been successfully updated.' });
  }

  function onPasswordSubmit(values: z.infer<typeof passwordSchema>) {
    toast({ title: 'Password Updated', description: 'Your password has been successfully updated.' });
    passwordForm.reset();
  }

  return (
    <AuthGuard>
      <AppShell>
        <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
          <div className="flex items-center justify-between space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          </div>

          <div className="grid gap-8 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Profile</CardTitle>
                <CardDescription>Manage your personal information.</CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...profileForm}>
                  <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src="https://placehold.co/100x100.png" alt="@user" data-ai-hint="profile avatar" />
                        <AvatarFallback>JD</AvatarFallback>
                      </Avatar>
                      <Button variant="outline">Change Photo</Button>
                    </div>
                    <FormField
                      control={profileForm.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Name</FormLabel>
                          <FormControl>
                            <Input placeholder="Your name" {...field} />
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
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="Your email" {...field} disabled />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit">Save Changes</Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <div className="space-y-8">
              <Card>
                <CardHeader>
                  <CardTitle>Change Password</CardTitle>
                  <CardDescription>Update your account password.</CardDescription>
                </CardHeader>
                <CardContent>
                  <Form {...passwordForm}>
                    <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                      <FormField
                        control={passwordForm.control}
                        name="currentPassword"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Password</FormLabel>
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
                            <FormLabel>New Password</FormLabel>
                            <FormControl>
                              <Input type="password" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button type="submit">Update Password</Button>
                    </form>
                  </Form>
                </CardContent>
              </Card>

              <Card>
                 <CardHeader>
                  <CardTitle>Support & Logout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                   <Button variant="outline" className="w-full" asChild>
                     <Link href="https://wa.me/11975933070" target="_blank">
                       Contact Support on WhatsApp
                     </Link>
                   </Button>
                   <Button variant="destructive" className="w-full" onClick={logout}>
                    Logout
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
