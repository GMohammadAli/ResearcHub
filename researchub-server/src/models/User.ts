import mongoose, { Document, model, Schema, Types } from "mongoose";

export interface IUser extends Document {
  _id: Types.ObjectId;
  username: string;
  email: string;
  password: string;
  personalDetails: Record<string, any>;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, unique: true, required: true },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: true },
    personalDetails: { type: mongoose.Schema.Types.Mixed },
  },
  { timestamps: true },
);

userSchema.index({ email: 1, createdAt: -1 });

export const UserModel = model<IUser>("USERS", userSchema);
