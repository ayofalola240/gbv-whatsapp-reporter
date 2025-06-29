import mongoose, { Schema, Document, Types } from 'mongoose';

// Define possible status values
export type IncidentStatus = 'New' | 'Investigating' | 'Referred' | 'Resolved' | 'Closed' | 'Escalated';
export type ViolenceType = 'Physical' | 'Sexual' | 'Emotional' | 'Trafficking' | 'Rape' | 'Other';

// Define the structure of the report document
export interface IIncidentReport extends Document {
  referenceId: string;
  areaCouncil?: string;
  isAnonymous: boolean;
  reporterName?: string;
  reporterPhone?: string;
  incidentDate?: string; // Storing as string from user, can be converted to Date
  incidentTime?: string;
  locationText?: string;
  exactLocationType?: string;
  violenceType?: ViolenceType | string;
  servicesRequested?: ('Medical' | 'Legal' | 'Shelter' | 'Psychological' | 'Police/Security' | 'Counselling' | 'Other' | string)[];
  perpetratorKnown?: boolean;
  perpetratorRelationship?: string;
  perpetratorCount?: string;
  status: IncidentStatus;
  pdfPath?: string;
  mediaFiles?: Types.ObjectId[];
  description?: string;
  mediaAttached?: boolean;
  isDirectServiceRequest?: boolean;
  consentGiven: boolean;
  language: { type: String; default: 'English' };
  internalNotes?: {
    note: string;
    byUser: Types.ObjectId;
    createdAt: Date;
  }[];
  escalationDetails?: {
    agency?: string;
    escalatedAt?: Date;
    notes?: string;
  };
  resolutionDetails?: {
    resolvedAt?: Date;
    notes?: string;
  };
}

const IncidentReportSchema: Schema = new Schema(
  {
    referenceId: { type: String, required: true, unique: true },
    isAnonymous: { type: Boolean, required: true },
    reporterName: { type: String },
    reporterPhone: { type: String },
    incidentDate: { type: String },
    incidentTime: { type: String },
    locationText: { type: String },
    areaCouncil: { type: String },
    status: {
      type: String,
      enum: ['New', 'Investigating', 'Referred', 'Escalated', 'Resolved', 'Closed'],
      default: 'New'
    },
    internalNotes: [
      {
        note: { type: String, required: true },
        byUser: { type: Schema.Types.ObjectId, ref: 'User' },
        createdAt: { type: Date, default: Date.now }
      }
    ],
    escalationDetails: {
      agency: { type: String },
      escalatedAt: { type: Date },
      notes: { type: String }
    },
    resolutionDetails: {
      resolvedAt: { type: Date },
      notes: { type: String }
    },
    pdfPath: { type: String },
    mediaFiles: [{ type: Schema.Types.ObjectId, ref: 'MediaFile' }],
    exactLocationType: { type: String },
    violenceType: { type: String },
    perpetratorKnown: { type: Boolean },
    perpetratorRelationship: { type: String },
    perpetratorCount: { type: String },
    description: { type: String },
    mediaAttached: { type: Boolean, default: false },
    servicesRequested: { type: [String] },
    isDirectServiceRequest: { type: Boolean, default: false },
    consentGiven: { type: Boolean, required: true },
    language: { type: String, default: 'English' }
  },
  {
    // This automatically adds `createdAt` and `updatedAt` fields
    timestamps: true
  }
);

export default mongoose.model<IIncidentReport>('IncidentReport', IncidentReportSchema);
