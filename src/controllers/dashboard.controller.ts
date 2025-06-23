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
  areaCouncil?: string;
}

interface DashboardStatsResponse {
  totalIncidents: number;
  newThisWeek: number;
  resolvedIncidents: number;
  pendingIncidents: number;
  incidentsByViolenceType: NameValue[];
  incidentsByAreaCouncil: NameValue[];
  incidentStatusOverview: NameValue[];
  recentIncidents: RecentIncidentOutput[];
}

export const getDashboardStats = async (req: Request, res: Response): Promise<void> => {
  try {
    // --- No changes to these initial stats ---
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

    // --- Aggregation for Violence Types (Unchanged) ---
    const incidentsByViolenceTypeRaw = await IncidentReport.aggregate<{ _id: ViolenceType | string; value: number }>([
      { $match: { violenceType: { $nin: [null, ''] } } },
      { $group: { _id: '$violenceType', value: { $sum: 1 } } },
      { $sort: { value: -1 } }
    ]);
    const definedViolenceTypes: (ViolenceType | string)[] = ['Physical', 'Sexual', 'Emotional', 'Trafficking', 'Rape', 'other'];
    const incidentsByViolenceType: NameValue[] = definedViolenceTypes.map((typeName) => {
      const found = incidentsByViolenceTypeRaw.find((item) => item._id === typeName);
      return { name: typeName, value: found ? found.value : 0 };
    });

    // --- ADDED: Aggregation for Incidents by Area Council ---
    const incidentsByAreaCouncilRaw = await IncidentReport.aggregate<{ _id: string; value: number }>([
      { $match: { areaCouncil: { $nin: [null, ''] } } }, // Only include documents where areaCouncil is set
      { $group: { _id: '$areaCouncil', value: { $sum: 1 } } },
      { $sort: { value: -1 } }
    ]);
    // Define all possible Area Councils to ensure they are all represented on the dashboard
    const definedAreaCouncils: string[] = ['AMAC', 'Bwari', 'Gwagwalada', 'Kuje', 'Kwali', 'Abaji'];
    const incidentsByAreaCouncil: NameValue[] = definedAreaCouncils.map((councilName) => {
      const found = incidentsByAreaCouncilRaw.find((item) => item._id === councilName);
      return { name: councilName, value: found ? found.value : 0 };
    });

    // --- Aggregation for Status Overview (Unchanged) ---
    const incidentStatusOverviewRaw = await IncidentReport.aggregate<{ _id: IncidentStatus; value: number }>([
      { $match: { status: { $ne: null, $nin: [''] } } },
      { $group: { _id: '$status', value: { $sum: 1 } } }
    ]);
    const definedStatuses: IncidentStatus[] = ['New', 'Investigating', 'Escalated', 'Resolved', 'Closed'];
    const incidentStatusOverview: NameValue[] = definedStatuses.map((statusName) => {
      const found = incidentStatusOverviewRaw.find((item) => item._id === statusName);
      return { name: statusName, value: found ? found.value : 0 };
    });

    // --- MODIFIED: Recent Incidents to include areaCouncil ---
    const recentIncidentsRaw = await IncidentReport.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select('referenceId createdAt violenceType status locationText areaCouncil _id')
      .lean();

    const recentIncidents: RecentIncidentOutput[] = recentIncidentsRaw.map((incident: any) => ({
      id: incident._id.toString(),
      referenceId: incident.referenceId,
      dateReported: incident.createdAt?.toISOString?.() || '',
      violenceType: incident.violenceType,
      status: incident.status,
      locationLGA: incident.locationText || 'N/A',
      areaCouncil: incident.areaCouncil || 'N/A'
    }));

    // --- MODIFIED: Final response payload ---
    const responsePayload: DashboardStatsResponse = {
      totalIncidents,
      newThisWeek,
      resolvedIncidents,
      pendingIncidents,
      incidentsByViolenceType,
      incidentsByAreaCouncil,
      incidentStatusOverview,
      recentIncidents
    };

    res.json(responsePayload);
  } catch (error: any) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard statistics', error: error.message });
  }
};
