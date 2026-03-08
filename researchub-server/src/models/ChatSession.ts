import { model, Schema, Types } from "mongoose";

export interface Citation {
  chunkIndex: number;
  pages: number[];
  text: string;
}

export enum MessageRole {
  USER = "user",
  AGENT = "agent",
}

//used for soft delete
export enum isActive {
  Y = "Y",
  N = "N",
}

export interface Message {
  role: MessageRole;
  content: string;
  isSummary?: boolean;
  citations: Citation[];
}

export interface IChatSession extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  docId: Types.ObjectId;
  title: string;
  messages: Message[];
  messageCount: number;
  tokensUtilized: number;
  isActive: isActive;
  createdAt: Date;
  updatedAt: Date;
}

const chatSessionSchema = new Schema<IChatSession>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "USERS",
      required: true,
      index: true,
    },
    docId: {
      type: Schema.Types.ObjectId,
      ref: "DOCUMENTS",
      required: true,
      index: true,
    },
    title: { type: String, required: true },
    messages: { type: [Object], required: true },
    messageCount: { type: Number, default: 0 },
    tokensUtilized: { type: Number, default: 0 },
    isActive: { type: String, required: true, default: isActive.Y },
  },
  {
    timestamps: true,
  },
);

//whenever "save" is used on chat session, message count gets re-calculated
chatSessionSchema.pre("save", function (next) {
  if (this.isModified("messages")) {
    this.messageCount = this.messages.length;
  }
  next();
});

chatSessionSchema.index({ _id: 1, createdAt: -1 });

export const ChatSessionModel = model<IChatSession>(
  "CHAT_SESSIONS",
  chatSessionSchema,
);
