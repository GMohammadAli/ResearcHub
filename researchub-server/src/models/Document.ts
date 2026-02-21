import { Model, model, Schema, Types } from "mongoose";
import {
  SUPPORTED_FILE_TYPES,
  SupportedFileType,
} from "../services/documentService";

//NOTE, max. document size could be upto 16MB hence,
// 1MB chunking is implemented in the content
//"The maximum BSON document size is 16 mebibytes."
// - https://www.mongodb.com/docs/manual/core/document/#document-size-limit

export interface PDFChunkMetadata {
  text: string;
  chunkIndex: number;
  pages: number[];
}
export interface IDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  name: string;
  type: SupportedFileType;
  content: string[]; //extracted text stored in chunks
  contentWithMetadata: PDFChunkMetadata[];
  createdAt: Date;
  updatedAt: Date;
  sizeInBytes: number;
}

//Interface for statics
export interface IDocumentModel extends Model<IDocument> {
  chunkContent(text: string): string[];
}

const documentSchema = new Schema<IDocument, IDocumentModel>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "USERS",
      required: true,
      index: true,
    },
    name: { type: String, required: true },
    type: { type: String, required: true, enum: SUPPORTED_FILE_TYPES },
    //disable storing content in later iterations
    content: { type: [String], required: true },
    contentWithMetadata: { type: [Object], required: true },
    sizeInBytes: { type: Number },
  },
  {
    timestamps: true, // Automatically handles createdAt & updatedAt
  },
);

//schema.statics.methodName, allows you to define static methods on a model.
documentSchema.statics.chunkContent = function (text: string) {
  const CHUNK_SIZE = 1000000; //1 MB
  const chunks: string[] = [];
  for (let i = 0; i < text.length; i += CHUNK_SIZE) {
    const chunk = text.slice(i, i + CHUNK_SIZE).trim();
    chunks.push(chunk);
  }
  return chunks;
};

documentSchema.index({ content: 1, createdAt: -1 });

export const DocumentModel = model<IDocument, IDocumentModel>(
  "DOCUMENTS",
  documentSchema,
);
