import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  playerCount: { type: Number, required: true },
  contactName: { type: String, required: true },
  contactPhone: { type: String, required: true },
  contactEmail: { type: String, required: true },
  specialRequests: { type: String },
}, {
  timestamps: true,
})

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema)
