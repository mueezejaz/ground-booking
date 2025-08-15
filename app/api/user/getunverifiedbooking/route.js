import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";

export const POST= handleRouteError(auth(async (req) => {
    await dbConnect();

    const body = await req.json();
    const email = body?.email;

    if (!req.auth.user || req.auth.user.email !== email) {
        throw new ApiError(401, "Unauthorized user");
    }


    const booking = await Booking.findOne({ contactEmail: email, isImage: false })
        .sort({ createdAt: -1 });

    if (!booking) {
        return NextResponse.json({success:true, isFound: false}, { status: 404 });
    }

        const createdAt = new Date(booking.createdAt);
        const now = new Date();
        const diffMs = now.getTime() - createdAt.getTime();
        const diffMinutes = Math.floor(diffMs / 60000);
        const minutesLeft = Math.max(20 - diffMinutes, 0);

    if (minutesLeft <= 0) {
        await Booking.deleteOne({ _id: booking._id });
        return NextResponse.json({
            success:true,
            expired: true,
            message: "Booking has been deleted because it was older than 20 minutes."
        }, { status: 410 }); // 410 Gone
    }

    return NextResponse.json({ booking,success:true,isFound:true,minutesLeft }, { status: 200 });
}));
