import { model, Schema, Types } from 'mongoose';

// src/models/mediaFile.model.ts
interface IMediaFile extends Document {
  reportId: Types.ObjectId;
  fileType: 'Image' | 'Audio' | 'Video';
  url: string; // or storagePath
  caption?: string;
  uploadedAt: Date;
  originalWaMediaId: string; // WhatsApp Media ID
}
const mediaFileSchema = new Schema<IMediaFile>({
  reportId: { type: Schema.Types.ObjectId, ref: 'IncidentReport', required: true, index: true },
  fileType: { type: String, enum: ['Image', 'Audio', 'Video'], required: true },
  url: { type: String, required: true }, // URL or storage path
  caption: { type: String, trim: true },
  uploadedAt: { type: Date, default: Date.now },
  originalWaMediaId: { type: String, required: true }
});
export const MediaFile = model<IMediaFile>('MediaFile', mediaFileSchema);
