import { Request, Response } from 'express';
import IncidentReport, { IncidentStatus, ViolenceType } from '../models/incidentReport.model';

// Interfaces for structured data
interface NameValue {
  name: string;
  value: number;
}

interface RecentIncidentOutput {
  id: string;
  referenceId: string;
  dateReported: string;
  violenceType?: ViolenceType | string;
  status?: IncidentStatus;
  locationLGA?: string;
}

interface DashboardStatsResponse {
  totalIncidents: number;
  newThisWeek: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  incidentsByViolenceType: NameValue[];
  incidentStatusOverview: NameValue[];
  recentIncidents: RecentIncidentOutput[];
}

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // Fetching various statistics from the IncidentReport model
    const totalIncidents: number = await IncidentReport.countDocuments();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const newThisWeek: number = await IncidentReport.countDocuments({
      createdAt: { $gte: sevenDaysAgo }
    });

    const resolvedIncidents: number = await IncidentReport.countDocuments({
      status: 'Resolved' as IncidentStatus
    });

    const pendingIncidents: number = await IncidentReport.countDocuments({
      status: { $in: ['New', 'Investigating', 'Escalated'] as IncidentStatus[] }
    });

    const incidentsByViolenceTypeRaw = await IncidentReport.aggregate<{ _id: ViolenceType | string; value: number }>([
      { $match: { violenceType: { $nin: [null, ''] } } },
      { $group: { _id: '$violenceType', value: { $sum: 1 } } },
      { $sort: { value: -1 } }
    ]);

    const definedViolenceTypes: (ViolenceType | string)[] = ['Physical', 'Sexual', 'Emotional', 'Trafficking', 'Rape', 'option_other'];
    const incidentsByViolenceType: NameValue[] = definedViolenceTypes.map((typeName) => {
      const found = incidentsByViolenceTypeRaw.find((item) => item._id === typeName);
      return { name: typeName, value: found ? found.value : 0 };
    });

    const incidentStatusOverviewRaw = await IncidentReport.aggregate<{ _id: IncidentStatus; value: number }>([
      { $match: { status: { $ne: null, $nin: [''] } } },
      { $group: { _id: '$status', value: { $sum: 1 } } }
    ]);
    const definedStatuses: IncidentStatus[] = ['New', 'Investigating', 'Escalated', 'Resolved', 'Closed'];
    const incidentStatusOverview: NameValue[] = definedStatuses.map((statusName) => {
      const found = incidentStatusOverviewRaw.find((item) => item._id === statusName);
      return { name: statusName, value: found ? found.value : 0 };
    });

    const recentIncidentsRaw = await IncidentReport.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('referenceId createdAt violenceType status locationText _id')
      .lean();

    const recentIncidents: RecentIncidentOutput[] = recentIncidentsRaw.map((incident: any) => ({
      id: incident._id.toString(),
      referenceId: incident.referenceId,
      dateReported: incident.createdAt?.toISOString?.() || '',
      violenceType: incident.violenceType,
      status: incident.status,
      locationLGA: incident.locationText || 'N/A'
    }));

    const responsePayload: DashboardStatsResponse = {
      totalIncidents,
      newThisWeek,
      resolvedIncidents,
      pendingIncidents,
      incidentsByViolenceType,
      incidentStatusOverview,
      recentIncidents
    };

    res.json(responsePayload);
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics', error: error.message });
  }
};
