import mongoose, { Schema, Document, Model } from "mongoose";

export interface IKnowledgeItem extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  content: string;
  summary: string;
  tags: string[];
  source?: string;
  createdAt: Date;
  updatedAt: Date;
}

const KnowledgeItemSchema = new Schema<IKnowledgeItem>(
  {
    userId:  { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    title:   { type: String, required: true, trim: true },
    content: { type: String, required: true },
    summary: { type: String, default: "" },
    tags:    { type: [String], default: [] },
    source:  { type: String, trim: true },
  },
  { timestamps: true }
);

// Full-text search index
KnowledgeItemSchema.index({ title: "text", content: "text", tags: "text" });

const KnowledgeItem: Model<IKnowledgeItem> =
  mongoose.models.KnowledgeItem ??
  mongoose.model<IKnowledgeItem>("KnowledgeItem", KnowledgeItemSchema);

export default KnowledgeItem;