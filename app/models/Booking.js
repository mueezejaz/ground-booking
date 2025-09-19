import mongoose from "mongoose"

const BookingSchema = new mongoose.Schema({
  startDateTime: { type: Date, required: true },
  endDateTime: { type: Date, required: true },
  numberOfHours: { type: Number, required: true },
  playerCount: { type: Number, },
  contactName: { type: String, },
  contactPhone: { type: String, },
  price: { type: Number, require: true },
  isImage: { type: Boolean, required: true },
  status: { type: String, required: true },
  imageData: { type: Object },
  contactEmail: { type: String, required: true },
  specialRequests: { type: String },
}, {
  timestamps: true,
})

export default mongoose.models.Booking || mongoose.model("Booking", BookingSchema)
