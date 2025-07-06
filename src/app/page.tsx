'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Bot, Loader2, User } from 'lucide-react';
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

const formSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  age: z.coerce.number().min(1, 'Please enter your age.').max(120),
  routineDescription: z.string().min(10, 'Please describe your routine.'),
  bedtime: z.string().min(1, 'Please enter your typical bedtime.'),
  sleepDifficulties: z
    .string()
    .min(10, 'Please describe your sleep difficulties.'),
  previousMethods: z.string().optional(),
  expectations: z.string().min(10, 'Please describe your expectations.'),
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
      age: undefined,
      routineDescription: '',
      bedtime: '11:00 PM',
      sleepDifficulties: '',
      previousMethods: '',
      expectations: '',
    },
  });

  async function onSubmit(values: FormValues) {
    setIsLoading(true);
    setReport(null);
    try {
      const result = await generateReportAction(values);
      if (result.report && !result.report.startsWith('Sorry')) {
        setReport(result.report);
        addReport(result.report);
      } else {
        toast({
          variant: 'destructive',
          title: 'Error generating report',
          description: result.report || 'The AI failed to generate a report. Please try again.',
        });
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'An error occurred',
        description:
          'Something went wrong while generating your report. Please try again later.',
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
              AI Sleep Consultation
            </h1>
          </div>
          <p className="text-muted-foreground">
            Fill out the form below to receive a personalized sleep report from
            our AI consultant.
          </p>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Your Sleep Profile</CardTitle>
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
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., Jane Doe" {...field} />
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
                            <FormLabel>Age</FormLabel>
                            <FormControl>
                              <Input type="number" placeholder="e.g., 30" {...field} />
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
                            <FormLabel>Typical Bedtime</FormLabel>
                            <FormControl>
                              <Input placeholder="e.g., 11:00 PM" {...field} />
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
                          <FormLabel>Daily Routine</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Describe a typical day for you..."
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
                          <FormLabel>Sleep Difficulties</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What problems do you have with sleep?"
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
                          <FormLabel>Previous Methods (Optional)</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Have you tried anything to improve your sleep?"
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
                          <FormLabel>Expectations</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="What do you hope to achieve?"
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
                          Generating Report...
                        </>
                      ) : (
                        'Generate My Report'
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle>Your Personalized Report</CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex items-center justify-center">
                {isLoading ? (
                  <div className="text-center text-muted-foreground">
                    <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                    <p className="mt-4">Our AI is analyzing your profile...</p>
                  </div>
                ) : report ? (
                  <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none w-full whitespace-pre-wrap rounded-md bg-muted p-4 font-sans text-sm">
                    <div className="flex items-start gap-4">
                      <Avatar className="h-8 w-8 border">
                         <AvatarFallback className="bg-primary text-primary-foreground"><Bot className="h-5 w-5"/></AvatarFallback>
                      </Avatar>
                      <p className="flex-1 pt-0.5">{report}</p>
                    </div>
                  </div>
                ) : (
                   <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                    <Bot className="mx-auto h-12 w-12" />
                    <p className="mt-4">Your report will appear here.</p>
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
