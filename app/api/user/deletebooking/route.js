import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";

export const POST = handleRouteError(auth(async (req) => {
    await dbConnect();

    if (!req.auth.user && !req.auth.user.email) {
        throw new ApiError(403, "Forbidden");
    }

    const body = await req.json();
    const { id } = body;

    if (!id) {
        throw new ApiError(400, "booking id is required");
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
        throw new ApiError(400, "Invalid booking id format");
    }

    const deletedBooking = await Booking.findByIdAndDelete(id);

    if (!deletedBooking) {
        throw new ApiError(404, "No booking found with the provided id");
    }

    return NextResponse.json({
        booking: deletedBooking,
        success: true,
        message: "Booking deleted successfully"
    }, { status: 200 });
}));
