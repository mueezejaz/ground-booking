import { NextResponse } from "next/server";
import mongoose from "mongoose";
import dbConnect from "@/app/lib/mongoose.js";
import Booking from "@/app/models/Booking";
import handleRouteError from "@/app/utils/HandleApiError";
import ApiError from "@/app/utils/ApiError";
import { auth } from "@/app/auth";

export const GET = handleRouteError(auth(async (req) => {
    await dbConnect();
    console.log("enter")
    if (!req.auth.user && !req.auth.user.email) {
        throw new ApiError(403, "Forbidden");
    }
    let isAdmin = false;
    if (req.auth.user.email === process.env.ADMIN_EMAIL) {
        isAdmin = true;
    }
    const booking = await Booking.findOne({ contactEmail: req.auth.user.email, isImage: false })
        .sort({ createdAt: -1 });

    if (!booking) {
        return NextResponse.json({ success: true, isAdmin, isFound: false }, { status: 404 });
    }
    console.log("this is booking",booking);
    const createdAt = new Date(booking.createdAt);
    const now = new Date();
    const diffMs = now.getTime() - createdAt.getTime();
    const diffMinutes = Math.floor(diffMs / 60000);
    const minutesLeft = Math.max(20 - diffMinutes, 0);
    if (minutesLeft <= 0) {
        await Booking.deleteOne({ _id: booking._id });
        return NextResponse.json({
            success: true,
            isFound: true,
            expired: true,
            isAdmin,
            message: "Booking has been deleted because it was older than 20 minutes pls creat new booking."
        }, { status: 410 }); // 410 Gone
    }

    return NextResponse.json({ booking, success: true, isFound: true, minutesLeft }, { status: 200 });
}));
