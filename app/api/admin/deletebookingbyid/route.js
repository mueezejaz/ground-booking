import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import { auth } from "@/app/auth";
import ApiError from "@/app/utils/ApiError";

export const POST = handleRouteError(auth(async (req) => {
  await dbConnect();

  if (!req.auth?.user?.email || req.auth.user.email !== process.env.ADMIN_EMAIL) {
    throw new ApiError(403, "Forbidden");
  }

  const { bookingId } = await req.json();
  if (!bookingId) {
    throw new ApiError(400, "Booking ID is required");
  }

  const deletedBooking = await Booking.findByIdAndDelete(bookingId);

  if (!deletedBooking) {
    throw new ApiError(404, "Booking not found");
  }

  return NextResponse.json(
    {
      message: `Booking with ID ${bookingId} deleted successfully`,
      bookingId: bookingId,
      success: true,
    },
    { status: 200 }
  );
}));
