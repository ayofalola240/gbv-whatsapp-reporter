import mongoose from 'mongoose';
import IncidentReport from '../models/incidentReport.model';

/**
 * Saves a completed incident report to the database.
 * @param reportData The report data collected from the user session.
 * @returns The saved report document.
 */
export const saveIncidentReport = async (reportData: any) => {
  try {
    // Create a new report instance using the Mongoose model
    const newReport = new IncidentReport(reportData);
    // Save the instance to the database
    await newReport.save();
    console.log(`Successfully saved report with Ref ID: ${reportData.referenceId}`);
    return newReport;
  } catch (error) {
    console.error('Error saving report to database:', error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

/**
 * Retrieves an incident report by its reference ID.
 * @param referenceId The unique reference ID of the report.
 * @returns The found report document or null if not found.
 */
export const getIncidentReportByReferenceId = async (referenceId: string) => {
  try {
    // Find the report by its reference ID
    const report = await IncidentReport.findOne({ referenceId }).exec();
    if (!report) {
      console.warn(`No report found with reference ID: ${referenceId}`);
      return null;
    }
    console.log(`Found report with Ref ID: ${referenceId}`);
    return report;
  } catch (error) {
    console.error('Error retrieving report from database:', error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
};
/**
 * Updates an existing incident report with new data.
 * @param referenceId The unique reference ID of the report to update.
 * @param updateData The data to update in the report.
 * @returns The updated report document or null if not found.
 */
export const updateIncidentReport = async (referenceId: string, updateData: any) => {
  try {
    // Find the report by its reference ID and update it
    const updatedReport = await IncidentReport.findOneAndUpdate(
      { referenceId },
      updateData,
      { new: true, runValidators: true } // Return the updated document and validate
    ).exec();
    if (!updatedReport) {
      console.warn(`No report found to update with reference ID: ${referenceId}`);
      return null;
    }
    console.log(`Successfully updated report with Ref ID: ${referenceId}`);
    return updatedReport;
  } catch (error) {
    console.error('Error updating report in database:', error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
};
/**
 * Deletes an incident report by its reference ID.
 * @param referenceId The unique reference ID of the report to delete.
 * @returns True if the report was deleted, false if not found.
 */
export const deleteIncidentReport = async (referenceId: string) => {
  try {
    // Find the report by its reference ID and delete it
    const result = await IncidentReport.deleteOne({ referenceId }).exec();
    if (result.deletedCount === 0) {
      console.warn(`No report found to delete with reference ID: ${referenceId}`);
      return false;
    }
    console.log(`Successfully deleted report with Ref ID: ${referenceId}`);
    return true;
  } catch (error) {
    console.error('Error deleting report from database:', error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
};
/**
 * Lists all incident reports in the database.
 * @returns An array of all report documents.
 */
export const listAllIncidentReports = async () => {
  try {
    // Retrieve all reports from the database
    const reports = await IncidentReport.find().exec();
    console.log(`Found ${reports.length} reports in the database`);
    return reports;
  } catch (error) {
    console.error('Error retrieving reports from database:', error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
};
/**
 * Counts the total number of incident reports in the database.
 * @returns The total count of reports.
 */
export const countIncidentReports = async () => {
  try {
    // Count the total number of reports in the database
    const count = await IncidentReport.countDocuments().exec();
    console.log(`Total incident reports in database: ${count}`);
    return count;
  } catch (error) {
    console.error('Error counting reports in database:', error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
};
/**
 * Finds incident reports based on various criteria.
 * @param criteria The search criteria object.
 * @returns An array of report documents that match the criteria.
 */
export const findIncidentReports = async (criteria: any) => {
  try {
    // Find reports based on the provided criteria
    const reports = await IncidentReport.find(criteria).exec();
    console.log(`Found ${reports.length} reports matching criteria: ${JSON.stringify(criteria)}`);
    return reports;
  } catch (error) {
    console.error('Error finding reports in database:', error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
};

/**
 * Archives an incident report by moving it to an archive collection.
 * @param referenceId The unique reference ID of the report to archive.
 * @returns True if the report was archived, false if not found.
 */
export const archiveIncidentReport = async (referenceId: string) => {
  try {
    // Find the report by its reference ID
    const report = await IncidentReport.findOne({ referenceId }).exec();
    if (!report) {
      console.warn(`No report found to archive with reference ID: ${referenceId}`);
      return false;
    }
    // Create a new archive document (assuming you have an ArchiveReport model)
    const ArchiveReport = IncidentReport.discriminator(
      'ArchiveReport',
      new mongoose.Schema({ archivedAt: { type: Date, default: Date.now } })
    );
    const archivedReport = new ArchiveReport({
      ...(report.toObject() as Record<string, any>),
      archivedAt: new Date() // Add an archive timestamp
    });
    // Save the archived report
    await archivedReport.save();
    // Delete the original report
    await IncidentReport.deleteOne({ referenceId }).exec();
    console.log(`Successfully archived report with Ref ID: ${referenceId}`);
    return true;
  } catch (error) {
    console.error('Error archiving report in database:', error);
    // Re-throw the error to be handled by the controller
    throw error;
  }
};
