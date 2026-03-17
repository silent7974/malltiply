import mongoose from "mongoose"

const AnalyticsLogSchema = new mongoose.Schema({
  timestamp: String,
  userId: String,
  sessionId: String,
  page: String,
  component: String,
  event: String,
  payload: Object,
})

export default mongoose.models.AnalyticsLog || mongoose.model("AnalyticsLog", AnalyticsLogSchema)