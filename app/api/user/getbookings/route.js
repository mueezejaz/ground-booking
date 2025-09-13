import { NextResponse } from "next/server";
// import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
// import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";

export const GET = handleRouteError(auth(async () => {
  await dbConnect();
  console.log("enter")

  const bookings = await Booking.find({ status: "confirmed", isImage: true })
    .sort({ createdAt: -1 })
    .limit(10);

  console.log("this is booking", bookings);

  return NextResponse.json({ bookings, success: true }, { status: 200 });
}));
