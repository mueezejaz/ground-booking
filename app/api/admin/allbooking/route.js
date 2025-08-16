import { NextResponse } from "next/server";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import { auth } from "@/app/auth";

export const GET = handleRouteError(auth(async (req) => {
    await dbConnect();

    // if (req.auth.user.email !== process.env.ADMIN_EMAIL) {
    //     throw new ApiError(403, "Forbidden");
    // }

    const bookings = await Booking.find({}).sort({ _id: -1 });

    return NextResponse.json({
        bookings: bookings,
        success: true,
    }, { status: 200 });
}));
