// src/models/incidentReport.model.ts (Ensure this and other models are created as previously discussed)
import { Schema, model, Document, Types } from 'mongoose';

export interface IIncidentReport extends Document {
  sourceUserId: string;
  reporterName?: string;
  reporterPhone?: string;
  victimName?: string;
  victimAge?: number;
  victimGender?: string;
  violenceType: 'Physical' | 'Sexual' | 'Emotional' | 'Trafficking' | 'Other' | string; // Allow string for 'Other: ...'
  incidentDate: Date;
  incidentTime?: string;
  location: string;
  description: string;
  servicesRequested?: ('Medical' | 'Legal' | 'Shelter' | 'Psychological' | 'Police/Security' | 'Counselling' | 'Other' | string)[];
  consentGiven: boolean;
  status: 'Submitted' | 'Escalated' | 'InProgress' | 'Closed' | 'Aborted';
  pdfPath?: string;
  mediaFiles?: Types.ObjectId[];
  referenceId: string;
  isAnonymous: boolean;
  perpetratorKnown?: boolean;
  perpetratorRelationship?: string;
  perpetratorCount?: string; // or number
  mediaAttached?: boolean;
  isDirectServiceRequest?: boolean;
  language: 'English' | 'Yoruba' | 'Igbo' | 'Hausa' | string;
  createdAt: Date;
  updatedAt: Date;
}

const incidentReportSchema = new Schema<IIncidentReport>(
  {
    sourceUserId: { type: String, required: true, index: true },
    reporterName: { type: String, trim: true },
    reporterPhone: { type: String, trim: true },
    victimName: { type: String, trim: true, default: 'Anonymous' },
    victimAge: { type: Number },
    victimGender: { type: String },
    violenceType: { type: String, required: true },
    incidentDate: { type: Date, required: true },
    incidentTime: { type: String },
    location: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    servicesRequested: [{ type: String }],
    consentGiven: { type: Boolean, required: true },
    status: {
      type: String,
      enum: ['Submitted', 'Escalated', 'InProgress', 'Closed', 'Aborted'],
      default: 'Submitted'
    },
    pdfPath: { type: String },
    mediaFiles: [{ type: Schema.Types.ObjectId, ref: 'MediaFile' }],
    referenceId: { type: String, required: true, unique: true },
    isAnonymous: { type: Boolean, default: true },
    perpetratorKnown: { type: Boolean },
    perpetratorRelationship: { type: String },
    perpetratorCount: { type: String },
    mediaAttached: { type: Boolean, default: false },
    isDirectServiceRequest: { type: Boolean, default: false },
    language: { type: String, default: 'English' }
  },
  { timestamps: true }
);

export const IncidentReport = model<IIncidentReport>('IncidentReport', incidentReportSchema);
