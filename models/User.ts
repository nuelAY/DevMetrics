import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  image: String,
  emailVerified: Date,
  githubUsername: String,
  bio: String,
  publicEmail: String,
  settings: {
    theme: { type: String, default: "Dark Neural" },
    glassIntensity: { type: Number, default: 75 },
    neonAccents: { type: Boolean, default: true },
    notifications: {
      velocityAlerts: { type: Boolean, default: true },
      metricMilestones: { type: Boolean, default: true },
      neuralSummaries: { type: Boolean, default: false },
      systemAnomalies: { type: Boolean, default: false },
    },
    security: {
      sessionTimeout: { type: String, default: "24 Hours" },
    }
  },
  stats: {
    totalCommits: { type: Number, default: 0 },
    prVelocity: { type: Number, default: 0 },
    consistencyScore: { type: Number, default: 0 },
    lastUpdated: Date,
  },
  aiSummary: String,
});

export const User = mongoose.models.User || mongoose.model("User", UserSchema);
