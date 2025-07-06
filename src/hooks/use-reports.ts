'use client';

import { useState, useEffect, useCallback } from 'react';

export type Report = {
  id: string;
  date: string;
  summary: string;
  content: string;
};

const getReportsFromStorage = (): Report[] => {
  if (typeof window === 'undefined') return [];
  try {
    const storedReports = localStorage.getItem('sleepwise_reports');
    if (!storedReports) return [];
    const reports = JSON.parse(storedReports) as Report[];
    return reports.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime());
  } catch (error) {
    console.error('Failed to parse reports from localStorage', error);
    localStorage.removeItem('sleepwise_reports');
    return [];
  }
};

export function useReports() {
  const [reports, setReports] = useState<Report[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setReports(getReportsFromStorage());
    setIsLoading(false);
  }, []);

  const addReport = useCallback((reportContent: string) => {
    const currentReports = getReportsFromStorage();
    
    const newReport: Report = {
      id: new Date().toISOString(),
      date: new Date().toLocaleDateString('pt-BR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }),
      summary: reportContent.split(' ').slice(0, 12).join(' ') + '...',
      content: reportContent,
    };

    const updatedReports = [newReport, ...currentReports];
    localStorage.setItem('sleepwise_reports', JSON.stringify(updatedReports));
    setReports(updatedReports.sort((a, b) => new Date(b.id).getTime() - new Date(a.id).getTime()));
  }, []);

  return { reports, isLoading, addReport };
}
