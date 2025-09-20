import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import { auth } from "@/app/auth";
import ApiError from "@/app/utils/ApiError";

export const POST = handleRouteError(auth(async (req) => {
  await dbConnect();
  if (!req.auth.user.email || req.auth.user.email !== process.env.ADMIN_EMAIL) {
    throw new ApiError(403, "Forbidden");
  }
  console.log(req.auth.user.email !== process.env.ADMIN_EMAIL)
  const query = {};
  const body = await req.json();
  console.log(body);
  if (body.unVerified === 'show univerified') {
    query.$or = [
      { isImage: false },
      { status: "pending" }
    ];
  } else if (body.unVerified === 'show all') {
    query.isImage = true;
    query.status = "confirmed"

  } else {
    query.isImage = true;
    query.status = "cancelled"
    query.contactEmail = process.env.ADMIN_EMAIL;
  }
  const bookings = await Booking.find(query).sort({ _id: -1 }).limit(20);

  return NextResponse.json({
    bookings: bookings,
    success: true,
  }, { status: 200 });
}));
