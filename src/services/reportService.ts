import type { UsageReport } from '../types/report';
import { createApiClient } from './apiClient';

/** Servicio de reportes básicos de uso de canchas. */
export const createReportService = (token: string) => {
  const reportApi = createApiClient('http://localhost:8080/reports/api', token);

  return {
    /** Obtiene los indicadores de uso para un rango de fechas. */
    getUsageReport: async (from: string, to: string): Promise<UsageReport> => {
      const { data } = await reportApi.get<UsageReport>('usage', { params: { from, to } });
      return data;
    },
  };
};

export type ReportService = ReturnType<typeof createReportService>;
