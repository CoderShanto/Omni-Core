import { Request, Response } from 'express';
import { AIService } from '../services/aiService';

export const getProjectRisks = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const reports = await AIService.evaluateProjectRisks(companyId ? companyId.toString() : null);
    return res.json({
      disclaimer: 'AI Generated Estimate — Risk scores calculated based on deadline proximity and overdue task ratios.',
      reports
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error analyzing project risks', error: (error as Error).message });
  }
};

export const getRevenueForecast = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    const forecast = await AIService.forecastRevenue(companyId ? companyId.toString() : null);
    return res.json({
      disclaimer: 'AI Generated Estimate — Projected earnings based on historical cash flow dynamics.',
      forecast
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error generating revenue forecast', error: (error as Error).message });
  }
};

export const askAI = async (req: Request, res: Response) => {
  try {
    const { query } = req.body;
    if (!query) {
      return res.status(400).json({ message: 'Query string is required' });
    }

    const companyId = req.user?.companyId;
    const result = await AIService.processNaturalQuery(query, companyId ? companyId.toString() : null);

    return res.json({
      disclaimer: 'AI Generated Insights',
      query,
      ...result
    });
  } catch (error) {
    return res.status(500).json({ message: 'Error processing AI query', error: (error as Error).message });
  }
};
export const getRevenueLeaks = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) return res.status(400).json({ message: 'Company ID required' });
    const leaks = await AIService.detectRevenueLeaks(companyId.toString());
    return res.json({ leaks });
  } catch (error) {
    return res.status(500).json({ message: 'Error analyzing revenue leaks', error: (error as Error).message });
  }
};

export const getWorkloadBurnout = async (req: Request, res: Response) => {
  try {
    const companyId = req.user?.companyId;
    if (!companyId) return res.status(400).json({ message: 'Company ID required' });
    const burnoutReport = await AIService.detectBurnout(companyId.toString());
    return res.json({ burnoutReport });
  } catch (error) {
    return res.status(500).json({ message: 'Error analyzing workload burnout', error: (error as Error).message });
  }
};
