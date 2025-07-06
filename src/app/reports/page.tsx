'use client';

import { useState } from 'react';
import { Download, Eye, Loader2, FileX2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import AuthGuard from '@/components/auth-guard';
import AppShell from '@/components/app-shell';
import { useReports, type Report as ReportType } from '@/hooks/use-reports';

export default function ReportsPage() {
  const { reports, isLoading } = useReports();
  const [selectedReport, setSelectedReport] = useState<ReportType | null>(null);

  return (
    <AuthGuard>
      <AppShell>
        <Dialog onOpenChange={(isOpen) => !isOpen && setSelectedReport(null)}>
          <div className="flex-1 space-y-4 p-4 sm:p-8 pt-6">
            <div className="flex items-center justify-between space-y-2">
              <h1 className="text-3xl font-bold tracking-tight">Meus Relatórios</h1>
            </div>
            <Card>
              <CardHeader>
                <CardTitle>Relatórios de Sono Gerados</CardTitle>
                <CardDescription>
                  Visualize e baixe todos os seus relatórios de sono personalizados.
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex h-40 items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  </div>
                ) : reports.length === 0 ? (
                  <div className="text-center text-muted-foreground p-8 border-2 border-dashed rounded-lg">
                    <FileX2 className="mx-auto h-12 w-12" />
                    <p className="mt-4">Você ainda não tem relatórios.</p>
                    <p className="text-sm">
                      Vá para a página de Consulta para gerar seu primeiro relatório.
                    </p>
                  </div>
                ) : (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Data</TableHead>
                          <TableHead>Resumo</TableHead>
                          <TableHead className="w-[120px] text-right">
                            Ações
                          </TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {reports.map((report) => (
                          <TableRow key={report.id}>
                            <TableCell className="font-medium whitespace-nowrap">
                              {report.date}
                            </TableCell>
                            <TableCell className="max-w-sm truncate text-muted-foreground">
                              {report.summary}
                            </TableCell>
                            <TableCell className="text-right">
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="mr-2"
                                  onClick={() => setSelectedReport(report)}
                                >
                                  <Eye className="h-4 w-4" />
                                  <span className="sr-only">Visualizar</span>
                                </Button>
                              </DialogTrigger>
                              <Button variant="ghost" size="icon" disabled>
                                <Download className="h-4 w-4" />
                                <span className="sr-only">Baixar PDF</span>
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {selectedReport && (
            <DialogContent className="sm:max-w-2xl">
              <DialogHeader>
                <DialogTitle>Relatório de Sono</DialogTitle>
                <DialogDescription>
                  Gerado em {selectedReport.date}
                </DialogDescription>
              </DialogHeader>
              <Separator />
              <ScrollArea className="h-[60vh] pr-4">
                <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none whitespace-pre-wrap font-sans">
                  {selectedReport.content}
                </div>
              </ScrollArea>
            </DialogContent>
          )}
        </Dialog>
      </AppShell>
    </AuthGuard>
  );
}
