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
    if (body.unVerified) {
        query.$or = [
            { isImage: false },
            { status: "pending" }
        ];
    } else {
        query.isImage = true;
        query.status = "confirmed"

    }
    const bookings = await Booking.find(query).sort({ _id: -1 }).limit(10);

    return NextResponse.json({
        bookings: bookings,
        success: true,
    }, { status: 200 });
}));
