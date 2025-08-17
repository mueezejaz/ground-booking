import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";

export const POST = handleRouteError(auth(async (req) => {
    await dbConnect();

    // if (req.auth.user.email !== process.env.ADMIN_EMAIL) {
    //     throw new ApiError(403, "Forbidden");
    // }

    const body = await req.json();
    const { bookingId, status } = body;

    if (!bookingId || !status) {
        throw new ApiError(400, "Booking ID and status are required");
    }

    const updatedBooking = await Booking.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true }
    );

    console.log(updatedBooking);
    if (!updatedBooking) {
        throw new ApiError(404, "Booking not found");
    }

    return NextResponse.json({
        booking: updatedBooking,
        success: true,
    }, { status: 200 });
}));
