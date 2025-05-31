// // src/api/services/report.service.ts
// // (This would handle saving, updating, and fetching reports from MongoDB)
// // For brevity, a placeholder. You'd implement full CRUD and business logic here.
// import { IIncidentReport, IncidentReport as IncidentReportModel } from '../models/incidentReport.model';
// import { logger } from '../utils/logger';

// export const saveIncidentReport = async (reportData: Partial<IIncidentReport>): Promise<IIncidentReport> => {
//   try {
//     const newReport = new IncidentReportModel(reportData);
//     await newReport.save();
//     logger.info(`Incident report ${newReport.referenceId} saved for user ${newReport.sourceUserId}`);
//     return newReport;
//   } catch (error) {
//     logger.error('Error saving incident report:', error);
//     throw error;
//   }
// };

// export const findReportByReferenceId = async (referenceId: string): Promise<IIncidentReport | null> => {
//   try {
//     return await IncidentReportModel.findOne({ referenceId });
//   } catch (error) {
//     logger.error(`Error finding report by reference ID ${referenceId}:`, error);
//     throw error;
//   }
// };
// // Add other report service functions (updateStatus, getReportById, etc.)
