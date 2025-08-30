import { Model, model, Schema, Types } from "mongoose";
import {
  SUPPORTED_FILE_TYPES,
  SupportedFileType,
} from "../services/documentService";

//NOTE, max. document size could be upto 16MB hence,
// 1MB chunking is implemented in the content
//"The maximum BSON document size is 16 mebibytes."
// - https://www.mongodb.com/docs/manual/core/document/

export interface IDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  type: SupportedFileType;
  content: string[]; //extracted text stored in chunks
  uploadedAt: Date;
  sizeInBytes: number;
}

//Interface for statics
export interface IDocumentModel extends Model<IDocument> {
  chunkContent(text: string): string[];
}

const documentSchema = new Schema<IDocument, IDocumentModel>({
  name: { type: String, required: true },
  type: { type: String, required: true, enum: SUPPORTED_FILE_TYPES },
  content: { type: [String], required: true },
  uploadedAt: { type: Date, default: Date.now },
  sizeInBytes: { type: Number },
});

//schema.statics.methodName, allows you to define static methods on a model.
documentSchema.statics.chunkContent = function (text: string) {
  const CHUNK_SIZE = 1000000; //1 MB
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    chunks.push(text.slice(i, i + CHUNK_SIZE));
  }
  return chunks;
};

export const DocumentModel = model<IDocument, IDocumentModel>(
  "Document",
  documentSchema
);
