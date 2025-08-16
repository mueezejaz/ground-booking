import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";

export const POST = handleRouteError(auth(async (req) => {
    await dbConnect();

    const body = await req.json();
    const { email } = body;

    if (!email) {
        throw new ApiError(400, "email is required");
    }
    if (!req.auth.user || req.auth.user.email !== email) {
        throw new ApiError(401, "Unauthorized user");
    }

    const bookings = await Booking.find({ contactEmail: email }).sort({ _id: -1 });
    if (!bookings) {
        throw new ApiError(404, "No booking found pls create new booking");
    }

    return NextResponse.json({
        booking: bookings,
        success: true,
    }, { status: 200 });
}));