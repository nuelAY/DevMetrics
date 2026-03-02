import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Date,
  githubUsername: String,
  stats: {
    totalCommits: { type: Number, default: 0 },
    prVelocity: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 },
    lastUpdated: Date,
  },
  aiSummary: String,
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
