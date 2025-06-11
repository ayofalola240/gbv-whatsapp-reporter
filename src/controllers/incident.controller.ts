import { Request, Response } from 'express';
import asyncHandler from 'express-async-handler';
import IncidentReport from '../models/incidentReport.model';
// Define types for request bodies if needed, e.g., IUpdateStatusBody, IEscalateBody

// GET /api/incidents - Get all incidents (with filtering, search, and pagination)
export const getAllIncidents = asyncHandler(async (req: Request, res: Response) => {
  const { status, violenceType, search } = req.query;

  // Build the query object
  const query: any = {};

  if (status) {
    query.status = status;
  }
  if (violenceType) {
    query.violenceType = violenceType;
  }
  if (search) {
    // Basic search across multiple fields using a case-insensitive regex
    const searchRegex = new RegExp(search as string, 'i');
    query.$or = [{ referenceId: searchRegex }, { description: searchRegex }, { locationText: searchRegex }];
  }

  // You can add pagination here later if needed
  // For now, we fetch all matching documents
  const incidents = await IncidentReport.find(query).sort({ createdAt: -1 });

  const total = await IncidentReport.countDocuments(query);

  res.json({ incidents, total }); // Send back incidents and total count
});

// GET /api/incidents/:id - Get a single incident by ID
export const getIncidentById = asyncHandler(async (req: Request, res: Response) => {
  const incident = await IncidentReport.findById(req.params.id);
  if (incident) {
    res.json(incident);
  } else {
    res.status(404);
    throw new Error('Incident not found');
  }
});

// PUT /api/incidents/:id/status - Update incident status (e.g., Mark as Resolved)
export const updateIncidentStatus = asyncHandler(async (req: Request, res: Response) => {
  const { status, notes } = req.body; // New status, optional notes
  const incident = await IncidentReport.findById(req.params.id);

  if (incident) {
    incident.status = status;
    if (status === 'Resolved' && !incident.resolutionDetails?.resolvedAt) {
      incident.resolutionDetails = { resolvedAt: new Date(), notes: notes || incident.resolutionDetails?.notes };
    }
    // Add to internalNotes if notes are provided
    if (notes) {
      incident.internalNotes = incident.internalNotes || [];
      incident.internalNotes.push({ note: `Status changed to ${status}: ${notes}`, byUser: req.user?._id, createdAt: new Date() });
    }

    const updatedIncident = await incident.save();
    res.json(updatedIncident);
  } else {
    res.status(404);
    throw new Error('Incident not found');
  }
});

// POST /api/incidents/:id/escalate - Escalate incident
export const escalateIncident = asyncHandler(async (req: Request, res: Response) => {
  const { agency, notes } = req.body; // Agency name, escalation notes
  const incident = await IncidentReport.findById(req.params.id);

  if (incident) {
    incident.status = 'Escalated'; // Or 'Referred to Agency'
    incident.escalationDetails = { agency, escalatedAt: new Date(), notes };
    if (notes) {
      // Also add to internal notes
      incident.internalNotes = incident.internalNotes || [];
      incident.internalNotes.push({ note: `Escalated to ${agency}: ${notes}`, byUser: req.user?._id, createdAt: new Date() });
    }
    const updatedIncident = await incident.save();
    res.json(updatedIncident);
  } else {
    res.status(404);
    throw new Error('Incident not found');
  }
});

// POST /api/incidents/:id/notes - Add an internal note
export const addIncidentNote = asyncHandler(async (req: Request, res: Response) => {
  const { note } = req.body;
  const incident = await IncidentReport.findById(req.params.id);

  if (incident) {
    incident.internalNotes = incident.internalNotes || [];
    incident.internalNotes.push({ note, byUser: req.user?._id, createdAt: new Date() });
    const updatedIncident = await incident.save();
    res.json(updatedIncident);
  } else {
    res.status(404);
    throw new Error('Incident not found');
  }
});
