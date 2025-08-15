import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import  handleRouteError  from "@/app/utils/HandleApiError";
import  ApiError  from "@/app/utils/ApiError"; 

export const POST = handleRouteError(async (req) => {
  await dbConnect();

  const body = await req.json();

  const requiredFields = [
    "startDateTime",
    "endDateTime",
    "playerCount",
    "contactName",
    "contactPhone",
    "contactEmail",
  ];

  for (const field of requiredFields) {
    if (!body[field]) {
      throw new ApiError(400, `${field.charAt(0).toUpperCase() + field.slice(1)} is required.`);
    }
  }

  const start = new Date(body.startDateTime);
  const end = new Date(body.endDateTime);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    throw new ApiError(400, "Invalid start or end datetime.");
  }

  // Check for overlapping bookings
  const conflict = await Booking.findOne({
    $or: [
      { startDateTime: { $lt: end }, endDateTime: { $gt: start } }
    ],
  });

  if (conflict) {
    throw new ApiError(409, "This time slot is already booked. Please choose a different time.");
  }

  try {
    const newBooking = new Booking({
      startDateTime: start,
      endDateTime: end,
      playerCount: body.playerCount,
      contactName: body.contactName,
      contactPhone: body.contactPhone,
      contactEmail: body.contactEmail,
      specialRequests: body.specialRequests || "",
    });

    const savedBooking = await newBooking.save();

    return NextResponse.json({
      message: "Booking successful!",
      data: savedBooking,
    }, { status: 201 });
  } catch (error) {
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      throw new ApiError(400, "Validation failed: " + messages.join(", "));
    }
    console.error("Error saving booking:", error);
    throw new ApiError(500, "An unexpected error occurred while processing the booking.");
  }
});

